import React, { Component } from 'react'
import { stateTrackerII } from 'my_decorators'
import {routes} from '../routing'


export default class Footer extends Component {
  render () {
    return (
      <div className='footer'>
        <div className='footer-contents'>
          <div className='address'>
            <div>Crossref 50 Salem</div>
            <div>St Lynnfield MA</div>
            <div>01940</div>
            <div>USA</div>
          </div>
          <div className='footer-links'>
            <a href='https://crossref.org/news/' target='_blank' title='News'>News</a><br />
            <a href='https://crossref.org/blog/' target='_blank' title='Blog'>Blog</a><br />
            <a href='https://crossref.org/labs/' target='_blank' title='Labs'>Labs</a><br />
            <a href='https://crossref.org/contact/' target='_blank' title='Contact'>Contact</a><br />
          </div>
          <div className='footer-links'>
            <a href='https://crossref.org/membership/' target='_blank' title='Become a member'>Join</a><br />
            <a href='https://crossref.org/faqs/' target='_blank' title='FAQs'>FAQs</a><br />
            <a href='https://crossref.org/dashboard/' target='_blank' title='Dashboard'>Dashboard</a><br />
            <a href='https://crossref.org/member-obligations/' target='_blank' title='Member obligations'>Member obligations</a><br />
          </div>
          <div className='footer-links'>
            <a href='https://crossref.org/truths/' target='_blank' title='Our truths'>Truths</a><br />
            <a href='https://crossref.org/annual-report/' target='_blank' title='Annual report'>Annual report</a><br />
            <a href='https://crossref.org/governance-committees/' target='_blank' title='Committees'>Committees</a><br />
            <a href='https://crossref.org/board-and-governance/' target='_blank' title='Governance'>Governance</a><br />
          </div>
        </div>
        <div className='footer-meta'>
          <div className='footer-meta-content flex'>
            <div className='text-left'>
              <img src={`${routes.images}/App/cc.svg`} />
              <img src={`${routes.images}/App/by.svg`} />
             The content of this site is licensed under a <a href='https://creativecommons.org/licenses/by/4.0/' target='_blank' title='Creative Commons'>Creative Commons Attribution 4.0 International License</a>
            </div>
            <div className='text-right'>
              <a target='_blank' href='https://www.crossref.org/privacy/'>Privacy</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
