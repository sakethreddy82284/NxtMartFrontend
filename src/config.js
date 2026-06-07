// Centralized API configuration
const isProduction = window.location.hostname !== 'localhost';

export const BASE_URL = isProduction 
  ? 'https://nxt-mart-backend.vercel.app' // Replace with your actual Vercel backend URL
  : 'http://localhost:2000';
