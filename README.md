## Here are the instructions for this programming assessment task.
## https://share.nuclino.com/p/Support-Engineer-Code-Review-Update-copy-S1FOpodKcvP6BNpGrKamKh

# My Simple Portfolio

(work in progress)

This directory contains the beginnings of a little CMS for my portfolio site.

My content lives in `data/`.

`data/site.json` has general site information.

`data/projects/*.json` has one file for each of my portfolio projects.

## Installing

I've only tested this out with node version 12.

```bash
npm install
```

## Developer Scripts:

### `npm test`

This will run backend data read/write and http api tests. The tests themselves live
alongside implementation files as `*.test.js`.

### `npm run serve`

Serves the `public/` directory. Eventually this will hold a local build of the portfolio site.


### `npm run deploy`

Currently does nothing, eventually this will deploy my portfolio site.

### `npm run format`

Runs `pretier --write`

### `npm run edit`

Starts an server and serves a CMS front-end.

## Environment Variables

### `DATA_PATH`

Sets the data path directory for content. This is changed in the test scripts so I can test against sample data instead of my actually content.

### `NODE_ENV`

In test mode, this is used turn off verbose logging.

## Implementation notes:

The editor api exposes several endpoints:

### Back-end:

#### Data Model

The data model is directly read from and written to the file system as JSON.

##### Site
- Requires `headline` text
- Requires `welcomeMessage` text

##### Projects
- Requires `title` text
- Requires `description` text

Projects have identifiers that are used in the filename the data is stored in: `data/projects/:id.json`

The `id` of a project MUST only be comprised of lower-case letters a-z and dashes.

#### API
* `GET /api/projects`
Returns an array of objects.

* `GET /api/projects/:id`
Returns a single object, or `404` status code if no such project exists.

* `PUT /api/projects/:id`
Returns `200`, or `422` status code with JSON payload describing validation errors.

* `DELETE /api/projects/:id`
Returns `204` status code.

* `GET /api/site`
Returns a singe object.

* `PUT /api/site`
Returns `200`, or `422` status code with JSON payload describing validation errors.
