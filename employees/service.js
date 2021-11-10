import DATA from './employees-json'
import {validDateErr, validNumberErr, validRefErr, validStringErr} from "./core";

export  function findByName(name, surname) {
    return DATA.employees.filter(value => (!name || value.name === name) && (!surname || value.surname === surname))
}

export  function addEmployee(name, surname) {
    validStringErr(name, "Name:String should be not empty");
    validStringErr(surname, "Surname:String should be not empty");
    const nextID = DATA.employees.length === 0?0:DATA.employees.sort((a, b) => b.id - a.id)[0].id + 1;
    DATA.employees.push({id: nextID, name: name, surname: surname, department: ""});
    return nextID;
}

export  function findById(id) {
    validNumberErr(id, "Id:Number should be not empty", t => t < 0);
    return DATA.employees.find(s => s.id === id);
}

export  function removeEmployee(id) {
    validNumberErr(id, "Id:Number should be not empty", t => t < 0);
    const index = DATA.employees.findIndex(s => s.id === id);
    if (index >= 0)
        DATA.employees.splice(index, 1);
}

export  function showEmployee(empl) {
    validRefErr(empl, "Empl:Employee should be not empty");
    if (!("name" in empl))
        throw  new Error("Employee has not contain property 'name'");
    console.log(`Information about employee: ${empl.name}`);
    Object.keys(empl).forEach(key => console.log(`${key} : ${empl[key]}`));
}

export function showEmployees() {
    DATA.employees.forEach(e => {
        console.log("*".repeat(10));
        showEmployee(e);
    });
}

export function addPhone(id, phone) {
    validStringErr(phone, "Phone:String should be not empty");
    const empl = findById(id);
    validRefErr(empl, `Employee by id ${id} not found`);
    ("phones" in empl) ? empl.phones.push(phone) : empl.phones = [phone];
}

export function setManager(idEmployee, idManager) {
    validNumberErr(idEmployee, "idEmployee:Number should be not empty", t => t < 0);
    validNumberErr(idManager, "idManager:Number should be not empty", t => t < 0);
    const empl = findById(idEmployee);
    const mang = findById(idManager);
    validRefErr(empl, `Employee by id ${idEmployee} not found`);
    validRefErr(mang, `Employee-Manager by id ${idManager} not found`);
    empl.managerId = idManager;
}

export function setDateOfBirth(id, dt) {
    validDateErr(dt, "dt:Date should be not empty");
    const empl = findById(id);
    validRefErr(empl, `Employee by id ${id} not found`);
    empl.dateOfBirth = dt;
}
export function setDepartment(id, value) {
    const empl = findById(id);
    validRefErr(empl, `Employee by id ${id} not found`);
    empl.department = value;
}
export function diffDate(dt1, dt2) {
    const y = dt1.getFullYear() - dt2.getFullYear();
    const m = dt1.getMonth() - dt2.getMonth();
    const d = dt1.getDate() - dt2.getDate();
    return y - ((m > 0 || (m === 0 && d > 0)) ? -1 : 0);
}

export function getAge(id) {
    const empl = findById(id);
    validRefErr(empl, `Employee by id ${id} not found`);
    return ("dateOfBirth" in empl) ? diffDate(new Date(), empl.dateOfBirth) : -1;
}

export function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return ((day < 10) ? '0' + day : day) + '.' + ((month < 10) ? '0' + month : month) + '.' + year;
}

export function getEmployeeInfo(id) {
    const empl = findById(id);
    validRefErr(empl, `Employee by id ${id} not found`);
    const phones = empl.phones ? `Список телефонов: ${empl.phones}` : '';
    const age = empl.dateOfBirth ? `Возраст: ${getAge(empl.id)}` : '';
    return ` 
          Имя: ${empl.name}
          Фамилия: ${empl.surname}
          Дата рождения: ${formatDate(empl.dateOfBirth)}
          ${phones} 
          ${age}
         `;
}

export function getEmployeeJSON(id) {
    const empl = findById(id);
    validRefErr(empl, `Employee by id ${id} not found`);
    return JSON.stringify(empl);
}

export function getEmployee() {
    return [...DATA.employees];
}

export function fullSaveEmpl(obj)
{
    const newID = addEmployee(obj.name, obj.surname);
    const mangId = obj.manager * 1;
    setDateOfBirth(newID, new Date(obj.birth));
    setDepartment(newID, obj.department);
    if (mangId > 0)
        setManager(newID, mangId);
}

export function search(dict){
    const helperString = (name,el) => {
        if(name in dict)
        {
            return  (el[name].toLowerCase().indexOf(dict[name].toLowerCase())) >-1;
        }
        return true;
    }
    const ret = DATA.employees.filter(el => {
        return  helperString("name",el) &&
                helperString("surname",el) &&
                helperString("department",el) &&
                ((dict["manager"] ?? '-1')*1 === -1)?true:(el.managerId*1 === dict["manager"] * 1)

    });
    console.log(ret);
    return ret;
}