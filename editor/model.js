const { readFile, writeFile, readdir, unlink } = require('fs').promises;
const path = require('path');

/**
 * Combines environment variable and "/projects" to get a directory of projects.
 */
const getProjectsDir = () => path.join(process.env.DATA_PATH, 'projects');

/**
 * Constructs a single project file path
 */
const buildProjectPath = (key) => path.resolve(getProjectsDir(), `${key}.json`);

/**
 * Constructs a path to the general site data file.
 */
const getSitePath = () => path.join(process.env.DATA_PATH, 'site.json');

/**
 * Constructs a validation object for a project object.
 * Return object will have:
 * {
 *  valid: Boolean,
 *  errors: {
 *    title?: string[],
 *    description?: string[],
 *    id?: string[]
 *  }
 */
exports.buildProjectValidationErrors = function buildProjectValidationErrors(
  data
) {
  const errors = { valid: true, errors: {} };
  if (!data.title) {
    errors.valid = false;
    errors.errors.title = ['A title MUST be provided.'];
  }
  if (!data.description) {
    errors.valid = false;
    errors.errors.description = ['A description MUST be provided.'];
  }
  if (!data.id) {
    errors.valid = false;
    errors.errors.id = ['An id MUST be provided.'];
  }
  if (data.id && !data.id.match(/^[a-z\-]+$/)) {
    errors.valid = false;
    errors.errors.id = [
      'The id MUST contain only lower-case letters and dashes.',
    ];
  }
  return errors;
};

/**
 * Constructs a validation object for a site object.
 * Return object will have:
 * {
 *  valid: Boolean,
 *  errors: {
 *    headline?: string[],
 *    welcomeMessage?: string[],
 *  }
 */
exports.buildSiteValidationErrors = function buildSiteValidationErrors(data) {
  const errors = { valid: true, errors: {} };
  if (!data.headline) {
    errors.valid = false;
    errors.errors.headline = ['A headline MUST be provided.'];
  }
  if (!data.welcomeMessage) {
    errors.valid = false;
    errors.errors.welcomeMessage = ['A welcome message MUST be provided.'];
  }
  return errors;
};

/**
 * Reads file names for projects in a directory and loads their json data.
 */
exports.listProjects = async function listProjects() {
  const files = await readdir(getProjectsDir());
  const projectFiles = files.filter((path) => path.match(/\.json$/));
  const projectReaders = projectFiles.map(async (pathName) => {
    const projectFilePath = path.join(getProjectsDir(), pathName);
    const projectRaw = await readFile(projectFilePath, 'utf-8');
    return JSON.parse(projectRaw);
  });
  return Promise.all(projectReaders);
};

/**
 * Reads a single json object from disk.
 */
exports.readProject = async function readProject(key) {
  const projectFilePath = buildProjectPath(key);
  try {
    const projectRaw = await readFile(projectFilePath, 'utf-8');
    return JSON.parse(projectRaw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
};

/**
 * Write a single project object to disk.
 */
exports.writeProject = function writeProject(key, data) {
  const projectPath = buildProjectPath(key);
  return writeFile(projectPath, JSON.stringify(data));
};

/**
 * Delete a single project object from disk.
 */
exports.deleteProject = function deleteProject(key) {
  const projectPath = buildProjectPath(key);
  return unlink(projectPath);
};

/**
 * Read site data from disk.
 */
exports.readSite = async function readSite() {
  const sitePath = getSitePath();
  const rawSite = await readFile(sitePath, 'utf-8');
  return JSON.parse(rawSite);
};

/**
 * Write site data to disk.
 */
exports.writeSite = function writeSite(data) {
  const sitePath = getSitePath();
  return writeFile(sitePath, JSON.stringify(data));
};
