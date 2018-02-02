import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import sinon from 'sinon'
import {Map} from 'immutable'

import * as api from '../../actions/api'
import {AddArticlePage} from '../addArticlePage'
import defaultArticle from '../../__testUtils/dummyRecords/defaultArticle'
import fullFormArticle from '../../__testUtils/dummyRecords/fullFormArticle'
import recordRegistry from '../../__testUtils/dummyRecords/recordRegistry'




jest.mock("../../actions/api")


const sandbox = sinon.createSandbox()
sandbox.stub(api, 'getItem')
sandbox.stub(api, 'submitItem')


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



function testSave (testName, {pubDoi, editArticleDoi, duplicateArticleDoi}) {
  let component
  let instance
  let save

  beforeEach(async () => {
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


    sandbox.resetHistory()
    api.getItem.callsFake( id => recordRegistry[id].toJS())

    component = mount(
      <AddArticlePage {...articleProps}/>
    )

    instance = component.instance()

  })

  test(testName, async () => {
    if(!editArticleDoi) {
      await component.setState({
        article: {...instance.state.article, title: 'test save', doi: '10.5555/jesttestsave'}
      })

      api.getItem.callsFake( id => {
        throw "Mock doi dupe check"
      })
    }

    await instance.save()

    const savedJson = api.submitItem.args[0][0]
    delete savedJson.message.contains[0].date
    expect(savedJson).toMatchSnapshot()
  })
}


describe('save', ()=>testSave('new article', {pubDoi: defaultArticle.publicationDoi}))

describe('save', ()=>testSave('duplicate defaultArticle', {pubDoi: defaultArticle.publicationDoi, duplicateArticleDoi: defaultArticle.articleDoi}))

describe('save', ()=>testSave('duplicate fullFormArticle', {pubDoi: fullFormArticle.publicationDoi, duplicateArticleDoi: fullFormArticle.articleDoi}))

describe('save', ()=>testSave('edit defaultArticle', {pubDoi: defaultArticle.publicationDoi, editArticleDoi: defaultArticle.articleDoi}))

describe('save', ()=>testSave('edit fullFormArticle', {pubDoi: fullFormArticle.publicationDoi, editArticleDoi: fullFormArticle.articleDoi}))