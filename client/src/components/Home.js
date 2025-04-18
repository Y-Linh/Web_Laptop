import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
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
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchProducts();
    } catch (error) {
      alert('Xóa thất bại');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Danh sách sản phẩm</h2>
      <button className="btn btn-success mb-3" onClick={() => navigate('/add')}>Thêm sản phẩm</button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((prod) => (
          <div key={prod._id} className="border p-3 rounded shadow">
            <img src={prod.image} alt={prod.name} className="w-full h-40 object-cover mb-2" />
            <h5 className="font-bold">{prod.name}</h5>
            <p>{prod.description}</p>
            <p><strong>Giá:</strong> {prod.price?.toLocaleString()} VND</p>
            <button className="btn btn-warning me-2" onClick={() => navigate(`/edit/${prod._id}`)}>Sửa</button>
            <button className="btn btn-danger" onClick={() => handleDelete(prod._id)}>Xóa</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
