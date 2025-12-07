import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  RefreshCcw,
  ArrowLeft,
  Plus,
  Minus,
  Zap,
  Ruler
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchProduct, fetchProducts, addReview } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import './ProductDetail.css';
import { toast } from 'react-hot-toast';
import { getPrimaryOptions, getSizeOptions } from '../utils/sizeOptions';
import { favoriteService } from '../services/favoriteService';

// --- Small reusable bits ---

const FavoriteButton = ({ isFavorite, onToggle }) => (
  <button
    type="button"
    className="icon-button"
    aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
    onClick={onToggle}
  >
    <Heart
      className={`icon-button__icon ${isFavorite ? 'icon-button__icon--active' : ''}`}
      fill={isFavorite ? 'currentColor' : 'none'}
    />
  </button>
);

const ShareButton = () => (
  <button type="button" className="icon-button" aria-label="Share product">
    <Share2 className="icon-button__icon" />
  </button>
);

const ReviewStars = ({ rating }) => (
  <div className="product-page__stars">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={i < rating ? 'star-icon star-icon--filled' : 'star-icon'}
        fill={i < rating ? 'currentColor' : 'none'}
      />
    ))}
  </div>
);

// --- Fallback images ---

const FALLBACK_IMAGE =
  'https://via.placeholder.com/800x600?text=Cricket+Gear+Image';
const ERROR_IMAGE =
  'https://via.placeholder.com/800x600?text=Image+Error';
const THUMB_ERROR_IMAGE =
  'https://via.placeholder.com/120x120?text=Error';

