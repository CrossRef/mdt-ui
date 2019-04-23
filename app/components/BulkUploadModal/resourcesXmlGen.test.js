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
        fundingObj =jsonObj
      })
  })
test('csv for funding got parsed',()=>{
  expect(fundingObj).toBeDefined()
})
test('doi reducer for resource XML generation', () => {
    var doiMap = new Map()
    console.log(f)
    fundingObj.reduce(f.doiReducer,doiMap)    
    expect(doiMap).toMatchSnapshot()
  })
