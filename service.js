function validRef(t, textThrowable, anyCondition = () => {return false;}) {
    const isNull = t == null;
    const isUndefined = t === undefined;
    if (isNull || isUndefined || anyCondition(t)) throw new Error(textThrowable);
}

function validString(t, textThrowable, anyCondition = () => {return false;}) {
    const isNotNeedType = typeof (t) !== typeof ("");
    const isEmptyString = t.length === 0;
    validRef(t, textThrowable, s => {
        return isEmptyString || isNotNeedType || anyCondition(s);
    });
}

function validNumber(t, textThrowable, anyCondition = () => {return false;}) {
    const isNotNeedType = typeof (t) !== typeof (0);
    const isNan = isNaN(t);
    validRef(t, textThrowable, s => {
        return isNotNeedType || isNan || anyCondition(s);
    });
}

function validDate(t, textThrowable, anyCondition = () => {return false;}) {
    const isNotNeedType = typeof (t) !== typeof (new Date());
    validRef(t, textThrowable, s => {
        return isNotNeedType  || anyCondition(s);
    });
}

/************************************/

function findByName(name, surname) {
    return DATA.employees.filter(value => (!name || value.name === name) && (!surname || value.surname === surname))
}

function addEmployee(name, surname) {
    validString(name, "Name:String should be not empty");
    validString(surname, "Surname:String should be not empty");
    const nextID = DATA.employees.sort((a, b) => b.id - a.id)[0].id + 1;
    DATA.employees.push({id: nextID, name: name, surname: surname, department: ""});
    return nextID;
}

function findById(id) {
    validNumber(id, "Id:Number should be not empty", t => t < 0);
    return DATA.employees.find(s => s.id === id);
}

function removeEmployee(id) {
    validNumber(id, "Id:Number should be not empty", t => t < 0);
    const index = DATA.employees.findIndex(s => s.id === id);
    if (index >= 0)
         DATA.employees.splice(index,index+1);
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

function addPhone(id,phone){
    validString(phone, "Phone:String should be not empty");
    const empl = findById(id);
    validRef(empl,`Employee by id ${id} not found`);
    ("phones" in empl)?empl.phones.push(phone):empl.phones = [phone];
}

function setDateOfBirth(id,dt){
    validDate(dt, "dt:Date should be not empty");
    const empl = findById(id);
    validRef(empl,`Employee by id ${id} not found`);
    empl.dateOfBirth  = dt;
}

function diffDate(dt1,dt2) {
    const y = dt1.getFullYear() - dt2.getFullYear();
    const m = dt1.getMonth() - dt2.getMonth();
    const d = dt1.getDate() - dt2.getDate();
    return y - ((m > 0 || (m===0 && d > 0))?-1:0);
}

function getAge(id){
    const empl = findById(id);
    validRef(empl,`Employee by id ${id} not found`);
    return ("dateOfBirth" in empl) ? diffDate(new Date(),empl.dateOfBirth) : -1;
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth()+1;
    const year = date.getFullYear();
    return ((day<10)?'0'+day:day) + '.' + ((month<10)?'0'+month:month) + '.' + year;
}

function getEmployeeInfo(id) {
    const empl = findById(id);
    validRef(empl,`Employee by id ${id} not found`);
    const phones = empl.phones? `Список телефонов: ${empl.phones}`:'';
    const age = empl.dateOfBirth? `Возраст: ${getAge(empl.id)}`:'';
    return ` 
          Имя: ${empl.name}
          Фамилия: ${empl.surname}
          Дата рождения: ${formatDate(empl.dateOfBirth)}
          ${phones} 
          ${age}
         `;
}

function getEmployeeJSON(id) {
    const empl = findById(id);
    validRef(empl,`Employee by id ${id} not found`);
    return JSON.stringify(empl);
}



























/***********************************/


function autoTest() {

    function bind(name, f){
        let fail = null;
        try{
            if(f())
                fail = "FAIL "+name;
            else
                console.log("OK "+name);
        }
        catch (e)
        {
            fail = "FAIL " + name +"\n" + e;
        }
        if(fail!=null) throw new Error(fail);
    }


    let id = -1;
    const dt = new Date();
   dt.setFullYear(dt.getFullYear() - 3);


    bind("addEmployee", () => {
        id = addEmployee("test1", "test2");
        return (DATA.employees.find(e => e.id === id) === undefined);
    });
    bind("findByName", () => {
        return (findByName("test1").length === 0 ||
            findByName("test1", "test2").length === 0 ||
            findByName(null, "test2").length === 0);
    });
    bind("findById", () => {
        return (findById(id) === undefined);
    });
    bind("addPhone", () => {
        addPhone(id,"99999999999");
        return (findById(id).phones === ["99999999999"]);
    });
    bind("setDateOfBirth", () => {
        setDateOfBirth(id,dt);
        let empl = findById(id);
        return (empl.dateOfBirth !== dt);
    });
    bind("getAge", () => {
        let d = getAge(id);
        return (d !== 3);
    });

    bind("getEmployeeInfo", () => {
        console.log(getEmployeeInfo(id));
        return false;
    });
    bind("getEmployeeJSON", () => {
        console.log(getEmployeeJSON(id));
        return false;
    });
    bind("removeEmployee", () => {
        removeEmployee(id);
        return (findByName("test1").length > 0 ||
            findByName("test1", "test2").length > 0 ||
            findByName(null, "test2").length > 0);
    });
}
autoTest();
/***********************************/