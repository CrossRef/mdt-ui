/* eslint-disable no-multiple-empty-lines,padded-blocks */
import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from './containers/app'
import AddArticlesPage from './containers/addArticlesPage'
import LoginPage from './containers/loginPage'
import LoggedInPage from './containers/loggedIn'
import PublicationsPage from './containers/publicationsPage'
import PublicationPage from './containers/publicationPage'
import DepositCartPage from './containers/depositCartPage'
import DepositHistoryPage from './containers/depositHistoryPage'



let base = `/${document.baseURI.substr(document.baseURI.indexOf(window.location.host) + window.location.host.length).split('/')[1]}/`;
if(base === '//') base = '/';

export const routes = {
  base: base,
  images: base + 'images',
  loggedInPage: base + 'loggedin',
  publications: base + 'publications',
  publicationsModal: base + 'publications?modal=:doi',
  publication: base + 'publications/:doi',
  addArticle: base + 'publications/:pubDoi/addarticle',
  editArticle: base + 'publications/:pubDoi/addarticle/:articleDoi',
  addArticleUnderIssue: base + 'publications/:pubDoi/:issueDoi/addarticle',
  editArticleUnderIssue: base + 'publications/:pubDoi/:issueDoi/addarticle/:articleDoi',
  depositCart: base + 'cart',
  depositHistory: base + 'deposit-history'
};

export default () => {

  return (
    <Route path={routes.base} component={App}>
      <IndexRoute component={LoginPage} />
      <Route path={routes.loggedInPage} component={LoggedInPage} />
      <Route path={routes.publications} component={PublicationsPage} />
      <Route path={routes.publicationsModal} component={PublicationsPage} />
      <Route path={routes.publication} component={PublicationPage} />
      <Route path={routes.addArticle} component={AddArticlesPage} />
      <Route path={routes.editArticle} component={AddArticlesPage} />
      <Route path={routes.addArticleUnderIssue} component={AddArticlesPage} />
      <Route path={routes.editArticleUnderIssue} component={AddArticlesPage} />
      <Route path={routes.depositCart} component={DepositCartPage} />
      <Route path={routes.depositHistory} component={DepositHistoryPage} />
    </Route>
  )
}

// Is ArticlesPage doing anything? Remove?

