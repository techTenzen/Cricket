import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Share2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { addToCart } from '../store/slices/cartSlice';
import { favoriteService } from '../services/favoriteService';

const ProductCard = ({ product }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // ... (Hooks and helper functions remain the same) ...
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setIsFavorite(favorites.some(fav => fav.product._id === product._id));
  }, [favorites, product._id]);

  const fetchFavorites = async () => {
    try {
      const response = await favoriteService.getFavorites();
      setFavorites(response.data);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  };

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Stop propagation to prevent card link from activating
    if (!isAuthenticated) {
      toast.error('Please login to add to favorites');
      return;
    }
    try {
      if (isFavorite) {
        await favoriteService.removeFromFavorites(product._id);
        toast.success('Removed from favorites');
      } else {
        await favoriteService.addToFavorites(product._id);
        toast.success('Added to favorites');
      }
      // Re-fetch only if not already fetching
      fetchFavorites(); 
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Stop propagation to prevent card link from activating
    const url = `${window.location.origin}/products/${product._id}`;
    try {
      if (navigator.share) {
        // Use native share API if available (mobile/modern browsers)
        await navigator.share({
          title: product.name,
          url: url,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        toast.success('Product link copied to clipboard!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') { // Ignore user canceling share
        toast.error('Failed to share/copy link');
      }
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Stop propagation to prevent card link from activating

    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
      toast.success("Product added to cart!");
    } catch (err) {
      toast.error("Failed to add product to cart");
    }
  };


  const finalPrice = product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const mrpPrice = product.mrp ? product.mrp.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : null;
  const discountPercent = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : null;
  const stockAvailable = product.stock > 0;

  return (
    <div className="product-card">
      {/* The main card body is a link for better SEO and user experience */}
      <Link to={`/products/${product._id}`} className="product-card-link">

        {/* Product Image */}
        <div className="product-image-wrapper">
          <img
            src={product.images?.[product.primaryImageIndex || 0] || "https://via.placeholder.com/400x400?text=No+Image"}
            className="product-image primary-image"
            alt={product.name}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
            }}
          />
          {/* Hover Image for cool effect */}
          {product.images?.[product.hoverImageIndex || 1] && (
            <img
              src={product.images[product.hoverImageIndex || 1]}
              className="product-image hover-image"
              alt={`${product.name} - Hover View`}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}

          {/* Out of Stock Overlay */}
          {!stockAvailable && (
            <div className="out-of-stock-overlay">
              <span>Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Name */}
        <h3 className="product-title">{product.name}</h3>

        {/* Rating */}
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`star-icon ${
                i < Math.floor(product.rating || 0) ? "filled-star" : "empty-star"
              }`}
              fill={i < Math.floor(product.rating || 0) ? '#f59e0b' : 'none'}
            />
          ))}
          <span className="review-count">({product.numReviews || 0} reviews)</span>
        </div>

        {/* Price Section */}
        <div className="product-price-section">
          <span className="final-price">{finalPrice}</span>

          {product.mrp && discountPercent > 0 && (
            <>
              <span className="mrp">{mrpPrice}</span>
              <span className="discount">
                {discountPercent}% OFF
              </span>
            </>
          )}
        </div>

        {/* Only X left in stock */}
        {product.stock <= 3 && product.stock > 0 && (
          <p className="low-stock">Only {product.stock} left in stock!</p>
        )}
      </Link>

      {/* Action buttons (Outside the main link) */}
      <div className="product-actions">
        <button
          onClick={handleAddToCart}
          disabled={!stockAvailable}
          className="add-to-cart-btn"
          aria-label={stockAvailable ? `Add ${product.name} to cart` : "Unavailable"}
        >
          <ShoppingCart size={18} />
          {stockAvailable ? "Add to Cart" : "Unavailable"}
        </button>
        <div className="action-buttons">
          <button
            onClick={handleFavoriteToggle}
            className={`action-btn ${isFavorite ? 'favorite-active' : ''}`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={isFavorite ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
          >
            <Heart 
              size={18} 
              fill={isFavorite ? '#ef4444' : 'none'} 
              color={isFavorite ? '#ef4444' : '#6b7280'} 
              strokeWidth={1.8}
            />
          </button>
          <button
            onClick={handleShare}
            className="action-btn"
            title="Share product link"
            aria-label={`Share ${product.name} link`}
          >
            <Share2 size={18} color="#6b7280" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;