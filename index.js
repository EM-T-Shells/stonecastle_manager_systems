//Dependencies packages
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const CFonts = require("cfonts");

//Local Connection to MySQL for database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "U8e*&0^C5%#U2cCU",
  database: "lafamiglia_db",
});

//When connected use cfonts as a header and then go to the main function to prompt users
connection.connect(function (err) {
  if (err) throw err;
  CFonts.say("emt_shells", {
    font: "3d",
    align: "left",
    colors: ["red", "cyan"],
    background: "transparent",
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: "0",
    gradient: false,
    independentGradient: false,
    transitionGradient: false,
    env: "node",
  });
  promptUser();
});

//Main Menu of Employee Manager, asks questions then divert to appropriate function
function promptUser() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View All Roles",
          "View All Departments",
          "Add Role",
          "Add Employee",
          "Add Department",
          "Remove Employee",
          "Update Employee Role",
          "Done!",
        ],
        name: "userchoice",
      },
    ])
    .then(function (response) {
      switch (response.userchoice) {
        case "View All Departments":
          viewByDepartment();
          break;

        case "View All Roles":
          viewRoles();
          break;

        case "View All Employees":
          viewAll();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Done!":
          missionComplete();
          break;
      }
    });
}

//function to view all employees, departments, and roles
function viewAll() {
  let query =
    "SELECT employee.first_name, employee.last_name, roles.title, departments.id, employee.salary";
  query +=
    " FROM employee INNER JOIN roles ON (employee.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id)";
  query += " ORDER BY employee.last_name;";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
}

//function to view all roles
function viewRoles() {
  let query = "SELECT roles.title FROM roles;";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
}

//function to view all departments
function viewByDepartment() {
  let query = "SELECT * FROM departments;";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
}

//function to add roles to db
function addRole(){
  let departmentArr = [];
  let departmentQuery = "SELECT * FROM departments;";
  connection.query(departmentQuery, function (err, res){
      if (err) throw err;
      for (i = 0; i < res.length; i++){
          departmentArr.push(res[i].department)
      }
  let query = "SELECT roles.title, departments.id";
  query += " FROM roles INNER JOIN departments ON (roles.department_id = departments.id);";
  connection.query(query, function (err, res){
      if (err) throw err;
      console.table(res);
      inquirer.prompt([
          {
              type: 'input',
              message: 'What is the name of the role you want to add?',
              name: "newrole"
          },
          {
              type: 'list',
              message: 'What department does this role belong to?',
              choices: departmentArr,
              name: "roleDepartment"
          }
      ]).then(function(response){
          let addDepartment = response.roleDepartment;
          let addDepartmentId = departmentArr.indexOf(addDepartment);
          addDepartmentId++;
          console.log("Adding New Role...\n");
          connection.query("INSERT INTO role SET ?",
          {
              title: response.newrole,
              department_id: addDepartmentId
          },
          function (err, res){
              if (err) throw err;
              console.log(res.affectedRows + " Role Created Succesfully\n");
              promptUser();
          });
      })
  })
  })
};

//function to add employees to db
function addEmployee() {
  let roleArr = [];
  let roleQuery = "SELECT roles.title FROM roles;";
  connection.query(roleQuery, function (err, res) {
    if (err) throw err;
    for (i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is your employees first name?",
          name: "firstname",
        },
        {
          type: "input",
          message: "What is your employees last name?",
          name: "lastname",
        },
        {
          type: "input",
          message: "What is your employees salary?",
          name: "salary",
        },
        {
          type: "list",
          message: "Choose your employees roles",
          name: "roles",
          choices: roleArr,
        },
      ])
      .then(function (response) {
        console.log("Adding New Employee...\n");
        let addEmployeeRole = response.roles;
        let addEmployeeRoleId = roleArr.indexOf(addEmployeeRole);
        addEmployeeRoleId++;
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: response.firstname,
            last_name: response.lastname,
            salary: response.salary,
            role_id: addEmployeeRoleId,
          },
          function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " Employee Created Succesfully\n");
            promptUser();
          }
        );
      });
  });
}

//function to add department to db
function addDepartment() {
  let query = "SELECT * FROM departments;";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the name of the department you want to add?",
          name: "roleDepartment",
        },
      ])
      .then(function (response) {
        console.log("Adding New Department...\n");
        connection.query(
          "INSERT INTO departments SET ?",
          {
            department_name: response.roleDepartment,
          },
          function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " Department Created Succesfully\n");
            promptUser();
          }
        );
      });
  });
}

//function to delete an employee from the db
function removeEmployee() {
  let employeeArr = [];
  let query =
    "SELECT employee.first_name, employee.last_name, departments.id";
  query +=
    " FROM employee INNER JOIN roles ON (employee.role_id = roles.id) INNER JOIN departments ON (roles.department_id = departments.id)";
  query += " ORDER BY employee.last_name";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    for (i = 0; i < res.length; i++) {
      employeeArr.push(res[i].last_name);
    }
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which employee do you want to remove?",
          choices: employeeArr,
          name: "last_name"
        },
      ])
      .then(function (response) {
        var query = "DELETE FROM employee WHERE ?";
        connection.query(query, response, function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " Employee Deleted Succesfully\n");
          promptUser();
        });
      });
  });
}

//function to update roles of employee
function updateEmployeeRole() {
  let roleArr = [];
  let roleQuery = "SELECT roles.title FROM roles;";
  connection.query(roleQuery, function (err, res) {
    if (err) throw err;
    for (i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }
  });
  let updateEmployeeRole = [];
  let query =
    "SELECT employee.first_name, employee.last_name, roles.title, departments.id";
  query +=
    " FROM employee INNER JOIN roles ON (employee.role_id = roles.id) INNER JOIN departments ON (roles.department_id = departments.id)";
  query += " ORDER BY employee.last_name";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    for (i = 0; i < res.length; i++) {
      updateEmployeeRole.push(res[i].last_name);
    }
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which employee do you want to update his/her roles?",
          choices: updateEmployeeRole,
          name: "last_name",
        },
        {
          type: "list",
          message: "Choose the new roles for the employee",
          name: "roles",
          choices: roleArr,
        },
      ])
      .then(function (response) {
        console.log("Updating Role for Employee...\n");
        let updateRole = response.roles;
        let updateRoleId = roleArr.indexOf(updateRole);
        updateRoleId++;
        var query = "UPDATE employee SET ? WHERE ?";
        connection.query(
          query,
          [
            {
              role_id: updateRoleId,
            },
            {
              last_name: response.last_name,
            },
          ],
          function (err, res) {
            if (err) throw err;
            console.log("Role Successfully Changed!!\n");
            promptUser();
          }
        );
      });
  });
}

//function to end program
function missionComplete() {
  CFonts.say("ca va sans dire.", {
    font: "block",
    align: "left",
    colors: ["system"],
    background: "transparent",
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: "0",
    gradient: false,
    independentGradient: false,
    transitionGradient: false,
    env: "node",
  });
  connection.end();
}
