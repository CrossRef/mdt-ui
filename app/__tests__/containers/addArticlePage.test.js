import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import toJson from 'enzyme-to-json';
import sinon from 'sinon'


import {AddArticlePage} from '../../containers/addArticlePage'
import defaultArticle from '../../__testUtils/dummyRecords/defaultArticle'
import fullFormArticle from '../../__testUtils/dummyRecords/fullFormArticle'


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


function testArticle ({pubDoi, editArticleDoi, duplicateArticleDoi}) {
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
    didMount.reset()
    didUpdate.reset()

    component = shallow(
      <AddArticlePage {...articleProps}/>
    )
  })

  it('article loads', () => {
    expect(didMount.callCount).toBe(1)
    expect(didUpdate.called).toBe(true)
    expect(toJson(component)).toMatchSnapshot()
  })

}





describe('edit defaultArticle', ()=>testArticle({pubDoi: defaultArticle.publicationDoi, editArticleDoi: defaultArticle.articleDoi}))



describe('edit fullFormArticle', ()=>testArticle({pubDoi: fullFormArticle.publicationDoi, editArticleDoi: fullFormArticle.articleDoi}))



describe('duplicate article tests', ()=>testArticle({pubDoi: defaultArticle.publicationDoi, duplicateArticleDoi: defaultArticle.articleDoi}))



describe('new article tests', ()=>testArticle({pubDoi: defaultArticle.publicationDoi}))



describe('save defaultArticle', () => {
  let component
  const articleProps = {
    ...commonProps,
    routeParams: {pubDoi: defaultArticle.publicationDoi, articleDoi: defaultArticle.articleDoi},
    location: {}
  }

  beforeEach(() => {
    didMount.reset()
    didUpdate.reset()

    component = shallow(
      <AddArticlePage {...articleProps}/>
    )

    component.setState({})
  })

  it('save', () => {
    expect(didMount.callCount).toBe(1)
    expect(didUpdate.called).toBe(true)
    expect(toJson(component)).toMatchSnapshot()
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
