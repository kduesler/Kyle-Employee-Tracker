const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "1234",
    database: "employees_db",
  },
  console.log(`Connected to the employee_db database.`)
);

const addDepartmentQuestion = [
  {
    type: "input",
    name: "deptName",
    message: "Enter the name of the department you would like to add.",
  },
];

// const updateEmployeeQuestions = [
// {
//   type: "list",
//   name: "updateEmp",
//   message: "For which employee would you like to update their role?",
//   choices:
// }
// ]

// 1. initalize app
function init() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "init",
        message: "I want to ",
        choices: [
          "view all departments.",
          "view all roles.",
          "view all employees.",
          new inquirer.Separator(),
          "add a department.",
          "add a role.",
          "add an employee.",
          new inquirer.Separator(),
          "update an employee's role.",
          new inquirer.Separator(),
        ],
      },
    ])
    .then((answer) => {
      // 2. choose options
      switch (answer.init) {
        case "view all departments.":
          viewDepartments();
          break;
        case "view all roles.":
          viewRoles();
          break;
        case "view all employees.":
          viewEmployees();
          break;
        case "view employees by manager.":
          viewEmployeesByManager();
          break;
        case "view employees by role.":
          viewEmployeesByRole();
          break;
        case "view employees by department.":
          viewEmployeesByDepartment();
          break;
        case "add a department.":
          addDepartment();
          break;
        case "add a role.":
          addRole();
          break;
        case "add an employee.":
          addEmployee();
          break;
        case "update an employee's role.":
          updateEmployeeRole();
          break;
        default:
      }
    });
}

// 3. create functions for each option

function viewDepartments() {
  db.query("SELECT * FROM department", function (err, results) {
    console.table(results);
    init();
  });
}

function viewRoles() {
  db.query(
    "SELECT role.title, role.id, department.name, role.salary FROM role JOIN department ON department_id=department.id;",
    function (err, results) {
      console.table(results);
      init();
    }
  );
}

function viewEmployees() {
  db.query(
    "SELECT employee.id AS 'EID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department Name', role.salary AS 'Salary', employee.manager_id FROM employee JOIN role ON role_id=role.id JOIN department on department_id=department.id;",
    function (err, results) {
      console.table(results);
      init();
    }
  );
}

function addDepartment() {
  inquirer.prompt(addDepartmentQuestion).then((answer) => {
    db.query(`INSERT INTO department (name) VALUES ("${answer.deptName}");`);
    viewDepartments();
  });
}

function addRole() {
  db.query(
    "SELECT department.name AS name, department.id AS value FROM department;",
    function (err, results) {
      if (err) console.error(err);
      const addRoleQuestions = [
        {
          type: "input",
          name: "roleName",
          message: "Enter the name of the role you would like to add.",
        },
        {
          type: "input",
          name: "roleSalary",
          message: "Enter the salary of the role you would like to add.",
        },
        {
          type: "list",
          name: "roleDept",
          message: "In which department in this role?",
          choices: results,
        },
      ];
      inquirer.prompt(addRoleQuestions).then((answer) => {
        db.query(
          `INSERT INTO role (title, salary, department_id) VALUES ("${answer.roleName}", "${answer.roleSalary}", "${answer.roleDept}");`
        );
        viewRoles();
      });
    }
  );
}

//add manger logic to show manager in question but insert manager_id into employee TABLE
function addEmployee() {
  db.query(
    "SELECT role.title AS name, role.id AS value FROM role;",
    function (err, results) {
      if (err) console.error(err);
      const addEmployeeQuestions = [
        {
          type: "input",
          name: "empFirstName",
          message:
            "Enter the first name of the employee you would like to add.",
        },
        {
          type: "input",
          name: "empLastName",
          message: "Enter the last name of the employee you would like to add.",
        },
        {
          type: "list",
          name: "empRole",
          message: "In which role is this employee?",
          choices: results,
        },
        // {
        //   type: "list",
        //   name: "empManager",
        //   message: "Who is this employee's manager?",
        //   choices:
        // },
      ];
      inquirer.prompt(addEmployeeQuestions).then((answer) => {
        db.query(
          `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.empFirstName}", "${answer.empLastName}", "${answer.empRole}", 1);`
        );
        viewEmployees();
      });
    }
  );
}

function updateEmployeeRole() {
  
}

init();
