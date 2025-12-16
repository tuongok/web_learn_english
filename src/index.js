import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 1. Import Redux Provider
import { Provider } from 'react-redux';
import { store } from './redux/store';

// 2. Import BrowserRouter (QUAN TRỌNG: Thêm dòng này)
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Thứ tự bọc chuẩn: Provider (Redux) -> BrowserRouter (Router) -> App
  <Provider store={store}>
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </Provider>
);

reportWebVitals();