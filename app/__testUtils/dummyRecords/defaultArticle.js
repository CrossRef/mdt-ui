import {fromJS} from 'immutable'

export default {
  publicationDoi: "10.5555/defaultPub",
  articleDoi: "10.5555/defaultArticle",


  publicationJson: fromJS({
    "status": "ok",
    "message-type": "get",
    "message-version": "1.0.0",
    "message": {
      "doi": "10.5555/defaultPub",
      "owner-prefix": "10.5555",
      "type": "Publication",
      "title": {"title":"test new system 2"},
      "state": {},
      "date": "2018-01-17",
      "deposit-timestamp": "20180117154727430",
      "mdt-version": "0",
      "status": "accepted",
      "content": "<Journal xmlns=\"http://www.crossref.org/xschema/1.1\"><journal_metadata language=\"af\"><full_title>test new system 2</full_title><abbrev_title>arhaerh</abbrev_title><archive_locations><archive name=\"LOCKSS\"/></archive_locations><doi_data><doi>10.5555/13g14g14h12h2h24h2</doi><resource>http://afhaehaerhaerh.com</resource></doi_data></journal_metadata></Journal>",
      "contains": [
        {
          "doi": "10.5555/afvafbafgnafnafnafgn",
          "owner-prefix": "10.5555",
          "type": "article",
          "title": {"title":"test references"},
          "state": {},
          "date": "2018-01-17",
          "deposit-timestamp": "20180117154727430",
          "mdt-version": "1",
          "status": "draft",
          "content": "",
          "contains": [

          ]
        },
        {
          "doi": "10.5555/fbaefbadbnanana",
          "owner-prefix": "10.5555",
          "type": "article",
          "title": {"title":"test deposit timestamp"},
          "state": {},
          "date": "2018-01-17",
          "deposit-timestamp": "",
          "mdt-version": "1",
          "status": "failed",
          "content": "",
          "contains": [

          ]
        },
        {
          "doi": "10.5555/abaebaebaerbaerb",
          "owner-prefix": "10.5555",
          "type": "article",
          "title": {"title":"arahhaharh"},
          "state": {},
          "date": "2018-01-19",
          "deposit-timestamp": "",
          "mdt-version": "3",
          "status": "draft",
          "content": "",
          "contains": [

          ]
        },
        {
          "doi": "10.5555/aerhaerhaerhaerh",
          "owner-prefix": "10.5555",
          "type": "article",
          "title": {"title":"awerarehaerharh"},
          "state": {},
          "date": "2018-01-17",
          "deposit-timestamp": "",
          "mdt-version": "1",
          "status": "draft",
          "content": "",
          "contains": [

          ]
        },
        {
          "doi": "10.5555/defaultArticle",
          "owner-prefix": "10.5555",
          "type": "article",
          "title": {"title":"afhaerharhtaer"},
          "state": {},
          "date": "2018-01-23",
          "deposit-timestamp": "",
          "mdt-version": "1",
          "status": "draft",
          "content": "",
          "contains": [

          ]
        }
      ]
    }
  }),


  articleJson: fromJS({
    "status": "ok",
    "message-type": "get",
    "message-version": "1.0.0",
    "message": {
      "doi": "10.5555/defaultPub",
      "owner-prefix": "10.5555",
      "type": "Publication",
      "title": {"title":"test new system 2"},
      "state": {},
      "date": "2018-01-17",
      "deposit-timestamp": "20180117154727430",
      "mdt-version": "0",
      "status": "accepted",
      "contains": [
        {
          "doi": "10.5555/defaultArticle",
          "owner-prefix": "10.5555",
          "type": "article",
          "title": {"title":"afhaerharhtaer"},
          "state": {},
          "date": "2018-01-23",
          "deposit-timestamp": "",
          "mdt-version": "1",
          "status": "draft",
          "content": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><crossref xmlns=\"http://www.crossref.org/xschema/1.1\"><journal><journal_metadata language=\"af\"><full_title>test new system 2</full_title><abbrev_title>arhaerh</abbrev_title><archive_locations><archive name=\"LOCKSS\"/></archive_locations><doi_data><doi>10.5555/13g14g14h12h2h24h2</doi><resource>http://afhaehaerhaerh.com</resource></doi_data></journal_metadata><journal_article><titles><title>afhaerharhtaer</title></titles><doi_data><doi>10.5555/aefbtabangagnanatn</doi><resource>http://</resource></doi_data></journal_article></journal></crossref>",
          "contains": [

          ]
        }
      ]
    }
  })
}
