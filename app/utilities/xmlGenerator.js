import { getContributor } from './getSubItems'

export const crossmarkXml = (form, crossmarkPrefix) => {

  function generateUpdate (card) {
    let array = [`<updates>`];
    for (var number in card) {
      const { type, DOI, day, month, year } = card[number];
      const date = `${year || ''}-${month || ''}-${day || ''}`;
      array.push(`<update${type ? `type="${type.toLowerCase().replace(/\s+/g, '_')}"`:''} ${year || month || day ? `date="${date}"`:''}>${DOI ? DOI:''}</update>`)
    }
    array.push(`</updates>`)
    return array.join('')
  }

  function generateOther (card) {
    let array = [];
    for (var number in card) {
      const { label, explanation, href } = card[number];
      array.push(`<assertion name="${(label || '').toLowerCase().replace(/\s+/g, '_')}" ${label ? `label="${label}"`:''} ${explanation ? `explanation="${explanation}"`:''} ${href ? `href="${href}"`:''} ${number ? `order="${number}"`:''}/>`)
    } return array.join('')
  }

  function generatePubHist (card) {
    let array = [];
    for (var number in card) {
      const { label, day, month, year } = card[number];
      const date = `${year || ''}-${month || ''}-${day || ''}`;
      array.push(`<assertion name="${(label || '').toLowerCase().replace(/\s+/g, '_')}" ${label ? `label="${label}"`:''} group_name="publication_history" group_label="Publication History" ${number ? `order="${number}"`:''}>${year || month || day ? date : ''}</assertion>`)
    } return array.join('')
  }

  function generatePeer (card) {
    let array = [];
    for (var number in card) {
      const { label, explanation, href } = card[number];
      array.push(`<assertion name="${(label || '').toLowerCase().replace(/\s+/g, '_')}" ${label ? `label="${label}"`:''} group_name="peer_review" group_label="Peer review" ${explanation ? `explanation="${explanation}"`:''} ${href ? `href="${href}"`:''} ${number ? `order="${number}"`:''}/>`)
    } return array.join('')
  }

  function generateSupp (card) {
    let array = [];
    for (var number in card) {
      const { explanation, href } = card[number];
      array.push(`<assertion name="supplementary_Material" label="Supplementary Material" ${explanation ? `explanation="${explanation}"`:''} ${href ? `href="${href}"`:''} ${number ? `order="${number}"`:''}/>`)
    } return array.join('')
  }

  function generateCopyright (card) {
    let array = [];
    for (var number in card) {
      const { label, explanation, href } = card[number];
      if(label === 'Copyright Statement')
        array.push(`<assertion name="copyright_statement" ${label ? `label="${label}"`:''} group_name="copyright_licensing" group_label="Copyright $amp; Licensing" ${explanation ? `explanation="${explanation}"`:''} ${href ? `href="${href}"`:''} ${number ? `order="${number}"`:''}/>`);
      if(label === 'Licensing Information')
        array.push(`<assertion name="licensing" ${label ? `label="${label}"`:''} group_name="copyright_licensing" group_label="Copyright $amp; Licensing" ${explanation ? `explanation="${explanation}"`:''} ${href ? `href="${href}"`:''} ${number ? `order="${number}"`:''} ${number ? `order="${number}"`:''}/>`);
    } return array.join('')
  }

  function generateClinical (card) {
    let array = [`<program xmlns="http://www.crossref.org/clinicaltrials.xsd">`];
    for (var number in card) {
      const { registry, trialNumber, type } = card[number];
      array.push(`<clinical-trial-number ${registry ? `registry="${registryDois[registry]}"`:''} ${type ? `type="${lowerCaseFirst(type).replace(/-/g, '')}"`:''}>${trialNumber ? trialNumber : ''}</clinical-trial-number>`)
    };
    array.push(`</program>`);
    return array.join('')
  }


  let data = {};
  for (var key in form) {
    if(!key.includes('_')) continue;
    const [ card, number, field ] = key.split('_');
    if(!data[card]) data[card] = {};
    if(!data[card][number]) data[card][number] = {};
    data[card][number][field] = form[key];
  }

  if(!Object.keys(data).length) return undefined;


  return [
    `<crossmark>`,
      `<crossmark_policy>${crossmarkPrefix}/something</crossmark_policy>`,

      `<crossmark_domains><crossmark_domain><domain>psychoceramics.labs.crossref.org</domain></crossmark_domain></crossmark_domains>`, //TEMPORARY, Crossref team said they will be removing this requirement

      data.update ? generateUpdate(data.update) : '',

      `<custom_metadata>`,

        data.other ? generateOther(data.other) : '',

        data.pubHist ? generatePubHist(data.pubHist) : '',

        data.peer ? generatePeer(data.peer) : '',

        data.supp ? generateSupp(data.supp) : '',

        data.copyright ? generateCopyright(data.copyright) : '',

        data.clinical ? generateClinical(data.clinical) : '',

      `</custom_metadata>`,
    `</crossmark>`
  ].join('')

}




