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
const didMount = sandbox.spy(AddIssueModal.prototype, 'componentDidMount')
const didUpdate = sandbox.spy(AddIssueModal.prototype, 'componentDidUpdate')
sandbox.stub(api, 'getItem')



const commonProps = {
  asyncGetPublications: sandbox.stub(),
  close: sandbox.stub()
}


function testLoad (testName, {pubDoi, publicationJson, issueProp, mode}) {
  let component

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
  })

  test(testName, () => {
    expect(didMount.callCount).toBe(1)
    expect(didUpdate.called).toBe(true)
    expect(toJson(component)).toMatchSnapshot()
  })
}



describe('load', ()=>testLoad('edit fullFormIssue', {
  pubDoi: fullFormIssue.publicationDoi,
  publicationJson: fullFormIssue.publicationJson.toJS(),
  issueProp: fullFormIssue.issueProp.toJS(),
  mode: 'edit'
}))