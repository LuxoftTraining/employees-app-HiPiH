import {
    $clear,
    $set,
    createForm,
    createInput,
    createTab,
    createTable,
    cTag,
    dateToString,
    validRef,
    validString
} from "./core";
import Service from "./service";

export const GLOBAL_UI = {
    PLACEHOLDER: "placeholder-table",
    PLACEHOLDERADD: "placeholder-add"

}
const FORM_FIELDS = [
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
        values: [[-1, "no manager"]].concat(Service.getEmployee().map(el => [el.id, el.name + " " + el.surname]))
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
                const param =  Object.create(FORM_FIELDS.find(t => t.id === "department"));
                param.value = row.department;
                const control = createInput(param);
                control.addEventListener("change", () => Service.setDepartment(row.id, control.value), false);
                return control;
            }
        }, {
            title: "DateOfBirth",
            value: row => {
                const dt = row.dateOfBirth;
                const param = Object.create(FORM_FIELDS.find(t => t.id === "birth"));
                param.value = (!validString(dt)) ? dateToString(dt) : "";
                const control = createInput(param);
                control.addEventListener("change", () => Service.setDateOfBirth(row.id, new Date(control.value)), false);
                return control;

            }
        }, {
            title: "Manager",
            value: row => {
                const param = Object.create(FORM_FIELDS.find(t => t.id === "manager"));
                param.value = row.manager;
                const control = createInput(param);
                control.addEventListener("change", () => Service.setManager(row.id, param.values[control.selectedIndex][0]), false);
                return control;
            }
        }

    ], row => {
        let del = true;
        if (process.env.NODE_ENV === 'production'){
            del = confirm("Delete?");

        }
        if(del) {
            Service.removeEmployee(row.id);
            render();
        }
    });

    let findField = ["name", "surname", "manager", "department"]
        .map(f => FORM_FIELDS.find(t => t.id === f))
        .map(f => {
            const el = createInput(f);
            const attr = document.createAttribute("placeholder");
            const filterVal = (filter??[])[el.name];
            attr.value = el.name;
            if(!validRef(filterVal))
                el.value = filterVal;
            el.attributes.setNamedItem(attr);
            el.addEventListener("keyup", e => {
                if (e.keyCode === 13) findAction();
            });
            return el;
        });


    let findAction = () => {
        let dict = findField.fold({})((acc, el) => {
            const val = (el.value + "");
            if (val.length > 0) {
                acc[el.name]= val;
            }
            return acc;
        });

        showEmployees(Service.search(dict),dict);
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
                        click: () => showEmployees(Service.search({}))
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
                console.log(obj);
                Service.fullSaveEmpl(obj);
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
    showEmployees(Service.getEmployee());
}

export function runUI() {
    document.body.appendChild(createTab([["Table",GLOBAL_UI.PLACEHOLDER], ["Add",GLOBAL_UI.PLACEHOLDERADD]]));
    render();
}
