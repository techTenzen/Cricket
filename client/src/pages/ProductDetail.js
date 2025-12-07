import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Truck, ShieldCheck, RefreshCcw, ArrowLeft, Plus, Minus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchProduct, fetchProducts, addReview } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

// Placeholder for missing components
const FavoriteButton = ({ productId }) => (
  <button type="button" className="icon-button p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150">
    <Heart className="icon-button__icon text-gray-600 dark:text-gray-300" size={24} />
  </button>
);
const ShareButton = () => (
    <button type="button" className="icon-button p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150">
        <Share2 className="icon-button__icon text-gray-600 dark:text-gray-300" size={24} />
    </button>
);
const ReviewStars = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={16}
                className={`star-icon ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                fill={i < rating ? '#f59e0b' : 'none'}
                strokeWidth={1.5}
            />
        ))}
    </div>
);


const FALLBACK_IMAGE = 'https://via.placeholder.com/800x600?text=No+Image';
const ERROR_IMAGE = 'https://via.placeholder.com/800x600?text=Image+Error';
const THUMB_ERROR_IMAGE = 'https://via.placeholder.com/120x120?text=Error';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTab] = useState('features');

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  const { currentProduct: product, products, isLoading } = useAppSelector(
    (state) => state.products
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // --- Fetch Data ---
  useEffect(() => {
    if (!id) return;

    dispatch(fetchProduct(id))
      .unwrap()
      .catch(() => {
        toast.error('Failed to load product details');
      });

    // Fetch related products for the bottom section
    dispatch(fetchProducts({ limit: 12 }))
      .unwrap()
      .catch(() => {
        console.warn('Failed to fetch related products');
      });
  }, [dispatch, id]);

  // --- Related Products Logic ---
  const relatedProducts = useMemo(() => {
    if (!product || !Array.isArray(products)) return [];
    return products
      .filter((p) => p._id !== product._id && p.category === product.category)
      .slice(0, 4);
  }, [product, products]);

  // --- Add to Cart Handler ---
  const handleAddToCart = useCallback(async () => {
    if (!id || !product || product.stock === 0) {
      toast.error(product && product.stock === 0 ? 'Product is out of stock' : 'Invalid product');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    // Check if size is required but not selected
    if (product.sizeVariants && product.sizeVariants.length > 0 && !selectedSize) {
        toast.error('Please select a size');
        return;
    }

    try {
      await dispatch(addToCart({ productId: id, quantity, size: selectedSize })).unwrap();
      toast.success('Product added to cart!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add product to cart');
    }
  }, [dispatch, id, isAuthenticated, product, quantity, navigate, selectedSize]);

  // --- Review Submission Handler ---
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!id || !product) {
      toast.error('Product not found');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to add a review');
      navigate('/login');
      return;
    }

    if (!reviewData.comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await dispatch(addReview({ id, reviewData })).unwrap();
      toast.success('Review added successfully!');
      setShowReviewForm(false);
      setReviewData({ rating: 5, comment: '' });
      // Re-fetch product to update reviews
      dispatch(fetchProduct(id)); 
    } catch (error) {
      console.error(error);
      toast.error('Failed to add review. You might have already reviewed this product.');
    }
  };

  // --- Quantity Control ---
  const handleQuantityChange = (delta) => {
    if (!product) return;
    const stock = product.stock || 0;
    const max = stock; // Max quantity is current stock
    const next = Math.min(Math.max(1, quantity + delta), max);
    setQuantity(next);
  };

  // --- Image Error Handlers ---
  const handleMainImageError = (e) => {
    e.target.src = ERROR_IMAGE;
    setIsImageLoading(false);
  };

  const handleThumbImageError = (e) => {
    e.target.src = THUMB_ERROR_IMAGE;
  };
  
  // Update image loading state when selected image changes
  useEffect(() => {
    setIsImageLoading(true);
  }, [selectedImage]);

  // --- Loading/Error States ---
  if (isLoading && !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!id || !product) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] flex-col p-8">
        <p className="text-xl text-red-500 font-semibold mb-4">Product not found or Invalid URL</p>
        <button
            type="button"
            className="text-indigo-600 hover:text-indigo-800 flex items-center transition duration-150"
            onClick={() => navigate('/products')}
        >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Go to Product List
        </button>
      </div>
    );
  }

  // --- Derived State ---
  const mainImage =
    product.images && product.images.length > 0
      ? product.images[selectedImage] || product.images[0]
      : FALLBACK_IMAGE;

  const hasStock = (product.stock || 0) > 0;
  const roundedRating = product.rating ? Number(product.rating.toFixed(1)) : 0;

  const hasOldPrice = product.oldPrice && product.oldPrice > product.price;
  const discountPercent = hasOldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  const maxQty = product.stock || 1;

  return (
    <>
      <div className="product-page container mx-auto px-4 py-8 lg:py-12">
        
        {/* Back link */}
        <button
          type="button"
          className="text-indigo-600 hover:text-indigo-800 flex items-center mb-6 transition duration-150 font-medium"
          onClick={() => navigate('/products')}
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Products
        </button>

        <div className="product-page__card p-4 sm:p-8 rounded-xl shadow-2xl">
          
          {/* Main Product Grid */}
          <div className="product-page__grid grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left: Images */}
            <div className="product-page__media flex flex-col-reverse lg:flex-row gap-4">
                
                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                    <div className="product-page__thumbnails flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto lg:overflow-y-auto max-h-[400px] pb-2">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className={`thumb-button w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                    selectedImage === idx ? 'border-indigo-600 ring-2 ring-indigo-300' : 'border-gray-200 hover:border-indigo-400 dark:border-gray-700 dark:hover:border-indigo-500'
                                }`}
                                onClick={() => {
                                    setSelectedImage(idx);
                                }}
                            >
                                <img
                                    src={img}
                                    alt={`${product.name} thumbnail ${idx + 1}`}
                                    onError={handleThumbImageError}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
                
                {/* Main Image */}
                <div className="product-page__main-image-wrapper flex-grow relative aspect-square lg:aspect-auto">
                    {isImageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse">
                            <span className="text-gray-500 dark:text-gray-400">Loading image...</span>
                        </div>
                    )}
                    <img
                        src={mainImage}
                        alt={product.name}
                        onError={handleMainImageError}
                        onLoad={() => setIsImageLoading(false)}
                        className={`product-page__main-image w-full h-full object-contain rounded-xl transition-opacity duration-500 ${
                            isImageLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                        style={{ maxHeight: '600px' }} // Set a max height for large screens
                    />
                </div>
            </div>

            {/* Right: Info */}
            <div className="product-page__info">
              
              {/* Category/Status */}
              <div className="flex items-center space-x-2 mb-2">
                {product.category && (
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{product.category}</span>
                )}
                {!hasStock && (
                    <span className="text-sm font-bold text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 px-2 py-0.5 rounded-full">Out of Stock</span>
                )}
              </div>

              <h1 className="product-page__title text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Rating row */}
              <div className="product-page__rating-row flex items-center space-x-3 mb-4 border-b pb-4 border-gray-200 dark:border-gray-700">
                <ReviewStars rating={Math.round(roundedRating)} />
                <span className="product-page__rating-score text-lg font-bold text-gray-800 dark:text-gray-200">
                    {roundedRating > 0 ? roundedRating.toFixed(1) : '—'}
                </span>
                <span className="product-page__rating-count text-sm text-gray-500 dark:text-gray-400">
                  ({product.numReviews || 0} reviews)
                </span>
                <button 
                    onClick={() => setActiveTab('reviews')}
                    className="text-indigo-600 text-sm hover:text-indigo-800 font-medium transition duration-150 ml-auto"
                >
                    Read All Reviews
                </button>
              </div>

              {/* Price row */}
              <div className="product-page__price-row flex items-baseline space-x-3 mb-6">
                <span className="product-page__price text-4xl font-bold text-indigo-600">£{product.price.toFixed(2)}</span>
                {hasOldPrice && (
                  <>
                    <span className="product-page__old-price text-xl line-through text-gray-500 dark:text-gray-400">
                      £{product.oldPrice.toFixed(2)}
                    </span>
                    <span className="pill pill--discount bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full dark:bg-red-900 dark:text-red-300">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>
              
              {/* Description */}
              {product.description && (
                <p className="product-page__description text-gray-600 dark:text-gray-300 mb-6">
                  {product.description}
                </p>
              )}

              {/* Optional attributes */}
              <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300 mb-6">
                 {product.brand && <p><span className="font-semibold">Brand:</span> {product.brand}</p>}
                 {product.modelRange && <p><span className="font-semibold">Model:</span> {product.modelRange}</p>}
                 {product.size && <p><span className="font-semibold">Default Size:</span> {product.size}</p>}
              </div>
              
              {/* Size Variants */}
              {product.sizeVariants && product.sizeVariants.length > 0 && (
                <div className="product-page__option-row mb-6">
                  <span className="product-page__option-label text-md font-semibold text-gray-800 dark:text-gray-200 mb-2 block">Available Sizes</span>
                  <div className="product-page__option-buttons flex flex-wrap gap-2">
                    {product.sizeVariants.map((variant, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`option-button px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200 ${
                          selectedSize === variant.size
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                            : variant.stock === 0 
                                ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setSelectedSize(variant.size)}
                        disabled={variant.stock === 0}
                      >
                        {variant.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + Add to Cart */}
              <div className="product-page__cart-row flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                
                {/* Quantity Control */}
                <div className="product-page__qty-group flex items-center space-x-3 flex-shrink-0">
                  <span className="product-page__qty-label text-sm font-semibold">Quantity:</span>
                  <div className="qty-control flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                    <button
                      type="button"
                      className="qty-control__btn p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={!hasStock || quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="qty-control__value w-8 text-center font-medium">{quantity}</span>
                    <button
                      type="button"
                      className="qty-control__btn p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleQuantityChange(1)}
                      disabled={!hasStock || quantity >= maxQty}
                      aria-label="Increase quantity"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  className={`btn btn--primary flex-grow flex items-center justify-center py-3 px-6 rounded-lg font-bold text-base transition-colors duration-200 transform hover:scale-[1.01] ${
                    hasStock
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/50'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!hasStock}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="btn__icon mr-2" size={20} />
                  {hasStock ? 'Add to Cart' : 'Out of Stock'}
                </button>

                {/* Favorite & Share Icons */}
                <div className="flex space-x-2 sm:space-x-3 justify-center sm:justify-start">
                    <FavoriteButton productId={id} />
                    <ShareButton />
                </div>
              </div>

              {/* Low Stock Alert */}
              {product.stock <= 5 && product.stock > 0 && (
                <p className="low-stock text-red-500 font-semibold text-sm mb-6 animate-pulse">
                    ⚠️ Only {product.stock} left in stock! Order soon.
                </p>
              )}

              {/* Feature strip */}
              <div className="product-page__benefits grid grid-cols-3 gap-4 border-t pt-6 border-gray-200 dark:border-gray-700">
                <div className="benefit-card text-center p-2">
                  <Truck className="benefit-card__icon w-6 h-6 mx-auto text-indigo-600 mb-1" />
                  <div className="benefit-card__title text-sm font-semibold">Free Shipping</div>
                  <div className="benefit-card__subtitle text-xs text-gray-500 dark:text-gray-400">Orders £100+</div>
                </div>
                <div className="benefit-card text-center p-2">
                  <ShieldCheck className="benefit-card__icon w-6 h-6 mx-auto text-indigo-600 mb-1" />
                  <div className="benefit-card__title text-sm font-semibold">12 Months</div>
                  <div className="benefit-card__subtitle text-xs text-gray-500 dark:text-gray-400">Warranty Included</div>
                </div>
                <div className="benefit-card text-center p-2">
                  <RefreshCcw className="benefit-card__icon w-6 h-6 mx-auto text-indigo-600 mb-1" />
                  <div className="benefit-card__title text-sm font-semibold">30 Days</div>
                  <div className="benefit-card__subtitle text-xs text-gray-500 dark:text-gray-400">Easy Returns</div>
                </div>
              </div>

            </div>
          </div>

          {/* Tabs Section */}
          <div className="product-page__tabs mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="tab-nav flex border-b border-gray-200 dark:border-gray-700 mb-6">
              <button
                type="button"
                className={`tab-nav__item px-4 py-3 text-lg font-semibold transition-colors duration-200 ${
                  activeTab === 'features' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('features')}
              >
                Features & Specs
              </button>
              <button
                type="button"
                className={`tab-nav__item px-4 py-3 text-lg font-semibold transition-colors duration-200 ${
                  activeTab === 'reviews' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({product.numReviews || 0})
              </button>
            </div>

            <div className="tab-panel p-4">
              {/* --- Features & Specs Tab --- */}
              {activeTab === 'features' && (
                <div className="tab-panel__content space-y-8">
                  
                  {/* Features Section */}
                  {product.features && product.features.length > 0 && (
                    <div className="features-section">
                      <h3 className="text-2xl font-bold mb-4">Key Features</h3>
                      <ul className="tab-list list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 pl-4">
                        {product.features.map((feature, index) => (
                          <li key={`feature-${index}`} className="text-base">{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Specifications Section */}
                  {product.specifications && Object.keys(product.specifications).some(key => product.specifications[key]) && (
                    <div className="specifications-section">
                      <h3 className="text-2xl font-bold mb-4">Specifications</h3>
                      <div className="tab-list specs-list grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                        {Object.keys(product.specifications).map(key => 
                          product.specifications[key] && (
                            <div key={`spec-${key}`} className="flex justify-between items-start border-b border-gray-100 dark:border-gray-700 pb-2">
                              <strong className="font-medium text-gray-600 dark:text-gray-400 w-1/3 pr-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> 
                              <span className="text-gray-900 dark:text-gray-100 w-2/3 text-right">{product.specifications[key]}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                  
                  {(!product.features || product.features.length === 0) && 
                    (!product.specifications || !Object.keys(product.specifications).some(key => product.specifications[key])) && (
                    <p className="text-gray-500 dark:text-gray-400">No detailed features or specifications available for this product yet.</p>
                  )}
                </div>
              )}

              {/* --- Reviews Tab --- */}
              {activeTab === 'reviews' && (
                <div className="tab-panel__content">
                  <div className="tab-reviews-header flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Customer Reviews</h3>
                    {isAuthenticated && (
                      <button
                        type="button"
                        className="btn bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition duration-150"
                        onClick={() => setShowReviewForm((prev) => !prev)}
                      >
                        {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                      </button>
                    )}
                  </div>

                  {!isAuthenticated && (
                    <p className="product-detail__login-hint bg-yellow-50 dark:bg-yellow-900/50 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700 text-sm text-yellow-800 dark:text-yellow-200 mb-6">
                      <button
                        type="button"
                        className="font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                        onClick={() => navigate('/login')}
                      >
                        Login
                      </button>{' '}
                      to write a review and see full details.
                    </p>
                  )}

                  {/* Review Submission Form */}
                  {showReviewForm && isAuthenticated && (
                    <form
                      onSubmit={handleReviewSubmit}
                      className="product-detail__review-form p-6 mb-8 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                    >
                      <h4 className="text-xl font-semibold mb-4">Submit Your Review</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="product-detail__form-group">
                          <label
                            className="product-detail__form-label block text-sm font-medium mb-1"
                            htmlFor="rating-select"
                          >
                            Overall Rating
                          </label>
                          <select
                            id="rating-select"
                            value={reviewData.rating}
                            onChange={(e) =>
                              setReviewData({
                                ...reviewData,
                                rating: parseInt(e.target.value, 10),
                              })
                            }
                            className="product-detail__form-select w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800"
                          >
                            {[5, 4, 3, 2, 1].map((num) => (
                              <option key={num} value={num}>
                                {num} Star{num > 1 ? 's' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="product-detail__form-group mt-4">
                        <label
                          className="product-detail__form-label block text-sm font-medium mb-1"
                          htmlFor="review-comment"
                        >
                          Comment
                        </label>
                        <textarea
                          id="review-comment"
                          value={reviewData.comment}
                          onChange={(e) =>
                            setReviewData({
                              ...reviewData,
                              comment: e.target.value,
                            })
                          }
                          className="product-detail__form-textarea w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 resize-y"
                          rows={4}
                          required
                          minLength={5}
                          maxLength={1000}
                          placeholder="Share your thoughts on the product..."
                        />
                        <p className="product-detail__form-helper text-xs text-gray-500 mt-1">
                          Between 5 and 1000 characters.
                        </p>
                      </div>

                      <div className="product-detail__form-actions mt-4 flex space-x-3">
                        <button
                          type="submit"
                          className="btn bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150"
                        >
                          Submit Review
                        </button>
                        <button
                          type="button"
                          className="btn bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-150 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                          onClick={() => setShowReviewForm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Reviews List */}
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="product-detail__reviews-list space-y-6">
                      {product.reviews.map((review, index) => (
                        <article
                          key={review._id || index}
                          className="product-detail__review-card p-4 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm dark:bg-gray-800/50"
                        >
                          <div className="product-detail__review-header flex justify-between items-center mb-2">
                            <div className="product-detail__review-user flex items-center space-x-3">
                              <span className="product-detail__review-name font-bold text-lg">
                                {review.name || 'Anonymous User'}
                              </span>
                              <ReviewStars rating={review.rating} />
                            </div>
                            {review.createdAt && (
                              <span className="product-detail__review-date text-xs text-gray-500 dark:text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className="product-detail__review-comment text-gray-700 dark:text-gray-300">
                            {review.comment}
                          </p>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="product-detail__no-reviews text-gray-500 dark:text-gray-400 italic">
                      No reviews yet. Be the first to review this product!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="product-page__related mt-16">
            <h3 className="product-page__related-title text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              You Might Also Like
            </h3>
            <div className="product-detail__related-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp._id} product={rp} />
              ))}
            </div>
          </section>
        )}
      </div>
      
      {/* Assuming Footer is defined elsewhere */}
      <Footer />
    </>
  );
};

export default ProductDetail;