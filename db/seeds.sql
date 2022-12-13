INSERT INTO departments (department_name)
VALUES ("Corleonesi Cosa Nostra");

INSERT INTO roles (title, department_id)
VALUES("Capomandamento", 1),
      ("Concierge", 1),
      ("Underboss", 1),
      ("Caporegime", 1),
      ("Soldier", 1);

INSERT INTO employees (first_name, last_name, role_id, salary, manager_id, department_id)
VALUES("Don Vito", "Corleone", 1, 100000000, NULL, 1),
      ("Thomas", "Hagen", 2, 5000000, 1, 1),
      ("Santino 'Sonny'", "Corleone", 3, 10000000, 1, 1),
      ("Michael", "Corleone", 3, 5000000, 1, 1),
      ("Peter", "Clemenza", 4, 1000000, 3, 1),
      ("Salvatore 'Sal'", "Tessio", 4, 500000, 5, 1),
      ("Frank 'Frankie Five Angels'", "Pentangeli", 4, 500000, 5, 1),
      ("Luca", "Brasi", 5, 350000, 6, 1),
      ("Roberto 'Thunder Bob'", "Nelenza", 5, 200000, 7, 1),
      ("Gaetano 'Gary Dee'", "De Luna", 5, 100000, 6, 1);