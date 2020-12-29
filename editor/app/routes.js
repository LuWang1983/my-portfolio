import React from 'react';
import Home from './components/home';
import ApplicationError from './components/application-error';
import ListProjects from './components/projects/list';
import EditProject from './components/projects/edit';
import EditSite from './components/site/edit';

function trapAsyncErrors(routeFunction) {
  return async function (match) {
    try {
      return await routeFunction(match);
    } catch (error) {
      return <ApplicationError />;
    }
  };
}

export default {
  '/': () => <Home />,
  '/application-error': () => <ApplicationError />,
  '/site/edit': trapAsyncErrors(async () => {
    const site = await (await fetch('/api/site')).json();
    return <EditSite site={site} />;
  }),
  '/projects': trapAsyncErrors(async () => {
    const projects = await (await fetch('/api/projects')).json();
    return <ListProjects projects={projects} />;
  }),
  '/projects/:id/edit': trapAsyncErrors(async ({ id }) => {
    const project = await (await fetch(`/api/projects/${id}`)).json();
    return <EditProject project={project} />;
  }),
};
