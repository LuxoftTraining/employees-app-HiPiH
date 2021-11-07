function validRef(t, anyCondition = () => {
    return false;
}) {
    const isNull = t == null;
    const isUndefined = t === undefined;
    return (isNull || isUndefined || anyCondition(t));
}

function validRefErr(t, textThrowable, anyCondition = () => {
    return false;
}) {
    if (validRef(t, anyCondition)) throw new Error(textThrowable);
}

function validString(t, anyCondition = () => {
    return false;
}) {
    const isNotNeedType = typeof (t) !== typeof ("");
    return validRef(t, s => {
        return t.length === 0 || isNotNeedType || anyCondition(s);
    });
}

function validStringErr(t, textThrowable, anyCondition = () => {
    return false;
}) {
    if (validString(t, anyCondition)) throw new Error(textThrowable);
}

function validNumberErr(t, textThrowable, anyCondition = () => {
    return false;
}) {
    const isNotNeedType = typeof (t) !== typeof (0);
    const isNan = isNaN(t);
    validRefErr(t, textThrowable, s => {
        return isNotNeedType || isNan || anyCondition(s);
    });
}

function validDateErr(t, textThrowable, anyCondition = () => {
    return false;
}) {
    const isNotNeedType = typeof (t) !== typeof (new Date());
    validRefErr(t, textThrowable, s => {
        return isNotNeedType || anyCondition(s);
    });
}

Object.prototype.mapObj = function (f) {
    return Object.keys(this).map(k => f(k, this[k]));
};
HTMLElement.prototype.getElementById = function (id) {
    for (let el of this.childNodes) {
        if (el.id === id)
            return el;
    }
    return null;
};
Array.prototype.fold = function (zero) {
    function loop(arr, _f, _zero) {
        if (arr.length === 0 || validRef(arr)) return _zero;
        let el = arr.pop();
        return loop(arr, _f, _f(zero, el));

    }

    return f => {
        return loop(this.slice(), f, zero);
    }
}


$ = id => document.getElementById(id);
$set = (id, value, append = true) => {
    let obj = $(id);
    if (!append)
        $clear(id);
    obj.appendChild(value);
    return obj;
}

$clear = id => {
    let obj = $(id);
    obj.innerHTML = '';
    return obj;
}


function cTag(tagName, id, className = "", anyAttr = {}, childNode = [], events = {}) {

    let ret = document.createElement(tagName);
    let dictAttr = (anyAttr ?? {});
    dictAttr["id"] = id;
    dictAttr["class"] = className;
    dictAttr.mapObj((k, v) => {
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
function createInput(field) {
    if(field.type === "select")
    {
        return cTag("select", "field_" + field.id, "form-control col-auto",
            {"placeholder": field.placeholder, "name": field.id},
            (field.values??[]).map(v => {
                let attr = {"value":v[0]};
                if(v[0] === field.value)
                    attr["selected"] = true;
                return cTag("option","","",attr,v[1])
            }))
    }
    return cTag("input", "field_" + field.id, "form-control col-auto",
        {"placeholder": field.placeholder, "type": "text", "name": field.id, value:field.value??""}, )
}

function creatField(field) {
    return cTag("div", "", "row mb-3", {"data-field": field.id}, [
        cTag("label", "", "form-label col-auto", {"for": "field_" + field.id}, field.label),
        createInput(field),
        cTag("label", "error_field_" + field.id, "col-auto text-danger", {}, "")
    ]);
};

function createForm(field, submit) {

    let fields = field.map(creatField);
    let buttonSubmit = cTag("button", "", "btn btn-primary col-4 offset-md-8",
        {"type": "button"},
        submit.title, {
            "click": e => {
                let body = fields.fold({error: false, fields: {}})((acc, el) => {
                    let id = el.getAttribute("data-field");
                    let value = el.getElementById("field_" + id).value;
                    let f = field.filter(t => t.id === id)[0];
                    let errorPlace = el.getElementById("error_field_" + id);
                    errorPlace.innerHTML = '';
                    acc.fields[id] = value;
                    if (!validRef(f)) {
                        let errors = f.validate.map(t => t(value)).filter(t => t !== null);
                        if (errors.length > 0) {
                            acc.error = true;
                            for (let e of errors)
                                errorPlace.appendChild(cTag("div", "", "", {}, e));
                        }
                    }
                    return acc;
                });
                if (!body.error)
                    submit.click(body.fields);
            }
        })
    let controls = fields.concat(buttonSubmit);
    return cTag("form", "", "", {}, controls);

}

function createTable(arr, columns, deleteAction) {
    let header = cTag("thead", "", "", {},
        cTag("tr", "", "", {},
            columns.map(el => cTag("th", "", "", {"scope": "col"}, el.title))
        )
    );
    let body = cTag('tbody', "", "", {},
        arr.map(row => {
            let dataCol = columns.map(el => cTag("th", "", "", {"scope": "col"}, el.value(row)));
            let deleteCol =  cTag("th", "", "", {},
                cTag("button", "", "btn btn-danger",
                    {"type": "button"},"Delete",{click: e => { deleteAction(row);return false;} })
            )
            return cTag("tr", "", "", {}, dataCol.concat(deleteCol));
        }));
    return cTag("table", "", "table", [], [header, body]);
}


function dateToString(dt)
{
    let to2letter = (d) => {
        let dd = (d+"");
        return dd.length === 1? "0"+dd:dd;
    }
    return dt.getFullYear()+"-"+to2letter(dt.getMonth()+1)+"-"+to2letter(dt.getDate());
}