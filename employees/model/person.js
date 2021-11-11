import {diffDate} from "../core";

export class Person {

    name = null;
    surname = null;
    dateOfBirth = null;
    phones = [];

    constructor(_name, _surname) {
        this.name = _name;
        this.surname = _surname;
    }

    cloneAndSetNewParams(newParamsObj) {
        return Object.assign(new this.constructor(), this, newParamsObj);
    }

    setDateOfBirth(date) {
        return this.cloneAndSetNewParams({dateOfBirth: new Date(date)});
    }

    getDateOfBirth() {
        return this.dateOfBirth;
    }

    getFullName() {
        return this.name + " " + this.surname;
    }

    getAge() {
        if (!this.dateOfBirth) return "";
        return diffDate(new Date(), this.dateOfBirth);
    }

    appendNewPhone(phone) {
        return this.cloneAndSetNewParams({phones: [...this.phones, phone]});
    }

    toString() {
        const phones = this.phones ? `Список телефонов: ${this.phones}` : '';
        return `${this.getFullName()} ${this.dateOfBirth} ${this.getAge()} ${phones}`;
    }

    static fromJSON(obj) {
        return Object.assign(new Person(), obj)
    }


}

