import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddProduct from './AddProduct'; // Import AddProduct như component

export default function Home() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProducts(res.data);
    } catch (error) {
      alert('Lỗi khi tải dữ liệu sản phẩm');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      await axios.delete(`
        http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: 
          `Bearer ${localStorage.getItem('token')}` },
      });
      fetchProducts();
    } catch (error) {
      alert('Xóa thất bại');
    }
  };

  return (
    <div className="p-4 relative">
      <h2 className="text-2xl mb-4">Danh sách sản phẩm</h2>
      <button className="btn btn-success mb-3" onClick={() => setShowModal(true)}>
        Thêm sản phẩm
      </button>

    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((prod) => (
          <div key={prod._id} className="border p-3 rounded shadow">
            <img src={prod.image} alt={prod.name} className="w-full h-40 object-cover mb-2" />
            <h5 className="font-bold">{prod.name}</h5>
            <p>{prod.description}</p>
            <p><strong>Nhu cầu:</strong> {prod.nhu_cau}</p>
            <p><strong>Giá:</strong> {prod.price?.toLocaleString()} VND</p>
            <button className="btn btn-warning me-2" onClick={() => navigate(`/edit/${prod._id}`)}>Sửa</button>
            <button className="btn btn-danger" onClick={() => handleDelete(prod._id)}>Xóa</button>
          </div>
        ))}
      </div>

     
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
