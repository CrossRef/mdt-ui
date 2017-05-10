import React, { Component } from 'react'
import { stateTrackerII } from 'my_decorators'


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
            <a href='https://crossref.org/news/' title='News'>News</a><br />
            <a href='https://crossref.org/blog/' title='Blog'>Blog</a><br />
            <a href='https://crossref.org/labs/' title='Labs'>Labs</a><br />
            <a href='https://crossref.org/contact/' title='Contact'>Contact</a><br />
          </div>
          <div className='footer-links'>
            <a href='https://crossref.org/membership/' title='Become a member'>Join</a><br />
            <a href='https://crossref.org/faqs/' title='FAQs'>FAQs</a><br />
            <a href='https://crossref.org/dashboard/' title='Dashboard'>Dashboard</a><br />
            <a href='https://crossref.org/member-obligations/' title='Member obligations'>Member obligations</a><br />
          </div>
          <div className='footer-links'>
            <a href='https://crossref.org/truths/' title='Our truths'>Truths</a><br />
            <a href='https://crossref.org/annual-report/' title='Annual report'>Annual report</a><br />
            <a href='https://crossref.org/governance-committees/' title='Committees'>Committees</a><br />
            <a href='https://crossref.org/board-and-governance/' title='Governance'>Governance</a><br />
          </div>
        </div>
        <div className='footer-meta'>
          <div className='footer-meta-content flex'>
            <div className='text-left'>
              <img src='/images/App/cc.svg' />
              <img src='/images/App/by.svg' />
             The content of this site is licensed under a <a href='https://creativecommons.org/licenses/by/4.0/' title='Creative Commons'>Creative Commons Attribution 4.0 International License</a>
            </div>
            <div className='text-right'>
              <a href='https://www.crossref.org/privacy/'>Privacy</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
