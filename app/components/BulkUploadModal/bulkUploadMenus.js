var menus=
    [
          {
              val: 0,
              label: 'DOI'
          },
          {
              val: 1,
              label: 'SimilarityCheck',
              items: [{parentVal: 1, val: 17, label: 'item crawler="iParadigms"'}, {parentVal: 1, val: 8, label: 'test item'}]
          },
          {
              val: 2,
              label: 'Funding',
              items: [{parentVal: 2, val: 21, label: 'funder_name'}, {parentVal: 2, val: 22, label: 'funder_identifier'},{parentVal: 2, val: 23, label: 'award_number'}]
          },
          {
              val: 3,
              label: 'License Free to read',
              items: [{parentVal: 3, val: 9, label: 'sub item 5'}, {parentVal: 3, val: 10, label: 'sub item 6'}]
          },
          {
            val:4, 
            label: 'License Version of record',
            items:[{parentVal: 4, val: 47, label: 'DOI'},
            {parentVal: 4, val: 41, label: 'License URL'},
            {parentVal: 4, val: 42, label: 'License start date'},
            {parentVal: 4, val: 43, label: 'Full text URL'},
            {parentVal: 4, val: 44, label: 'MIME type',items:[{parentVal:44, val:446, label:'Type \'text/html\''},{parentVal:44, val:447, label:'Type \'text/plain\''}]}]
          },
          {
              val: 5,
              label: 'License Accepted manuscript',
          },
        { 
            val: 6,
            label: 'License TDM'
        }
      ]
      module.exports=menus
