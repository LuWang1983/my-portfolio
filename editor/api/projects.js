const router = require('express').Router();
const db = require('../db')
const {
  buildProjectValidationErrors,
  buildSiteValidationErrors,
} = require('../model.js');

// Express doesn't have build in async-error handling, so this utility wraps all async http endpoind functions.
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
router.get(
  '/projects',
  trapAsyncErrors(async (req, res, next) => {
    res.json(await db.collection('projects').get());
  })
);

/**
 * PUTS a single project onto disk. Emits 422 with errors if data is not valid.
 * This will replace the porject entirely, not merge.
 */
router.put(
  '/projects/:id',
  trapAsyncErrors(async (req, res, next) => {
    const { title, description } = req.body;
    const { id } = req.params
    const project = { title, description, id };
    const validationErrors = buildProjectValidationErrors(project);
    if (validationErrors.valid === false) {
      res.status(422).send(validationErrors.errors);
    } else {
      await db.collection('projects').doc(id).update(project)
      res.sendStatus(200);
    }
  })
);

/**
 * Loads and sends a single project object, or 404 if no object is on disk.
 */
router.get(
  '/projects/:id',
  trapAsyncErrors(async (req, res, next) => {
    const projectRef = await db.collection('projects').doc(req.params.id);
    const project = await projectRef.get()
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
router.delete(
  '/projects/:id',
  trapAsyncErrors(async (req, res, next) => {
    await db.collection('projects').doc(req.params.id).delete();
    res.sendStatus(204);
  })
);

/**
 * Load site data from disk.
 */
router.get(
  '/site',
  trapAsyncErrors(async (req, res, next) => {
    const site = await readSite();
    res.json(site);
  })
);

/**
 * Update site data (this will completely overwrite data, not merge).
 */
router.put(
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

module.exports = router;
