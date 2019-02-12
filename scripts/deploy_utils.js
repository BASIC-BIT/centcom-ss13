const AWS = require('aws-sdk');
const mime = require('mime-types');
const chardet = require('chardet');

const s3 = new AWS.S3();

function getParams(bucket, name, data ) {
  const type = mime.lookup(name);
  const charset = chardet.detect(data);

  const ContentType = `${type}${charset ? `; charset=${charset}` : ''}`;

  console.log(ContentType);

  return {
    Bucket: bucket,
    Key: name,
    Body: data,
    ACL: 'public-read',
    ContentType,
    ContentEncoding: 'base64',
  }
}

async function putFile(bucket, name, contents) {
  const callbackPromise = callbackToPromise(
    (resp) => {
      return resp;
    }
  );
  await s3.upload(getParams(bucket, name, contents), callbackPromise);

  await callbackPromise;
}

function callbackToPromise(callback) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      resolve(callback(...args));
    });
  }
}

exports.putFile = putFile;