const path = require('path');
const {
  listProjects,
  readProject,
  writeProject,
  deleteProject,
  buildProjectValidationErrors,
  readSite,
  writeSite,
  buildSiteValidationErrors,
} = require('./model');
const { assert } = require('chai');
const tmp = require('tmp');
const { mkdirSync } = require('fs');

describe('Site', () => {
  describe('validating data', () => {
    it('requires a headline', () => {
      const errors = buildSiteValidationErrors({});
      assert.isFalse(errors.valid);
      assert.deepEqual(
        ['A headline MUST be provided.'],
        errors.errors.headline
      );
    });

    it('requires a welcome message', () => {
      const errors = buildSiteValidationErrors({});
      assert.isFalse(errors.valid);
      assert.deepEqual(
        ['A welcome message MUST be provided.'],
        errors.errors.welcomeMessage
      );
    });

    it('accepts valid data', () => {
      const errors = buildSiteValidationErrors({
        headline: 'Check out my site',
        welcomeMessage: 'Glad to have you here',
      });
      assert.isTrue(errors.valid);
    });
  });

  describe('Reading data', () => {
    before(() => {
      process.env.DATA_PATH = path.resolve('editor', 'test-data');
    });
    after(() => {
      delete process.env.DATA_PATH;
    });

    describe('readSite', () => {
      it('returns json data for the site', async () => {
        const siteData = await readSite();
        assert.deepEqual(
          {
            headline: 'Site headline',
            welcomeMessage: 'Welcome!',
          },
          siteData
        );
      });
    });
  });
});

describe('Projects', () => {
  describe('validating data', () => {
    it('requires a title', () => {
      const errors = buildProjectValidationErrors({});
      assert.isFalse(errors.valid);
      assert.deepEqual(['A title MUST be provided.'], errors.errors.title);
    });

    it('requires an id', () => {
      const errors = buildProjectValidationErrors({});
      assert.isFalse(errors.valid);
      assert.deepEqual(['An id MUST be provided.'], errors.errors.id);
    });

    it('requires ids match format', () => {
      const errors = buildProjectValidationErrors({
        id: 'invalid identifier?',
      });
      assert.isFalse(errors.valid);
      assert.deepEqual(
        ['The id MUST contain only lower-case letters and dashes.'],
        errors.errors.id
      );
    });

    it('requires a description', () => {
      const errors = buildProjectValidationErrors({});
      assert.isFalse(errors.valid);
      assert.deepEqual(
        ['A description MUST be provided.'],
        errors.errors.description
      );
    });

    it('accepts valid data', () => {
      const errors = buildProjectValidationErrors({
        title: 'Super Cool Project',
        id: 'super-cool',
        description: 'It is indeed as cool as it sounds.',
      });
      assert.deepEqual({ valid: true, errors: {} }, errors);
    });
  });
  describe('writing data', () => {
    let tmpDir;
    beforeEach(() => {
      tmpDir = tmp.dirSync();
      mkdirSync(path.join(tmpDir.name, 'projects'));
      process.env.DATA_PATH = tmpDir.name;
    });
    afterEach(() => {
      delete process.env.DATA_PATH;
    });
    describe('writeProject', () => {
      it('writes data that can be read later', async () => {
        await writeProject('created-project', { title: 'Created Project' });
        const laterRead = await readProject('created-project');
        assert.deepEqual({ title: 'Created Project' }, laterRead);
      });

      it('writes data that can be listed later', async () => {
        await writeProject('created-project', { title: 'Created Project' });
        const laterRead = await listProjects();
        assert.deepEqual([{ title: 'Created Project' }], laterRead);
      });
    });
    describe('deleteProjects', () => {
      it('makes previously readable projects unreadable', async () => {
        await writeProject('created-project', { title: 'Created Project' });
        const laterRead = await readProject('created-project');
        assert.deepEqual({ title: 'Created Project' }, laterRead);
        await deleteProject('created-project');
        const readAfterDelete = await readProject('created-project');
        assert.isNull(readAfterDelete);
      });
    });
  });

  describe('reading data', () => {
    before(() => {
      process.env.DATA_PATH = path.resolve('editor', 'test-data');
    });
    after(() => {
      delete process.env.DATA_PATH;
    });
    describe('listProjects', () => {
      it('returns json data for json files in the projects directory', async () => {
        const projects = await listProjects();
        assert.deepEqual(
          [
            {
              title: 'Test Project',
            },
            {
              title: 'Test 2',
            },
          ],
          projects
        );
      });
    });

    describe('readProject', () => {
      it('returns json data for specific project files by project key', async () => {
        const project = await readProject('test-1');
        assert.deepEqual({ title: 'Test Project' }, project);
      });

      it('returns null if no project matching key exists', async () => {
        const project = await readProject('not-a-project');
        assert.isNull(project);
      });
    });
  });
});
