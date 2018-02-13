import defaultArticle from './defaultArticle'
import fullFormArticle from './fullFormArticle'
import fullFormIssue from './fullFormIssue'


export default {
  [defaultArticle.articleDoi]: defaultArticle.articleJson,
  [defaultArticle.publicationDoi]: defaultArticle.publicationJson,

  [fullFormArticle.articleDoi]: fullFormArticle.articleJson,
  [fullFormArticle.publicationDoi]: fullFormArticle.publicationJson,

  [fullFormIssue.issueDoi]: fullFormIssue.issueJson,
  [fullFormIssue.publicationDoi]: fullFormIssue.publicationJson

}
