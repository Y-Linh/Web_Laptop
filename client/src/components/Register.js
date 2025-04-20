import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/register', { username, password });
      alert('Đăng ký thành công');
      navigate('/');
    } catch (err) {
      alert('Tài khoản đã tồn tại hoặc lỗi server');
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl mb-4">Đăng ký</h2>
      <input className="form-control mb-2" placeholder="Tài khoản" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input className="form-control mb-2" type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input className="form-control mb-2" type="password" placeholder="Nhập lại mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      <button className="btn btn-success" onClick={handleRegister}>Đăng ký</button>
      <p className="text-center mt-4 text-sm text-gray-500">
          Đã có tài khoản? <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => navigate('/')}>Đăng nhập</span>
        </p>
    </div>
  );
}