import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get
        (`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: 
            `Bearer ${localStorage.getItem('token')}` }
        });
        setForm(res.data);
        setPreview(res.data.image);
      } catch {
        alert('Không thể tải thông tin sản phẩm');
        navigate('/home');
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
      setPreview(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) return alert('Vui lòng điền đủ thông tin bắt buộc');
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate('/home');
    } catch {
      alert('Lỗi khi lưu sản phẩm');
    }
  };

  if (!form) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-center display-8 mb-4">Sửa sản phẩm</h2>
      <input className="form-control mb-2" placeholder="ID" value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} disabled />
      <input className="form-control mb-2" placeholder="Tên sản phẩm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input className="form-control mb-2" placeholder="Hãng" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
      <input type="number" className="form-control mb-2" placeholder="Giá" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
      <textarea className="form-control mb-2" placeholder="Mô tả" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <input className="form-control mb-2" placeholder="Nhu cầu" value={form.nhu_cau} onChange={e => setForm({ ...form, nhu_cau: e.target.value })} />
      <input type="file" className="form-control mb-2" onChange={handleImage} />
      {preview && <img src={preview} alt="preview" className="w-full h-40 object-cover mb-2" />}
      <button className="btn btn-primary" onClick={handleSubmit}>Lưu thay đổi</button>
    </div>
  );
}