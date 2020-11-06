const { prompt } = require('inquirer')
const db = require('./db/index')
require('console.table')


function begin() {
    employeeTrackerPrompts()
}

function quit() {
    process.exit()
}

function employeeTrackerPrompts() {
    prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: [
                {
                    name: "View employees",
                    value: "VIEW_EMPLOYEES"
                },
                {
                    name: "New employee",
                    value: "NEW_EMPLOYEE"
                },
                {
                    name: "Delete employee",
                    value: "DELETE_EMPLOYEE"
                },
                {
                    name: "Update Employee Job",
                    value: "UPDATE_JOB"
                },
                {
                    name: "Update Employee Manager",
                    value: "UPDATE_MANAGER"
                },
                {
                    name: "View Manager",
                    value: "VIEW_MANAGERS"
                },
                {
                    name: "View Departments",
                    value: "VIEW_DEPARTMENTS"
                },
                {
                    name: "Create Department",
                    value: "CREATE_DEPARTMENTS"
                },
                {
                    name: "Delete Department",
                    value: "DELETE_DEPARTMENT"
                },
                {
                    name: "View Jobs",
                    value: "VIEW_JOBS"
                },
                {
                    name: "New Job",
                    value: "NEW_JOBS"
                },
                {
                    name: "Delete Job",
                    value: "DELETE_JOB"
                },
                {
                    name: "Quit",
                    value: "QUIT"
                }
            ]
        }
    ])
    .then(res => {
        let choice = res.choice;
        switch (choice) {
            case "VIEW_EMPLOYEES": 
                viewEmployees()
                break;
            case "NEW_EMPLOYEE": 
                newEmployee()
                break;
            case "DELETE_EMPLOYEE": 
                deleteEmployee()
                break;
            case "UPDATE_JOB": 
                updateEmployeeJob()
                break;
            case "UPDATE_MANAGER": 
                updateEmployeeManager()
                break;
            case "VIEW_MANAGERS": 
                viewManagers()
                break;
            case "VIEW_DEPARTMENTS": 
                viewDepartments()
                break;
            case "CREATE_DEPARTMENTS": 
                createDepartment()
                break;
            case "DELETE_DEPARTMENT": 
                deleteDepartment()
                break;
            case "VIEW_JOBS": 
                viewJobs()
                break;
            case "NEW_JOBS": 
                newJob()
                break;
            case "DELETE_JOB": 
                deleteJob()
                break;
            default:
                quit();
        }
    })
}

function viewEmployees() {
    db.viewEmployees()
        .then(([rows]) => {
            let employees = rows
            console.log("\n")
            console.table(employees)
        })
        .then(() => employeeTrackerPrompts());
}

function newEmployee() {
    prompt([
        {
            name: "first_name",
            message: "Employee's first name?"
        },
        {
            name: "last_name",
            message: "Employee's last name?"
        }
    ])
        .then(res => {
            let firstName = res.first_name
            let lastName = res.last_name
            db.viewJobs()
                .then(([rows]) => {
                    let jobs = rows
                    const jobOptions = jobs.map(({ id, title}) => ({
                        name: title,
                        value: id
                    }))
                    prompt({
                        type: "list",
                        name: "jobId",
                        message: "What is the employee's job?",
                        choices: jobOptions
                    })
                        .then(res => {
                            let jobId = res.jobId
                            db.viewEmployees()
                                .then(([rows]) => { 
                                let employees = rows
                                const managerOptions = employees.map(({ id, first_name, last_name }) => ({
                                    name: `${first_name} ${last_name}`,
                                    value: id
                                }))
                                managerOptions.unshift({ name: "None", value: null})
                                prompt({
                                    type: "list",
                                    name: "manager",
                                    message: "Who is their manager?",
                                    choices: managerOptions
                                })
                                    .then(res => {
                                        let employee = {
                                            manager_id: res.manager,
                                            job_id: jobId,
                                            first_name: firstName,
                                            last_name: lastName
                                        }
                                        db.newEmployee(employee)
                                    })
                                    .then(() => console.log(
                                        `Added employee ${firstName} ${lastName}`
                                    ))
                                    .then(() => employeeTrackerPrompts())
                            })  
                        })
                })
        })
}

