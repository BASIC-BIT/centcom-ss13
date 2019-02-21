const fs = require('fs');
const JSZip = require('jszip');

const putFile = require('./deploy_utils').putFile;

const SERVER_BUCKET = 'centcom-server-staging';

const walk = function(basePath, dirPath = '', origin = true) {
  var results = [];
  var list = fs.readdirSync(basePath + '/' + dirPath);
  list.forEach(function(file) {
    const fullPath = basePath + '/' + (dirPath ? dirPath + '/' : '') + file;
    var stat;
    try {
      stat = fs.statSync(fullPath);
    } catch(e) {}
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(walk(basePath, (dirPath ? dirPath + '/' : '') + file, false));
    } else {
      /* Is a file */
      results.push((dirPath ? dirPath + '/' : '') + file);
    }
  });
  return results;
};

const filePaths = walk('./server_dist');
const zip = new JSZip();
filePaths.map(async item => {
  const data = fs.readFileSync(`./server_dist/${item}`);
  zip.file(item, data);
  console.log(`Packaged ${item} into server.zip`)
});
zip.generateAsync({type:"nodebuffer"}).then(async (zipContent) => {
  await putFile(SERVER_BUCKET, `v${process.env.npm_package_version}/server.zip`, zipContent);
  console.log(`Successfully uploaded server.zip to server bucket`);
});