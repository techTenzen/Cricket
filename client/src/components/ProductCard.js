import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Share2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { addToCart } from '../store/slices/cartSlice';
import { favoriteService } from '../services/favoriteService';

// Fallback for image loading errors
const FALLBACK_IMAGE = "https://via.placeholder.com/400x400?text=No+Image";

const ProductCard = ({ product }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const stockAvailable = product.stock > 0;

  // --- Favorites Logic ---
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
    e.stopPropagation(); // Prevent card navigation
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
      fetchFavorites();
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  // --- Share Logic ---
  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card navigation
    const url = `${window.location.origin}/products/${product._id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Product link copied to clipboard!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error('Failed to share/copy link');
      }
    }
  };

  // --- Add to Cart Logic ---
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card navigation

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


  // --- Formatting & Calculations ---
  const finalPrice = product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const mrpPrice = product.mrp ? product.mrp.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : null;
  const discountPercent = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : null;
  
  const ratingFloor = Math.floor(product.rating || 0);

  return (
    <div className="product-card group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
      <Link to={`/products/${product._id}`} className="block h-full">

        {/* Product Image and Overlay */}
        <div className="product-image-wrapper relative overflow-hidden aspect-square">
          <img
            src={product.images?.[product.primaryImageIndex || 0] || FALLBACK_IMAGE}
            className="product-image primary-image w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            alt={product.name}
            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          />
          {/* Hover Image (Hidden on mobile) */}
          {product.images?.[product.hoverImageIndex || 1] && (
            <img
              src={product.images[product.hoverImageIndex || 1]}
              className="product-image hover-image absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out hidden sm:block"
              alt={`${product.name} - Hover View`}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}

          {/* Discount/Stock Overlay */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {discountPercent > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                -{discountPercent}%
              </span>
            )}
            {!stockAvailable && (
              <span className="bg-gray-800 bg-opacity-70 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                Out of Stock
              </span>
            )}
            {product.stock <= 3 && product.stock > 0 && (
              <span className="bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
                Low Stock
              </span>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 flex flex-col">
          {/* Product Name */}
          <h3 className="product-title text-base font-semibold text-gray-900 dark:text-white mb-1 leading-tight line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="product-rating flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`star-icon ${
                  i < ratingFloor ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                }`}
                fill={i < ratingFloor ? '#f59e0b' : 'none'}
                strokeWidth={1.5}
              />
            ))}
            <span className="review-count text-xs text-gray-500 dark:text-gray-400 ml-2">({product.numReviews || 0})</span>
          </div>

          {/* Price Section */}
          <div className="product-price-section flex items-baseline space-x-2">
            <span className="final-price text-xl font-bold text-gray-900 dark:text-white">
              {finalPrice}
            </span>

            {product.mrp && discountPercent > 0 && (
              <span className="mrp text-sm line-through text-gray-500 dark:text-gray-400">
                {mrpPrice}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Action buttons (Absolute positioning for modern feel) */}
      <div className="product-actions absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleFavoriteToggle}
          className={`action-btn p-2 rounded-full shadow-md transition-colors duration-200 ${isFavorite ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white text-gray-500 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={isFavorite ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={1.8} />
        </button>
        <button
          onClick={handleShare}
          className="action-btn p-2 rounded-full shadow-md bg-white text-gray-500 hover:bg-gray-100 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          title="Share product link"
          aria-label={`Share ${product.name} link`}
        >
          <Share2 size={18} strokeWidth={1.8} />
        </button>
      </div>
      
      {/* Primary Call to Action at the bottom */}
      <div className="p-4 pt-0">
          <button
            onClick={handleAddToCart}
            disabled={!stockAvailable}
            className={`add-to-cart-btn flex items-center justify-center w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 transform group-hover:scale-[1.02] ${
              stockAvailable
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
            }`}
            aria-label={stockAvailable ? `Add ${product.name} to cart` : "Unavailable"}
          >
            <ShoppingCart size={18} className="mr-2" />
            {stockAvailable ? "Add to Cart" : "Unavailable"}
          </button>
      </div>
    </div>
  );
};

export default ProductCard;