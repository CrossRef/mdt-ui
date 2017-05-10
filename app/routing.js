import React from 'react'
import { Route, IndexRoute } from 'react-router'
import client from './client'

import App from './containers/app'
import ArticlesPage from './containers/articlesPage'
import AddArticlesPage from './containers/addArticlesPage'
import LoginPage from './containers/loginPage'
import LoggedInPage from './containers/loggedIn'
import PublicationsPage from './containers/publicationsPage'
import PublicationPage from './containers/publicationPage'
import DepositCartPage from './containers/depositCartPage'

export default (store) => {
  const requireAuth = (nextState, replace) => {
    if (!client.isLoggedIn()) {
      console.log('Not logged in, kicking back to home page')
      replace({
        pathname: '/'
      })
    }
  }

  return (
    <Route path='/' component={App}>
      <IndexRoute component={LoginPage} />
      <Route path='loggedin' component={LoggedInPage} onEnter={requireAuth} />
      <Route path='publications' component={PublicationsPage} onEnter={requireAuth} />
      <Route path='publications?modal=:doi' component={PublicationsPage} onEnter={requireAuth} />
      <Route path='publications/:doi' component={PublicationPage} onEnter={requireAuth} />
      <Route path='articles' component={ArticlesPage} onEnter={requireAuth} />
      <Route path='publications/:pubDoi/addarticle' component={AddArticlesPage} onEnter={requireAuth} />
      <Route path='publications/:pubDoi/addarticle/:articleDoi' component={AddArticlesPage} onEnter={requireAuth} />
      <Route path='cart' component={DepositCartPage} onEnter={requireAuth} />
    </Route>
  )
}
