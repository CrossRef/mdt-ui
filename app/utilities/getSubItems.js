import _ from 'lodash'

export const getSubmitSubItems = (items) => {
    return _.filter(items, (item) => {
        for(var key in item) { // checking all the properties of errors to see if there is a true
            if(item[key]){
                try {
                    if (item[key].trim().length > 0) {
                        return item
                    }
                } catch (e) {
                    if (item[key].length > 0) {
                        return item
                    }
                }
            }
        }
    })
}

//get contributor
export const getContributor = (subitem) => {
    var contributors = getSubmitSubItems(subitem).map((contributor, i) => {
        // cause the type "ROLE" is shared name
        var attributes = [
            (contributor.firstName && (contributor.firstName.trim().length > 0)) ? `<given_name>${contributor.firstName.trim()}</given_name>` : undefined,
            (contributor.lastName && (contributor.lastName.trim().length > 0)) ? `<surname>${contributor.lastName.trim()}</surname>` : undefined,
            (contributor.suffix && (contributor.suffix.trim().length > 0)) ? `<suffix>${contributor.suffix.trim()}</suffix>` : undefined,
            (contributor.affiliation && (contributor.affiliation.trim().length > 0)) ? `<affiliation>${contributor.affiliation.trim()}</affiliation>` : undefined,
            (contributor.orcid && (contributor.orcid.trim().length > 0)) ? `<ORCID>${contributor.orcid.trim()}</ORCID>` : undefined,
            (contributor.alternativeName && (contributor.alternativeName.trim().length > 0)) ? `<alt-name>${contributor.alternativeName.trim()}</alt-name>` : undefined
        ]

        attributes = _.filter(attributes, (attribute) => { // filter all the undefined
        for(var key in attribute) { // checking all the properties of errors to see if there is a true
            if (attribute[key]) {
                return attribute
            }
        }
        })

        var person = `<person_name sequence="${(i===0) ? 'first' : 'additional'}" ${(contributor.role && contributor.role.trim()) ? `contributor_role="${contributor.role}"` : ''}>${attributes.join('')}</person_name>`

    return person
    })

    return contributors.length > 0 ? `<contributors>${contributors.join('')}</contributors>` : ``
}