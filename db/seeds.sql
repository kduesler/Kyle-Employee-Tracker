INSERT INTO department(name)
VALUES ("Sales"),
("Engineering"),
("Finance"),
("Legal");


INSERT INTO role (title, salary, department_id)
VALUES ( "Sales Lead", 100000, 1),
("Salesperson", 80000, 1);


INSERT INTO employee ( first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
("Mike", "Chan", 2, 1);

INSERT INTO employee( first_name, last_name, role_id, manager_id) VALUES ("jack", "jackson", 35, 35);