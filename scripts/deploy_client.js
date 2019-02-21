const fs = require('fs');

const putFile = require('./deploy_utils').putFile;

const FRONT_END_BUCKET = 'centcom.services';

fs.readdir('./dist', async (err, items) => {
  await Promise.all(items.map(async item => {
    const data = fs.readFileSync(`./dist/${item}`);
    await putFile(FRONT_END_BUCKET, item, data);
    console.log(`Successfully uploaded ${item} to client bucket`);
  }));
});

