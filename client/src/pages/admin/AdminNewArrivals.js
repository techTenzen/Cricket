import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchProducts } from '../../store/slices/productSlice';
import { newArrivalsService } from '../../services/newArrivalsService';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminNewArrivals = () => {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);
  const [newArrivals, setNewArrivals] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchProducts({}));
    fetchNewArrivals();
  }, [dispatch]);

  const fetchNewArrivals = async () => {
    try {
      const response = await newArrivalsService.getNewArrivals();
      setNewArrivals(response.data || []);
    } catch (error) {
      console.error('Failed to fetch new arrivals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToNewArrivals = async (productId) => {
    try {
      const order = newArrivals.length + 1;
      await newArrivalsService.addToNewArrivals(productId, order);
      toast.success('Product added to new arrivals');
      fetchNewArrivals();
      setShowAddModal(false);
    } catch (error) {
      toast.error('Failed to add product to new arrivals');
    }
  };

  const handleRemove = async (productId) => {
    if (window.confirm('Remove from new arrivals?')) {
      try {
        await newArrivalsService.removeFromNewArrivals(productId);
        toast.success('Product removed from new arrivals');
        fetchNewArrivals();
      } catch (error) {
        toast.error('Failed to remove product');
      }
    }
  };

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...newArrivals];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    
    const reorderedItems = updatedItems.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    setNewArrivals(reorderedItems);
    updateOrder(reorderedItems);
  };

  const updateOrder = async (items) => {
    try {
      await newArrivalsService.updateNewArrivalsOrder(items.map(item => ({
        productId: item._id,
        order: item.order
      })));
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Manage New Arrivals</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Current New Arrivals (Drag to reorder)</h2>
          {newArrivals.length === 0 ? (
            <p className="text-gray-500">No products in new arrivals</p>
          ) : (
            <div className="space-y-3">
              {newArrivals.map((product, index) => (
                <div
                  key={product._id}
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                >
                  <GripVertical className="h-5 w-5 text-gray-400 mr-3 cursor-move" />
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/50x50?text=No+Image'}
                    alt={product.name}
                    className="h-12 w-12 rounded object-cover mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.brand} - £{product.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => moveItem(index, Math.max(0, index - 1))}
                      disabled={index === 0}
                      className="px-2 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveItem(index, Math.min(newArrivals.length - 1, index + 1))}
                      disabled={index === newArrivals.length - 1}
                      className="px-2 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddProductModal
          products={products.filter(p => !newArrivals.find(na => na._id === p._id))}
          onAdd={handleAddToNewArrivals}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

const AddProductModal = ({ products, onAdd, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <h2 className="text-xl font-bold mb-4">Add Product to New Arrivals</h2>
        
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        
        <div className="max-h-96 overflow-y-auto">
          {filteredProducts.map(product => (
            <div key={product._id} className="flex items-center p-3 border-b hover:bg-gray-50">
              <img
                src={product.images?.[0] || 'https://via.placeholder.com/50x50?text=No+Image'}
                alt={product.name}
                className="h-12 w-12 rounded object-cover mr-4"
              />
              <div className="flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.brand} - £{product.price}</p>
              </div>
              <button
                onClick={() => onAdd(product._id)}
                className="bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700"
              >
                Add
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

export default AdminNewArrivals;