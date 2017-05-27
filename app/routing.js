import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from './containers/app'
import ArticlesPage from './containers/articlesPage'
import AddArticlesPage from './containers/addArticlesPage'
import LoginPage from './containers/loginPage'
import LoggedInPage from './containers/loggedIn'
import PublicationsPage from './containers/publicationsPage'
import PublicationPage from './containers/publicationPage'
import DepositCartPage from './containers/depositCartPage'
import DepositHistoryPage from './containers/depositHistoryPage'

export default (store) => {
  const requireAuth = (nextState, replace) => {
    //not necessary?
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
      <Route path='publications/:pubDoi/:issueDoi/addarticle' component={AddArticlesPage} onEnter={requireAuth} />
      <Route path='publications/:pubDoi/:issueDoi/addarticle/:articleDoi' component={AddArticlesPage} onEnter={requireAuth} />
      <Route path='cart' component={DepositCartPage} onEnter={requireAuth} />
      <Route path='deposit-history' component={DepositHistoryPage} onEnter={requireAuth} />
    </Route>
  )
}
