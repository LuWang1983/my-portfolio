const pathToRegexp = require('path-to-regexp');

const stateChangeCallbacks = [];

export function onStateChange(callback) {
  stateChangeCallbacks.push(callback);
}

function invokeStateChangeCallbacks() {
  stateChangeCallbacks.forEach((callback) => callback());
}

window.addEventListener('popstate', invokeStateChangeCallbacks);

export function navigateTo(path) {
  window.history.pushState({}, null, path);
  queueMicrotask(invokeStateChangeCallbacks);
}

export async function executeRouter(currentPath, routes) {
  for (const [path, handler] of Object.entries(routes)) {
    const matcher = pathToRegexp.match(path);
    const matched = matcher(currentPath);
    if (matched) {
      const routedItem = await handler(matched.params);
      console.info(
        `Transitioning route. path: ${currentPath} rendering: `,
        routedItem
      );
      return routedItem;
    }
  }
}
