/* eslint-disable no-multiple-empty-lines,padded-blocks */
import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from './containers/app'
import AddArticlePage from './containers/addArticlePage'
import LoginPage from './containers/loginPage'
import PublicationsPage from './containers/publicationsPage'
import PublicationPage from './containers/publicationPage'
import DepositCartPage from './containers/depositCartPage'
import DepositHistoryPage from './containers/depositHistoryPage'



let base = `/${window.location.pathname.split('/')[1]}/`;
if(base === '//') base = '/';

export const routes = {
  base: base,
  images: base + 'assets/images',
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
      <Route path={routes.publications} component={PublicationsPage} />
      <Route path={routes.publicationsModal} component={PublicationsPage} />
      <Route path={routes.publication} component={PublicationPage} />
      <Route path={routes.addArticle} component={AddArticlePage} />
      <Route path={routes.editArticle} component={AddArticlePage} />
      <Route path={routes.addArticleUnderIssue} component={AddArticlePage} />
      <Route path={routes.editArticleUnderIssue} component={AddArticlePage} />
      <Route path={routes.depositCart} component={DepositCartPage} />
      <Route path={routes.depositHistory} component={DepositHistoryPage} />
    </Route>
  )
}



