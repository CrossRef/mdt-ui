/*
* structure of acceptible fields in bulk upload. 
* object structure relates to field breakdown. 
* root nodes are valid tags,
* any sub objects contain the tag attribute name as key and a list of valid values
*/
export default {
    doi:true,
    funder_name:true,
    item:{crawler:['iParadigms']},
    funder_identifier:true,
    award_number:true,
    license_ref:{
        applies_to:['am','vor','tdm']
    },
    vor_lic_start_date:true,
    am_lic_start_date:true,
    tdm_lic_start_date:true,
    resource :{
        content_version:['am','vor','tdm'],
        mime_type:["text/plain", "text/richtext", "text/enriched", "text/tab-separated-values", "text/html", "text/sgml", "text/css", "text/xml", "text/xml-external-parsed-entity",
        "multipart/mixed", "multipart/alternative", "multipart/digest", "multipart/parallel", "multipart/appledouble", "multipart/header-set", "multipart/form-data", "multipart/report",
        "multipart/voice-message", "multipart/signed", "multipart/encrypted", "multipart/byteranges", "application/eps", "application/epub+zip", "application/octet-stream", "application/postscript",
        "application/rtf", "application/applefile", "application/mac-binhex40", "application/wordperfect5.1", "application/pdf", "application/x-gzip", "application/zip", "application/gzip",
        "application/macwriteii", "application/msword", "application/sgml", "application/cals-1840", "application/pgp-encrypted", "application/pgp-signature", "application/pgp-keys",
        "application/sgml-open-catalog", "application/rc", "application/xml", "application/xml-external-parsed-entity", "application/xml-dtd", "application/batch-SMTP", "application/ipp",
        "application/ocsp-request", "application/ocsp-response", "application/vnd.oasis.opendocument.text", "application/vnd.oasis.opendocument.presentation", "application/vnd.oasis.opendocument.spreadsheet",
        "application/vnd.ms-excel", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/epub+zip", "image/fits", "image/jpeg", "image/gif", "image/ief", "image/g3fax", "image/tiff", "image/graphics-metafile",
        "image/png", "audio/basic", "audio/32kadpcm", "audio/mpeg", "audio/parityfec", "audio/mp4a-latm", "audio/mpa-robust", "video/x-ms-wmv", "video/avi", "video/mpeg", "video/quicktime", "video/pointer",
        "video/parityfec", "video/mp4v-es", "video/mp4", "chemical/x-alchemy", "chemical/x-cache-csf", "chemical/x-cactvs-binary", "chemical/x-cactvs-binary", "chemical/x-cactvs-binary", "chemical/x-cdx",
        "chemical/x-cerius", "chemical/x-chemdraw", "chemical/x-cif", "chemical/x-mmcif", "chemical/x-chem3d", "chemical/x-cmdf", "chemical/x-compass", "chemical/x-crossfire", "chemical/x-cml", "chemical/x-csml",
        "chemical/x-ctx", "chemical/x-cxf", "chemical/x-daylight-smiles", "chemical/x-embl-dl-nucleotide", "chemical/x-galactic-spc", "Data/spcvue.htm", "chemical/x-gamess-input", "chemical/x-gaussian-input",
        "chemical/x-gaussian-checkpoint", "chemical/x-gaussian-cube", "chemical/x-gcg8-sequence", "chemical/x-genbank", "chemical/x-isostar", "chemical/x-jcamp-dx", "chemical/x-kinemage", "chemical/x-macmolecule",
        "chemical/x-macromodel-input", "chemical/x-mdl-molfile", "chemical/x-mdl-rdfile", "chemical/x-mdl-rxnfile", "chemical/x-mdl-sdfile", "chemical/x-mdl-tgf", "chemical/x-mif", "chemical/x-mol2", "chemical/x-molconn-Z",
        "chemical/x-mopac-input", "chemical/x-mopac-graph", "chemical/x-ncbi-asn1", "chemical/x-ncbi-asn1-binary", "chemical/x-pdb", "chemical/x-swissprot", "chemical/x-vamas-iso14976", "chemical/x-vmd", "chemical/x-xtel",
        "chemical/x-xyz", "model/vrml", "audio/x-wav", "video/x-flv"].sort(function (a, b) {            
            if(a.toLowerCase() < b.toLowerCase()) return -1
            if(a.toLowerCase() > b.toLowerCase()) return 1
            return 0
          })

    }
    
}