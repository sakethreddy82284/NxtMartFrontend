import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, CreditCard, TrendingUp, 
  TrendingDown, Plus, ShieldCheck, 
  Gift, RefreshCw
} from 'lucide-react';
import Navbar from '../../../components/common/navbar/Navbar';
import './Wallet.css';

const Wallet = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(450); // Mock
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'credit', amount: 50, title: 'Cashback Received', date: '2 hours ago' },
    { id: 2, type: 'debit', amount: 120, title: 'Order #XT2910', date: 'Yesterday' },
    { id: 3, type: 'credit', amount: 500, title: 'Wallet Top-up', date: '3 days ago' },
  ]);

  return (
    <div className="wallet-root">
      <Navbar />
      
      <main className="wallet-container">
        <header className="wallet-header">
           <button className="back-btn" onClick={() => navigate(-1)}>
             <ArrowLeft size={20} />
           </button>
           <h1>NxtMart Wallet</h1>
        </header>


        <div className="balance-card">
          <div className="balance-bg-effect"></div>
          <div className="balance-info">
            <span className="balance-label">Total Balance</span>
            <div className="balance-amount">
              <span className="currency">₹</span>
              <h2>{balance.toLocaleString()}</h2>
            </div>
            <p className="balance-sub">Spend on your next order!</p>
          </div>
          <button className="add-money-btn">
             <Plus size={20} />
             <span>Top Up</span>
          </button>
        </div>


        <div className="wallet-stats">
          <div className="w-stat">
            <div className="ws-icon up"><TrendingUp size={18} /></div>
            <div>
              <span className="ws-lbl">Total Earned</span>
              <h4 className="ws-val">₹1,240</h4>
            </div>
          </div>
          <div className="w-stat">
            <div className="ws-icon down"><TrendingDown size={18} /></div>
            <div>
              <span className="ws-lbl">Total Spent</span>
              <h4 className="ws-val">₹790</h4>
            </div>
          </div>
        </div>


        <section className="wallet-offers">
           <div className="offer-banner">
             <Gift size={24} className="gift-icon" />
             <div className="offer-info">
               <h4>Refer & Earn ₹100</h4>
               <p>Invite friends to join NxtMart</p>
             </div>
             <ChevronRight size={18} />
           </div>
        </section>


        <section className="transaction-history">
          <div className="th-head">
            <h3>Recent Transactions</h3>
            <button className="refresh-btn"><RefreshCw size={14} /></button>
          </div>
          
          <div className="history-list">
            {transactions.map(t => (
              <div key={t.id} className="history-item">
                <div className={`hi-icon ${t.type}`}>
                  {t.type === 'credit' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                </div>
                <div className="hi-info">
                  <h4>{t.title}</h4>
                  <span>{t.date}</span>
                </div>
                <div className={`hi-amount ${t.type}`}>
                  {t.type === 'credit' ? '+' : '-'} ₹{t.amount}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="security-note">
          <ShieldCheck size={14} />
          <span>Secured by NxtMart Pay System</span>
        </div>
      </main>
    </div>
  );
};

const ChevronRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export default Wallet;
