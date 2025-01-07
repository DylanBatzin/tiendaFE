import React from 'react';
import  {jwtDecode}  from 'jwt-decode';
import Products from '../Products/Products';
import Header from '../Header/Header';
import OrdersList from '../orders/orders';
const Home = () => {
  
      const token = localStorage.getItem('jwt');
      let role = null;
      if (token) {
          const decoded = jwtDecode(token);
          role = decoded.role;
      }

    const renderHome = () => {
    if (role === '58D4CF0B-89BE-4630-A34A-6144C9E086FE'){
      return (
        <div>
          <Header />
          <Products />
        </div>
      );
    } else if (role === 'D75D5E20-A13A-45CC-81C1-64A46C0B482A') { 
      return (
        <div>
          <Header />
          <OrdersList />
        </div>
      );
    } else if (role === 'D04011B0-6F35-4DD6-89E8-99DCEB1D1B3D') {
      return (
        <div>
          <Header />
          <h1>Bienvenido</h1>
        </div>
      );
    } else {
      return null; 
    }
  };

  return (
    <div>
      {renderHome()}
    </div>
  );
}
export default Home;
