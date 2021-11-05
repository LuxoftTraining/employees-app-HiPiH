
function autoTest() {

    function bind(name, f) {
        let fail = null;
        try {
            if (f())
                fail = "FAIL " + name;
            else
                console.log("OK " + name);
        } catch (e) {
            fail = "FAIL " + name + "\n" + e;
        }
        if (fail != null) throw new Error(fail);
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
        addPhone(id, "99999999999");
        return (findById(id).phones === ["99999999999"]);
    });
    bind("setDateOfBirth", () => {
        setDateOfBirth(id, dt);
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