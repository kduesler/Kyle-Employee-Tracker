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



INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Terry", "Blake", 4, NULL);

