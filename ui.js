let GLOBAL_UI = {
    PLACEHOLDER: "placeholder"
}


function clearEmployeesPlaceholder() {
    $clear(GLOBAL_UI.PLACEHOLDER);
}


function removeEmployeeUI(id) {
    removeEmployee(id);
    render();
}


function showEmployees(employees) {
    let table = createTable(employees, [
        {title: "Name", value: row => `${row.name} ${row.surname}`},
        {title: "Department", value: row => `${row.department}`}
    ], row => {removeEmployeeUI(row.id);});
    let place = cTag("div", "", "row", {},
        cTag("div", "", "col-5 offset-md-3", {}, table)
    );
    $set(GLOBAL_UI.PLACEHOLDER, place);
}


function addEmployeeFormUI() {
    let form = createForm(
        [
            {
                id: "name", label: "Имя", help: "", type: "text", validate: [
                    str => validString(str) ? "Имя сотрудника должно быть задано" : null
                ]
            },
            {
                id: "surname", label: "Фамилия", help: "", type: "text", validate: [
                    str => validString(str) ? "Фамилия сотрудника должна быть задана" : null
                ]
            },
            {
                id: "birth", label: "Дата рождения", placeholder: "Формат ГГГГ-ММ-ДД", type: "text", validate: [
                    str => validString(str) ? "Дата рождения сотрудника должна быть задана" : null,
                    str => (str.match(/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/g) === null) ? "Формат даты ГГГГ.ММ.ДД" : null
                ]
            }
        ], {
            title: "Добавить сотрудника", click: function (obj) {
                let newID = addEmployee(obj.name, obj.surname);
                setDateOfBirth(newID, new Date(obj.birth));
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