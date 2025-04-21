// src/components/Home.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProducts(res.data);
    } catch (error) {
      alert('Lỗi khi tải dữ liệu sản phẩm');
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchProducts();
    } catch (error) {
      alert('Xóa thất bại');
    }
  };

  // Phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);


  
  return (
    <div>
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 shadow bg-white sticky top-0 z-10">
        <div className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/home')}>
          🛍️ MyShop
        </div>
        <div className="space-x-4">
        <button className="text-gray-700 hover:text-blue-500" onClick={() => setShowModal(true)}>
        Thêm sản phẩm
      </button>

          <button onClick={() => navigate('/search')} className="text-gray-700 hover:text-blue-500">Tìm kiếm</button>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
            className="text-red-500 font-semibold"
          >
            Đăng xuất
          </button>
        </div>
      </nav>

      {/* Nội dung chính */}
      <div className="p-4">
        <h2 className="text-2xl mb-4">Danh sách sản phẩm</h2>

        {/* Danh sách sản phẩm */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentProducts.map((prod) => (
            <div key={prod._id} className="border p-3 rounded shadow">
              <img src={prod.image} alt={prod.name} className="w-full h-40 object-cover mb-2" />
              <h5 className="font-bold">{prod.name}</h5>
              <p>{prod.description}</p>
              <p><strong>Nhu cầu:</strong> {prod.nhu_cau}</p>
              <p><strong>Giá:</strong> {prod.price?.toLocaleString()} VND</p>
              <button
  className="btn btn-warning me-2"
  onClick={() => setEditId(prod._id)}
>
  Sửa
</button>

              <button className="btn btn-danger" onClick={() => handleDelete(prod._id)}>Xóa</button>
            </div>
          ))}
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {editId && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 relative">
          <button
            className="absolute top-2 right-2 text-red-500 font-bold text-xl"
            onClick={() => setEditId(null)}
          >
            &times;
          </button>
          <EditProduct
            id={editId}
            onClose={() => {
              setEditId(null);
              fetchProducts();
            }}
          />
        </div>
      </div>
    )}

        {/* Modal AddProduct */}
        {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 relative">
            <button className="absolute top-2 right-2 text-red-500 font-bold text-xl" onClick={() => setShowModal(false)}>
              &times;
            </button>
            <AddProduct
              onClose={() => {
                setShowModal(false);
                fetchProducts();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}