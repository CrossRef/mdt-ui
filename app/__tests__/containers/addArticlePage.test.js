import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import toJson from 'enzyme-to-json';
import sinon from 'sinon'


import {AddArticlePage} from '../../containers/addArticlePage'
import defaultArticle from '../../testUtils/dummyRecords/defaultArticle'



jest.mock("../../actions/api")


const didMount = sinon.spy(AddArticlePage.prototype, 'componentDidMount')
const didUpdate = sinon.spy(AddArticlePage.prototype, 'componentDidUpdate')


const commonProps = {
  reduxControlModal: () => {},
  reduxEditForm: () => {},
  reduxClearForm: () => {},
  reduxDeleteCard: () => {},
  reduxCartUpdate: () => {},
  asyncGetPublications: () => {},
  reduxForm: {},
  reduxCart: [],
  showSection: {},
  crossmarkPrefixes: []
}



describe('edit article tests', () => {

  let component
  const editArticleProps = {
    ...commonProps,
    routeParams: {pubDoi: defaultArticle.publicationDoi, articleDoi: defaultArticle.articleDoi},
    location: {}
  }




  beforeEach(() => {
    didMount.reset()
    didUpdate.reset()

    component = mount(
      <AddArticlePage {...editArticleProps}/>
    )
  })

  it('edit article loads', () => {
    expect(didMount.callCount).toBe(1)
    const editUpdateCount = didUpdate.callCount
    expect(didUpdate.called).toBe(true)
    expect(toJson(component)).toMatchSnapshot()
  })
})



describe('duplicate article tests', () => {


  const duplicateArticleProps = {
    ...commonProps,
    routeParams: {pubDoi: defaultArticle.publicationDoi},
    location: {state: {duplicateFrom: defaultArticle.articleDoi}}
  }


  const component = mount(
    <AddArticlePage {...duplicateArticleProps}/>
  )


  it('duplicate article loads', () => {
    didMount.reset()
    didUpdate.reset()
    expect(didMount.callCount).toBe(1)
    expect(didUpdate.called).toBe(true)
    const duplicateUpdateCount = didUpdate.callCount
    expect(toJson(component)).toMatchSnapshot()
    debugger
  })

})



describe('new article tests', () => {

  const duplicateArticleProps = {
    ...commonProps,
    routeParams: {pubDoi: defaultArticle.publicationDoi},
    location: {}
  }


  const component = mount(
    <AddArticlePage {...duplicateArticleProps}/>
  )


  it('new article loads', () => {
    didMount.reset()
    didUpdate.reset()
    expect(didMount.callCount).toBe(1)
    const newUpdateCount = didUpdate.callCount
    expect(didUpdate.called).toBe(true)
    expect(toJson(component)).toMatchSnapshot()
    debugger
  })

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
