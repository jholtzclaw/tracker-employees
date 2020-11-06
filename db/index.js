const connection = require('./connection')

class DB {
    constructor(connection) {
        this.connection = connection;
    }

    viewEmployees() {
        return this.connection.promise().query(
            `SELECT employee.id, employee.first_name,
             employee.last_name, job.title, departments.name
             AS department, job.salary, CONCAT(manager.first_name,
                 ' ', manager.last_name) AS manager FROM 
                 employee LEFT JOIN job on employee.job_id = 
                 job.id LEFT JOIN departments on job.departments_id 
                 = departments.id LEFT JOIN employee manager on 
                 manager.id = employee.manager_id;`
        )
    }

    newEmployee(employee) {
        return this.connection.promise().query(
            `INSERT INTO employee SET ?`, employee
        )
    }

    deleteEmployee(employee_id) {
        return this.connection.promise().query(
            `DELETE FROM employee WHERE id = ?`, employee_id
        )
    }

    updateEmployeeJob(employee_id, job_id) {
        return this.connection.promise().query(
            `UPDATE employee SET job_id = ? WHERE id = ?`, 
            [job_id, employee_id]
        )
    }

    updateEmployeeManager(employee_id, manager_id) {
        return this.connection.promise().query(
            `UPDATE employee SET manager_id = ? WHERE id = ?`, 
            [manager_id, employee_id]
        )
    }

    viewManagers(employee_id) {
        return this.connection.promise().querry(
            `SELECT id, first_name, last_name FROM employee WHERE id != ?`, employee_id
        )
    }

    viewDepartments() {
        return this.connection.promise().query(
            `SELECT departments.id, departments.name FROM departments`)
    }

    createDepartment(department) {
        return this.connection.promise().query(
            `INSERT INTO departments SET ?`, department
        )
    }

    deleteDepartment(departments_id) {
        return this.connection.promise().query(
            `DELETE from departments WHERE id = ?`, departments_id
        )
    }

    viewJobs() {
        return this.connection.promise().query(
            `SELECT job.id, job.title, departments.name AS departments, 
            job.salary FROM job LEFT JOIN departments on job.departments_id
            = departments.id;`
        )
    }

    newJob(job) {
        return this.connection.promise().query(
            `INSERT INTO job SET ?`, job
        )
    }

    deleteJob(job_id) {
        return this.connection.promise().query(`
            DELETE FROM job ? WHERE id = ?`, job_id)
    }
}

module.exports = new DB(connection)