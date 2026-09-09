import React from 'react';
import { AppProvider } from './context/AppContext';
import AppRoutes from './routes/AppRoutes';
import './styles.css';

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
