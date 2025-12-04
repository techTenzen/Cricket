import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, RefreshCw } from 'lucide-react';
import { bestSellerService } from '../../services/bestSellerService';
import { productService } from '../../services/productService';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminBestSellers = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bestSellersRes, productsRes] = await Promise.all([
        bestSellerService.getAdminBestSellers(),
        productService.getProducts()
      ]);
      setBestSellers(bestSellersRes.data);
      setProducts(productsRes.data.products);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBestSeller = async () => {
    if (!selectedProduct) return;
    try {
      await bestSellerService.addBestSeller(selectedProduct);
      setShowAddModal(false);
      setSelectedProduct('');
      fetchData();
    } catch (error) {
      console.error('Failed to add best seller:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this best seller?')) return;
    try {
      await bestSellerService.deleteBestSeller(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete best seller:', error);
    }
  };

  const handleSyncAuto = async () => {
    try {
      await bestSellerService.syncAutoBestSellers();
      fetchData();
    } catch (error) {
      console.error('Failed to sync auto best sellers:', error);
    }
  };

  const handleReorder = async (id, newOrder) => {
    try {
      await bestSellerService.updateOrder(id, newOrder);
      fetchData();
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  const manualBestSellers = bestSellers.filter(bs => bs.type === 'manual');
  const autoBestSellers = bestSellers.filter(bs => bs.type === 'auto');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Best Sellers Management</h1>
        <div className="flex gap-2">
          <button
            onClick={handleSyncAuto}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Sync Auto
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Manual
          </button>
        </div>
      </div>

      {/* Manual Best Sellers */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Manual Best Sellers</h2>
        <div className="space-y-2">
          {manualBestSellers.map((item, index) => (
            <div key={item._id} className="flex items-center gap-4 p-4 border rounded-lg">
              <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
              <img
                src={item.product?.images?.[0] || 'https://via.placeholder.com/60x60'}
                alt={item.product?.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.product?.name}</h3>
                <p className="text-sm text-gray-500">₹{item.product?.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={item.order}
                  onChange={(e) => handleReorder(item._id, parseInt(e.target.value))}
                  className="w-16 px-2 py-1 border rounded text-center"
                  min="0"
                />
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auto Best Sellers */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Auto Best Sellers (Top Selling)</h2>
        <div className="space-y-2">
          {autoBestSellers.map((item, index) => (
            <div key={item._id} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
              <span className="text-sm text-gray-500">#{index + 1}</span>
              <img
                src={item.product?.images?.[0] || 'https://via.placeholder.com/60x60'}
                alt={item.product?.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.product?.name}</h3>
                <p className="text-sm text-gray-500">₹{item.product?.price}</p>
              </div>
              <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">Auto</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Manual Best Seller</h3>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4"
            >
              <option value="">Select a product</option>
              {products.map(product => (
                <option key={product._id} value={product._id}>
                  {product.name} - ₹{product.price}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleAddBestSeller}
                disabled={!selectedProduct}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBestSellers;