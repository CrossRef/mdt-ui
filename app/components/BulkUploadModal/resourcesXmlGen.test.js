import f from './resourcesXmlGenerator.js'
import csvExample from '../../__testUtils/dummyRecords/csvExamples.js'
import csv from 'csvtojson'
var fundingObj
beforeAll(() => {
  return csv({
      flatKeys: true,
      noheader: false
      // TODO add reformated headers test
    })
    .fromString(csvExample.funding.file).then((jsonObj) => {
      fundingObj = jsonObj
    })
})
test('csv for funding got parsed', () => {
  expect(fundingObj).toBeDefined()
})
/* call order for resources XML Generator:
 *  default passes through to handleReadFiles which calls mainProcessorCb
 *  mainProcessorCb calls getDoiObjects calls doiReducer and generateFundGroupCB
 *  generateFundGroupCB calls makeAssertionElem and aggregateByAward
 *  aggregateByAward calls awardReducer and awardCb
 *  awardCb calls makeAssertionElem and getFundingElem
 *  getFundingElem calls makeAssertionElem
 *  
 */
describe('generate resource XML from csv', () => {
  describe('makeAssertionElem', () => {
  it('should create a "fr:assertion" element with given name and value', () => {
    var doc = new DOMParser().parseFromString('<doi_resources></doi_resources>', 'text/xml')
    var funderElm = doc.createElement('fundref_data')
    doc.documentElement.appendChild(funderElm)
    f.makeAssertionElem(funderElm, "DOI", "10.5555/test1")
    expect(funderElm).toMatchSnapshot()
  })
})
  describe('getFundingElem', () => {
    //exports.getFundingElem=getFundingElem
    it('should create a Funding Element within given group', () => {

      var doc = new DOMParser().parseFromString('<doi_resources></doi_resources>', 'text/xml')
      var programElm = doc.createElementNS("http://www.crossref.org/fundref.xsd", "fr:program")
      programElm.setAttribute("name", "fundref")

      var group = f.makeAssertionElem(programElm, "fundgroup")
      var row = {
        "<funder_name>": "crossref funder",
        "<funder_identifier>": "1234567"
      }
      expect(f.getFundingElem(row, group)).toMatchSnapshot()
    })
    it('should work for a row without an identifier', () => {

      var doc = new DOMParser().parseFromString('<doi_resources></doi_resources>', 'text/xml')
      var group = f.makeAssertionElem(doc.documentElement, "fundgroup")
      var row = {
        "<funder_name>": "crossref funder"
      }
      expect(f.getFundingElem(row, group)).toMatchSnapshot()
    })
    it('should work for a row without a name', () => {

      var doc = new DOMParser().parseFromString('<doi_resources></doi_resources>', 'text/xml')
      var group = f.makeAssertionElem(doc.documentElement, "fundgroup")
      var row = {
        "<funder_identifier>": "1234567"
      }
      expect(f.getFundingElem(row, group)).toMatchSnapshot()
    })
    it('should not error when neither name or identfier are present', () => {

      var doc = new DOMParser().parseFromString('<doi_resources></doi_resources>', 'text/xml')
      var group = f.makeAssertionElem(doc.documentElement, "fundgroup")
      var row = {        
      }
      expect(() => {f.getFundingElem(row, group)}).not.toThrow()
    })

  })
  //exports.awardReducer=awardReducer
test('award Reducer', () => {
  var awardMap = new Map()
  const itemArray=[{ "<funder_identifier>": "1234567", "<funder_name>": "crossref funder","<award_number>":"grant id 1"},
{"<funder_identifier>": "22222", "<funder_name>": "another crossref funder","<award_number>":"grant id 1"},
{"<funder_identifier>": "33333", "<funder_name>": "old crossref funder","<award_number>":"grant id 2"}]
  
  awardMap = itemArray.reduce(f.awardReducer, awardMap)
  expect(awardMap).toMatchSnapshot()
})

    //exports.awardCb=awardCb
describe('awardCallback',()=>{

    it('should modify doc appending the funders within an award group', () => {
      var doc = new DOMParser().parseFromString('<doi_resources></doi_resources>', 'text/xml')

      const itemArray=[{ "<funder_identifier>": "1234567", "<funder_name>": "crossref funder"}]

      f.awardCb(doc.documentElement)(itemArray,"Grant id 1234")
      expect(doc).toMatchSnapshot()
    })

    it('should with no award', () => {
      var doc = new DOMParser().parseFromString('<doi_resources></doi_resources>', 'text/xml')
      const itemArray=[{ "<funder_identifier>": "1234567", "<funder_name>": "crossref funder"}]

      f.awardCb(doc.documentElement)(itemArray,"")
      expect(doc).toMatchSnapshot()
    })
})


  //exports.aggregateByAward=aggregateByAward

  test('should take array of funder rows and the program element to insert funding xml into', () => {
    var doc = new DOMParser().parseFromString('<doi_resources></doi_resources>', 'text/xml')
    const itemArray=[{ "<funder_identifier>": "1234567", "<funder_name>": "crossref funder"}]
    var funderElm = doc.createElement('fundref_data')

    f.makeAssertionElem(funderElm, "DOI", "10.5555/test1")

    var programElm = doc.createElementNS("http://www.crossref.org/fundref.xsd", "fr:program")
    programElm.setAttribute("name", "fundref")

    f.aggregateByAward(itemArray, programElm)
    expect(programElm).toMatchSnapshot()

  })




  test('generate fund group callback', () => {
    var doiMap = new Map()
    
    var doc = new DOMParser().parseFromString('<doi_resources></doi_resources>', 'text/xml')
    doiMap.set("10.5555/test1",{doi:"10.5555/test1", "<funder_identifier>": "1234567", "<funder_name>": "crossref funder"})
    doiMap.set("10.5555/test2",[])
    var itemArray =new Array(doiMap.get("10.5555/test1"))
    f.generateFundGroupCB(doc)(itemArray,"10.5555/test1")

    expect(doc).toMatchSnapshot()
  })
  //exports.makeAssertionElem=makeAssertionElem


  test('doi reducer for resource XML generation', () => {
    var doiMap = new Map()
    fundingObj.reduce(f.doiReducer, doiMap)
    expect(doiMap).toMatchSnapshot()
  })
  
  //exports.getDoiObjects=getDoiObjects
  test('get DOI Objects', () => {
    var doc = f.getDoiObjects(fundingObj)
    expect(doc).toMatchSnapshot()

  })


  //exports.handleReadFiles = handleReadFiles
  test('handleReadFiles', () => {
    expect(fundingObj).toBeDefined()

  })
  //exports.mainProcessorCb = mainProcessorCb
  test('main processor callback', () => {

    var doc = f.mainProcessorCb(fundingObj)
    expect(doc).toMatchSnapshot()

  })
})