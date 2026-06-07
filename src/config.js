// Centralized API configuration
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

export const BASE_URL = isProduction 
  ? 'https://nxtmartbackend-2-q25g.onrender.com' 
  : 'http://localhost:2000';
