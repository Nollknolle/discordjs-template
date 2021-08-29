#!/usr/bin/env node

const inquirer = require("inquirer");
const wget = require("wget");
const unzipper = require("unzipper");
const fs = require("fs");
const colors = require("colors");
const { exec } = require("child_process");
const pckjson = require("../package.json");

const choices_list = ["Setup", "Create command", "Remove .zip file"];

function run() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "run",
        message: "Choose your option",
        choices: choices_list,
      },
    ])
    .then(async (answers) => {
      if (answers.run === choices_list[0]) {
        await runSetup();
      } else if (answers.run === choices_list[1]) {
        await createCommand();
      } else if (answers.run === choices_list[2]) {
        await unlink("/latest.zip");
      }
    });
}

run();

async function runSetup() {
  try {
    const download = wget.download(
      `${pckjson.repo}/latest.zip`,
      `${process.cwd()}/latest.zip`
    );

    download.on("end", async () => {
      await fs
        .createReadStream(`${process.cwd()}/latest.zip`)
        .pipe(unzipper.Extract({ path: `${process.cwd()}` }));
      console.log(
        colors.green(
          "Setup finished.\n- There is a template in commands/\n- New commands does only supports name, description and (options) [Use discord.js docs for documentation]\n- Please look in the config file in config/Config.js\n" +
            "Please run:"
        )
      );
      console.log(colors.magenta("npm i discord.js"));
      console.log(
        colors.red(
          "Move all files from latest in root directory and delete latest/"
        )
      );
    });

    download.on("error", (err_msg) => {
      console.log(
        colors.red("Error while downloading\nError Message: " + err_msg)
      );
    });
  } catch (error) {
    this.err();
  }
}

async function unlink(path) {
  if (fs.existsSync(process.cwd() + path)) {
    fs.unlink(process.cwd() + path, (error) => {
      if (error) {
        this.err();
        return;
      } else console.log(colors.green("File deleted"));
    });
  } else console.log(colors.yellow("No .zip file found"));
}

async function createCommand() {
  console.log(colors.yellow("In development!"));
  return;

  // try {
  //   if (!fs.existsSync(`${process.cwd()}/commands`)) {
  //     console.log(colors.red("Non existing commands folder!"));
  //     return;
  //   }

  //   if (!fs.existsSync(`${process.cwd()}/commands/template.js`)) {
  //     console.log(colors.red("Non existing templates file!"));
  //     return;
  //   }

  //   const answ = await inquirer.prompt({
  //     type: "input",
  //     name: "create",
  //     message: "Choose your command file name",
  //   });

  //   fs.copyFile(
  //     `${process.cwd()}/commands/template.js`,
  //     `${process.cwd()}/commands/${answ.create}.js`
  //   );

  //   console.log(colors.green("File copied!"));
  // } catch (error) {
  //   console.log(colors.red("Error while creating"));
  // }
}

function err() {
  console.log(
    colors.red(
      `Error while processing.\nPlease create issue.\n${pckjson.bugs.url}`
    )
  );
}
