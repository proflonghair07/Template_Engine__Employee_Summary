const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employeeArray = [];

prompts = [
  {
    type: "input",
    message: "What is this employee's name?",
    name: "name",
  },
  {
    type: "list",
    message: "What role does this employee have?",
    name: "role",
    choices: ["Engineer", "Intern", "Manager"],
  },
  {
    type: "input",
    message: "What is this employee's GitHub username?",
    name: "github",
    when: function (answers) {
      return answers.role == "Engineer";
    },
  },
  {
    type: "input",
    message: "What school is their internship thorugh?",
    name: "school",
    when: function (answers) {
      return answers.role == "Intern";
    },
  },
  {
    type: "input",
    message: "What is this employee's office number?",
    name: "officeNumber",
    when: function (answers) {
      return answers.role == "Manager";
    },
  },
  {
    type: "input",
    message: "What is this employee's id number?",
    name: "idNumber",
  },
  {
    type: "input",
    message: "What is this employee's email address?",
    name: "email",
  },
];

function inquirerPrompt() {
  return inquirer.prompt(prompts).then((answers) => {
    const name = answers.name;
    const role = answers.role;
    const id = answers.idNumber;
    const email = answers.email;

    if (role == "Engineer") {
      var newEmployee = new Engineer(name, id, email, answers.github);
    } else if (role == "Intern") {
      var newEmployee = new Intern(name, id, email, answers.school);
    } else if (role == "Manager") {
      var newEmployee = new Manager(name, id, email, answers.officeNumber);
    }
    employeeArray.push(newEmployee);
    addEmployee();
  });
}

function addEmployee() {
  inquirer
    .prompt({
      type: "confirm",
      message: "Do you have another employee to add?",
      name: "addEmployee",
    })
    .then((answers) => {
      if (answers.addEmployee) {
        inquirerPrompt();
      } else {
        writeHTML(render(employeeArray));
      }
    });
}

function writeHTML(template) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
  fs.writeFileSync(outputPath, template);
  console.log("Page Rendered!");
}

inquirerPrompt();
