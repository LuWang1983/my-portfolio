const path = require('path');
const express = require('express');
const volleyball = require('volleyball');

const app = express();
const publicDir = path.resolve('public');

app.use(volleyball);
app.use(express.static(publicDir));

const PORT = process.env.PORT || 3333;

app.listen(PORT, (error) => {
  if (error) {
    console.trace('Failed to start local server. (exiting immediately)');
    process.exit(1);
  }

  console.log(`Started server, listening @ http://localhost:${PORT}`);
});
