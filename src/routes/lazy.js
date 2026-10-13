/**
 * Adapts a default-exported page module to React Router's route `lazy` API,
 * so the page (and its heavy deps) load in a separate chunk on first visit.
 */
export const lazyPage = (importer) => () =>
  importer().then((module) => ({ Component: module.default }));
