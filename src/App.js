import React from 'react';
import 'boxicons';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Components/routes';

function App() {
  return (
    
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
