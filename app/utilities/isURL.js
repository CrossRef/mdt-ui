const isURL = function (url) {
    var re = /^(?:(ftp|http|https)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
    return re.test(url)
}

export default isURL