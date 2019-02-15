const shell = require('shelljs');

const variables = {
  prod_lambda_deploy_version: process.env.npm_package_version,
  dev_lambda_deploy_version: process.env.npm_package_version,

};

const terraformCommand = `terraform apply ${Object.entries(variables)
.map(([key, value]) => `-var '${key}=${value}'`)
.join(' ')}`;

shell.exec(terraformCommand);