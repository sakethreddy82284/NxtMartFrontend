import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SavorAuth from "./pages/auth/auth"
import Product from './pages/StoreManager/product/Product'
import CustomerPrduct from './pages/Customer/products/products'
import ManagerHome from './pages/StoreManager/home/Home'
import CustomerHome from './pages/Customer/home/CustomerHome'

import ProtectedRoute from './components/middlewares/ProtectedRoute/ProtectedRoute'

import Onboarding from './pages/Customer/onboarding/Onboarding'
import Categories from './pages/Customer/categories/categories'
import Cart from './pages/Customer/cart/Cart'
import OrderSuccess from './pages/Customer/cart/OrderSuccess'
import Profile from './pages/Customer/profile/Profile'
import OrderTracking from './pages/Customer/profile/OrderTracking'
import Wallet from './pages/Customer/profile/Wallet'

// NEW DASHBOARDS
import AdminHome from './pages/Admin/home/AdminHome'
import DeliveryHome from './pages/Delivery/home/DeliveryHome'
import DeliveryProfile from './pages/Delivery/profile/DeliveryProfile'
import ManagerProfile from './pages/StoreManager/profile/ManagerProfile'
import RoleRedirect from './pages/auth/RoleRedirect'
import SingleProduct from './pages/Customer/products/SingleProduct'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleRedirect />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/auth" element={<SavorAuth />} />

        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminHome />
            </ProtectedRoute>
          }
        />

        {/* --- MANAGER ROUTES --- */}
        <Route path="/manager" element={<Navigate to="/manager/home" replace />} />
        <Route path="/manager/home" element={
            <ProtectedRoute allowedRoles={["manager", "admin"]}>
              <ManagerHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/products"
          element={
            <ProtectedRoute allowedRoles={["manager", "admin"]}>
              <Product />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/profile"
          element={
            <ProtectedRoute allowedRoles={["manager", "admin"]}>
              <ManagerProfile />
            </ProtectedRoute>
          }
        />

        {/* --- DELIVERY ROUTES --- */}
        <Route path="/delivery" element={
            <ProtectedRoute allowedRoles={["delivery"]}>
              <DeliveryHome />
            </ProtectedRoute>
          }
        />

        <Route path="/delivery/profile" element={
            <ProtectedRoute allowedRoles={["delivery"]}>
              <DeliveryProfile />
            </ProtectedRoute>
          }
        />

        {/* --- CUSTOMER ROUTES --- */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Categories />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/products/:category" 
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerPrduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/product/:id" 
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <SingleProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart" 
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-success" 
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders" 
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Profile initialTab="orders" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile" 
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/track/:id" 
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <OrderTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet" 
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Wallet />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}


export default App