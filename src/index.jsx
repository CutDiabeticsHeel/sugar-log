import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './error-boundary.jsx';
import { store } from "./store/store";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from 'virtual:pwa-register';
import { syncOutbox } from './offline/api.js';

registerSW({ immediate: true });

window.deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredInstallPrompt = e;
  window.dispatchEvent(new Event('pwa-install-available'));
});
window.addEventListener('online', syncOutbox);
syncOutbox();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <ErrorBoundary>
                    <App />
                </ErrorBoundary>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);