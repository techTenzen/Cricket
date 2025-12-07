import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchProducts, deleteProduct, createProduct, updateProduct } from '../../store/slices/productSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getPrimaryOptions, getSizeOptions } from '../../utils/sizeOptions';

const AdminProducts = () => {
  const dispatch = useAppDispatch();
  const { products, isLoading } = useAppSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [brands, setBrands] = useState(['SS', 'SG', 'Kookaburra', 'GM', 'MRF', 'Gray-Nicolls', 'New Balance', 'Puma']);

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.modelRange && product.modelRange.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesBrand = !brandFilter || product.brand === brandFilter;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  const categories = ['bats', 'balls', 'pads', 'gloves', 'helmets', 'shoes', 'clothing', 'accessories', 'stumps'];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
          <button
            onClick={() => setShowBrandModal(true)}
            className="bg-white text-gray-900 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Manage Brands
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model/Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price (GBP)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.images[0] || 'https://via.placeholder.com/50x50?text=No+Image'}
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">Rating: {product.rating}/5</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.modelRange || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.size || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">£{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.sizeVariants ? (
                      <div className="space-y-1">
                        {product.sizeVariants.map((variant, idx) => (
                          <div key={idx} className="text-xs flex items-center gap-1">
                            <span className="font-medium">{variant.size}:</span>
                            <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded font-semibold ${
                              variant.stock > 10 ? 'bg-green-100 text-green-800' :
                              variant.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`} style={{ 
                              color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#000' : undefined,
                              width: '28px',
                              textAlign: 'center'
                            }}>
                              {variant.stock}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-full ${
                        product.stock > 10 ? 'bg-green-100 text-green-800' :
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`} style={{ 
                        color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#000' : undefined,
                        width: '32px',
                        textAlign: 'center'
                      }}>
                        {product.stock || 0}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <ProductModal
          product={editingProduct}
          brands={brands}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
        />
      )}
      
      {/* Brand Management Modal */}
      {showBrandModal && (
        <BrandModal
          brands={brands}
          setBrands={setBrands}
          onClose={() => setShowBrandModal(false)}
        />
      )}
    </div>
  );
};

// Simple Product Modal Component
const ProductModal = ({ product, brands, onClose }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: product?.name || '',
    brand: product?.brand || '',
    modelRange: product?.modelRange || '',
    category: product?.category || '',
    price: product?.price || '',
    oldPrice: product?.oldPrice || '',
    description: product?.description || ''
  });
  const [features, setFeatures] = useState(product?.features || ['']);
  const [specifications, setSpecifications] = useState({
    weight: product?.specifications?.weight || '',
    material: product?.specifications?.material || '',
    size: product?.specifications?.size || '',
    color: product?.specifications?.color || ''
  });
  const [sizeVariants, setSizeVariants] = useState(product?.sizeVariants || [{ size: '', stock: 0 }]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState(product?.images || []);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(product?.primaryImageIndex || 0);
  const [hoverImageIndex, setHoverImageIndex] = useState(product?.hoverImageIndex || 1);

  const categories = ['bats', 'balls', 'pads', 'gloves', 'helmets', 'shoes', 'clothing', 'accessories', 'stumps'];
  
  const addSizeVariant = () => {
    setSizeVariants([...sizeVariants, { size: '', stock: 0 }]);
  };
  
  const removeSizeVariant = (index) => {
    setSizeVariants(sizeVariants.filter((_, i) => i !== index));
  };
  
  const updateSizeVariant = (index, field, value) => {
    const updated = sizeVariants.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    );
    setSizeVariants(updated);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + existingImages.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setSelectedImages(files);
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (product) {
        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
          submitData.append(key, formData[key]);
        });
        submitData.append('sizeVariants', JSON.stringify(sizeVariants));
        submitData.append('features', JSON.stringify(features.filter(f => f.trim())));
        submitData.append('specifications', JSON.stringify(specifications));
        submitData.append('existingImages', JSON.stringify(existingImages));
        submitData.append('primaryImageIndex', primaryImageIndex);
        submitData.append('hoverImageIndex', hoverImageIndex);
        selectedImages.forEach(image => {
          submitData.append('images', image);
        });
        await dispatch(updateProduct({ id: product._id, productData: submitData })).unwrap();
        toast.success('Product updated successfully!');
      } else {
        // For new products, send FormData to enable image uploads
        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
          submitData.append(key, formData[key]);
        });
        submitData.append('sizeVariants', JSON.stringify(sizeVariants));
        submitData.append('features', JSON.stringify(features.filter(f => f.trim())));
        submitData.append('specifications', JSON.stringify(specifications));
        submitData.append('primaryImageIndex', primaryImageIndex);
        submitData.append('hoverImageIndex', hoverImageIndex);
        selectedImages.forEach(image => {
          submitData.append('images', image);
        });
        await dispatch(createProduct(submitData)).unwrap();
        toast.success('Product added successfully!');
      }
      onClose();
    } catch (error) {
      toast.error(error || 'Operation failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{product ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={formData.brand}
            onChange={(e) => setFormData({...formData, brand: e.target.value})}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Brand</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Model Name/Range"
            value={formData.modelRange}
            onChange={(e) => setFormData({...formData, modelRange: e.target.value})}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Size"
            value={formData.size}
            onChange={(e) => setFormData({...formData, size: e.target.value})}
            className="w-full p-2 border rounded"
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Price Per pcs in GBP £ (without shipping)"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Previous Price (optional) - for discount display"
            value={formData.oldPrice}
            onChange={(e) => setFormData({...formData, oldPrice: e.target.value})}
            className="w-full p-2 border rounded"
          />
          
          {/* Size Variants */}
          {/* Features */}
          <div>
            <label className="block text-sm font-medium mb-2">Features</label>
            {features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Feature"
                  value={feature}
                  onChange={(e) => {
                    const updated = [...features];
                    updated[index] = e.target.value;
                    setFeatures(updated);
                  }}
                  className="flex-1 p-2 border rounded"
                />
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setFeatures(features.filter((_, i) => i !== index))}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFeatures([...features, ''])}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              Add Feature
            </button>
          </div>

          {/* Specifications */}
          <div>
            <label className="block text-sm font-medium mb-2">Specifications</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Weight"
                value={specifications.weight}
                onChange={(e) => setSpecifications({...specifications, weight: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Material"
                value={specifications.material}
                onChange={(e) => setSpecifications({...specifications, material: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Size"
                value={specifications.size}
                onChange={(e) => setSpecifications({...specifications, size: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Color"
                value={specifications.color}
                onChange={(e) => setSpecifications({...specifications, color: e.target.value})}
                className="p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Size Variants & Stock</label>
            {sizeVariants.map((variant, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={variant.size}
                  onChange={(e) => updateSizeVariant(index, 'size', e.target.value)}
                  className="flex-1 p-2 border rounded"
                  required
                >
                  <option value="">Select Size</option>
                  {/* Show all possible sizes for the category */}
                  {(() => {
                    const primaryOpts = getPrimaryOptions(formData.category);
                    if (primaryOpts) {
                      // For two-step categories, show sizes for all primary options
                      const allSizes = new Set();
                      primaryOpts.options.forEach(opt => {
                        getSizeOptions(formData.category, opt).forEach(size => allSizes.add(size));
                      });
                      return Array.from(allSizes).map(size => (
                        <option key={size} value={size}>{size}</option>
                      ));
                    } else {
                      return getSizeOptions(formData.category).map(size => (
                        <option key={size} value={size}>{size}</option>
                      ));
                    }
                  })()}
                </select>
                <input
                  type="number"
                  placeholder="Stock"
                  value={variant.stock}
                  onChange={(e) => updateSizeVariant(index, 'stock', parseInt(e.target.value))}
                  className="w-20 p-2 border rounded"
                  required
                />
                {sizeVariants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSizeVariant(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSizeVariant}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              Add Size
            </button>
          </div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded h-20"
            required
          />
          
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium mb-2">Product Images (Max 5)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
            />
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Existing Images:</p>
                <div className="flex flex-wrap gap-2">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={image} alt={`Product ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* New Images Preview */}
            {selectedImages.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">New Images:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={URL.createObjectURL(image)} alt={`New ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                        {existingImages.length + index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Image Order Selection */}
            {(existingImages.length > 0 || selectedImages.length > 0) && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <h4 className="text-sm font-medium mb-2">Image Display Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Primary Image (Card Display)</label>
                    <select
                      value={primaryImageIndex}
                      onChange={(e) => setPrimaryImageIndex(parseInt(e.target.value))}
                      className="w-full p-2 border rounded text-sm"
                    >
                      {[...Array(existingImages.length + selectedImages.length)].map((_, index) => (
                        <option key={index} value={index}>Image {index + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Hover Image (On Mouse Over)</label>
                    <select
                      value={hoverImageIndex}
                      onChange={(e) => setHoverImageIndex(parseInt(e.target.value))}
                      className="w-full p-2 border rounded text-sm"
                    >
                      {[...Array(existingImages.length + selectedImages.length)].map((_, index) => (
                        <option key={index} value={index}>Image {index + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Primary: Image {primaryImageIndex + 1} | Hover: Image {hoverImageIndex + 1}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
              {product ? 'Update' : 'Add'}
            </button>
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Brand Management Modal
const BrandModal = ({ brands, setBrands, onClose }) => {
  const [newBrand, setNewBrand] = useState('');
  
  const addBrand = () => {
    if (newBrand.trim() && !brands.includes(newBrand.trim())) {
      setBrands([...brands, newBrand.trim()]);
      setNewBrand('');
      toast.success('Brand added successfully');
    }
  };
  
  const removeBrand = (brandToRemove) => {
    setBrands(brands.filter(brand => brand !== brandToRemove));
    toast.success('Brand removed successfully');
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Manage Brands</h2>
        
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New brand name"
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              className="flex-1 p-2 border rounded"
              onKeyPress={(e) => e.key === 'Enter' && addBrand()}
            />
            <button
              onClick={addBrand}
              className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
            >
              Add
            </button>
          </div>
        </div>
        
        <div className="max-h-60 overflow-y-auto">
          <h3 className="font-medium mb-2">Current Brands:</h3>
          {brands.map(brand => (
            <div key={brand} className="flex justify-between items-center p-2 border-b">
              <span>{brand}</span>
              <button
                onClick={() => removeBrand(brand)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;