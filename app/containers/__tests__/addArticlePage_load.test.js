import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import toJson from 'enzyme-to-json';
import sinon from 'sinon'
import {Map} from 'immutable'

import * as api from '../../actions/api'
import {AddArticlePage} from '../addArticlePage'
import defaultArticle from '../../__testUtils/dummyRecords/defaultArticle'
import fullFormArticle from '../../__testUtils/dummyRecords/fullFormArticle'
import recordRegistry from '../../__testUtils/dummyRecords/recordRegistry'




jest.mock("../../actions/api")


const sandbox = sinon.createSandbox()
const didMount = sandbox.spy(AddArticlePage.prototype, 'componentDidMount')
const didUpdate = sandbox.spy(AddArticlePage.prototype, 'componentDidUpdate')
sandbox.stub(api, 'getItem')


const commonProps = {
  reduxControlModal: () => {},
  reduxEditForm: () => {},
  reduxClearForm: () => {},
  reduxDeleteCard: () => {},
  reduxCartUpdate: () => {},
  asyncGetPublications: () => {},
  reduxForm: new Map,
  reduxCart: [],
  showSection: {},
  crossmarkPrefixes: []
}



function testLoad (testName, {pubDoi, editArticleDoi, duplicateArticleDoi}) {
  let component

  const articleProps = {
    ...commonProps,
    routeParams: {pubDoi: pubDoi},
    location: {}
  }

  if(editArticleDoi) {
    articleProps.routeParams.articleDoi = editArticleDoi
  }

  if(duplicateArticleDoi) {
    articleProps.location = {state: {duplicateFrom: duplicateArticleDoi}}
  }

  beforeEach(() => {
    sandbox.resetHistory()
    api.getItem.callsFake( id => recordRegistry[id].toJS())

    component = mount(
      <AddArticlePage {...articleProps}/>
    )
  })

  test(testName, () => {
    expect(didMount.callCount).toBe(1)
    expect(didUpdate.called).toBe(true)
    expect(toJson(component)).toMatchSnapshot()
  })
}


describe('load', ()=>testLoad('edit defaultArticle', {pubDoi: defaultArticle.publicationDoi, editArticleDoi: defaultArticle.articleDoi}))

describe('load', ()=>testLoad('edit fullFormArticle', {pubDoi: fullFormArticle.publicationDoi, editArticleDoi: fullFormArticle.articleDoi}))

describe('load', ()=>testLoad('duplicate defaultArticle', {pubDoi: defaultArticle.publicationDoi, duplicateArticleDoi: defaultArticle.articleDoi}))

describe('load', ()=>testLoad('duplicate fullFormArticle', {pubDoi: fullFormArticle.publicationDoi, duplicateArticleDoi: fullFormArticle.articleDoi}))

describe('load', ()=>testLoad('new article', {pubDoi: defaultArticle.publicationDoi}))