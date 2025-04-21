// src/components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow bg-white sticky top-0 z-10">
      <div className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/home')}>
        🛍️ MyShop
      </div>
      <div className="space-x-4">
        <button onClick={() => navigate('/add')} className="text-gray-700 hover:text-blue-500">Thêm sản phẩm</button>
        <button onClick={() => navigate('/search')} className="text-gray-700 hover:text-blue-500">Tìm kiếm</button>
        <button
          onClick={handleLogout} 
          className="text-red-500 font-semibold"
        >
          Đăng xuất
        </button>
      </div>
    </nav>
  );
}