// ------------------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------------------

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [selectedPrimary, setSelectedPrimary] = useState(''); // Handle type or Hand
  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTab] = useState('specs');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { currentProduct: product, products, isLoading } = useAppSelector(
    (state) => state.products
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Fetch product + a small set of related ones
  useEffect(() => {
    if (!id) return;

    dispatch(fetchProduct(id))
      .unwrap()
      .catch(() => toast.error('Failed to load product details'));

    dispatch(fetchProducts({ limit: 12 }))
      .unwrap()
      .catch(() => console.warn('Failed to fetch related products'));
  }, [dispatch, id]);

  const relatedProducts = useMemo(() => {
    if (!product || !Array.isArray(products)) return [];
    return products
      .filter((p) => p._id !== product._id && p.category === product.category)
      .slice(0, 4);
  }, [product, products]);

  // ----------------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------------

  const handleAddToCart = useCallback(async () => {
    if (!id || !product) {
      toast.error('Invalid product');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to add items to your bag');
      navigate('/login');
      return;
    }

    // Check if primary selection is required
    const primaryOptions = getPrimaryOptions(product.category);
    if (primaryOptions && !selectedPrimary) {
      toast.error(`Please select ${primaryOptions.label.toLowerCase()}`);
      return;
    }

    // Check if size selection is required
    const sizeOptions = getSizeOptions(product.category, selectedPrimary);
    if (sizeOptions.length > 1 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    const currentStock =
      product?.sizeVariants?.find((v) => v.size === selectedSize)?.stock ??
      product?.stock ??
      0;

    if (currentStock === 0) {
      toast.error('Product / size is out of stock');
      return;
    }

    try {
      await dispatch(
        addToCart({
          productId: id,
          quantity,
          primaryOption: selectedPrimary,
          size: selectedSize
        })
      ).unwrap();
      toast.success('Added to bag');
    } catch {
      toast.error('Failed to add product to bag');
    }
  }, [dispatch, id, product, selectedPrimary, selectedSize, quantity, isAuthenticated, navigate]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!id || !product) {
      toast.error('Product not found');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to write a review');
      return;
    }

    if (!reviewData.comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await dispatch(addReview({ id, reviewData })).unwrap();
      toast.success('Review added');
      setShowReviewForm(false);
      setReviewData({ rating: 5, comment: '' });
      dispatch(fetchProduct(id));
    } catch {
      toast.error('Failed to add review (maybe already reviewed?)');
    }
  };

  const handleQuantityChange = (delta) => {
    if (!product) return;

    const currentStock =
      product.sizeVariants && selectedSize
        ? product.sizeVariants.find((v) => v.size === selectedSize)?.stock ?? 0
        : product.stock ?? 0;

    const next = Math.min(Math.max(1, quantity + delta), currentStock || 1);
    setQuantity(next);
  };

  const handleMainImageError = (e) => {
    e.target.src = ERROR_IMAGE;
    setIsImageLoading(false);
  };

  const handleThumbImageError = (e) => {
    e.target.src = THUMB_ERROR_IMAGE;
  };

  useEffect(() => {
    setIsImageLoading(true);
  }, [selectedImage]);

  // 🔁 Load favorites for this product (using product._id, not URL id)
  useEffect(() => {
    if (!isAuthenticated || !product?._id) return;

    let isMounted = true;

    const loadFavorites = async () => {
      try {
        const response = await favoriteService.getFavorites();
        const favs = response.data || [];
        if (isMounted) {
          setIsFavorite(favs.some((fav) => fav.product._id === product._id));
        }
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      }
    };

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, product?._id]);

  const handleToggleFavorite = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to favorites');
      navigate('/login');
      return;
    }

    if (!product?._id) {
      toast.error('Product not loaded correctly');
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

      // Optimistically update UI
      setIsFavorite((prev) => !prev);
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error('Failed to update favorites');
    }
  }, [isFavorite, isAuthenticated, navigate, product]);

  // ----------------------------------------------------------------
  // Loading / error
  // ----------------------------------------------------------------

  if (isLoading && !product) {
    return (
      <div className="product-detail-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (!id || !product) {
    return (
      <div className="product-detail-loading">
        <div>
          <p className="product-detail-error">
            Product not found or invalid URL
          </p>
          <button
            type="button"
            className="product-page__back-link"
            onClick={() => navigate('/products')}
          >
            <ArrowLeft size={18} />
            Back to Gear
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // Derived values
  // ----------------------------------------------------------------

  const mainImage =
    product.images && product.images.length > 0
      ? product.images[selectedImage] || product.images[0]
      : FALLBACK_IMAGE;

  const primaryOptions = getPrimaryOptions(product.category);
  const sizeOptions = getSizeOptions(product.category, selectedPrimary);
  const sizeVariants = product.sizeVariants || [];

  const productStock =
    sizeVariants.length > 0 && selectedSize
      ? sizeVariants.find((v) => v.size === selectedSize)?.stock ?? 0
      : product.stock ?? 0;

  const hasStock = (productStock ?? 0) > 0;
  const roundedRating = product.rating ? Number(product.rating.toFixed(1)) : 0;
  const hasOldPrice =
    product.oldPrice && product.oldPrice > product.price;

  const discountPercent = hasOldPrice
    ? Math.round(
        ((product.oldPrice - product.price) / product.oldPrice) * 100
      )
    : null;

  const maxQty = productStock || 1;

  // ----------------------------------------------------------------
  // UI
  // ----------------------------------------------------------------

  return (
    <>
      <div className="product-page">
        <div className="product-page__shell">
          <button
            type="button"
            className="product-page__back-link"
            onClick={() => navigate('/products')}
          >
            <ArrowLeft size={18} />
            Back to Gear
          </button>

          {/* MAIN CARD */}
          <div className="product-page__card">
            <div className="product-page__grid">
              {/* LEFT – IMAGES */}
              <div className="product-page__media">
                <div className="product-page__main-image-wrapper">
                  {isImageLoading && (
                    <div className="product-page__image-skeleton">
                      <span>Loading image…</span>
                    </div>
                  )}
                  <img
                    src={mainImage}
                    alt={product.name}
                    onError={handleMainImageError}
                    onLoad={() => setIsImageLoading(false)}
                    className={`product-page__main-image ${
                      isImageLoading ? 'product-page__main-image--hidden' : ''
                    }`}
                  />
                </div>

                {product.images && product.images.length > 1 && (
                  <div className="product-page__thumbnails">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`thumb-button ${
                          selectedImage === idx ? 'thumb-button--active' : ''
                        }`}
                        onClick={() => setSelectedImage(idx)}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          onError={handleThumbImageError}
                          className="thumb-button__image"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT – DETAILS */}
              <div className="product-page__info">
                <div>
                  {product.category && (
                    <span className="pill pill--category">
                      {product.category}
                    </span>
                  )}
                  {hasOldPrice && discountPercent != null && (
                    <span className="pill pill--discount">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                <h1 className="product-page__title">{product.name}</h1>

                <div className="product-page__rating-row">
                  <ReviewStars rating={Math.round(roundedRating)} />
                  <span className="product-page__rating-score">
                    {roundedRating > 0 ? roundedRating.toFixed(1) : '—'}
                  </span>
                  <span className="product-page__rating-count">
                    ({product.numReviews || 0} reviews)
                  </span>
                </div>

                <div className="product-page__price-row">
                  <span className="product-page__price">
                    £{product.price.toFixed(2)}
                  </span>
                  {hasOldPrice && (
                    <span className="product-page__old-price">
                      £{product.oldPrice.toFixed(2)}
                    </span>
                  )}
                  {!hasStock && (
                    <span className="pill pill--stock">Out of stock</span>
                  )}
                </div>

                {product.description && (
                  <p className="product-page__description">
                    {product.description}
                  </p>
                )}

                {/* PRIMARY SELECTION (Handle Type / Hand) */}
                {primaryOptions && (
                  <div className="product-page__option-row">
                    <span className="product-page__option-label">
                      Select {primaryOptions.label}
                    </span>
                    <div className="product-page__option-buttons">
                      {primaryOptions.options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`option-button ${
                            selectedPrimary === option
                              ? 'option-button--active'
                              : ''
                          }`}
                          onClick={() => {
                            setSelectedPrimary(option);
                            setSelectedSize(''); // Reset size when primary changes
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* SIZE SELECTION */}
                {sizeOptions.length > 0 && (!primaryOptions || selectedPrimary) && (
                  <div className="product-page__option-row">
                    <span className="product-page__option-label">
                      Select Size
                    </span>
                    <div className="product-page__option-buttons">
                      {sizeOptions.map((size) => {
                        let isOutOfStock = false;

                        if (sizeVariants.length > 0) {
                          const sizeVariant = sizeVariants.find(v => v.size === size);
                          isOutOfStock =
                            !sizeVariant ||
                            (sizeVariant.stock !== undefined && sizeVariant.stock === 0);
                        }

                        return (
                          <button
                            key={size}
                            type="button"
                            className={`option-button ${
                              selectedSize === size
                                ? 'option-button--active'
                                : ''
                            } ${
                              isOutOfStock
                                ? 'option-button--disabled'
                                : ''
                            }`}
                            onClick={() => setSelectedSize(size)}
                            disabled={isOutOfStock}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* QUANTITY + CTAS + INLINE SIZE GUIDE */}
                <div className="product-page__cart-row">
                  <div className="product-page__qty-group">
                    <span className="product-page__qty-label">Quantity</span>
                    <div className="qty-control">
                      <button
                        type="button"
                        className="qty-control__btn"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={!hasStock || quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="qty-control__value">{quantity}</span>
                      <button
                        type="button"
                        className="qty-control__btn"
                        onClick={() => handleQuantityChange(1)}
                        disabled={!hasStock || quantity >= maxQty}
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="product-page__cta-row">
                    <button
                      type="button"
                      className={`btn btn--primary ${
                        !hasStock ? 'btn--disabled' : ''
                      }`}
                      disabled={!hasStock}
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart size={18} />
                      {hasStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>

                    <FavoriteButton
                      isFavorite={isFavorite}
                      onToggle={handleToggleFavorite}
                    />

                    {product.category === 'bats' && (
                      <button
                        type="button"
                        onClick={() => setShowSizeGuide(true)}
                        title="Size Guide"
                        className="icon-button"
                        aria-label="Size Guide"
                      >
                        <Ruler className="icon-button__icon" />
                      </button>
                    )}

                    <ShareButton />
                  </div>

                  {productStock <= 5 && productStock > 0 && (
                    <p className="product-page__low-stock">
                      ⚠ Only {productStock} left in stock!
                    </p>
                  )}
                </div>

                {/* BENEFITS */}
                <div className="product-page__benefits">
                  <div className="benefit-card">
                    <Truck className="benefit-card__icon" />
                    <div>
                      <div className="benefit-card__title">
                        Pro Fast Shipping
                      </div>
                      <div className="benefit-card__subtitle">
                        Pan-India on cricket gear
                      </div>
                    </div>
                  </div>

                  <div className="benefit-card">
                    <Zap className="benefit-card__icon" />
                    <div>
                      <div className="benefit-card__title">
                        1 Year Bat Warranty
                      </div>
                      <div className="benefit-card__subtitle">
                        On selected English willow bats
                      </div>
                    </div>
                  </div>

                  <div className="benefit-card">
                    <RefreshCcw className="benefit-card__icon" />
                    <div>
                      <div className="benefit-card__title">
                        30-Day Easy Returns
                      </div>
                      <div className="benefit-card__subtitle">
                        Unused gear in original pack
                      </div>
                    </div>
                  </div>
                </div>

                {/* TABS (Specs & Reviews) */}
                <div className="product-page__tabs-wrapper">
                  <div className="product-page__tabs">
                    <div className="tab-nav">
                      <button
                        type="button"
                        className={`tab-nav__item ${
                          activeTab === 'specs'
                            ? 'tab-nav__item--active'
                            : ''
                        }`}
                        onClick={() => setActiveTab('specs')}
                      >
                        Specs & Features
                      </button>
                      <button
                        type="button"
                        className={`tab-nav__item ${
                          activeTab === 'reviews'
                            ? 'tab-nav__item--active'
                            : ''
                        }`}
                        onClick={() => setActiveTab('reviews')}
                      >
                        Reviews ({product.numReviews || 0})
                      </button>
                    </div>

                    <div className="tab-panel">
                      {/* SPECS TAB */}
                      {activeTab === 'specs' && (
                        <div className="tab-panel__content">
                          {product.features &&
                            product.features.length > 0 && (
                              <div>
                                <h3>Key Features</h3>
                                <ul className="tab-list">
                                  {product.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          {product.specifications &&
                            Object.keys(product.specifications).some(
                              (key) => product.specifications[key]
                            ) && (
                              <div style={{ marginTop: '1.25rem' }}>
                                <h3>Technical Specifications</h3>
                                <ul className="tab-list">
                                  {Object.keys(
                                    product.specifications
                                  ).map(
                                    (key) =>
                                      product.specifications[key] && (
                                        <li key={key}>
                                          <strong>
                                            {key
                                              .replace(
                                                /([A-Z])/g,
                                                ' $1'
                                              )
                                              .trim()}
                                            :
                                          </strong>{' '}
                                          {product.specifications[key]}
                                        </li>
                                      )
                                  )}
                                </ul>
                              </div>
                            )}

                          {(!product.features ||
                            product.features.length === 0) &&
                            (!product.specifications ||
                              Object.keys(product.specifications).length ===
                                0) && (
                              <p
                                style={{
                                  color: '#6b7280',
                                  fontStyle: 'italic',
                                  fontSize: '0.9rem'
                                }}
                              >
                                No technical details provided for this
                                product.
                              </p>
                            )}
                        </div>
                      )}

                      {/* REVIEWS TAB */}
                      {activeTab === 'reviews' && (
                        <div className="tab-panel__content">
                          <div className="tab-reviews-header">
                            <h3>Customer Reviews</h3>
                            {isAuthenticated && (
                              <button
                                type="button"
                                className="btn btn--primary"
                                style={{ flex: '0 0 auto', boxShadow: 'none' }}
                                onClick={() =>
                                  setShowReviewForm(
                                    (prev) => !prev
                                  )
                                }
                              >
                                {showReviewForm
                                  ? 'Cancel'
                                  : 'Write Review'}
                              </button>
                            )}
                          </div>

                          {showReviewForm && isAuthenticated && (
                            <form
                              onSubmit={handleReviewSubmit}
                              className="product-detail__review-form"
                            >
                              <div className="product-detail__form-group">
                                <label
                                  className="product-detail__form-label"
                                  htmlFor="rating-select"
                                >
                                  Rating
                                </label>
                                <select
                                  id="rating-select"
                                  value={reviewData.rating}
                                  onChange={(e) =>
                                    setReviewData({
                                      ...reviewData,
                                      rating: parseInt(
                                        e.target.value,
                                        10
                                      )
                                    })
                                  }
                                  className="product-detail__form-select"
                                >
                                  {[5, 4, 3, 2, 1].map((num) => (
                                    <option key={num} value={num}>
                                      {num} Star
                                      {num > 1 ? 's' : ''}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="product-detail__form-group">
                                <label
                                  className="product-detail__form-label"
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
                                      comment: e.target.value
                                    })
                                  }
                                  className="product-detail__form-textarea"
                                  required
                                  minLength={5}
                                  maxLength={1000}
                                  placeholder="Share how this gear performs in the nets or on match day…"
                                />
                              </div>

                              <div className="product-detail__form-actions">
                                <button
                                  type="submit"
                                  className="btn btn--primary"
                                >
                                  Submit Review
                                </button>
                                <button
                                  type="button"
                                  className="btn"
                                  style={{
                                    background:
                                      'linear-gradient(135deg,#e5e7eb,#d1d5db)',
                                    color: '#374151'
                                  }}
                                  onClick={() =>
                                    setShowReviewForm(false)
                                  }
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          )}

                          {product.reviews &&
                          product.reviews.length > 0 ? (
                            <div className="product-detail__reviews-list">
                              {product.reviews.map((review, index) => (
                                <div
                                  key={review._id || index}
                                  className="product-detail__review-card"
                                >
                                  <div className="product-detail__review-header">
                                    <div className="product-detail__review-user">
                                      <span className="product-detail__review-name">
                                        {review.name ||
                                          'Anonymous Cricketer'}
                                      </span>
                                      <ReviewStars
                                        rating={review.rating}
                                      />
                                    </div>
                                    {review.createdAt && (
                                      <span className="product-detail__review-date">
                                        {new Date(
                                          review.createdAt
                                        ).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                  <p className="product-detail__review-comment">
                                    {review.comment}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p
                              style={{
                                color: '#6b7280',
                                fontStyle: 'italic',
                                fontSize: '0.9rem'
                              }}
                            >
                              No reviews yet. Be the first to share
                              your match experience with this gear!
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RELATED PRODUCTS */}
          {relatedProducts.length > 0 && (
            <section className="product-page__related">
              <h3 className="product-page__related-title">
                You Might Also Like
              </h3>
              <div className="product-detail__related-grid">
                {relatedProducts.map((rp) => (
                  <ProductCard key={rp._id} product={rp} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer />

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setShowSizeGuide(false)}
        >
          <div 
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>Cricket Bat Size Guide</h2>
              <button
                onClick={() => setShowSizeGuide(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  lineHeight: 1,
                  padding: '0 4px'
                }}
              >
                ×
              </button>
            </div>
            
            <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>
              Choose the right bat size based on the player's age and height for optimal performance.
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700', color: '#111827' }}>Size</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700', color: '#111827' }}>Age Range</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700', color: '#111827' }}>Height Range</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700', color: '#111827' }}>Bat Length</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px', fontWeight: '600', color: '#111827' }}>Size 1</td>
                  <td style={{ padding: '12px', color: '#374151' }}>4-5 years</td>
                  <td style={{ padding: '12px', color: '#374151' }}>3'5" - 3'9"</td>
                  <td style={{ padding: '12px', color: '#374151' }}>24" - 26"</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                  <td style={{ padding: '12px', fontWeight: '600', color: '#111827' }}>Size 2</td>
                  <td style={{ padding: '12px', color: '#374151' }}>5-6 years</td>
                  <td style={{ padding: '12px', color: '#374151' }}>3'9" - 4'1"</td>
                  <td style={{ padding: '12px', color: '#374151' }}>26" - 27"</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px', fontWeight: '600', color: '#111827' }}>Size 3</td>
                  <td style={{ padding: '12px', color: '#374151' }}>6-7 years</td>
                  <td style={{ padding: '12px', color: '#374151' }}>4'1" - 4'4"</td>
                  <td style={{ padding: '12px', color: '#374151' }}>27" - 28"</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                  <td style={{ padding: '12px', fontWeight: '600', color: '#111827' }}>Size 4</td>
                  <td style={{ padding: '12px', color: '#374151' }}>7-8 years</td>
                  <td style={{ padding: '12px', color: '#374151' }}>4'4" - 4'7"</td>
                  <td style={{ padding: '12px', color: '#374151' }}>28" - 29"</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px', fontWeight: '600', color: '#111827' }}>Size 5</td>
                  <td style={{ padding: '12px', color: '#374151' }}>8-9 years</td>
                  <td style={{ padding: '12px', color: '#374151' }}>4'7" - 4'10"</td>
                  <td style={{ padding: '12px', color: '#374151' }}>29" - 30"</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                  <td style={{ padding: '12px', fontWeight: '600', color: '#111827' }}>Size 6 (Harrow)</td>
                  <td style={{ padding: '12px', color: '#374151' }}>9-11 years</td>
                  <td style={{ padding: '12px', color: '#374151' }}>4'10" - 5'2"</td>
                  <td style={{ padding: '12px', color: '#374151' }}>30" - 31"</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px', fontWeight: '600', color: '#111827' }}>Short Handle (SH)</td>
                  <td style={{ padding: '12px', color: '#374151' }}>11-14 years</td>
                  <td style={{ padding: '12px', color: '#374151' }}>5'2" - 5'6"</td>
                  <td style={{ padding: '12px', color: '#374151' }}>31" - 32"</td>
                </tr>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <td style={{ padding: '12px', fontWeight: '600', color: '#111827' }}>Long Handle (LH)</td>
                  <td style={{ padding: '12px', color: '#374151' }}>14+ years</td>
                  <td style={{ padding: '12px', color: '#374151' }}>5'6"+</td>
                  <td style={{ padding: '12px', color: '#374151' }}>33" - 34"</td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#1e40af', lineHeight: '1.6' }}>
                <strong>Tip:</strong> When in doubt, choose a slightly lighter bat. It's easier to control and helps develop proper technique.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
