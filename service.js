function validRef(v, textThrowable, anyCondition = () => {return false;}) {
    let isNull = v == null;
    let isUndefined = v === undefined;
    if (isNull || isUndefined || anyCondition(v)) throw new Error(textThrowable);
}

function validString(str, textThrowable, anyCondition = () => {return false;}) {
    let isNotNeedType = typeof (str) !== typeof ("");
    let isEmptyString = str.length === 0;
    validRef(str, textThrowable, s => {
        return isEmptyString || isNotNeedType || anyCondition(s);
    });
}

function validNumber(num, textThrowable, anyCondition = () => {return false;}) {
    let isNotNeedType = typeof (num) !== typeof (0);
    let isNan = isNaN(num);
    validRef(num, textThrowable, s => {return isNotNeedType || isNan || anyCondition(s);});
}




/************************************/
function autoTest() {
    console.log("Test addEmployee");
    let id = addEmployee("test1", "test2");
    if (DATA.employees.find(e => e.id === id) === undefined)
        console.log("addEmployee not work");

    console.log("Test findByName");
    if (findByName("test1").length === 0 ||
        findByName("test1", "test2").length === 0 ||
        findByName(null, "test2").length === 0)
        console.log("findByName not work");

    console.log("Test removeEmployee");
    removeEmployee(id);
    if (findByName("test1").length > 0 ||
        findByName("test1", "test2").length > 0 ||
        findByName(null, "test2").length > 0)
        console.log("removeEmployee not work");

}

/***********************************/


function findByName(name, surname) {
    return DATA.employees.filter(value => (!name || value.name === name) && (!surname || value.surname === surname))
}


function addEmployee(name, surname) {
    validString(name, "Name:String should be not empty");
    validString(surname, "Surname:String should be not empty");
    let nextID = DATA.employees.sort((a, b) => b.id - a.id)[0].id + 1;
    DATA.employees.push({id: nextID, name: name, surname: surname, department: ""});
    return nextID;
}


function removeEmployee(id) {
    validNumber(id, "Id:Number should be not empty", t => t < 0);
    let index = DATA.employees.findIndex(s => s.id === id);
    if (index >= 0)
        delete DATA.employees[index];
}

function showEmployee(empl) {
    validRef(empl, "Empl:Employee should be not empty");
    if (!("name" in empl))
        throw  new Error("Employee has not contain property 'name'");
    console.log(`Information about employee: ${empl.name}`);
    Object.keys(empl).forEach(key => console.log(`${key} : ${empl[key]}`));
}

function showEmployees() {
    DATA.employees.forEach(e => {
        console.log("*".repeat(10));
        showEmployee(e);
    });
}