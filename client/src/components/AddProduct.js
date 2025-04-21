import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function AddProduct({ onClose }) {
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
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

  const fetchMaxId = async (categoryCode) => {
    try {
      const res = await axios.get(`
        http://localhost:5000/api/max-id/${categoryCode}`, {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem('token')}`
        },
      });
      const next = res.data.lastNumber + 1;
      return `LAPTOP${categoryCode}
      ${String(next).padStart(4, '0')}`;
    } catch {
      return `LAPTOP${categoryCode}0001`;
    }
  };

  const handleCategoryChange = async (e) => {
    const categoryCode = e.target.value;
    const autoId = await fetchMaxId(categoryCode);

    // Tự động chọn hãng dựa trên phân loại
    let brand = '';
    switch (categoryCode) {
      case 'HP':
        brand = 'HP';
        break;
      case 'AS':
        brand = 'ASUS';
        break;
      case 'DE':
        brand = 'DELL';
        break;
      case 'LV':
        brand = 'LENOVO';
        break;
      case 'AC':
        brand = 'ACER';
        break;
      default:
        brand = '';
    }

    setForm({
      ...form,
      category: categoryCode,
      id: autoId,
      brand: brand
    });
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

  const handleNhuCauChange = (value) => {
    setForm({ ...form, nhu_cau: value });
  };

  const handleBrandChange = (value) => {
    setForm({ ...form, brand: value });
  };

  const handleSubmit = async () => {
    const { id, name, brand, price, image, description, nhu_cau, category } = form;

    if (!category || category === '') {
      alert('Vui lòng chọn phân loại cho sản phẩm.');
      return;
    }
    if (!id) {
      alert('Vui lòng nhập ID cho sản phẩm.');
      return;
    }
    if (!name) {
      alert('Vui lòng nhập tên sản phẩm.');
      return;
    }
    if (!brand) {
      alert('Vui lòng chọn hãng sản phẩm.');
      return;
    }
    if (!price) {
      alert('Vui lòng nhập giá sản phẩm.');
      return;
    }
    if (!image) {
      alert('Vui lòng chọn ảnh sản phẩm.');
      return;
    }
    if (!description) {
      alert('Vui lòng nhập mô tả sản phẩm.');
      return;
    }
    if (!nhu_cau) {
      alert('Vui lòng chọn nhu cầu sử dụng cho sản phẩm.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/products', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      alert('Sản phẩm đã được thêm thành công!');

      if (onClose) onClose();

    } catch (err) {
      alert('Thêm sản phẩm thất bại. Có thể ID đã tồn tại hoặc lỗi kết nối.');
    }
  };

  return (
    <div>
      <nav className="flex justify-between items-center p-4 shadow bg-white sticky top-0 z-10">
        <div className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate('/home')}>
          🛍️ MyShop
        </div>
        <div className="space-x-4">
          <button onClick={() => navigate('/home')} className="text-gray-700 hover:text-blue-500">Sản phẩm</button>
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
      <div className="p-4 max-w-lg mx-auto">

        <h2 className="text-center display-8 mb-4">Thêm sản phẩm</h2>



        {form.category && (
          <div className="mb-2">
            <label className="block">Hãng:</label>
            <button
              className={`btn ${form.category === 'HP' ? 'btn-success' : 'btn-light'} me-2`}
              onClick={() => handleBrandChange('HP')}
              disabled={form.category && form.category !== 'HP'}>HP
            </button>
            <button
              className={`btn ${form.category === 'AS' ? 'btn-success' : 'btn-light'} me-2`}
              onClick={() => handleBrandChange('AS')}
              disabled={form.category && form.category !== 'AS'}>ASUS
            </button>
            <button
              className={`btn ${form.category === 'DE' ? 'btn-success' : 'btn-light'} me-2`}
              onClick={() => handleBrandChange('DE')}
              disabled={form.category && form.category !== 'DE'}>DELL
            </button>
            <button
              className={`btn ${form.category === 'LV' ? 'btn-success' : 'btn-light'} me-2`}
              onClick={() => handleBrandChange('LV')}
              disabled={form.category && form.category !== 'LV'}>LENOVO
            </button>
            <button
              className={`btn ${form.category === 'AC' ? 'btn-success' : 'btn-light'}`}
              onClick={() => handleBrandChange('AC')}
              disabled={form.category && form.category !== 'AC'}>ACER
            </button>
          </div>
        )}

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

        <textarea className="form-control mb-2" placeholder="Mô tả" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input type="number" className="form-control mb-2" placeholder="Giá" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />

        <div className="mb-2">
          <label className="block">Chọn nhu cầu:</label>
          <button
            className={`btn ${form.nhu_cau === 'Văn Phòng' ? 'btn-primary' : 'btn-light'} me-2`}
            onClick={() => handleNhuCauChange('Văn Phòng')}> Văn Phòng
          </button>
          <button
            className={`btn ${form.nhu_cau === 'Gaming' ? 'btn-primary' : 'btn-light'} me-2`}
            onClick={() => handleNhuCauChange('Gaming')}> Gaming
          </button>
          <button
            className={`btn ${form.nhu_cau === 'Đa dụng' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => handleNhuCauChange('Đa dụng')} >Đa dụng </button></div>

        <input type="file" className="form-control mb-2" onChange={handleImage} />
        {preview && <img src={preview} alt="preview" className="w-full h-40 object-cover mb-2" />}
        <div className="d-flex justify-content-between mt-2">
          <button className="btn btn-success " onClick={handleSubmit}>Thêm</button></div>
      </div>
    </div>
  );
}
