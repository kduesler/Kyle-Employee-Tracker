const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");

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
          "view employees by manager.",
          "view employees by role.",
          "view employees by department.",
          new inquirer.Separator(),
          "add a department.",
          "add a role.",
          "add an employee.",
          new inquirer.Separator(),
          "update an employee's role.",
          "update an employee's manager.",
          new inquirer.Separator(),
          "delete a department, role, or employee.",
          new inquirer.Separator(),
          "view the total utilized budget of a department.",
          new inquirer.Separator(),
        ],
      },
    ])
    .then((answer) => {
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
        case "update an employee's manager.":
          updateEmployeeManager();
          break;
        case "delete a department, role, or employee.":
          deleteItem();
          break;
        case "view the total utilized budget of a department.":
          viewDeptBudget();
          break;
        default:
      }
    });
}

function viewDepartments() {
  db.query(
    "SELECT department.id AS 'Department ID', department.name AS 'Department Name' from department;",
    function (err, results) {
      console.table(results);
      init();
    }
  );
}

function viewRoles() {
  db.query(
    "SELECT role.title AS 'Role', role.id AS 'Role ID', department.name AS 'Department', role.salary AS 'Salary' FROM role JOIN department ON department_id=department.id;",
    function (err, results) {
      console.table(results);
      init();
    }
  );
}

function viewEmployees() {
  db.query(
    "SELECT employee.id AS 'EID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Role', department.name AS 'Department', role.salary AS 'Salary', employee.manager_id AS 'Manager ID' FROM employee JOIN role ON role_id=role.id JOIN department on department_id=department.id;",
    function (err, results) {
      console.table(results);
      init();
    }
  );
}

function addDepartment() {
  const addDepartmentQuestion = [
    {
      type: "input",
      name: "deptName",
      message: "Enter the name of the department you would like to add.",
    },
  ];
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

function addEmployee() {
  db.query(
    "SELECT role.title AS name, role.id AS value FROM role;",
    function (err, results) {
      if (err) console.error(err);
      db.query(
        'SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name, employee.id AS value FROM employee;',
        function (err, results1) {
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
              message:
                "Enter the last name of the employee you would like to add.",
            },
            {
              type: "list",
              name: "empRole",
              message: "In which role is this employee?",
              choices: results,
            },
            {
              type: "list",
              name: "empManager",
              message: "Who is this employee's manager?",
              choices: results1,
            },
          ];
          inquirer.prompt(addEmployeeQuestions).then((answer) => {
            db.query(
              `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.empFirstName}", "${answer.empLastName}", "${answer.empRole}", "${answer.empManager}");`
            );
            viewEmployees();
          });
        }
      );
    }
  );
}

function updateEmployeeRole() {
  db.query(
    'SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name, employee.id AS value FROM employee;',
    function (err, results) {
      if (err) console.error(err);

      db.query(
        "SELECT role.title AS name, role.id AS value FROM role;",
        function (err, results1) {
          if (err) console.error(err);

          const updateEmployeeQuestions = [
            {
              type: "list",
              name: "updateEmp",
              message:
                "For which employee would you like to update their role?",
              choices: results,
            },
            {
              type: "list",
              name: "updateRole",
              message: "Which role do you want to give this employee?",
              choices: results1,
            },
          ];
          inquirer.prompt(updateEmployeeQuestions).then((answer) => {
            db.query(
              `UPDATE employee
              SET role_id = ${answer.updateRole}
              WHERE employee.id = ${answer.updateEmp};`
            );
            viewEmployees();
          });
        }
      );
    }
  );
}

function updateEmployeeManager() {
  db.query(
    'SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name, employee.id AS value FROM employee;',
    function (err, results) {
      if (err) console.error(err);

      const updateEmployeeManagerQuestions = [
        {
          type: "list",
          name: "updateEmpMan",
          message: "For which employee would you like to update their manager?",
          choices: results,
        },
        {
          type: "list",
          name: "updateMan",
          message: "Who is this employee's new manager?",
          choices: results,
        },
      ];
      inquirer.prompt(updateEmployeeManagerQuestions).then((answer) => {
        db.query(
          `UPDATE employee
              SET manager_id = ${answer.updateMan}
              WHERE employee.id = ${answer.updateEmpMan};`
        );
        viewEmployees();
      });
    }
  );
}

function viewEmployeesByManager() {
  db.query(
    'SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name, employee.id AS value FROM employee WHERE ISNULL(employee.manager_id);',
    function (err, results) {
      if (err) console.error(err);

      const viewEmployeeByManagerQuestion = [
        {
          type: "list",
          name: "viewByMan",
          message: "For which manager would you like to view their employees?",
          choices: results,
        },
      ];
      inquirer.prompt(viewEmployeeByManagerQuestion).then((answer) => {
        db.query(
          `SELECT employee.id AS "EID", employee.first_name AS "First Name", employee.last_name AS "Last Name", role.title AS "Role", department.name AS "Department", role.salary AS "Salary", employee.manager_id AS "Manager ID" FROM employee JOIN role ON role_id=role.id JOIN department on department_id=department.id WHERE employee.manager_id=${answer.viewByMan};`,
          function (err, results) {
            console.table(results);
            init();
          }
        );
      });
    }
  );
}

