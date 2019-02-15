const shell = require('shelljs');
const fs = require('fs');

const rawOutput = shell.cd('./terraform').exec('terraform output -json');

const output = JSON.parse(rawOutput);

console.log(Object.keys(output));

fs.writeFile("../generated/terraform_output.json", JSON.stringify(output), function(err) {
  if (err) {
    return console.log(err);
  }

  console.log("Current Terraform outputs written to ./generated/terraform_output.json");

  // shell.cd(path.resolve(__dirname, '../terraform')).exec(terraformCommand, { shell: 'sh' });
});
