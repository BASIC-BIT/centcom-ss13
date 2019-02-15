const express = require('express');
const { handler } = require('../server_dist/bundle');
const app = express();
const port = 3000;

app.get('/**', async (req, res) => {
  await new Promise((resolve, reject) => {
    const awsEvent = {
      path: req.url,
    };
    handler(awsEvent, {}, (err, response) => {
      res.send(response);
      resolve();
    });
  })
});

app.listen(port, () => console.log(`Local Server Runner running on port ${port}!`));