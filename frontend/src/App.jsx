import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import ScrollToTop from './components/common/ScrollToTop';
import ToastContainer from './components/common/ToastContainer';
import DemoRoleSwitcher from './components/common/DemoRoleSwitcher';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
      <ToastContainer />
      <DemoRoleSwitcher />
    </BrowserRouter>
  );
}
