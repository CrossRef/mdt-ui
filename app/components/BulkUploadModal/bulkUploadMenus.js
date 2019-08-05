import bulkUploadColumns from './bulkUploadColumns'
/*
* functional structure for the cascading menus in bulkupload column selections. 
* *NOTE* code is recursive and will show many levels, but there are parts that expect only 3 levels deep. (such as the mime type options generation)
* Ids are manually assigned with a scheme of sub items using a double digit with the 10s place being the parent id
* except for mime types, they're loaded from the valid list in bulkUploadColumns
* 'contentVersion' field is used to populate the mimetypes and isn't referenced by the menuing code
* 'options' denotes a submenu and contains a list of menu maps with  parentId,id, text and value
* kept the values the same as the csv upload for clarity, but since we use and XML generator
* the leading and trailing '<>' are stripped in code.
* 
*/
const menus= [
    {
        id: '0',
        text: 'DOI',
        value:'DOI'
    },
    {
        id: '1',
        text: 'SimilarityCheck full text URL', value:'<item crawler="iParadigms">'        
    },
    {
        id: '2',
        text: 'Funding',
        options: [
            {parentid: '2', id: '21', text: 'funder_name', value:'<funder_name>'},
            {parentid: '2', id: '22', text: 'funder_identifier',value:'<funder_identifier>' },
            {parentid: '2', id: '23', text: 'award_number',value:'<award_number>'}]
    },
    {
        id: '3',
        text: 'License TDM',
        contentVersion:'<resource content_version="tdm"',
        options: [
        {parentid: '3', id: '31', text: 'License URL', value:'<license_ref applies_to="tdm">'},
        {parentid: '3', id: '32', text: 'License start date',value:'<tdm_lic_start_date>'}//,
        //{parentid: '3', id: '33', text: 'Content URL',value:'<resource content_version="tdm">'},
        //{parentid: '3', id: '34', text: 'Content URL with MIME type',options:[]}]
        // TDM doesn't have resource or 
        ] 
    },
    {
      id:'4',
      text: 'License Version of record',
      contentVersion:'<resource content_version="vor"',
      options:[
      {parentid: '4', id: '41', text: 'License URL', value:'<license_ref applies_to="vor">'},
      {parentid: '4', id: '42', text: 'License start date',value:'<vor_lic_start_date>'},
      {parentid: '4', id: '43', text: 'Content URL',value:'<resource content_version="vor">'},
      {parentid: '4', id: '44', text: 'Content URL with MIME type',options:[]}]
    },
    {
        id:'5',
        text: 'License Accepted manuscript',
        contentVersion:'<resource content_version="am"',
        options:[
        {parentid: '5', id: '51', text: 'License URL', value:'<license_ref applies_to="am">'},
        {parentid: '5', id: '52', text: 'License start date',value:'<am_lic_start_date>'},
        {parentid: '5', id: '53', text: 'Content URL',value:'<resource content_version="am">'},
        {parentid: '5', id: '54', text: 'Content URL with MIME type',options:[]}]
      },

  ]

  const licenseRefFilter =(item)=>{
    return item.text.startsWith('License')    
  }
  // generate mimetype menu options only for 'License' type menus. 
  // looks for sub item (options) that contains within the text field 'MIME' 
  // appends all mimetypes as menu options
  const reducer = (acc,item,idx)=> {
    acc.filter(licenseRefFilter).forEach(element => {
      if (element.options){
        const mimeObj = element.options.find(menuItem=>menuItem.text.indexOf('MIME')>-1)
        if (mimeObj){
          mimeObj.options.push({'text':item,'id':''+mimeObj.id+idx,value:element.contentVersion+' mime_type="'+item+'">' , parentid:mimeObj.id})
        }
      }
    });
   return acc
}  
  
  
  


  export default (bulkUploadColumns.resource.mime_type.reduce(reducer,menus))
