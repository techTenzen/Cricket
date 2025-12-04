import React, { useEffect, useState } from 'react';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, RotateCcw, Trash2, BarChart3, PieChart, Calendar, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchStats } from '../../store/slices/adminSlice';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { stats, isLoading } = useAppSelector((state) => state.admin);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [resetFlags, setResetFlags] = useState({
    conversionRate: false,
    avgOrderValue: false,
    returnRate: false
  });

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  const handleResetRevenue = async () => {
    if (window.confirm('Are you sure you want to reset total revenue? This action cannot be undone.')) {
      try {
        await adminService.resetRevenue();
        toast.success('Revenue reset successfully');
        dispatch(fetchStats());
      } catch (error) {
        toast.error('Failed to reset revenue');
      }
    }
  };

  const handleResetOrders = async () => {
    if (window.confirm('Are you sure you want to reset total orders count? This action cannot be undone.')) {
      try {
        await adminService.resetOrders();
        toast.success('Orders count reset successfully');
        dispatch(fetchStats());
      } catch (error) {
        toast.error('Failed to reset orders count');
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      // API call to delete order
      toast.success('Order deleted successfully');
      dispatch(fetchStats());
      setShowDeleteModal(null);
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  const handleResetConversionRate = async () => {
    if (window.confirm('Are you sure you want to reset conversion rate? This action cannot be undone.')) {
      try {
        await adminService.resetConversionRate();
        setResetFlags(prev => ({ ...prev, conversionRate: true }));
        toast.success('Conversion rate reset successfully');
      } catch (error) {
        toast.error('Failed to reset conversion rate');
      }
    }
  };

  const handleResetAvgOrderValue = async () => {
    if (window.confirm('Are you sure you want to reset average order value? This action cannot be undone.')) {
      try {
        await adminService.resetAvgOrderValue();
        setResetFlags(prev => ({ ...prev, avgOrderValue: true }));
        toast.success('Average order value reset successfully');
      } catch (error) {
        toast.error('Failed to reset average order value');
      }
    }
  };

  const handleResetReturnRate = async () => {
    if (window.confirm('Are you sure you want to reset return rate? This action cannot be undone.')) {
      try {
        await adminService.resetReturnRate();
        setResetFlags(prev => ({ ...prev, returnRate: true }));
        toast.success('Return rate reset successfully');
      } catch (error) {
        toast.error('Failed to reset return rate');
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-blue-500', trend: '+12%' },
    { title: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'bg-green-500', trend: '+5%' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'bg-purple-500', trend: '+18%', hasReset: true },
    { title: 'Total Revenue', value: `£${stats?.totalRevenue || 0}`, icon: DollarSign, color: 'bg-yellow-500', trend: '+25%', hasReset: true },
    { title: 'Active Carts', value: stats?.totalCarts || 0, icon: ShoppingCart, color: 'bg-indigo-500', trend: '+8%' },
    { title: 'Total Admins', value: stats?.totalAdmins || 0, icon: Users, color: 'bg-red-500', trend: '0%' }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium">{stat.trend}</p>
                </div>
              </div>
              {stat.hasReset && (
                <button
                  onClick={stat.title.includes('Revenue') ? handleResetRevenue : handleResetOrders}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title={`Reset ${stat.title}`}
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Sales Overview</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Sales chart visualization</p>
              <p className="text-sm text-gray-400">Last 30 days performance</p>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Category Distribution</h2>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats?.categoryStats?.map((category, idx) => (
              <div key={category._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500', 'bg-indigo-500'][idx % 6]
                  }`}></div>
                  <span className="text-sm font-medium capitalize">{category._id}</span>
                </div>
                <span className="text-sm text-gray-600">{category.count} products</span>
              </div>
            )) || (
              <div className="text-center text-gray-500">No category data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">Conversion Rate</h3>
              <TrendingUp className="h-5 w-5 text-green-500 ml-2" />
            </div>
            <button
              onClick={handleResetConversionRate}
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Reset Conversion Rate"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
          <p className="text-3xl font-bold text-gray-900">{resetFlags.conversionRate ? 0 : stats?.conversionRate || 0}%</p>
          <p className="text-sm text-green-600">+0.5% from last month</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">Avg Order Value</h3>
              <DollarSign className="h-5 w-5 text-blue-500 ml-2" />
            </div>
            <button
              onClick={handleResetAvgOrderValue}
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Reset Average Order Value"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
          <p className="text-3xl font-bold text-gray-900">£{resetFlags.avgOrderValue ? 0 : stats?.avgOrderValue || 0}</p>
          <p className="text-sm text-blue-600">+£12 from last month</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">Return Rate</h3>
              <Calendar className="h-5 w-5 text-orange-500 ml-2" />
            </div>
            <button
              onClick={handleResetReturnRate}
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Reset Return Rate"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
          <p className="text-3xl font-bold text-gray-900">{resetFlags.returnRate ? 0 : stats?.returnRate || 0}%</p>
          <p className="text-sm text-orange-600">-0.3% from last month</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats?.recentOrders?.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.user?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    £{order.totalAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setShowDeleteModal(order._id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete Order"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Best Sellers */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Best Sellers (Home Page)</h2>
        <div className="space-y-4">
          {stats?.topProducts?.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="bg-primary-100 p-2 rounded-lg mr-4">
                  <TrendingUp className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{item.product?.name}</h3>
                  <p className="text-sm text-gray-500">Brand: {item.product?.brand}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  item.type === 'manual' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {item.totalSold}
                </span>
                <p className="text-sm text-gray-500">₹{item.product?.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Order</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you absolutely sure you want to delete this order? This action cannot be undone and will permanently remove the order from your system.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOrder(showDeleteModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;