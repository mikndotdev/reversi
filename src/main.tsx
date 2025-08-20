import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './index.css';
import { Toaster } from 'sonner';
import Create from '@/routes/create.tsx';
import Page from '@/routes/index';

import '@fontsource/inter';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster richColors />
      <Routes>
        <Route element={<Page />} path="/" />
        <Route element={<Create />} path="/create" />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
