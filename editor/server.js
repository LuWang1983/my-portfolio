const path = require('path');
const app = require('./app');
const appIndex = path.resolve('editor', 'app', 'index.html');
const Bundler = require('parcel-bundler');
const bundler = new Bundler(appIndex, {});
app.use(bundler.middleware());

const PORT = process.env.PORT || 4444;

app.listen(PORT, (error) => {
  if (error) {
    console.trace('Failed to start editorserver. (exiting immediately)');
    process.exit(1);
  }

  console.log(`Started server, listening @ http://localhost:${PORT}`);
});
