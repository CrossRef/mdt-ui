import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import toJson from 'enzyme-to-json';
import sinon from 'sinon'


import {AddArticlePage} from '../../containers/addArticlePage'
import defaultArticle from '../../testUtils/dummyRecords/defaultArticle'



jest.mock("../../actions/api")


describe('test suite', () => {
  const didMount = sinon.spy(AddArticlePage.prototype, 'componentDidMount')
  const didUpdate = sinon.spy(AddArticlePage.prototype, 'componentDidUpdate')



  const editArticleProps = {
    routeParams: {pubDoi: defaultArticle.publicationDoi, articleDoi: defaultArticle.articleDoi},
    location: {},
    crossmarkPrefixes: [],
  }

  const duplicateArticleProps = {
    routeParams: {pubDoi: defaultArticle.publicationDoi},
    location: {state: {duplicateFrom: defaultArticle.articleDoi}},
    crossmarkPrefixes: [],
  }

  const component = mount(
    <AddArticlePage {...editArticleProps}/>
  )

  it('should mount and load article', () => {
    expect(toJson(component)).toMatchSnapshot()
    expect(didMount.calledOnce).toBe(true)
    expect(didUpdate.called).toBe(true)
  })










  // it('should update', () => {
  //   component.setProps({
  //     criticalErrors: {
  //       title: true,
  //       doi: true,
  //       invaliddoi: true,
  //       invalidDoiPrefix: true,
  //       freetolicense: true,
  //       dupedoi: true
  //     },
  //     saving: true
  //   })
  //
  //   expect(toJson(component)).toMatchSnapshot()
  //   expect(didMount.calledTwice).toBe(false)
  //   expect(didReceiveProps.calledOnce).toBe(true)
  // })

})