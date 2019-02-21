const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

const variables = {
  prod_lambda_deploy_version: process.env.npm_package_version,
  dev_lambda_deploy_version: process.env.npm_package_version,

};

const terraformCommand = `terraform apply ${Object.entries(variables)
.map(([key, value]) => `-var '${key}=${value}'`)
.join(' ')}`;

fs.writeFile("./scripts/update_command.sh", terraformCommand, function(err) {
  if (err) {
    return console.log(err);
  }

  console.log("Terraform apply command file saved at scripts/update_command.sh - Run to apply new version!");

  // shell.cd(path.resolve(__dirname, '../terraform')).exec(terraformCommand, { shell: 'sh' });
});
