export default {
  publicationDoi: "10.5555/dummypublication",
  articleDoi: "10.5555/artundissdummydata",

  publicationJson: {

    "status": "ok",
    "message-type": "get",
    "message-version": "1.0.0",
    "message": {
    "doi": "10.5555/dummypublication",
      "owner-prefix": "10.5555",
      "type": "Publication",
      "title": {"title":"Test dummy data"},
    "state": {},
    "date": "2018-01-30",
      "deposit-timestamp": "",
      "mdt-version": "0",
      "status": "accepted",
      "content": "<Journal xmlns=\"http://www.crossref.org/xschema/1.1\"><journal_metadata><full_title>Test dummy data</full_title><doi_data><doi>10.5555/dummypublication</doi><resource>http://dummyurl.com</resource></doi_data></journal_metadata></Journal>",
      "contains": [
        {
          "doi": "",
          "owner-prefix": "10.5555",
          "type": "issue",
          "title": {"issue":"5","volume":"","title":""},
          "state": {},
          "date": "2018-01-30",
          "deposit-timestamp": "",
          "mdt-version": "1",
          "status": "draft",
          "content": "",
          "contains": [
            {
              "doi": "10.5555/artundissdummydata",
              "owner-prefix": "10.5555",
              "type": "article",
              "title": {"title":"Article Under Issue Dummy Data"},
              "state": {"archiveLocation":"LOCKSS","freetolicense":"yes"},
              "date": "2018-01-30",
              "deposit-timestamp": "",
              "mdt-version": "1",
              "status": "draft",
              "content": "",
              "contains": [

              ]
            }
          ]
        }
      ]
    }
  },

  articleJson: {
    "status": "ok",
    "message-type": "get",
    "message-version": "1.0.0",
    "message": {
      "doi": "10.5555/dummypublication",
      "owner-prefix": "10.5555",
      "type": "Publication",
      "title": {"title":"Test dummy data"},
      "state": {},
      "date": "2018-01-30",
      "deposit-timestamp": "",
      "mdt-version": "0",
      "status": "accepted",
      "contains": [
        {
          "doi": "",
          "owner-prefix": "10.5555",
          "type": "issue",
          "title": {"issue":"5","volume":"","title":""},
          "state": {},
          "date": "2018-01-30",
          "deposit-timestamp": "",
          "mdt-version": "1",
          "status": "draft",
          "contains": [
            {
              "doi": "10.5555/artundissdummydata",
              "owner-prefix": "10.5555",
              "type": "article",
              "title": {"title":"Article Under Issue Dummy Data"},
              "state": {"archiveLocation":"LOCKSS","freetolicense":"yes"},
              "date": "2018-01-30",
              "deposit-timestamp": "",
              "mdt-version": "1",
              "status": "draft",
              "content": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><crossref xmlns=\"http://www.crossref.org/xschema/1.1\"><journal><journal_metadata><full_title>Test dummy data</full_title><doi_data><doi>10.5555/dummypublication</doi><resource>http://dummyurl.com</resource></doi_data></journal_metadata><journal_article language=\"ab\"><titles><title>Article Under Issue Dummy Data</title></titles><contributors><person_name sequence=\"first\" contributor_role=\"chair\"><given_name>Bob</given_name><surname>Sagat</surname><suffix>Jr.</suffix><affiliation>Full House</affiliation><ORCID>10.5555/asdafaeh</ORCID></person_name><organization sequence=\"additional\" contributor_role=\"editor\">Awesome Group</organization></contributors><jats:abstract xmlns:jats=\"http://www.ncbi.nlm.nih.gov/JATS1\"><jats:p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae leo orci. Mauris tempus augue non mi porta sagittis. Etiam et aliquam sem. Sed ac neque auctor, aliquet lectus non, mattis dui. Praesent hendrerit sapien id arcu feugiat convallis. Cras nibh neque, luctus vel orci eget, faucibus vulputate purus. Ut vitae gravida arcu. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc posuere ante dui, at interdum tellus pretium vel. Etiam fermentum, ligula quis ullamcorper venenatis, nibh nisl tempor libero, quis laoreet nibh lectus sit amet massa. Donec gravida neque eget felis tempus, id congue urna efficitur. Cras ac luctus magna, a ornare lorem. Suspendisse potenti. Mauris efficitur ut sapien ac posuere. Aliquam auctor vitae sem eu laoreet. Praesent semper hendrerit neque, non accumsan sem blandit facilisis.\n\nDonec hendrerit elementum venenatis. Etiam vitae diam id enim egestas lobortis. Etiam eget condimentum lorem, rhoncus viverra enim. Cras elementum placerat massa non scelerisque. In porta dolor hendrerit, vestibulum orci vel, congue tellus. Maecenas egestas ac dolor sed mattis. Fusce iaculis aliquam velit, a lobortis tortor auctor vitae. Proin consequat a lectus et cursus. Vestibulum eget nisl venenatis, vulputate nunc id, maximus purus. Nam volutpat elit sed enim efficitur facilisis. Nulla facilisi. Sed vestibulum a est sed fermentum. Donec semper eget lectus fermentum tincidunt. Mauris eu orci id nulla pellentesque ornare nec id ligula. Duis vel erat posuere, ultricies metus nec, hendrerit lorem. Sed ac nibh magna.</jats:p></jats:abstract><publication_date media_type=\"online\"><month>12</month><day>21</day><year>2016</year></publication_date><publication_date media_type=\"print\"><month>1</month><day>5</day><year>2017</year></publication_date><pages><first_page>1</first_page><last_page>5</last_page></pages><publisher_item><item_number item_number_type=\"article_number\">3D9324F1-16B1-11D7- 8645000102C</item_number></publisher_item><fr:program xmlns:fr=\"http://www.crossref.org/fundref.xsd\"><fr:assertion name=\"fundgroup\"><fr:assertion name=\"funder_name\">Southern California Clinical and Translational Science Institute<fr:assertion name=\"funder_identifier\">http://dx.doi.org/10.13039/100009410</fr:assertion></fr:assertion><fr:assertion name=\"award_number\">12</fr:assertion><fr:assertion name=\"award_number\">5</fr:assertion></fr:assertion><fr:assertion name=\"fundgroup\"><fr:assertion name=\"funder_name\">University of Worcester<fr:assertion name=\"funder_identifier\">http://dx.doi.org/10.13039/100010022</fr:assertion></fr:assertion><fr:assertion name=\"award_number\">4</fr:assertion></fr:assertion></fr:program><ai:program name=\"AccessIndicators\" xmlns:ai=\"http://www.crossref.org/AccessIndicators.xsd\"><ai:free_to_read start_date=\"2016-02-20\"/><ai:license_ref applies_to=\"tdm\" start_date=\"2016-02-20\">http://adfhaerhaerh.com</ai:license_ref><ai:license_ref applies_to=\"vor\" start_date=\"2016-11-27\">http://aeraerhaerhaerh.com</ai:license_ref></ai:program><program name=\"relations\" xmlns=\"http://www.crossref.org/relations.xsd\"><related_item><description>aehraerh</description><inter_work_relation relationship-type=\"isCommentOn\" identifier-type=\"ISBN\">awerh</inter_work_relation></related_item><related_item><description>afhaerh</description><inter_work_relation relationship-type=\"isReviewOf\" identifier-type=\"DOI\">vadfbadfb</inter_work_relation></related_item></program><archive_locations><archive name=\"LOCKSS\"/></archive_locations><doi_data><doi>10.5555/artundissdummydata</doi><resource>http://aarwhaerh.com</resource><collection property=\"crawler-based\"><item crawler=\"iParadigms\"><resource>http://ararhareha.com</resource></item></collection></doi_data><citation_list><citation key=\"ref0\"><doi>10.1038/nrd2518</doi><unstructured_citation>Lagerstrom MC, Schioth HB. Structural diversity of G protein-coupled receptors and significance for drug discovery. Nat Rev Drug Discov. 2008;7(4):339\u201357. Epub 2008/04/03. pmid:18382464</unstructured_citation></citation><citation key=\"ref1\"><doi>10.1124/mol.63.6.1256</doi><unstructured_citation>Fredriksson R, Lagerstrom MC, Lundin LG, Schioth HB. The G-protein-coupled receptors in the human genome form five main families. Phylogenetic analysis, paralogon groups, and fingerprints. Mol Pharmacol. 2003;63(6):1256\u201372. pmid:12761335</unstructured_citation></citation><citation key=\"ref2\"><doi>10.1016/j.pharmthera.2013.11.004</doi><unstructured_citation>Foster SR, Roura E, Thomas WG. Extrasensory perception: odorant and taste receptors beyond the nose and mouth. Pharmacol Ther. 2014;142(1):41\u201361. pmid:24280065</unstructured_citation></citation><citation key=\"ref3\"><unstructured_citation>Thomas JH, Robertson HM. The Caenorhabditis chemoreceptor gene families. BMC Biol. 2008;6:42. pmid:18837995</unstructured_citation></citation><citation key=\"ref4\"><unstructured_citation>The-C.elegans-Sequencing-Consortium. Genome sequence of the nematode C. elegans: a platform for investigating biology. Science. 1998;282(5396):2012\u20138. pmid:9851916</unstructured_citation></citation></citation_list></journal_article></journal></crossref>",
              "contains": [

              ]
            }
          ]
        }
      ]
    }
  }
}