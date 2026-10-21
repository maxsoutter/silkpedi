import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import SoftFeetAfter50 from './pages/SoftFeetAfter50.tsx';
import SandalReadyFeet from './pages/SandalReadyFeet.tsx';
import ThankYou from './pages/ThankYou.tsx';
import SoftFeetGuide from './pages/SoftFeetGuide.tsx';
import Privacy from './pages/Privacy.tsx';
import DeliveryReturns from './pages/DeliveryReturns.tsx';
import ChristmasGifts from './pages/ChristmasGifts.tsx';
import PreOrder from './pages/PreOrder.tsx';
import ListiclePage from './pages/ListiclePage.tsx';
import {ROUGH_HEELS, AFTER_50} from './pages/listicles.ts';
import MemberPopup from './MemberPopup.tsx';
import {initPixel} from './analytics.ts';
import './index.css';

/**
 * Tiny path router. Netlify already rewrites every path to index.html
 * (see netlify.toml), so the page is just picked from the URL here.
 * Add a landing page by adding a line to this map.
 */
const ROUTES: Record<string, React.ComponentType> = {
  '/soft-feet-after-50': SoftFeetAfter50,
  '/sandal-ready-feet': SandalReadyFeet,
  '/thank-you': ThankYou,
  '/soft-feet-guide': SoftFeetGuide,
  '/privacy': Privacy,
  '/delivery-returns': DeliveryReturns,
  '/christmas-gifts': ChristmasGifts,
  '/pre-order': PreOrder,
  // Listicle pre-landers for cold ad traffic. Not in any menu.
  '/why-heels-stay-rough': () => <ListiclePage content={ROUGH_HEELS} />,
  '/feet-after-50': () => <ListiclePage content={AFTER_50} />,
};

// Pages where the discount pop-up would get in the way (already bought / already joined).
// /pre-order: its pre-sale price beats the pop-up's member price.
// Listicles: they warm people up and never show a price, so a discount pop-up would interrupt the read.
const NO_POPUP = new Set(['/thank-you', '/soft-feet-guide', '/privacy', '/delivery-returns', '/pre-order', '/why-heels-stay-rough', '/feet-after-50']);

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const Page = ROUTES[path] ?? App;

// No-op until a pixel ID is set in analytics.ts.
initPixel();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page />
    {!NO_POPUP.has(path) && <MemberPopup />}
  </StrictMode>,
);
