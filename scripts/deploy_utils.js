const AWS = require('aws-sdk');
const mime = require('mime-types');
const chardet = require('chardet');

const s3 = new AWS.S3();

function getParams(bucket, name, data ) {
  const type = mime.lookup(name);
  const charset = chardet.detect(data);

  const ContentType = `${type}${charset ? `; charset=${charset}` : ''}`;

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
  const params = getParams(bucket, name, contents);
  const [ error, results ] = await new Promise((resolve, reject) => {
    s3.upload(params, (...args) => resolve(args));
  });
  if(error) {
    throw error;
  }

  return {
    query: params,
    results,
  }
}

exports.putFile = putFile;