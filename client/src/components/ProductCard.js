// src/components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Share2, Truck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { addToCart } from '../store/slices/cartSlice';
import { favoriteService } from '../services/favoriteService';
import './ProductCard.css';

const FALLBACK_IMAGE = 'https://via.placeholder.com/400x400?text=No+Image';

const ProductCard = ({ product }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const stockAvailable = product.stock > 0;
  const productImages = (product.images && product.images.length > 0) 
    ? product.images 
    : [FALLBACK_IMAGE];

  const fetchFavorites = async () => {
    try {
      const response = await favoriteService.getFavorites();
      setFavorites(response.data);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchFavorites();
  }, [isAuthenticated]);

  useEffect(() => {
    setIsFavorite(favorites.some((fav) => fav.product._id === product._id));
  }, [favorites, product._id]);

  useEffect(() => {
    if (!isHovering || productImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [isHovering, productImages.length]);

  useEffect(() => {
    if (!isHovering) setCurrentImageIndex(0);
  }, [isHovering]);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return toast.error("Please login to add to favorites");

    try {
      if (isFavorite) {
        await favoriteService.removeFromFavorites(product._id);
        toast.success("Removed from favorites");
      } else {
        await favoriteService.addToFavorites(product._id);
        toast.success("Added to favorites");
      }
      fetchFavorites();
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/products/${product._id}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Product link copied!");
      }
    } catch {}
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return toast.error("Please login to add items");

    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
      toast.success("Product added!");
    } catch {
      toast.error("Failed to add");
    }
  };

  const finalPrice = product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  const mrpPrice = product.mrp?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  const discountPercent = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : null;
  const saveAmount = product.mrp ? product.mrp - product.price : null;
  const ratingFloor = Math.floor(product.rating || 0);

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link to={`/products/${product._id}`} className="product-card-link">

        {/* Image */}
        <div className="product-image-wrapper">
          <img
            key={currentImageIndex}
            src={productImages[currentImageIndex]}
            className="product-image primary-image"
            alt={product.name}
            onError={(e) => (e.target.src = FALLBACK_IMAGE)}
          />

          {/* Dots */}
          {productImages.length > 1 && (
            <div className="image-dots">
              {productImages.map((_, idx) => (
                <span key={idx} className={`dot ${idx === currentImageIndex ? 'dot-active' : ''}`} />
              ))}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2" style={{ zIndex: 10 }}>
            {discountPercent > 0 && <span className="bg-red-500">-{discountPercent}%</span>}
            {!stockAvailable && <span className="bg-gray-800">Out of Stock</span>}
            {product.stock <= 3 && product.stock > 0 && <span className="bg-yellow-500">Low Stock</span>}
          </div>
        </div>

        <div className="product-card__content">
          <h3 className="product-title">{product.name}</h3>

          <div className="rating-row">
            <div className="product-rating">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < ratingFloor ? "#facc15" : "none"} color={i < ratingFloor ? "#facc15" : "#d1d5db"} />
              ))}
              <span className="review-count">({product.numReviews || 0})</span>
            </div>
            {product.sizeVariants && product.sizeVariants.length > 0 && (
              <div className="available-sizes">
                <span className="available-sizes__label">Sizes:</span>
                <div className="available-sizes__list">
                  {product.sizeVariants
                    .filter(v => v.stock > 0)
                    .slice(0, 3)
                    .map((variant, idx) => (
                      <span key={idx} className="size-pill">{variant.size}</span>
                    ))}
                  {product.sizeVariants.filter(v => v.stock > 0).length > 3 && (
                    <span className="size-pill">+{product.sizeVariants.filter(v => v.stock > 0).length - 3}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="price-delivery-row">
            <div className="product-price-section">
              <span className="final-price">{finalPrice}</span>
              {product.mrp && discountPercent > 0 && <span className="mrp">{mrpPrice}</span>}
            </div>
            <div className="delivery-badge">
              <span>⚡ Fast</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="product-actions">
        <button onClick={handleFavoriteToggle} className={`action-btn ${isFavorite ? 'bg-red-500' : ''}`}>
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <button onClick={handleShare} className="action-btn">
          <Share2 size={18} />
        </button>
      </div>

      <div className="product-card__footer">
        <button onClick={handleAddToCart} disabled={!stockAvailable} className="add-to-cart-btn">
          <ShoppingCart size={18} />
          {stockAvailable ? "Add to Bag" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
