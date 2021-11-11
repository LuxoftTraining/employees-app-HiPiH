import DATA from './employees-json'
import { validNumberErr, validRefErr, validStringErr} from "./core";
import {Employee, jsonToEmployees} from "./model/employee";

class Service {

    constructor(DATA) {
        this._employee = jsonToEmployees(DATA)
    }

    findByName(name, surname) {
        return this._employee.find(value => (!name || value.name === name) && (!surname || value.surname === surname))
    }

    findById(id) {
        validNumberErr(id, "Id:Number should be not empty", t => t < 0);
        return this._employee.find(s => s.id === id);
    }

    addEmployee(name, surname) {
        validStringErr(name, "Name:String should be not empty");
        validStringErr(surname, "Surname:String should be not empty");
        const id = this._employee.length === 0 ? 0 : this._employee.sort((a, b) => b.id - a.id)[0].id + 1;
        const empl = new Employee(id, name, surname);
        this._employee = [...this._employee,empl];
        return empl;
    }

    removeEmployee(id) {
        validNumberErr(id, "Id:Number should be not empty", t => t < 0);
        this._employee = this._employee.filter(s => s.id !== id);
        return this;
    }

    replaceEmployee(empl){
        this.removeEmployee(empl.id);
        this._employee = [...this._employee, empl];
        return this;
    }

    getEmployee() {
        return [...this._employee];
    }

    showEmployee(empl) {
        validRefErr(empl, "Empl:Employee should be not empty");
        if (!("name" in empl))
            throw  new Error("Employee has not contain property 'name'");
        console.log(`Information about employee: ${empl.name}`);
        Object.keys(empl).forEach(key => console.log(`${key} : ${empl[key]}`));
    }

    showEmployees() {
        this._employee.forEach(e => {
            console.log("*".repeat(10));
            this.showEmployee(e);
        });

    }

    addPhone(id, phone) {
        validStringErr(phone, "Phone:String should be not empty");
        const empl = this.findById(id);
        validRefErr(empl, `Employee by id ${id} not found`);
        this.replaceEmployee(empl.appendNewPhone(phone));
        return empl;
    }


    setManager(idEmployee, idManager) {
        validNumberErr(idEmployee, "idEmployee:Number should be not empty", t => t < 0);
        validNumberErr(idManager, "idManager:Number should be not empty", t => t < 0);
        const empl = this.findById(idEmployee);
        const mang = this.findById(idManager);
        validRefErr(empl, `Employee by id ${idEmployee} not found`);
        validRefErr(mang, `Employee-Manager by id ${idManager} not found`);
        this.replaceEmployee(empl.setManager(idManager));
        return empl;

    }

    setDateOfBirth(id, dt) {
        validStringErr(dt, "dt:Date should be not empty");
        const empl = this.findById(id);
        validRefErr(empl, `Employee by id ${id} not found`);
        this.replaceEmployee(empl.setDateOfBirth(dt));
        return empl;
    }

    setDepartment(id, department) {
        const empl = this.findById(id);
        validRefErr(empl, `Employee by id ${id} not found`);
        this.replaceEmployee(empl.setDepartment(department));
        return empl;
    }

    fullSaveEmpl({name, surname, manager, birth, department}) {
        let empl = this.addEmployee(name, surname)
            .setDepartment(department)
            .setDateOfBirth(birth);

        const mangId = manager * 1;
        if (mangId > 0)
            empl.setManager(mangId);

        return this.replaceEmployee(empl);

    }

    searchEmployee(dict) {
        const helperString = (name, el) => {
            if (name in dict) {
                return (el[name].toLowerCase().indexOf(dict[name].toLowerCase())) > -1;
            }
            return true;
        }
        return this._employee.filter(el => {
            return helperString("name", el) &&
            helperString("surname", el) &&
            helperString("department", el) &&
            ((dict["manager"] ?? '-1') * 1 === -1) ? true : (el.manager * 1 === dict["manager"] * 1)
        });
    }
}

export default new Service(DATA);



//
// export function getAge(id) {
//     const empl = findById(id);
//     validRefErr(empl, `Employee by id ${id} not found`);
//     return ("dateOfBirth" in empl) ? diffDate(new Date(), empl.dateOfBirth) : -1;
// }
//
// export function formatDate(date) {
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();
//     return ((day < 10) ? '0' + day : day) + '.' + ((month < 10) ? '0' + month : month) + '.' + year;
// }
//
// export function getEmployeeInfo(id) {
//     const empl = findById(id);
//     validRefErr(empl, `Employee by id ${id} not found`);
//     const phones = empl.phones ? `Список телефонов: ${empl.phones}` : '';
//     const age = empl.dateOfBirth ? `Возраст: ${getAge(empl.id)}` : '';
//     return `
//           Имя: ${empl.name}
//           Фамилия: ${empl.surname}
//           Дата рождения: ${formatDate(empl.dateOfBirth)}
//           ${phones}
//           ${age}
//          `;
// }
//
// export function getEmployeeJSON(id) {
//     const empl = findById(id);
//     validRefErr(empl, `Employee by id ${id} not found`);
//     return JSON.stringify(empl);
// }
//

//

//
