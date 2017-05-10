const pascaleCase = function (name) {
    if (name) {
        var arr, i, l;
        arr = String(name).split(/\s|_/);

        i = 0;
        l = arr.length;

        while (i < l) {
        arr[i] = arr[i].substr(0, 1).toUpperCase() + (arr[i].length > 1 ? arr[i].substr(1).toLowerCase() : '');
        i++;
        }

        return arr.join(' ');
    } else {
        return name;
    }
}

export default pascaleCase