

export function deParseCrossmark (data) {
  const reduxForm = {};
  const showCards = {}

  if(data.updates) {
    if(!Array.isArray(data.updates.update)) data.updates.update = [data.updates.update];

    showCards['Status Update'] = parseInt(data.updates.update.length);

    data.updates.update.forEach((update, index)=>{
      const cardNumber = `update_${index}`;
      for (var key in update) {
        const slicedKey = key.slice(1);
        if(slicedKey === 'date') {
          const [year, month, day] = update[key].split('-');
          reduxForm[`${cardNumber}_year`] = year;
          reduxForm[`${cardNumber}_month`] = month;
          reduxForm[`${cardNumber}_day`] = day;
        } else if (slicedKey ==='text') {
          reduxForm[`${cardNumber}_DOI`] = update[key];
        } else if (slicedKey ==='type')reduxForm[`${cardNumber}_${slicedKey}`] = upperCaseFirst(update[key])
      }
    });
  }

  if(data.custom_metadata && data.custom_metadata.assertion) {
    if(!Array.isArray(data.custom_metadata.assertion)) data.custom_metadata.assertion = [data.custom_metadata.assertion];

    data.custom_metadata.assertion.forEach((assertion)=>{


      if(assertion['-group_name'] === 'publication_history') {
        const cardNumber = `pubHist_${assertion['-order']}`;
        showCards['Publication History'] = parseInt(assertion['-order']) + 1;

        for (var key in assertion) {
          const slicedKey = key.slice(1);
          if(slicedKey === 'text') {
            const [year, month, day] = assertion[key].split('-');
            reduxForm[`${cardNumber}_year`] = year;
            reduxForm[`${cardNumber}_month`] = month;
            reduxForm[`${cardNumber}_day`] = day;
          } else reduxForm[`${cardNumber}_${slicedKey}`] = assertion[key];
        }
      }
      else if (assertion['-group_name'] === 'peer_review') {
        const cardNumber = `peer_${assertion['-order']}`;
        showCards['Peer Review'] = parseInt(assertion['-order']) + 1;

        for (var key in assertion) {
          reduxForm[`${cardNumber}_${key.slice(1)}`] = assertion[key];
        }
      }
      else if (assertion['-group_name'] === 'copyright_licensing') {
        const cardNumber = `copyright_${assertion['-order']}`;
        showCards['Copyright & Licensing'] = parseInt(assertion['-order']) + 1;

        for (var key in assertion) {
          reduxForm[`${cardNumber}_${key.slice(1)}`] = assertion[key];
        }
      }
      else if (assertion['-name'] === 'supplementary_Material') {
        const cardNumber = `supp_${assertion['-order']}`;
        showCards['Supplementary Material'] = parseInt(assertion['-order']) + 1;

        for (var key in assertion) {
          reduxForm[`${cardNumber}_${key.slice(1)}`] = assertion[key];
        }
      } else {
        const cardNumber = `other_${assertion['-order']}`;
        showCards['Other'] = parseInt(assertion['-order']) + 1;

        for (var key in assertion) {
          reduxForm[`${cardNumber}_${key.slice(1)}`] = assertion[key];
        }
      }
    })
  }

  if(data.custom_metadata && data.custom_metadata.program && data.custom_metadata.program['clinical-trial-number']) {
    if(!Array.isArray(data.custom_metadata.program['clinical-trial-number'])) data.custom_metadata.program['clinical-trial-number'] = [data.custom_metadata.program['clinical-trial-number']];

    showCards['Linked Clinical Trials'] = parseInt(data.custom_metadata.program['clinical-trial-number'].length);

    data.custom_metadata.program['clinical-trial-number'].forEach((clinical, index)=>{
      const cardNumber = `clinical_${index}`;
      for (var key in clinical) {
        const slicedKey = key.slice(1);
        if(slicedKey === 'text') {
          reduxForm[`${cardNumber}_trialNumber`] = clinical[key];
        }
        else if (slicedKey === 'registry') {
          reduxForm[`${cardNumber}_${slicedKey}`] = swappedRegistry[clinical[key]];
        }
        else if (slicedKey === 'type'){

          reduxForm[`${cardNumber}_${slicedKey}`] = relationships[clinical[key]]
        }
      }
    })
  }

  return {reduxForm, showCards}
}


export const registryDois = {
  'Uniform Trial Number': '10.18810/utn',
  'ClinicalTrials.gov': '10.18810/clinical-trials-gov',
  'ISRCTN.org': '10.18810/isrctn',
  'Australian New Zealand Clinical Trials Registry': '10.18810/anzctr',
  'German Clinical Trials Register': '10.18810/drks',
  'Chinese Clinical Trial Registry': '10.18810/chictr',
  'Brazilian Clinical Trials Registry': '10.18810/rebec',
  'Netherlands National Trial Register': '10.18810/dutch-trial-register',
  'Clinical Trials Registry India': '10.18810/clinical-trial-registry-india',
  'UMIN Japan': '10.18810/umin-japan',
  'Pan African Clinical Trial Registry': '10.18810/pactr',
  'Sri Lanka Clinical Trials Registry': '10.18810/slctr',
  'Japan Medical Association Clinical Trial Registry': '10.18810/jma',
  'Iranian Registry of Clinical Trials': '10.18810/irct',
  'Clinical Research Information Service, Republic of Korea': '10.18810/cris',
  'Cuban Public Registry of Clinical Trials': '10.18810/rpec',
  'EU Clinical Trials Register': '10.18810/euctr',
  'Japan Primary Registries Network': '10.18810/jprn',
  'Thai Clinical Trials Registry': '10.18810/tctr'
}

const swappedRegistry = swap(registryDois);

const relationships = {
  'preResults': 'Pre-Results',
  'results': 'Results',
  'postResults': 'Post-Results'
}

function swap(object){
  var ret = {};
  for(var key in object){
    ret[object[key]] = key;
  }
  return ret;
}

function upperCaseFirst (string) {
  return string.split('_').map((string)=>string.charAt(0).toUpperCase() + string.slice(1)).join(' ')
}