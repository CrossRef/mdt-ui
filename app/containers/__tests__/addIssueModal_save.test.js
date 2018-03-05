import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import toJson from 'enzyme-to-json';
import sinon from 'sinon'

import * as api from '../../actions/api'
import {AddIssueModal} from '../addIssueModal'
import fullFormIssue from '../../__testUtils/dummyRecords/fullFormIssue'
import recordRegistry from '../../__testUtils/dummyRecords/recordRegistry'





jest.mock("../../actions/api")



const sandbox = sinon.createSandbox()
sandbox.stub(api, 'getItem')
sandbox.stub(api, 'submitItem')



const commonProps = {
  asyncGetPublications: sandbox.stub(),
  close: sandbox.stub()
}


function testSave (testName, {pubDoi, publicationJson, issueProp, mode}) {
  let component
  let instance
  let save

  const issueProps = {
    ...commonProps,
    publication: publicationJson,
    pubDoi: pubDoi,
    issue: issueProp,
    mode: mode
  }

  beforeEach(() => {
    sandbox.resetHistory()
    api.getItem.callsFake( id => Promise.resolve(recordRegistry[id.doi || JSON.stringify(id.title)].toJS()))

    component = mount(
      <AddIssueModal {...issueProps}/>
    )

    instance = component.instance()
  })

  test(testName, async () => {

    api.getItem.callsFake( id => {
      throw "Mock doi dupe check"
    })

    await instance.save()

    const savedJson = api.submitItem.args[0][0]
    delete savedJson.message.date
    delete savedJson.message.contains[0].date
    try {
      delete savedJson.message.contains[0].contains[0].date
    } catch (e){}

    expect(savedJson).toMatchSnapshot()
  })
}



describe('save', ()=>testSave('edit fullFormIssue', {
  pubDoi: fullFormIssue.publicationDoi,
  publicationJson: fullFormIssue.publicationJson.toJS(),
  issueProp: fullFormIssue.issueProp.toJS(),
  mode: 'edit'
}))