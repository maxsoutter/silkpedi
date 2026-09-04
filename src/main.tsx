import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import SoftFeetAfter50 from './pages/SoftFeetAfter50.tsx';
import './index.css';

/**
 * Tiny path router. Netlify already rewrites every path to index.html
 * (see netlify.toml), so the page is just picked from the URL here.
 * Add a landing page by adding a line to this map.
 */
const ROUTES: Record<string, React.ComponentType> = {
  '/soft-feet-after-50': SoftFeetAfter50,
};

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const Page = ROUTES[path] ?? App;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
