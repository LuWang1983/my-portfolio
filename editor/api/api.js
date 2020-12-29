const express = require('express');
const {
  listProjects,
  readProject,
  writeProject,
  deleteProject,
  buildProjectValidationErrors,
  readSite,
  writeSite,
  buildSiteValidationErrors,
} = require('../model.js');

const api = new express.Router();

// Express doesn't have build in async-error handling, so this utility
// wraps all async http endpoind functions.
function trapAsyncErrors(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
/**
 * Loads and sends a list of all projects currently on disk.
 */
api.get(
  '/projects',
  trapAsyncErrors(async (req, res, next) => {
    res.json(await listProjects());
  })
);

/**
 * PUTS a single project onto disk. Emits 422 with errors if data is not valid.
 * This will replace the porject entirely, not merge.
 */
api.put(
  '/projects/:id',
  trapAsyncErrors(async (req, res, next) => {
    const { title, description } = req.body;
    const project = { title, description, id: req.params.id };
    const validationErrors = buildProjectValidationErrors(project);
    if (validationErrors.valid === false) {
      res.status(422).send(validationErrors.errors);
    } else {
      await writeProject(req.params.id, project);
      res.sendStatus(200);
    }
  })
);

/**
 * Loads and sends a single project object, or 404 if no object is on disk.
 */
api.get(
  '/projects/:id',
  trapAsyncErrors(async (req, res, next) => {
    const project = await readProject(req.params.id);
    if (project === null) {
      res.sendStatus(404);
    } else {
      res.json(project);
    }
  })
);

/**
 * Deletes a single project from disk.
 */
api.delete(
  '/projects/:id',
  trapAsyncErrors(async (req, res, next) => {
    await deleteProject(req.params.id);
    res.sendStatus(204);
  })
);

/**
 * Load site data from disk.
 */
api.get(
  '/site',
  trapAsyncErrors(async (req, res, next) => {
    const site = await readSite();
    res.json(site);
  })
);

/**
 * Update site data (this will completely overwrite data, not merge).
 */
api.put(
  '/site',
  trapAsyncErrors(async (req, res, next) => {
    const { headline, welcomeMessage } = req.body;
    const site = { headline, welcomeMessage };
    const validationErrors = buildSiteValidationErrors(site);
    if (validationErrors.valid === false) {
      res.status(422).send(validationErrors.errors);
    } else {
      await writeSite(site);
      res.sendStatus(200);
    }
  })
);

module.exports = api;
