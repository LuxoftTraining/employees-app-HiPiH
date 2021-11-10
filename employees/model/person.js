import { diffDate,  validStringErr} from "../core";


export class Person {
    _dateOfBirth;
    phones = [];
    age;

    constructor( name, surname) {

        this.name = name;
        this.surname = surname;
    }

    get fullName() {
        return this.name + " " + this.surname;
    }

    get getAge() {
        if (!this._dateOfBirth) return "";
        return diffDate(new Date(), this._dateOfBirth);
    }

    set dateOfBirth(date) {
        this._dateOfBirth = new Date(date);
    }
    get dateOfBirth() {
        return this._dateOfBirth;
    }

    setPhone(phone){
        validStringErr(phone, "Phone:String should be not empty");
        this.phones.push(phone);
    }

    toString() {
        const phones = this.phones ?
            `Список телефонов: ${this.phones}` : '';
        return `
          ${this.fullName} \
          ${this.dateOfBirth} ${this.age} ${phones}`;
    }

    static fromJSON(obj) {
        return Object.assign(new Person(), obj)
    }


}

