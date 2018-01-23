import React from 'react';

import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import toJson from 'enzyme-to-json';
import sinon from 'sinon'


import ActionBar from '../../../components/AddArticlePage/actionBar';
import renderer from 'react-test-renderer';



describe('test suite', () => {
  const didMount = sinon.spy(ActionBar.prototype, 'componentDidMount')
  const didReceiveProps = sinon.spy(ActionBar.prototype, 'componentWillReceiveProps')

  const component = shallow(
    <ActionBar/>
  )

  it('should mount', () => {
    expect(toJson(component)).toMatchSnapshot()
    expect(didMount.calledOnce).toBe(true)
    expect(didReceiveProps.calledOnce).toBe(false)
  })

  it('should update', () => {
    component.setProps({
      criticalErrors: {
        title: true,
        doi: true,
        invaliddoi: true,
        invalidDoiPrefix: true,
        freetolicense: true,
        dupedoi: true
      },
      saving: true
    })

    expect(toJson(component)).toMatchSnapshot()
    expect(didMount.calledTwice).toBe(false)
    expect(didReceiveProps.calledOnce).toBe(true)
  })

})