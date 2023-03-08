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

SELECT employee.id AS 'EID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department Name', role.salary AS 'Salary', CONCAT(employee.manager_id FROM employee JOIN role ON role_id=role.id JOIN department on department_id=department.id;