export const journalArticleXml = (component, crossmark) => {
  const state = component.state;
  const article = state.article;
  const language = state.addInfo.language;
  const publicationType = state.addInfo.publicationType;

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

      article.onlineDateYear.length > 0 ? [
        `<publication_date media_type="online">`,
          `${article.onlineDateYear.length > 0 ? `<year>${article.onlineDateYear}</year>`:``}`,
          `${article.onlineDateMonth.length > 0 ? `<month>${article.onlineDateMonth}</month>`:``}`,
          `${article.onlineDateDay.length > 0 ? `<day>${article.onlineDateDay}</day>`:``}`,
        `</publication_date>`
      ].join('') : '',

      article.printDateYear.length > 0 ? [
        `<publication_date media_type="print">`,
          `${article.printDateYear.length > 0 ? `<year>${article.printDateYear}</year>`:``}`,
          `${article.printDateMonth.length > 0 ? `<month>${article.printDateMonth}</month>`:``}`,
          `${article.printDateDay.length > 0 ? `<day>${article.printDateDay}</day>`:``}`,
        `</publication_date>`
      ].join('') : '',

      `${(component.getPagesXML().length > 0) ? component.getPagesXML() : ``}`,

      `${(component.getPublisherItems().length > 0) ? component.getPublisherItems() : ``}`,

      `${(component.getFunderXML().length > 0) ? component.getFunderXML() : ``}`,

      `${(component.getLicenseXML().length > 0) ? component.getLicenseXML() : ``}`,

      `${(component.getRelatedItemsXML().length > 0) ? component.getRelatedItemsXML() : ``}`,

      state.addInfo.archiveLocation.trim().length > 0 ?
        `<archive_locations><archive name="${state.addInfo.archiveLocation}"/></archive_locations>` : '',

      crossmark ? crossmark : '',

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

export const getIssueXml = (issueObj) => {
    // the title
    const titles = issueObj.issue.issueTitle.trim().length > 0 ? `<titles><title>${issueObj.issue.issueTitle.trim()}</title></titles>` : ``

    // special numbering
    const specialNumbering = issueObj.issue.specialIssueNumber.trim().length > 0 ? `<special_numbering>${issueObj.issue.specialIssueNumber.trim()}</special_numbering>` : ``

    // special numbering
    const issue = issueObj.issue.issue.trim().length > 0 ? `<issue>${issueObj.issue.issue.trim()}</issue>` : ``

    // the online date
    var publicationOnlineDate = ''
    if (issueObj.issue.onlineDateYear.length > 0 || issueObj.issue.onlineDateDay.length > 0 || issueObj.issue.onlineDateMonth.length > 0) {
      publicationOnlineDate += (issueObj.issue.onlineDateYear.length > 0 ? `<year>${issueObj.issue.onlineDateYear}</year>` : ``)
      publicationOnlineDate += (issueObj.issue.onlineDateMonth.length > 0 ? `<month>${issueObj.issue.onlineDateMonth}</month>` : ``)
      publicationOnlineDate += (issueObj.issue.onlineDateDay.length > 0 ? `<day>${issueObj.issue.onlineDateDay}</day>` : ``)

      publicationOnlineDate = `<publication_date media_type="online">${publicationOnlineDate}</publication_date>`
    }

    // the print date
    var publicationPrintDate = ''
    if (issueObj.issue.printDateYear.length > 0 || issueObj.issue.printDateDay.length > 0 || issueObj.issue.printDateMonth.length > 0) {
      publicationPrintDate += (issueObj.issue.printDateYear.length > 0 ? `<year>${issueObj.issue.printDateYear}</year>` : ``)
      publicationPrintDate += (issueObj.issue.printDateMonth.length > 0 ? `<month>${issueObj.issue.printDateMonth}</month>` : ``)
      publicationPrintDate += (issueObj.issue.printDateDay.length > 0 ? `<day>${issueObj.issue.printDateDay}</day>` : ``)

      publicationPrintDate = `<publication_date media_type="print">${publicationPrintDate}</publication_date>`
    }

    //doi_data
    var doiData = ''
    if (issueObj.issue.issueDoi.trim().length > 0 || issueObj.issue.issueUrl.trim().length > 0 ) {
      doiData += (issueObj.issue.issueDoi.trim().length > 0 ? `<doi>${issueObj.issue.issueDoi}</doi>` : ``)
      doiData += (issueObj.issue.issueUrl.trim().length > 0 ? `<resource>${issueObj.issue.issueUrl}</resource>` : ``)
      doiData = `<doi_data>${doiData}</doi_data>`
    }

    // volume
    var volume = ''
    if ((issueObj.issue.volumeDoi ? issueObj.issue.volumeDoi : '').trim().length > 0 || (issueObj.issue.volumeUrl ? issueObj.issue.volumeUrl : '').trim().length > 0 || (issueObj.issue.volume ? issueObj.issue.volume : '').trim().length > 0) {
      volume += ((issueObj.issue.volume ? issueObj.issue.volume : '').trim().length > 0 ? `<volume>${issueObj.issue.volume}</volume>` : ``)

      var volumeDoiData = ''
      if ((issueObj.issue.volumeDoi ? issueObj.issue.volumeDoi : '').trim().length > 0 || (issueObj.issue.volumeUrl ? issueObj.issue.volumeUrl : '').trim().length > 0 ) {
        volumeDoiData += ((issueObj.issue.volumeDoi ? issueObj.issue.volumeDoi : '').trim().length > 0 ? `<doi>${issueObj.issue.volumeDoi}</doi>` : ``)
        volumeDoiData += ((issueObj.issue.volumeUrl ? issueObj.issue.volumeUrl : '').trim().length > 0 ? `<resource>${issueObj.issue.volumeUrl}</resource>` : ``)
        volumeDoiData = `<doi_data>${volumeDoiData}</doi_data>`
      }

      volume = `<journal_volume>${volume}${volumeDoiData}</journal_volume>`
    }

    // archive locations
    var archiveLocation = ''
    if (issueObj.issue.archiveLocation.trim().length > 0) {
      archiveLocation = `<archive_locations><archive name="${issueObj.issue.archiveLocation}"/></archive_locations>`
    }

    return `<?xml version="1.0" encoding="UTF-8"?><crossref xmlns="http://www.crossref.org/xschema/1.1"><journal_issue>${getContributor(issueObj.optionalIssueInfo)}${titles}${issue}${specialNumbering}${publicationOnlineDate}${publicationPrintDate}${volume}${archiveLocation}${doiData}</journal_issue></crossref>`
    //took out xsi:schemaLocation="http://www.crossref.org/xschema/1.1 http://doi.crossref.org/schemas/unixref1.1.xsd" per Mikes request
}



function lowerCaseFirst (string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}
