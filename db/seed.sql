USE employees;

INSERT INTO departments (name)
VALUES
    ('Grooming'),
    ('Daycare'),
    ('Kennel')
;

INSERT INTO job (title, salary, departments_id)
VALUES
    ('Grooming Manager', 85, 1),
    ('Groomer', 57, 1),
    ('Daycare Manager', 74, 2),
    ('Daycare Attendent', 25, 2),
    ('Boarding Manager', 85, 3),
    ('Kennel Attendent', 25, 3)
;

INSERT INTO employee (first_name, last_name, job_id, manager_id)
VALUES
    ('Joseph', 'Crouch', 3, null),
    ('Hunter', 'Wolfer', 2, 1), 
    ('Mariah', 'Jonesr', 8, null),
    ('April', 'Camacho', 1, 3),
    ('Heather', 'Masters', 8, null),
    ('Lori', 'Jones', 5, 4),
    ('Tony', 'Guy', 7, 2),
    ('Brandon', 'Holman', 7, 2)
;