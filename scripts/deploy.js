const AWS = require('aws-sdk');
const fs = require('fs');
const mime = require('mime-types');
const chardet = require('chardet');

const s3 = new AWS.S3();

const BUCKET_NAME = 'yogs.ddmers.com';

function getParams(name, data) {
  const type = mime.lookup(name);
  const charset = chardet.detect(data);

  const ContentType = `${type}${charset ? `; charset=${charset}` : ''}`;

  console.log(ContentType);

  return {
    Bucket: BUCKET_NAME,
    Key: name,
    Body: data,
    ACL: 'public-read',
    ContentType,
    ContentEncoding: 'base64',
  }
}

async function putFile(name, contents) {
  const callbackPromise = callbackToPromise(
    (resp) => {
      console.log(`Successfully uploaded ${name}`);
      return resp;
    }
  );
  s3.upload(getParams(name, contents), callbackPromise);

  await callbackPromise;
}

function callbackToPromise(callback) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      resolve(callback(...args));
    });
  }
}

fs.readdir('./dist', (err, items) => {
  items.forEach(async item => {
    const data = fs.readFileSync(`./dist/${item}`);
    await putFile(item, data);
  });
  console.log(items);
});
