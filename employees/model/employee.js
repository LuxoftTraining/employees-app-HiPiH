import {Person} from "./person";

export class Employee extends Person {
    _manager;
    _department;
    constructor(id,name, surname, department) {
        super(name, surname);
        this.id = id;
        this._department = department;
    }
    set manager(managerId){
        this._manager = managerId;
    }
    get manager() {
       return  this._manager;
    }

    set department(department){
        this._department = department;
    }
    get department() {
        return this._department ;
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
