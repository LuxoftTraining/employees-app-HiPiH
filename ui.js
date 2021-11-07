let GLOBAL_UI = {
    PLACEHOLDER: "placeholder-table",
    PLACEHOLDERADD: "placeholder-add"

}
let FORM_FIELDS = [
    {
        id: "name", label: "Имя", help: "", type: "text", validate: [
            str => validString(str) ? "Имя сотрудника должно быть задано" : null
        ], value: ""
    },
    {
        id: "surname", label: "Фамилия", help: "", type: "text", validate: [
            str => validString(str) ? "Фамилия сотрудника должна быть задана" : null
        ], value: ""
    },
    {
        id: "department", label: "Департамент", help: "", type: "text", validate: [
            str => validString(str) ? "Департамент сотрудника должна быть задан" : null
        ], value: ""
    },
    {
        id: "birth", label: "Дата рождения", placeholder: "Формат ГГГГ-ММ-ДД", type: "text", validate: [
            str => validString(str) ? "Дата рождения сотрудника должна быть задана" : null,
            str => (str.match(/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/g) === null) ? "Формат даты ГГГГ.ММ.ДД" : null
        ], value: ""
    },
    {
        id: "manager", label: "Фамилия менеджера", help: "", type: "select", validate: [],
        value: -1,
        values: [[-1, "no manager"]].concat(DATA.employees.map(el => [el.id, el.name + " " + el.surname]))
    }];

function clearEmployeesPlaceholder() {
    $clear(GLOBAL_UI.PLACEHOLDER);
}


function showEmployees(employees,filter) {
    let table = createTable(employees, [
        {
            title: "Name",
            value: row => `${row.name} ${row.surname}`
        }, {
            title: "Department",
            value: row => {
                let param =  Object.create(FORM_FIELDS.find(t => t.id === "department"));
                param.value = row.department;
                let control = createInput(param);
                control.addEventListener("change", e => setDepartment(row.id, control.value), false);
                return control;
            }
        }, {
            title: "DateOfBirth",
            value: row => {
                let dt = row.dateOfBirth;
                let param = Object.create(FORM_FIELDS.find(t => t.id === "birth"));
                param.value = (!validRef(dt)) ? dateToString(dt) : "";
                let control = createInput(param);
                control.addEventListener("change", e => setDateOfBirth(row.id, new Date(control.value)), false);
                return control;

            }
        }, {
            title: "Manager",
            value: row => {
                let param = Object.create(FORM_FIELDS.find(t => t.id === "manager"));
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

    let findField = ["name", "surname", "manager", "department"]
        .map(f => FORM_FIELDS.find(t => t.id === f))
        .map(f => {
            let el = createInput(f);
            let attr = document.createAttribute("placeholder");
            let filterVal = (filter??[])[el.name];
            attr.value = el.name;
            if(!validRef(filterVal))
                el.value = filterVal;
            el.attributes.setNamedItem(attr);
            el.addEventListener("keyup", e => {
                if (e.keyCode === 13) findAction(e);
            });
            return el;
        });


    let findAction = e => {
        let dict = findField.fold({})((acc, el) => {
            let val = (el.value + "");
            if (val.length > 0) {
                acc[el.name]= val;
            }
            return acc;
        });

        showEmployees(search(dict),dict);
    };


    let searchBar = cTag("div", "", "row flex", {},
        findField.map(el => cTag("div", "", "col-2", {}, el)).concat(
            [
                cTag("div", "", "col-1", {},
                cTag("button", "", "btn btn-primary", {"type": "Button"}, "Search", {
                    click: findAction
                })),
                cTag("div", "", "col-1", {},
                    cTag("button", "", "btn btn-primary", {"type": "Button"}, "Clear", {
                        click: e => showEmployees(search({}))
                    }))
                ]
        ));
    let place = cTag("div", "", "row", {}, [
        searchBar,
        cTag("div", "", "row", {}, cTag("div", "", "col-12", {}, table))
    ]);

    $set(GLOBAL_UI.PLACEHOLDER, place, false);
}


function addEmployeeFormUI() {
    let form = createForm(FORM_FIELDS, {
            title: "Добавить сотрудника", click: function (obj) {
                fullSaveEmpl(obj);
                render();
            }
        }
    )
    let place = cTag("div", "", "row container", {},
        cTag("div", "", "col-5 offset-md-3", {}, form)
    );

    $set(GLOBAL_UI.PLACEHOLDERADD, place, false);
}

function render() {
    clearEmployeesPlaceholder();
    addEmployeeFormUI();
    showEmployees(DATA.employees);
}


function runUI() {
    document.body.appendChild(createTab([["Table",GLOBAL_UI.PLACEHOLDER], ["Add",GLOBAL_UI.PLACEHOLDERADD]]));
    render();
}

window.addEventListener("load", runUI, false);