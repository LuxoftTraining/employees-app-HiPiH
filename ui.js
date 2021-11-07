let GLOBAL_UI = {
    PLACEHOLDER: "placeholder"
}
let FORM_FIELDS = [{
    id: "name", label: "Имя", help: "", type: "text", validate: [
        str => validString(str) ? "Имя сотрудника должно быть задано" : null
    ], value: "Имя"
},
    {
        id: "surname", label: "Фамилия", help: "", type: "text", validate: [
            str => validString(str) ? "Фамилия сотрудника должна быть задана" : null
        ], value: "Фамилия"
    },
    {
        id: "department", label: "Департамент", help: "", type: "text", validate: [
            str => validString(str) ? "Департамент сотрудника должна быть задан" : null
        ], value: "Департамент"
    },
    {
        id: "birth", label: "Дата рождения", placeholder: "Формат ГГГГ-ММ-ДД", type: "text", validate: [
            str => validString(str) ? "Дата рождения сотрудника должна быть задана" : null,
            str => (str.match(/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/g) === null) ? "Формат даты ГГГГ.ММ.ДД" : null
        ], value: "2021-01-01"
    },
    {
        id: "manager", label: "Фамилия", help: "", type: "select", validate: [],
        value: -1,
        values: [[-1, "no manager"]].concat(DATA.employees.map(el => [el.id, el.name + " " + el.surname]))
    }];

function clearEmployeesPlaceholder() {
    $clear(GLOBAL_UI.PLACEHOLDER);
}


function showEmployees(employees) {
    let table = createTable(employees, [
        {
            title: "Name",
            value: row => `${row.name} ${row.surname}`
        }, {
            title: "Department",
            value: row => {
                let param = FORM_FIELDS.find(t => t.id === "department");
                param.value = row.department;
                let control = createInput(param);
                control.addEventListener("change", e => setDepartment(row.id, control.value), false);
                return control;
            }
        }, {
            title: "DateOfBirth",
            value: row => {
                let dt = row.dateOfBirth;
                let param = FORM_FIELDS.find(t => t.id === "birth");
                param.value = (!validRef(dt)) ? dateToString(dt) : "";
                let control = createInput(param);
                control.addEventListener("change", e => setDateOfBirth(row.id, new Date(control.value)), false);
                return control;

            }
        }, {
            title: "Manager",
            value: row => {
                let param = FORM_FIELDS.find(t => t.id === "manager");
                param.value = row.managerId;
                let control = createInput(param);
                control.addEventListener("change", e => setManager(row.id, param.values[control.selectedIndex][0]), false);
                return control;
            }
        }

    ], row => {
        removeEmployee(row.id);
        render();
    });
    let place = cTag("div", "", "row", {},
        cTag("div", "", "col-10 offset-md-1", {}, table)
    );
    $set(GLOBAL_UI.PLACEHOLDER, place);
}


function addEmployeeFormUI() {
    let form = createForm(FORM_FIELDS, {
            title: "Добавить сотрудника", click: function (obj) {
                console.log(obj);
                let newID = addEmployee(obj.name, obj.surname);
                let mangId = obj.manager * 1;
                setDateOfBirth(newID, new Date(obj.birth));
                setDepartment(newID, obj.department);
                if (mangId > 0)
                    setManager(newID, mangId);
                render();
            }
        }
    )
    let place = cTag("div", "", "row", {},
        cTag("div", "", "col-5 offset-md-3", {}, form)
    );
    $set(GLOBAL_UI.PLACEHOLDER, place, false);
}

function render() {
    clearEmployeesPlaceholder();
    addEmployeeFormUI();
    showEmployees(DATA.employees);
}

function runUI() {
    document.body.appendChild(cTag("div", GLOBAL_UI.PLACEHOLDER, ""));
    render();
}

window.addEventListener("load", runUI, false);