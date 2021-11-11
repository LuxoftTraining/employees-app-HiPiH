export function validRef(t, anyCondition = () => {
    return false;
}) {
    const isNull = t == null;
    const isUndefined = t === undefined;
    return (isNull || isUndefined || anyCondition(t));
}

export function validRefErr(t, textThrowable, anyCondition = () => {
    return false;
}) {
    if (validRef(t, anyCondition)) throw new Error(textThrowable);
}

export function validString(t, anyCondition = () => {
    return false;
}) {
    const isNotNeedType = typeof (t) !== typeof ("");
    return validRef(t, s => {
        return t.length === 0 || isNotNeedType || anyCondition(s);
    });
}

export function validStringErr(t, textThrowable, anyCondition = () => {
    return false;
}) {
    if (validString(t, anyCondition)) throw new Error(textThrowable);
}

export function validNumberErr(t, textThrowable, anyCondition = () => {
    return false;
}) {
    const isNotNeedType = typeof (t) !== typeof (0);
    const isNan = isNaN(t);
    validRefErr(t, textThrowable, s => {
        return isNotNeedType || isNan || anyCondition(s);
    });
}

export function validDateErr(t, textThrowable, anyCondition = () => {
    return false;
}) {
    const isNotNeedType = typeof (t) !== typeof (new Date());
    validRefErr(t, textThrowable, s => {
        return isNotNeedType || anyCondition(s);
    });
}




export function fold(arr, zero) {
    function loop(arr, _f, _zero) {
        if (arr.length === 0 || validRef(arr)) return _zero;
        const el = arr.pop();
        return loop(arr, _f, _f(zero, el));
    }

    return f => {
        return loop([...arr], f, zero);
    }
}


export function $(id) { return document.getElementById(id);}
export function $set(id, value, append = true) {
    const obj = $(id);
    if (!append)
        $clear(id);
    obj.appendChild(value);
    return obj;
}

export function $clear(id) {
    let obj = $(id);
    obj.innerHTML = '';
    return obj;
}


export function cTag(tagName, id, className = "", anyAttr = {}, childNode = [], events = {}) {

    const ret = document.createElement(tagName);
    const dictAttr = (anyAttr ?? {});
    dictAttr["id"] = id;
    dictAttr["class"] = className;

    Object.keys(dictAttr).map(k => {
        const v = this[k];
        if (!validRef(v) && v !== "") ret.setAttribute(k, v);
    });

    if (!validRef(childNode)) {
        if (typeof (childNode) == "object") {
            if (Array.isArray(childNode)) {
                for (let el of childNode) {
                    if (!validRef(el))
                        ret.appendChild(el);
                }
            } else {
                ret.appendChild(childNode);
            }
        } else {
            ret.appendChild(document.createTextNode(childNode));
        }
    }
    if (!validRef(events) && typeof (events) === "object") {
        for (let i in events) {
            if (events.hasOwnProperty(i))
                ret.addEventListener(i, events[i], false);
        }
    }
    return ret;
}
export function diffDate(dt1, dt2) {
    const y = dt1.getFullYear() - dt2.getFullYear();
    const m = dt1.getMonth() - dt2.getMonth();
    const d = dt1.getDate() - dt2.getDate();
    return y - ((m > 0 || (m === 0 && d > 0)) ? -1 : 0);
}

export function createInput(field) {
    if (field.type === "select") {
        return cTag("select", "field_" + field.id, "form-control col-auto",
            {"placeholder": field.placeholder, "name": field.id,},
            (field.values ?? []).map(v => {
                let attr = {"value": v[0]};
                if (v[0] === field.value)
                    attr["selected"] = true;
                return cTag("option", "", "", attr, v[1])
            }))
    }
    return cTag("input", "field_" + field.id, "form-control col-auto",
        {"placeholder": field.placeholder, "type": "text", "name": field.id, value: field.value ?? ""},)
}

export function creatField(field) {
    return cTag("div", "", "row mb-3", {"data-field": field.id}, [
        cTag("label", "", "form-label col-auto", {"for": "field_" + field.id}, field.label),
        createInput(field),
        cTag("label", "error_field_" + field.id, "col-auto text-danger", {}, "")
    ]);
}

export function createForm(field, submit) {
    const fields = field.map(creatField);
    const buttonSubmit = cTag("button", "", "btn btn-primary col-6 offset-md-6",
        {"type": "button"},
        submit.title, {
            "click": () => {
                let body = fields.fold({error: false, fields: {}})((acc, el) => {
                    const id = el.getAttribute("data-field");
                    const inputField = [...el.childNodes].find(el => el.id === "field_" + id);
                    const value = inputField.value;
                    const f = field.filter(t => t.id === id)[0];
                    const errorPlace = [...el.childNodes].find(el => el.id === "error_field_" + id);
                    errorPlace.innerHTML = '';
                    acc.fields[id] = value;
                    inputField.classList.remove("error");
                    if (!validRef(f)) {
                        let errors = f.validate.map(t => t(value)).filter(t => t !== null);
                        if (errors.length > 0) {
                            acc.error = true;
                            for (let e of errors)
                                errorPlace.appendChild(cTag("div", "", "", {}, e));
                            inputField.classList.add("error");
                        }
                    }
                    return acc;
                });
                if (!body.error)
                    submit.click(body.fields);
            }
        })
    const controls = fields.concat(buttonSubmit);
    return cTag("form", "", "", {}, controls);

}

export function createTable(arr, columns, deleteAction) {
    let header = cTag("thead", "", "", {},
        cTag("tr", "", "", {},
            columns.map(el => cTag("th", "", "", {"scope": "col"}, el.title))
        )
    );
    let body = cTag('tbody', "", "", {},
        arr.map(row => {
            let dataCol = columns.map(el => cTag("th", "", "", {"scope": "col"}, el.value(row)));
            let deleteCol = cTag("th", "", "", {},
                cTag("button", "", "btn btn-danger",
                    {"type": "button"}, "Delete", {
                        click: () => {
                            deleteAction(row);
                            return false;
                        }
                    })
            )
            return cTag("tr", "", "", {}, dataCol.concat(deleteCol));
        }));
    return cTag("table", "", "table", [], [header, body]);
}


export function dateToString(dt) {
    let to2letter = (d) => {
        let dd = (d + "");
        return dd.length === 1 ? "0" + dd : dd;
    }

    console.log(dt);
    return dt.getFullYear() + "-" + to2letter(dt.getMonth() + 1) + "-" + to2letter(dt.getDate());
}


export function createTab(containers) {
    function setActiveTab(tab) {
        for (let i of document.getElementsByClassName("tab-button")) {
            i.classList.remove("active");
            if (i.id === "tab" + tab) {
                i.classList.add("active");
            }
        }
        for (let i of document.getElementsByClassName("tab-container")) {
            i.classList.add("hidden");
            if (i.id === tab) {
                i.classList.remove("hidden");
            }
        }
    }

    return cTag("div", "", "container", {}, [
        cTag("div", "", "row tab-header", {},
            containers.map(tab => cTag("div", "tab" +  tab[1], "col-1 tab-button " + ( tab[1] === containers[0][1] ? "active" : ""), {},
                cTag("a", "", "", {"href": "javascript:"},  tab[0], {click: () => setActiveTab( tab[1])}))
            )
        ),
        cTag("div", "", "row", {},
            containers.map(tab => cTag("div", tab[1], "container tab-container " + ( tab[1] === containers[0][1] ? "" : "hidden"), {}, ""))
        )
    ]);
}