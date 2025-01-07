import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Logjn/Login';
import Home from './Home/Home';
import PrivateRoute from './PrivateRoute';
import Cart from './Cart/Cart';
import UserProfile from './User/User';
import OrdersList from './orders/orders';
import History from './History/History';
import ProductList from './ProductList/ProductList';
import UsersOp from './UsersOP/UsersOp';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<PrivateRoute element={Home} />} />
      <Route path="/cart" element={<PrivateRoute element={Cart} />}/>
      <Route path="/account" element={<PrivateRoute element={UserProfile} />} />
      <Route path="/orders" element={<PrivateRoute element={OrdersList} />} />
      <Route path="/history" element={<PrivateRoute element={History} />} />
      <Route path="/products" element={<PrivateRoute element={ProductList} />} />
      <Route path="/users" element={<PrivateRoute element={UsersOp} />} />
    </Routes>
  );
};

export default AppRoutes;
