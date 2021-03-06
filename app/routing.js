import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from './containers/app'
import AddArticlePage from './containers/addArticlePage'
import LoginPage from './containers/loginPage'
import PublicationsPage from './containers/publicationsPage'
import PublicationPage from './containers/publicationPage'
import DepositCartPage from './containers/depositCartPage'
import DepositHistoryPage from './containers/depositHistoryPage'
import { controlModal } from './actions/application'



let base = `/${window.location.pathname.split('/')[1]}/`;
if(base === '//') base = '/';

export const routes = {
  base: base,
  images: base + 'assets/images',
  publications: base + 'publications',
  publicationsModal: base + 'publications?modal=:issueId',
  publication: base + 'publications/:pubDoi',
  addArticle: base + 'publications/:pubDoi/addarticle',
  editArticle: base + 'publications/:pubDoi/addarticle/:articleDoi',
  addArticleUnderIssue: base + 'publications/:pubDoi/:issueId/addarticle',
  editArticleUnderIssue: base + 'publications/:pubDoi/:issueId/addarticle/:articleDoi',
  depositCart: base + 'cart',
  depositHistory: base + 'deposit-history'
};



export default (store) => {

  const resetPage = () => {
    store.dispatch(controlModal({ showModal: false }))
    window.scrollTo(0, 0)
  }

  return (
    <Route path={routes.base} component={App}>
      <IndexRoute component={LoginPage} onEnter={resetPage}/>
      <Route path={routes.publications} component={PublicationsPage} onEnter={resetPage} />
      <Route path={routes.publicationsModal} component={PublicationsPage} onEnter={resetPage} />
      <Route path={routes.publication} component={PublicationPage} onEnter={resetPage} />
      <Route path={routes.addArticle} component={AddArticlePage} onEnter={resetPage} />
      <Route path={routes.editArticle} component={AddArticlePage} onEnter={resetPage} />
      <Route path={routes.addArticleUnderIssue} component={AddArticlePage} onEnter={resetPage} />
      <Route path={routes.editArticleUnderIssue} component={AddArticlePage} onEnter={resetPage} />
      <Route path={routes.depositCart} component={DepositCartPage} onEnter={resetPage} />
      <Route path={routes.depositHistory} component={DepositHistoryPage} onEnter={resetPage} />
    </Route>
  )
}



