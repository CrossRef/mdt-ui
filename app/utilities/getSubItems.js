import _ from 'lodash'

export const getSubItems = (items) => {
    return _.filter(items, (item) => {
        for(var key in item) { // checking all the properties of errors to see if there is a true
            if(item[key] && item[key] !== 'http://'){
                try {
                    if (item[key].trim().length > 0) {
                        return item
                    }
                } catch (e) {
                    if (item[key].length > 0) {
                        if(Array.isArray(item[key]) && item[key].length === 1 && item[key][0] === '') {
                          //do nothing, this covers the case of the funder grantNumbers array which has one empty string element by default
                        } else {
                          return item
                        }

                    }
                }
            }
        }
    })
}

