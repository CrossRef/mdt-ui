import {fromJS} from 'immutable'

export default {
  publicationDoi: "10.5555/dummypublication",
  issueDoi: "10.5555/fullformissue",

  publicationJson: fromJS({
    "status": "ok",
    "message-type": "get",
    "message-version": "1.0.0",
    "message": {
      "doi": "10.5555/dummypublication",
      "owner-prefix": "10.5555",
      "type": "Publication",
      "title": {
        "title": "Test dummy data"
      },
      "state": {},
      "date": "2018-01-31",
      "deposit-timestamp": "20180131104528685",
      "mdt-version": "0",
      "status": "accepted",
      "content": "<Journal xmlns=\"http://www.crossref.org/xschema/1.1\"><journal_metadata><full_title>Test dummy data</full_title><doi_data><doi>10.5555/dummypublication</doi><resource>http://dummyurl.com</resource></doi_data></journal_metadata></Journal>",
      "contains": [
        {
          "doi": "10.5555/fullformissue",
          "owner-prefix": "10.5555",
          "type": "issue",
          "title": {
            "issue": "1",
            "volume": "2",
            "title": "full form issue"
          },
          "state": {
            "archiveLocation": "Internet Archive"
          },
          "date": "2018-02-13",
          "deposit-timestamp": "",
          "mdt-version": "1",
          "status": "draft",
          "content": "",
          "contains": []
        },
        {
          "doi": "10.5555/babafbabfareb",
          "owner-prefix": "10.5555",
          "type": "article",
          "title": {
            "title": "arhaerhae"
          },
          "state": {
            "freetolicense": "yes"
          },
          "date": "2018-02-06",
          "deposit-timestamp": "",
          "mdt-version": "4",
          "status": "draft",
          "content": "",
          "contains": []
        },
        {
          "doi": "",
          "owner-prefix": "10.5555",
          "type": "issue",
          "title": {
            "issue": "5",
            "volume": "",
            "title": ""
          },
          "state": {},
          "date": "2018-01-31",
          "deposit-timestamp": "",
          "mdt-version": "2",
          "status": "draft",
          "content": "",
          "contains": [
            {
              "doi": "10.5555/artundissdummydata",
              "owner-prefix": "10.5555",
              "type": "article",
              "title": {
                "title": "Article Under Issue Dummy Data"
              },
              "state": {
                "archiveLocation": "LOCKSS",
                "freetolicense": "yes"
              },
              "date": "2018-02-05",
              "deposit-timestamp": "20180131104528685",
              "mdt-version": "2",
              "status": "draft",
              "content": "",
              "contains": []
            }
          ]
        }
      ]
    },
    "normalizedRecords": {
      "{\"issue\":\"5\",\"volume\":\"\",\"title\":\"\"}": {
        "doi": "",
        "owner-prefix": "10.5555",
        "type": "issue",
        "title": {
          "issue": "5",
          "volume": "",
          "title": ""
        },
        "state": {},
        "date": "2018-01-31",
        "deposit-timestamp": "",
        "mdt-version": "2",
        "status": "draft",
        "content": "",
        "contains": [
          {
            "doi": "10.5555/artundissdummydata",
            "owner-prefix": "10.5555",
            "type": "article",
            "title": {
              "title": "Article Under Issue Dummy Data"
            },
            "state": {
              "archiveLocation": "LOCKSS",
              "freetolicense": "yes"
            },
            "date": "2018-02-05",
            "deposit-timestamp": "20180131104528685",
            "mdt-version": "2",
            "status": "draft",
            "content": "",
            "contains": []
          }
        ]
      },
      "10.5555/babafbabfareb": {
        "doi": "10.5555/babafbabfareb",
        "owner-prefix": "10.5555",
        "type": "article",
        "title": {
          "title": "arhaerhae"
        },
        "state": {
          "freetolicense": "yes"
        },
        "date": "2018-02-06",
        "deposit-timestamp": "",
        "mdt-version": "4",
        "status": "draft",
        "content": "",
        "contains": []
      },
      "10.5555/fullformissue": {
        "doi": "10.5555/fullformissue",
        "owner-prefix": "10.5555",
        "type": "issue",
        "title": {
          "issue": "1",
          "volume": "2",
          "title": "full form issue"
        },
        "state": {
          "archiveLocation": "Internet Archive"
        },
        "date": "2018-02-13",
        "deposit-timestamp": "",
        "mdt-version": "1",
        "status": "draft",
        "content": "",
        "contains": []
      }
    }
  }),

  issueJson: fromJS({
    "status": "ok",
    "message-type": "get",
    "message-version": "1.0.0",
    "message": {
      "doi": "10.5555/dummypublication",
      "owner-prefix": "10.5555",
      "type": "Publication",
      "title": {"title":"Test dummy data"},
      "state": {},
      "date": "2018-01-31",
      "deposit-timestamp": "20180131104528685",
      "mdt-version": "0",
      "status": "accepted",
      "contains": [
        {
          "doi": "10.5555/fullformissue",
          "owner-prefix": "10.5555",
          "type": "issue",
          "title": {"issue":"1","volume":"2","title":"full form issue"},
          "state": {"archiveLocation":"Internet Archive"},
          "date": "2018-02-13",
          "deposit-timestamp": "",
          "mdt-version": "1",
          "status": "draft",
          "content": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><crossref xmlns=\"http://www.crossref.org/xschema/1.1\"><journal_issue><contributors><person_name sequence=\"first\" contributor_role=\"editor\"><given_name>Bob</given_name><surname>Sagat</surname><suffix>Jr.</suffix><affiliation>Full House</affiliation><ORCID>https://orcid.org/0000-0002-3843-3472</ORCID><alt-name>Jimmy</alt-name></person_name><person_name sequence=\"additional\" contributor_role=\"author\"><given_name>Billy</given_name><surname>Bob</surname><suffix>Sr.</suffix><affiliation>Alabama</affiliation><ORCID>https://orcid.org/0000-0002-3843-3472</ORCID><alt-name>Joe</alt-name></person_name></contributors><titles><title>full form issue</title></titles><publication_date media_type=\"online\"><month>5</month><day>4</day><year>2015</year></publication_date><publication_date media_type=\"print\"><month>3</month><day>5</day><year>2016</year></publication_date><journal_volume><volume>2</volume><doi_data><doi>10.5555/fullissueformvolume</doi><resource>http://fullissueformvolumeurl.com</resource></doi_data></journal_volume><issue>1</issue><special_numbering>124</special_numbering><archive_locations><archive name=\"Internet Archive\"/></archive_locations><doi_data><doi>10.5555/fullformissue</doi><resource>http://fullformissue.com</resource></doi_data></journal_issue></crossref>",
          "contains": [

          ]
        }
      ]
    }
  }),

  issueProp: fromJS({
    "doi": "10.5555/fullformissue",
    "owner-prefix": "10.5555",
    "type": "issue",
    "title": {
      "issue": "1",
      "volume": "2",
      "title": "full form issue"
    },
    "state": {
      "archiveLocation": "Internet Archive"
    },
    "date": "2018-02-13",
    "deposit-timestamp": "",
    "mdt-version": "1",
    "status": "draft",
    "content": "",
    "contains": []
  })
}