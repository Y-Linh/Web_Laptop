import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [form, setForm] = useState({
    id: '',
    name: '',
    brand: '',
    price: '',
    image: '',
    description: '',
    nhu_cau: '',
    category: ''
  });
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const fetchMaxId = async (categoryCode) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/max-id/${categoryCode}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const next = res.data.lastNumber + 1;
      return `LAPTOP${categoryCode}${String(next).padStart(4, '0')}`;
    } catch {
      return `LAPTOP${categoryCode}0001`;
    }
  };

  const handleCategoryChange = async (e) => {
    const categoryCode = e.target.value;
    const autoId = await fetchMaxId(categoryCode);
    setForm({ ...form, category: categoryCode, id: autoId });
  };

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
    const { id, name, brand, price, image, description, nhu_cau, category } = form;
    if (!category || category === '') {
      alert('Vui lòng chọn phân loại cho sản phẩm.');
      return;
    }
    if (!id || !name || !brand || !price || !image || !description || !nhu_cau) {
      alert('Vui lòng điền đầy đủ tất cả các thông tin.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/products', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate('/home');
    } catch (err) {
      alert('Thêm sản phẩm thất bại. Có thể ID đã tồn tại hoặc lỗi kết nối.');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl mb-4">Thêm sản phẩm</h2>
      <select className="form-control mb-2" onChange={handleCategoryChange} value={form.category}>
        <option value="">Chọn phân loại</option>
        <option value="HP">HP</option>
        <option value="AS">ASUS</option>
        <option value="DE">DELL</option>
        <option value="LV">LENOVO</option>
        <option value="AC">ACER</option>
      </select>
      <input className="form-control mb-2" placeholder="ID tự động" value={form.id} disabled />
      <input className="form-control mb-2" placeholder="Tên sản phẩm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input className="form-control mb-2" placeholder="Hãng" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
      <input type="number" className="form-control mb-2" placeholder="Giá" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
      <textarea className="form-control mb-2" placeholder="Mô tả" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <input className="form-control mb-2" placeholder="Nhu cầu" value={form.nhu_cau} onChange={e => setForm({ ...form, nhu_cau: e.target.value })} />
      <input type="file" className="form-control mb-2" onChange={handleImage} />
      {preview && <img src={preview} alt="preview" className="w-full h-40 object-cover mb-2" />}
      <button className="btn btn-success" onClick={handleSubmit}>Thêm</button>
    </div>
  );
};

export default AddProduct;
