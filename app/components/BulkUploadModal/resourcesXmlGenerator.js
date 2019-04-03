
String.prototype.format = function () {
    var a = this;
    for (var k in arguments) {
        a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
    }
    return a
}

const header= "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
+ "<doi_batch version=\"4.3.5\" xmlns=\"http://www.crossref.org/doi_resources_schema/4.3.5\" "
+ "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
+ "xsi:schemaLocation=\"http://www.crossref.org/doi_resources_schema/4.3.5  "
+ "http://doi.crossref.org/schemas/doi_resources4.3.5.xsd\" "
+ "xmlns:ai=\"http://www.crossref.org/AccessIndicators.xsd\" "
+ "xmlns:fr=\"http://www.crossref.org/fundref.xsd\">\n<head>\n  <doi_batch_id>{0}</doi_batch_id>\n"
+ "  <depositor>\n"
+ "    <depositor_name>webDeposit</depositor_name>\n"
+ "    <email_address>{1}</email_address>\n"
+ "  </depositor>\n</head>\n<body>\n"

/*
takes a parsed csv object and generates a deposit standard XML
*/

const f = function (csvObject) {
console.log(header.format("this is the filename.java","This is the email@.com"))

}
f(null)
module.exports.f = f