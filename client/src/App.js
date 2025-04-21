import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import SearchPage from './components/SearchPage';

const App = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path='/home' element={isLoggedIn ? <Home /> : <Navigate to='/login' />} />
        <Route path='/add' element={isLoggedIn ? <AddProduct /> : <Navigate to='/login' />} />
        <Route path='/edit/:id' element={isLoggedIn ? <EditProduct /> : <Navigate to='/login' />} />
      </Routes>
    </Router>
  );
};

export default App;