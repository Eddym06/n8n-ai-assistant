/**
 * 🚀 Entry Point for Premium Professional Popup
 * React 18 Rendering with Ultra-Modern Setup
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import PremiumPopup from './main-premium.jsx';

// Initialize React 18 with proper root mounting
const container = document.getElementById('root');
const root = createRoot(container);

// Render the premium popup
root.render(<PremiumPopup />);

// Hot reload support for development
if (module.hot) {
  module.hot.accept('./main-premium.jsx', () => {
    const UpdatedPopup = require('./main-premium.jsx').default;
    root.render(<UpdatedPopup />);
  });
}
