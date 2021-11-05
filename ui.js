let GLOBAL_UI = {
    PLACEHOLDER: "placeholder1"
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

function showEmployees(employees) {
    let lis = employees.map(obj => cTag("li", "", "", [], `${obj.name} ${obj.surname}`))
    let ul = cTag("ul", "", "", [], lis);
    $set(GLOBAL_UI.PLACEHOLDER, ul);
}

function addEmployeeUI(){
    let validForm = (id,textError,condition) => {
        let val = $(id).value;
        if(!condition(val))
        {
            return cTag("li","","error",[],textError);
        }else{
            return null;
        }
    };
    let  errLSt = [
            validForm("name","Имя сотрудника должно быть задано", v=>!validString(v)),
            validForm("surname","Фамилия сотрудника должно быть задано", v=>!validString(v))
    ].filter( v=>v!=null);
    if(errLSt.length === 0)
    {
        addEmployee($("name").value,$("surname").value);
        render();
    }else {
        $set("addEmployeeFormErrorMessage", errLSt.join("\n"), false);
    }
}

function addEmployeeFormUI(){
    let form = cTag("div","","",[], [
        cTag("input","name","",{"placeholder":"Имя"}),
        cTag("input","surname","",{"placeholder":"Фамилия"}),
        cTag("button","","",{"onclick":"addEmployeeUI()"},"Добавить сотрудника")
    ]) + cTag("ul","addEmployeeFormErrorMessage","",);
    $set(GLOBAL_UI.PLACEHOLDER, form, false);
}

function render(){
    clearEmployeesPlaceholder();
    addEmployeeFormUI();
    showEmployees(DATA.employees);
}
function runUI() {
    document.body.innerHTML = GLOBAL_UI.mapObj( (k,v) => cTag("dev",v)).join("\n");
    render();
}

window.addEventListener("load", runUI, false);