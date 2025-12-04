import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, Users, Package, ShoppingCart, Home, Star, Sparkles } from 'lucide-react';

const AdminLayout = () => {
  const navItems = [
    { path: '/admin', icon: BarChart3, label: 'Dashboard', exact: true },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/bestsellers', icon: Star, label: 'Best Sellers' },
    { path: '/admin/new-arrivals', icon: Sparkles, label: 'New Arrivals' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="mt-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors ${
                    isActive ? 'bg-primary-100 text-primary-600 border-r-2 border-primary-600' : ''
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/"
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors mt-4 border-t"
            >
              <Home className="h-5 w-5 mr-3" />
              Back to Store
            </NavLink>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;