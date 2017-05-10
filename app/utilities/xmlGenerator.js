
export const journalArticleXml = (component) => {
  const state = component.state;
  const article = state.article;
  const language = state.addInfo.language;
  const publicationType = state.addInfo.publicationType;

  let archiveLocation = ``
  if (state.addInfo.archiveLocation.trim().length > 0) {
    archiveLocation = `<archive_locations><archive name="${state.addInfo.archiveLocation}"/></archive_locations>`
  }

  const array = [
    `<journal_article`,
      `${(language.length > 0) ? ` language="${language}"`:``}`,
      `${(publicationType.length > 0) ? ` publication_type="${publicationType}"`:``}`,
    `>`,

      `<titles>`,
        `${article.title.length > 0 ? `<title>` + article.title.trim() + `</title>` : ``}`,
        `${article.subtitle.length > 0 ? `<subtitle>` + article.subtitle.trim() + `</subtitle>` : ``}`,
        `${article.originallanguagetitle.length > 0 ? `<original_language_title>` + article.originallanguagetitle.trim() + `</original_language_title>` : ``}`,
        `${article.originallanguagetitlesubtitle.length > 0 ? `<subtitle>` + article.originallanguagetitlesubtitle.trim() + `</subtitle>` : ``}`,
      `</titles>`,

      `${component.getAcceptanceDateXML()}`,

      `${(component.getContributorXML().length > 0) ? component.getContributorXML() : ``}`,

      `${(article.abstract.trim().length > 0) ? `<jats:abstract xmlns:jats="http://www.ncbi.nlm.nih.gov/JATS1"><jats:p>${article.abstract.trim()}</jats:p></jats:abstract>` : ''}`,

      `<publication_date media_type="online">`,
        `${article.onlineDateYear.length > 0 ? `<year>${article.onlineDateYear}</year>`:``}`,
        `${article.onlineDateMonth.length > 0 ? `<month>${article.onlineDateMonth}</month>`:``}`,
        `${article.onlineDateDay.length > 0 ? `<day>${article.onlineDateDay}</day>`:``}`,
      `</publication_date>`,

      `<publication_date media_type="print">`,
        `${article.printDateYear.length > 0 ? `<year>${article.printDateYear}</year>`:``}`,
        `${article.printDateMonth.length > 0 ? `<month>${article.printDateMonth}</month>`:``}`,
        `${article.printDateDay.length > 0 ? `<day>${article.printDateDay}</day>`:``}`,
      `</publication_date>`,

      `${(component.getPagesXML().length > 0) ? component.getPagesXML() : ``}`,

      `${(component.getPublisherItems().length > 0) ? component.getPublisherItems() : ``}`,

      `${(component.getFunderXML().length > 0) ? component.getFunderXML() : ``}`,

      `${(component.getLicenseXML().length > 0) ? component.getLicenseXML() : ``}`,

      `${(component.getRelatedItemsXML().length > 0) ? component.getRelatedItemsXML() : ``}`,

      `${archiveLocation}`,

      `<doi_data>`,
        `<doi>${article.doi}</doi>`,
        `<resource>${article.url}</resource>`,
        `${(component.getCollectionXML().length > 0) ? component.getCollectionXML() : ``}`,
      `</doi_data>`,

    `</journal_article>`
  ];
  return array.join('')
}


export const publicationXml = (form) => {
  const xmlArray = [
    `<Journal xmlns="http://www.crossref.org/xschema/1.1">`,
      `<journal_metadata${form.language ? ` language=${form.language}` : '' }>`,
        `<full_title>${form.title}</full_title>`,
        form.abbreviation ? `<abbrev_title>${form.abbreviation}</abbrev_title>` : '',
        `<issn media_type="electronic">${form.electISSN}</issn>`,
        `<doi_data>`,
          `<doi>${form.DOI}</doi>`,
          `<resource>${form.url}</resource>`,
        `</doi_data>`,
      `</journal_metadata>`,
      form.archivelocation ? `<archive_locations><archive name=${form.archivelocation}/></archive_locations>` : ``,
    `</Journal>`
  ]
  return xmlArray.join('')
}