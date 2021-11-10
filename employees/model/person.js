import {dateToString, validRefErr, validStringErr} from "../core";
import {diffDate, findById} from "../service";

export class Person {
    _dateOfBirth;
    phones;
    age;
    constructor(name, surname) {
        validStringErr(name, "Name:String should be not empty")
        validStringErr(surname, "Surname:String should be not empty")
        this.name = name;
        this.surname = surname;
    }

    get fullName() {
        return this.name+" "+this.surname;
    }
    get getAge() {
        if (!this._dateOfBirth) return "";
        return  diffDate(new Date(), this._dateOfBirth);
    }
    set dateOfBirth(date) {
        this._dateOfBirth = new Date(date);
    }
    get dateOfBirth() {
        return this._dateOfBirth?
            " <b>Дата рождения:</b> "+dateToString(this._dateOfBirth):
            "";
    }
    toString() {
        const phones = this.phones?
            `Список телефонов: ${this.phones}`:'';
        return `
          ${this.fullName} \
          ${this.dateOfBirth} ${this.age} ${phones}`;
    }


}

export class Employee extends Person {
    constructor(name, surname, department) {
        validStringErr(department, "Department:String should be not empty")
        super(name,surname);
        this.department = department;
    }

}