function viewEmployeesByRole() {
  db.query(
    "SELECT role.title AS name, role.id AS value FROM role;",
    function (err, results) {
      if (err) console.error(err);

      const viewEmployeeByRoleQuestion = [
        {
          type: "list",
          name: "viewByRole",
          message: "For which role would you like to view its employees?",
          choices: results,
        },
      ];
      inquirer.prompt(viewEmployeeByRoleQuestion).then((answer) => {
        db.query(
          `SELECT employee.id AS "EID", employee.first_name AS "First Name", employee.last_name AS "Last Name", role.title AS "Role", department.name AS "Department", role.salary AS "Salary", employee.manager_id AS "Manager ID" FROM employee JOIN role ON role_id=role.id JOIN department on department_id=department.id WHERE employee.role_id=${answer.viewByRole};`,
          function (err, results) {
            console.table(results);
            init();
          }
        );
      });
    }
  );
}

function viewEmployeesByDepartment() {
  db.query(
    "SELECT department.name AS name, department.id AS value FROM department;",
    function (err, results) {
      if (err) console.error(err);

      const viewEmployeeByDeptQuestion = [
        {
          type: "list",
          name: "viewByDept",
          message: "For which department would you like to view its employees?",
          choices: results,
        },
      ];
      inquirer.prompt(viewEmployeeByDeptQuestion).then((answer) => {
        db.query(
          `SELECT employee.id AS "EID", employee.first_name AS "First Name", employee.last_name AS "Last Name", role.title AS "Role", department.name AS "Department", role.salary AS "Salary", employee.manager_id AS "Manager ID" FROM employee JOIN role ON role_id=role.id JOIN department on department_id=department.id WHERE role.department_id=${answer.viewByDept};`,
          function (err, results) {
            console.table(results);
            init();
          }
        );
      });
    }
  );
}

function deleteItem() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "deleteWhat",
        message: "I want to delete ",
        choices: ["a department.", "a role.", "an employee."],
      },
    ])
    .then((answer) => {
      switch (answer.deleteWhat) {
        case "a department.":
          deleteDept();
          break;
        case "a role.":
          deleteRole();
          break;
        case "an employee.":
          deleteEmp();
          break;
      }
    });
}

function deleteDept() {
  db.query(
    "SELECT department.id AS value, department.name AS name from department;",
    function (err, results) {
      if (err) console.error(err);
      const deleteDeptQuestion = [
        {
          type: "list",
          name: "deleteDept",
          message: "Which department do you want to delete?",
          choices: results,
        },
      ];
      inquirer.prompt(deleteDeptQuestion).then((answer) => {
        db.query(
          `DELETE FROM department WHERE department.id=${answer.deleteDept};`
        );
        viewDepartments();
      });
    }
  );
}

function deleteRole() {
  db.query(
    "SELECT role.title AS name, role.id AS value FROM role;",
    function (err, results) {
      if (err) console.error(err);
      const deleteRoleQuestion = [
        {
          type: "list",
          name: "deleteRole",
          message: "Which role do you want to delete?",
          choices: results,
        },
      ];
      inquirer.prompt(deleteRoleQuestion).then((answer) => {
        db.query(`DELETE FROM role WHERE role.id=${answer.deleteRole};`);
        viewRoles();
      });
    }
  );
}

function deleteEmp() {
  db.query(
    'SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name, employee.id AS value FROM employee;',
    function (err, results) {
      if (err) console.error(err);

      const deleteEmpQuestion = [
        {
          type: "list",
          name: "deleteEmp",
          message: "Which employee do you want to delete?",
          choices: results,
        },
      ];
      inquirer.prompt(deleteEmpQuestion).then((answer) => {
        db.query(`DELETE FROM employee WHERE employee.id=${answer.deleteEmp};`);
        viewEmployees();
      });
    }
  );
}

function viewDeptBudget() {
  db.query(
    "SELECT department.id AS value, department.name AS name from department;",
    function (err, results) {
      if (err) console.error(err);
      const DeptBudgetQuestion = [
        {
          type: "list",
          name: "deptBud",
          message: "For which department do you want to view its budget?",
          choices: results,
        },
      ];
      inquirer.prompt(DeptBudgetQuestion).then((answer) => {
        db.query(
          `SELECT SUM(role.salary) AS 'Department Budget' FROM role WHERE role.department_id=${answer.deptBud};`,
          function (err, results) {
            console.table(results);
            init();
          }
        );
      });
    }
  );
}

init();
