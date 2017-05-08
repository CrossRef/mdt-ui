const isDOI = function (doi) {
    var re = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i
    return re.test(doi)
}

export default isDOI