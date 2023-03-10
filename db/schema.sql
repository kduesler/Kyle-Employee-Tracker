DROP DATABASE IF EXISTS employees_db;

create DATABASE employees_db;

USE employees_db;
CREATE Table department (
    id INT auto_increment,
    name VARCHAR(30),
    PRIMARY KEY (id)
);
CREATE Table role (
    id INT auto_increment,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    Foreign Key (department_id) 
    REFERENCES department(id)
    ON DELETE CASCADE
);
CREATE Table employee (
    id INT auto_increment,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    PRIMARY KEY (id),
    Foreign Key (role_id) 
    REFERENCES role(id)
    ON DELETE CASCADE,
    manager_id INT,
    Foreign Key (manager_id) 
    REFERENCES employee(id)
    ON DELETE SET NULL
 );



SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name, employee.id AS value FROM employee WHERE ISNULL(employee.manager_id);

SELECT employee.id AS 'EID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Role', department.name AS 'Department', role.salary AS 'Salary', employee.manager_id AS 'Manager ID' FROM employee JOIN role ON role_id=role.id JOIN department on department_id=department.id WHERE employee.manager_id=1;

SELECT employee.id AS "EID", employee.first_name AS "First Name", employee.last_name AS "Last Name", role.title AS "Role", department.name AS "Department", role.salary AS "Salary", employee.manager_id AS "Manager ID" FROM employee JOIN role ON role_id=role.id JOIN department on department_id=department.id WHERE employee.manager_id=5;