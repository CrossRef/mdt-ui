import defaultArticle from './defaultArticle'
import fullFormArticle from './fullFormArticle'


export default {
  [defaultArticle.articleDoi]: defaultArticle.articleJson,
  [defaultArticle.publicationDoi]: defaultArticle.publicationJson,

  [fullFormArticle.articleDoi]: fullFormArticle.articleJson,
  [fullFormArticle.publicationDoi]: fullFormArticle.publicationJson

}
