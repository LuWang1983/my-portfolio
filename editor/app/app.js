import React from 'react';
import ReactDOM from 'react-dom';
import { executeRouter, onStateChange } from './util/routing';
import NotFound from './components/not-found';
import routes from './routes';

async function renderApp() {
  const currentPath = window.location.pathname;
  const componentForRoute = await executeRouter(currentPath, routes);
  ReactDOM.render(
    componentForRoute || <NotFound />,
    document.querySelector('#root')
  );
}

onStateChange(renderApp);
renderApp();
