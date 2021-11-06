let GLOBAL_UI = {
    PLACEHOLDER: "placeholder"
}

function cTag(tagName, id, className = "", anyAttr = {}, childNode = "") {
    let genAttr = (k, v) => (!validString(k) && !validString(v)) ? `${k}='${v}'` : '';
    let dictAttr = (anyAttr ?? {});
    dictAttr["id"] = id;
    dictAttr["class"] = className;
    let any = dictAttr.mapObj((k, v) => genAttr(k, v)).join(" ");
    let children = (validRef(childNode)) ? "" : ((typeof (childNode) == "string") ? childNode : childNode.join("\n"));
    return `<${tagName} ${any}>${children}</${tagName}>`;
}

function clearEmployeesPlaceholder() {
    $clear(GLOBAL_UI.PLACEHOLDER);
}




function removeEmployeeUI(id) {
removeEmployee(id);
render();
}



function showEmployees(employees) {

    let lis = employees.map(obj => cTag("tr", "", "", [],
        [
            cTag("th","","",{"score":"row"},`${obj.name} ${obj.surname}`),
            // cTag("th","","",{"score":"row"},`${!validRef(obj.dateOfBirth)?obj.dateOfBirth:""}`),
            cTag("th","","",{"score":"row"},`${obj.department}`),
            cTag("th", "", "", {},
                cTag("button","","btn btn-danger",
                    {"type":"button",'date-id':`${obj.id}`,"onclick":`removeEmployeeUI(${obj.id});`},"Delete")
                )
        ]
    ));
    let header = cTag("thead", "", "", {},
        cTag("tr", "", "", {}, [
            cTag("th","","",{"scope":"col"},"Name"),
            // cTag("th","","",{"scope":"col"},"BirthDay"),
            cTag("th","","",{"scope":"col"},"Department"),
            cTag("th","","",{"scope":"col"},"&nbsp;")

        ])
    );
    let body = cTag('tbody',"","",{},lis)
    let ul = cTag("table", "", "table", [], [header,body]);
    $set(GLOBAL_UI.PLACEHOLDER, ul);
}

function addEmployeeUI() {
    let validForm = (val, textError, condition) => {
        if (!condition(val)) {
            return cTag("li", "", "error", [], textError);
        } else {
            return null;
        }
    };
    let nameValue = $("name").value;
    let surnameValue = $("surname").value;
    let birthValue = $("birth").value;

    let errLSt = [
        validForm(nameValue, "Имя сотрудника должно быть задано", v => !validString(v)),
        validForm(surnameValue, "Фамилия сотрудника должно быть задано", v => !validString(v)),
        validForm(birthValue, "Дата рождения сотрудника должно быть задано в формате ГГГГ.ММ.ДД",
            v => !validString(v) && v.match(/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/g) !== null
        )

    ].filter(v => v != null);
    if (errLSt.length === 0) {
        let newID = addEmployee(nameValue, surnameValue);
        setDateOfBirth(newID, new Date(birthValue));
        render();
    } else {
        $set("addEmployeeFormErrorMessage", errLSt.join("\n"), false);
    }
}

function addEmployeeFormUI() {
    let form = cTag("div", "", "form-control form-control-lg", [], [
        cTag("div","","mb-3",{},
            cTag("input", "name", "", {"placeholder": "Имя"}),

        ),
        cTag("div","","mb-3",{},
            cTag("input", "surname", "", {"placeholder": "Фамилия"}),

        ),
        cTag("div","","mb-3",{},
            cTag("input", "birth", "", {"placeholder": "Дата рождения: ГГГГ-ММ-ДД", "style": "width:300px;"}),

        ),
        cTag("div","","mb-3",{},
            cTag("button", "", "", {"onclick": "addEmployeeUI()"}, "Добавить сотрудника")

        ),
        cTag("div","","mb-3",{},
            cTag("ul", "addEmployeeFormErrorMessage", "",)
        ),
    ]);
    $set(GLOBAL_UI.PLACEHOLDER, form, false);
}

function render() {
    clearEmployeesPlaceholder();
    addEmployeeFormUI();
    showEmployees(DATA.employees);
}

function runUI() {
    document.body.innerHTML = cTag("div",GLOBAL_UI.PLACEHOLDER,"");
    render();
}

window.addEventListener("load", runUI, false);