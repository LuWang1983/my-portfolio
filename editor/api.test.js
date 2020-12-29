const path = require('path');
const { assert } = require('chai');
const request = require('supertest');
const tmp = require('tmp');
const app = require('./app');
const express = require('express');
const { mkdirSync } = require('fs');

describe('Server API', () => {
  describe('Read Data', () => {
    before(() => {
      process.env.DATA_PATH = path.resolve('editor', 'test-data');
    });
    after(() => {
      delete process.env.DATA_PATH;
    });

    describe('GET /api/site', () => {
      it('returns json data for the site info', async () => {
        const { body: site } = await request(app).get('/api/site').expect(200);

        assert.deepEqual(
          {
            headline: 'Site headline',
            welcomeMessage: 'Welcome!',
          },
          site
        );
      });
    });

    describe('GET /api/projects', () => {
      it('returns json data for json files in projects directory', async () => {
        const { body: projects } = await request(app)
          .get('/api/projects')
          .expect(200);

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

    describe('GET /api/projects/:id', () => {
      it('returns json for a project', async () => {
        const { body: project } = await request(app)
          .get('/api/projects/test-1')
          .expect(200);

        assert.deepEqual({ title: 'Test Project' }, project);
      });

      it('returns a 404 for projects that do not exist', async () => {
        await request(app).get('/api/projects/not-a-project').expect(404);
      });
    });
  });

  describe('Writing data', () => {
    let tmpDir;
    beforeEach(() => {
      tmpDir = tmp.dirSync();
      mkdirSync(path.join(tmpDir.name, 'projects'));
      process.env.DATA_PATH = tmpDir.name;
    });
    afterEach(() => {
      delete process.env.DATA_PATH;
    });

    describe('PUT /api/site', () => {
      it('writes data that can be read later', async () => {
        await request(app)
          .put('/api/site')
          .send({
            headline: 'New Headline',
            welcomeMessage: 'New Welcome',
          })
          .expect(200);
        const { body: site } = await request(app).get('/api/site').expect(200);
        assert.deepEqual(
          {
            headline: 'New Headline',
            welcomeMessage: 'New Welcome',
          },
          site
        );
      });

      it('responds with validation errors', async () => {
        const { body: errors } = await request(app)
          .put('/api/site')
          .send({})
          .expect(422);
        assert.deepEqual(
          {
            headline: ['A headline MUST be provided.'],
            welcomeMessage: ['A welcome message MUST be provided.'],
          },
          errors
        );
      });
    });

    describe('PUT /api/projects/:id', () => {
      it('writes data that can be read later', async () => {
        await request(app)
          .put('/api/projects/my-new-project')
          .send({
            title: 'My New Project',
            description: 'It is new and cool!',
          })
          .expect(200);
        const { body: project } = await request(app)
          .get('/api/projects/my-new-project')
          .expect(200);
        assert.deepEqual(
          {
            title: 'My New Project',
            description: 'It is new and cool!',
            id: 'my-new-project',
          },
          project
        );
        const { body: projects } = await request(app)
          .get('/api/projects')
          .expect(200);
        assert.deepEqual(
          [
            {
              title: 'My New Project',
              description: 'It is new and cool!',
              id: 'my-new-project',
            },
          ],
          projects
        );
      });

      it('responds with validation errors', async () => {
        const { body: errors } = await request(app)
          .put('/api/projects/my-new-project')
          .send({})
          .expect(422);
        assert.deepEqual(
          {
            description: ['A description MUST be provided.'],
            title: ['A title MUST be provided.'],
          },
          errors
        );
      });
    });
    describe('DELETE /api/projects/:id', () => {
      it('makes previously readable projects unreadable', async () => {
        await request(app)
          .put('/api/projects/my-new-project')
          .send({
            title: 'My New Project',
            description: 'It is new and cool!',
          })
          .expect(200);
        await request(app).get('/api/projects/my-new-project').expect(200);
        await request(app).delete('/api/projects/my-new-project').expect(204);
        await request(app).get('/api/projects/my-new-project').expect(404);
      });
    });
  });
});
