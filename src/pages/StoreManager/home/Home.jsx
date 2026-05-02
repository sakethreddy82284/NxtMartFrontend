import React, { useState } from 'react'
import Navbar from "../../../components/common/navbar/Navbar";
import CategoriesPage from '../catagory/Category';
import ManagerOrders from '../orders/ManagerOrders';
import { LayoutGrid, ClipboardList } from 'lucide-react';
import './ManagerHome.css';

function ManagerHome() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="manager-root">
       <Navbar/>
       
       <div className="manager-tabs-bar">
          <button 
            className={`tab-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <LayoutGrid size={18} />
            <span>Categories</span>
          </button>
          <button 
            className={`tab-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ClipboardList size={18} />
            <span>Order Flow</span>
          </button>
       </div>

       <div className="manager-tab-content">
          {activeTab === 'categories' ? <CategoriesPage/> : <ManagerOrders/>}
       </div>
    </div>
  )
}

export default ManagerHome
