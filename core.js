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


$ = id => document.getElementById(id);
$set = (id, value, append = true) => {
    let obj = $(id);
    if (append)
        obj.innerHTML += value;
    else
        obj.innerHTML = value;
    return obj;
}
$clear = id => {
    let obj = $(id);
    obj.innerHTML = '';
    return obj;
}
