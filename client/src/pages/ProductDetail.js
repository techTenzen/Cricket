// src/pages/ProductDetail.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Truck, ShieldCheck, RefreshCcw, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchProduct, fetchProducts, addReview } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

import './ProductDetail.css';

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

  // Fetch data
  useEffect(() => {
    if (!id) return;

    dispatch(fetchProduct(id))
      .unwrap()
      .catch(() => {
        toast.error('Failed to load product details');
      });

    dispatch(fetchProducts({ limit: 12 }))
      .unwrap()
      .catch(() => {
        console.warn('Failed to fetch related products');
      });
  }, [dispatch, id]);

  // Related products
  const relatedProducts = useMemo(() => {
    if (!product || !Array.isArray(products)) return [];
    return products
      .filter((p) => p._id !== product._id && p.category === product.category)
      .slice(0, 4);
  }, [product, products]);

  const handleAddToCart = useCallback(async () => {
    if (!id) {
      toast.error('Invalid product');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!product || product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    try {
      await dispatch(addToCart({ productId: id, quantity })).unwrap();
      toast.success('Product added to cart!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add product to cart');
    }
  }, [dispatch, id, isAuthenticated, product, quantity, navigate]);

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
    } catch (error) {
      console.error(error);
      toast.error('Failed to add review');
    }
  };

  const handleQuantityChange = (delta) => {
    if (!product) return;
    const stock = product.stock || 0;
    const next = Math.min(Math.max(1, quantity + delta), stock || 1);
    setQuantity(next);
  };

  const handleMainImageError = (e) => {
    e.target.src = ERROR_IMAGE;
  };

  const handleThumbImageError = (e) => {
    e.target.src = THUMB_ERROR_IMAGE;
  };

  if (isLoading && !product) {
    return (
      <div className="product-detail-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (!id) {
    return (
      <div className="product-detail-center">
        <p className="product-detail-error">Invalid product URL</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-center">
        <p className="product-detail-error">Product not found</p>
      </div>
    );
  }

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
    <div className="product-page">
      {/* Back link */}
      <button
        type="button"
        className="product-page__back-link"
        onClick={() => navigate('/products')}
      >
        <ArrowLeft className="product-page__back-icon" />
        Back to Products
      </button>

      <div className="product-page__card">
        <div className="product-page__grid">
          {/* Left: images */}
          <div className="product-page__media">
            <div className="product-page__main-image-wrapper">
              {isImageLoading && (
                <div className="product-page__image-skeleton">
                  <span className="product-page__image-skeleton-text">
                    Loading image...
                  </span>
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

            {product.images && product.images.length > 0 && (
              <div className="product-page__thumbnails">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`thumb-button ${
                      selectedImage === idx ? 'thumb-button--active' : ''
                    }`}
                    onClick={() => {
                      setSelectedImage(idx);
                      setIsImageLoading(true);
                    }}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      onError={handleThumbImageError}
                      className="thumb-button__image"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: info */}
          <div className="product-page__info">
            {/* Top pills */}
            

            <h1 className="product-page__title">{product.name}</h1>

            {/* Rating row */}
            <div className="product-page__rating-row">
              <div className="product-page__stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < Math.round(roundedRating)
                        ? 'star-icon star-icon--filled'
                        : 'star-icon'
                    }
                  />
                ))}
              </div>
              <span className="product-page__rating-score">
                {roundedRating > 0 ? roundedRating.toFixed(1) : '—'}
              </span>
              <span className="product-page__rating-count">
                {product.numReviews || 0} reviews
              </span>
            </div>

            {/* Brand, Model, Size */}
            <div className="product-page__brand-info">
              {product.brand && <p>Brand: {product.brand}</p>}
              {product.modelRange && <p>Model: {product.modelRange}</p>}
              {product.size && <p>Size: {product.size}</p>}
            </div>

            {/* Price row */}
            <div className="product-page__price-row">
              <span className="product-page__price">£{product.price}</span>
              {hasOldPrice && (
                <>
                  <span className="product-page__old-price">
                    £{product.oldPrice}
                  </span>
                  <span className="pill pill--discount">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="product-page__description">
                {product.description}
              </p>
            )}

            <hr className="product-page__divider" />

            {/* Size Variants */}
            {product.sizeVariants && product.sizeVariants.length > 0 && (
              <div className="product-page__option-row">
                <span className="product-page__option-label">Size</span>
                <div className="product-page__option-buttons">
                  {product.sizeVariants.map((variant, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`option-button ${
                        selectedSize === variant.size
                          ? 'option-button--active'
                          : ''
                      } ${
                        variant.stock === 0 ? 'option-button--disabled' : ''
                      }`}
                      onClick={() => setSelectedSize(variant.size)}
                      disabled={variant.stock === 0}
                    >
                      {variant.size}
                      {variant.stock === 0 && ' (Out of Stock)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="product-page__cart-row">
              <div className="product-page__qty-group">
                <span className="product-page__qty-label">Quantity:</span>
                <div className="qty-control">
                  <button
                    type="button"
                    className="qty-control__btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={!hasStock || quantity <= 1}
                  >
                    -
                  </button>
                  <span className="qty-control__value">{quantity}</span>
                  <button
                    type="button"
                    className="qty-control__btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={!hasStock || quantity >= maxQty}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                className={`btn btn--primary btn--wide ${
                  !hasStock ? 'btn--disabled' : ''
                }`}
                disabled={!hasStock}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="btn__icon" />
                {hasStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              <button type="button" className="icon-button">
                <Heart className="icon-button__icon" />
              </button>
              <button type="button" className="icon-button">
                <Share2 className="icon-button__icon" />
              </button>
            </div>

            {/* Feature strip */}
            <div className="product-page__benefits">
              <div className="benefit-card">
                <Truck className="benefit-card__icon" />
                <div>
                  <div className="benefit-card__title">Free Shipping</div>
                  <div className="benefit-card__subtitle">
                    Orders £100+
                  </div>
                </div>
              </div>
              <div className="benefit-card">
                <ShieldCheck className="benefit-card__icon" />
                <div>
                  <div className="benefit-card__title">12 Months</div>
                  <div className="benefit-card__subtitle">Warranty</div>
                </div>
              </div>
              <div className="benefit-card">
                <RefreshCcw className="benefit-card__icon" />
                <div>
                  <div className="benefit-card__title">30 Days</div>
                  <div className="benefit-card__subtitle">Returns</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="product-page__tabs">
          <div className="tab-nav">
            <button
              type="button"
              className={`tab-nav__item ${
                activeTab === 'features' ? 'tab-nav__item--active' : ''
              }`}
              onClick={() => setActiveTab('features')}
            >
              Features & Specifications
            </button>
            <button
              type="button"
              className={`tab-nav__item ${
                activeTab === 'reviews' ? 'tab-nav__item--active' : ''
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.numReviews || 0})
            </button>
          </div>

          <div className="tab-panel">
            {activeTab === 'features' && (
              <div className="tab-panel__content">
                {/* Features Section */}
                {product.features && product.features.length > 0 && (
                  <div className="features-section">
                    <h3>Key Features</h3>
                    <ul className="tab-list">
                      {product.features.map((feature, index) => (
                        <li key={`feature-${index}`}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Specifications Section */}
                {product.specifications && Object.keys(product.specifications).some(key => product.specifications[key]) && (
                  <div className="specifications-section">
                    <h3>Specifications</h3>
                    <ul className="tab-list specs-list">
                      {Object.keys(product.specifications).map(key => 
                        product.specifications[key] && (
                          <li key={`spec-${key}`}>
                            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {product.specifications[key]}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
                
                {(!product.features || product.features.length === 0) && 
                 (!product.specifications || !Object.keys(product.specifications).some(key => product.specifications[key])) && (
                  <p>No features or specifications available for this product.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-panel__content">
                <div className="tab-reviews-header">
                  <h3>Customer Reviews</h3>
                  {isAuthenticated && (
                    <button
                      type="button"
                      className="btn btn--primary btn--sm"
                      onClick={() => setShowReviewForm((prev) => !prev)}
                    >
                      {showReviewForm ? 'Close Form' : 'Write Review'}
                    </button>
                  )}
                </div>

                {!isAuthenticated && (
                  <p className="product-detail__login-hint">
                    <button
                      type="button"
                      className="product-detail__login-link"
                      onClick={() => navigate('/login')}
                    >
                      Login
                    </button>{' '}
                    to write a review.
                  </p>
                )}

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
                            rating: parseInt(e.target.value, 10),
                          })
                        }
                        className="product-detail__form-select"
                      >
                        {[5, 4, 3, 2, 1].map((num) => (
                          <option key={num} value={num}>
                            {num} Star{num > 1 ? 's' : ''}
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
                            comment: e.target.value,
                          })
                        }
                        className="product-detail__form-textarea"
                        required
                        minLength={5}
                        maxLength={1000}
                      />
                      <p className="product-detail__form-helper">
                        Between 5 and 1000 characters. Please avoid sharing
                        personal info.
                      </p>
                    </div>

                    <div className="product-detail__form-actions">
                      <button
                        type="submit"
                        className="btn btn--primary btn--sm"
                      >
                        Submit Review
                      </button>
                      <button
                        type="button"
                        className="btn btn--secondary btn--sm"
                        onClick={() => setShowReviewForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {product.reviews && product.reviews.length > 0 ? (
                  <div className="product-detail__reviews-list">
                    {product.reviews.map((review, index) => (
                      <article
                        key={review._id || index}
                        className="product-detail__review-card"
                      >
                        <div className="product-detail__review-header">
                          <div className="product-detail__review-user">
                            <span className="product-detail__review-name">
                              {review.name || 'Anonymous'}
                            </span>
                            <div className="product-detail__review-stars">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={
                                    i < review.rating
                                      ? 'star-icon star-icon--filled'
                                      : 'star-icon'
                                  }
                                />
                              ))}
                            </div>
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
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="product-detail__no-reviews">
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
        <section className="product-page__related">
          <h3 className="product-page__related-title">Related Products</h3>
          <div className="product-detail__related-grid">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp._id} product={rp} />
            ))}
          </div>
        </section>
      )}
    </div>
    
    <Footer />
    </>
  );
};

export default ProductDetail;