function deleteEmployee() {
    db.viewEmployees()
        .then(([rows]) => {
            let employees = rows
            const employeeOptions = employees.map(({ id, first_name, last_name}) => ({
                name: `${first_name} ${last_name}}`,
                value: id
            }))

            prompt([
                {
                    type: "list",
                    name: "employee_id",
                    message: "Remove which employee?",
                    choices: employeeOptions
                }
            ])
            .then(res => db.deleteEmployee(res.employee_id))
            .then(() => console.log("Employee removed"))
            .then(() => employeeTrackerPrompts())

        })
}

function updateEmployeeJob() {
    db.viewEmployees()
        .then(([rows]) => {
            let employees = rows
            const employeeOptions = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }))
            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Update which employees job?",
                    choices: employeeOptions
                }
            ])
                .then(res => {
                    let employeeId = res.employeeId;
                    db.viewJobs()
                        .then(([rows]) => {
                            let jobs = rows;
                            const jobOptions = jobs.map(({ id, title }) => ({
                            name: title,
                            value: id
                        }));
      
                        prompt([
                        {
                            type: "list",
                            name: "jobId",
                            message: "Which job does the employee have?",
                            choices: jobOptions
                        }
                        ])
                            .then(res => db.updateEmployeeJob(employeeId, res.jobId))
                            .then(() => console.log("Updated employee"))
                            .then(() => employeeTrackerPrompts())
                  });
              });
      
        })
}

function updateEmployeeManager() {
    db.viewEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeOptions = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Update which employee?",
                    choices: employeeOptions
                }
            ])
                .then(res => {
                    let employeeId = res.employeeId
                    db.viewManagers(employeeId)
                        .then(([rows]) => {
                            let managers = rows;
                            const managerOptions = managers.map(({ id, first_name, last_name }) => ({
                                name: `${first_name} ${last_name}`,
                                value: id
                            }));

                            prompt([
                                {
                                    type: "list",
                                    name: "managerId",
                                    message: "Which employee do you want to set as manager for the selected employee?",
                                    choices: managerOptions
                                }
                            ])
                                .then(res => db.updateEmployeeManager(employeeId, res.managerId))
                                .then(() => console.log("Updated employee"))
                                .then(() => employeeTrackerPrompts())
                        })
                })
        })

}

function viewManagers() {
    db.viewManagers()
        .then(([rows]) => {
            let Managers = rows;
            console.log("\n");
            console.table(Managers);
        })
        .then(() => employeeTrackerPrompts());
}

function viewDepartments() {
    db.viewDepartments()
        .then(([rows]) => {
            let departments = rows;
            console.log("\n");
            console.table(departments);
        })
        .then(() => employeeTrackerPrompts());
}

function createDepartment() {
    prompt([
        {
          name: "name",
          message: "What's the department name?"
        }
    ])
        .then(res => {
          let name = res;
          db.createDepartment(name)
            .then(() => console.log(`Added ${name.name}`))
            .then(() => employeeTrackerPrompts())
        })
    
}

function deleteDepartment() {
    db.viewDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentOptions = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            prompt(
                {
                    type: "list",
                    name: "departmentId",
                    message: "Which department would you like to remove? (Warning: This will also remove associated roles and employees)",
                    choices: departmentOptions
                })
                    .then(res => db.deleteDepartment(res.departmentId))
                    .then(() => console.log(`Removed department`))
                    .then(() => employeeTrackerPrompts())
        })

}

function viewJobs() {
    db.viewJobs()
        .then(([rows]) => {
            let jobs = rows;
            console.log("\n");
            console.table(jobs);
        })
        .then(() => employeeTrackerPrompts());

}

function newJob() {
    db.viewDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentOptions = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            prompt([
                {
                name: "title",
                message: "What is the role?"
                },
                {
                    name: "salary",
                    message: "What is the salary?"
                },
                {
                    type: "list",
                    name: "departments_id",
                    message: "Which department is the role in?",
                    choices: departmentOptions
                }
            ])
                .then(job => {
                    db.newJob(job)
                        .then(() => console.log(`Added ${job.title}`))
                        .then(() => employeeTrackerPrompts())
                })
        })

}

function deleteJob() {
    db.findAllRoles()
        .then(([rows]) => {
            let jobs = rows;
            const jobOptions = jobs.map(({ id, title }) => ({
                name: title,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "jobId",
                    message: "Remove which job?",
                    choices: jobOptions
                }
            ])
                .then(res => 
                    db.removeRole(res.jobId))
                        .then(() => console.log("Removed job"))
                        .then(() => employeeTrackerPrompts())
        })

}

begin();