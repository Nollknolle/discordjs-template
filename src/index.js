#!/usr/bin/env node

const inquirer = require("inquirer");
const wget = require("wget");
const unzipper = require("unzipper");
const path = require("path");
const fs = require("fs");
const colors = require("colors");

function run() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "run",
        message: "Choose your option",
        choices: ["Setup", "Create Command", "Deleting .zip File"],
      },
    ])
    .then(async (answers) => {
      if (answers.run === "Setup") {
        await runSetup();
      } else if (answers.run === "Create Command") {
        create();
      } else if (answers.run === "Deleting .zip File") {
        unlink(`${process.cwd()}/latest.zip`);
      }
    });
}

run();

async function runSetup() {
  const download = wget.download(
    "https://nollknolle.github.io/discord.bot.template/latest.zip",
    `${process.cwd()}/latest.zip`
  );

  download.on("end", () => {
    fs.createReadStream(`${process.cwd()}/latest.zip`).pipe(
      unzipper.Extract({ path: `${process.cwd()}` })
    );
    console.log(colors.green("Setup finished"));
  });

  //download.on("error", console.log(colors.red("Error while downloading")));
}

//Unlinks zip file
async function unlink(path) {
  if (fs.existsSync(path)) {
    fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
        return;
      } else console.log(colors.green("File deleted"));
    });
  } else console.log(colors.yellow(".zip File does not exits"));
}

async function create() {
  try {
    if (!fs.existsSync(`${process.cwd()}/commands`)) {
      console.log(colors.red("Non existing commands folder!"));
      return;
    }

    if (!fs.existsSync(`${process.cwd()}/commands/template.js`)) {
      console.log(colors.red("Non existing templates file!"));
      return;
    }

    const answ = await inquirer.prompt({
      type: "input",
      name: "create",
      message: "Choose your command file name",
    });

    fs.copyFile(
      `${process.cwd()}/commands/template.js`,
      `${process.cwd()}/commands/${answ.create}.js`
    );

    console.log(colors.green("File copied!"));
  } catch (error) {
    console.log(colors.red("Error while creating"));
  }
}
