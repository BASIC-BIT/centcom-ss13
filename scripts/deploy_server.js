const fs = require('fs');
const JSZip = require('jszip');

const putFile = require('./deploy_utils').putFile;

const SERVER_BUCKET = 'centcom-server-staging';

fs.readdir('./server_dist', async (err, items) => {
  const zip = new JSZip();
  await Promise.all(items.map(async item => {
    const data = fs.readFileSync(`./server_dist/${item}`);
    zip.file(item, data);
  }));
  const zipContent = await zip.generateAsync({type:"nodebuffer"});
  await putFile(SERVER_BUCKET, `v${process.env.npm_package_version}/server.zip`, zipContent);
  console.log(`Successfully uploaded server.zip to server bucket`);
});