import {Person} from "./person";

export class Employee extends Person {

    id = null;
    manager = null;
    department = "";

    constructor(_id, _name, _surname) {
        super(_name, _surname);
        this.id = _id;
    }

    setManager(managerId) {
        return this.cloneAndSetNewParams({manager: managerId});
    }

    getManager() {
        return this.manager;
    }

    setDepartment(department) {
        return this.cloneAndSetNewParams({department: department});
    }

    getDepartment() {
        return this.department;
    }

    static fromJSON(obj) {
        return Object.assign(new Employee(), obj)
    }
}


export function jsonToEmployees(employeesJSON) {
    let employees = [];
    for (let e of employeesJSON) {
        employees.push(Employee.fromJSON(e));
    }
    return employees;
}
