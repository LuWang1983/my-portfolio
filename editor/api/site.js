const router = require('express').Router();
const db = require('../db')
const {
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
 * Load site data from disk.
 */
router.get(
  '/',
  trapAsyncErrors(async (req, res, next) => {
    const site = await db.collection('site').get()
    res.json(site);
  })
);

/**
 * Update site data (this will completely overwrite data, not merge).
 */
router.put(
  '/',
  trapAsyncErrors(async (req, res, next) => {
    const { headline, welcomeMessage } = req.body;
    const site = { headline, welcomeMessage };
    const validationErrors = buildSiteValidationErrors(site);
    if (validationErrors.valid === false) {
      res.status(422).send(validationErrors.errors);
    } else {
      await db.collection('site').doc(id).update(project)
      res.sendStatus(200);
    }
  })
);

module.exports = router;
