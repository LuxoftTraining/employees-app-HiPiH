import {Person} from "./person";

export class Employee extends Person {
    constructor(name, surname, department,id) {
        super(name, surname);
        this.id = id;
        this.department = department;
    }

    static fromJSON(obj) {
        return Object.assign(new Employee(), obj)
    }
}

export function jsonToEmployees(employeesJSON) {
    let employees = [];
    for (let e of employeesJSON) {
        console.log(e);
        employees.push(Employee.fromJSON(e));
    }
    return employees;
}
