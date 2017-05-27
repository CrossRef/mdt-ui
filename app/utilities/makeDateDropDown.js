import React from 'react'

const makeDateDropDown = (handler, ref, type, preset, validation, index, item) => {
    var s = [<option key='-1'></option>], start = 0, end = 0
    if (type === 'y') {
        start = 2017
        end = 1980
    } else if (type === 'd') {
        start = 1
        end = 31
    } else if (type === 'm') {
        start = 1
        end = 12
    }

    if (type === 'y') {
        for(var i = start; i >= end; i--){
            s.push(<option key={i} value={i}>{i}</option>)
        }
    } else {
        for(var i = start; i <= end; i++){
            s.push(<option key={i} value={i}>{i}</option>)
        }
    }

    return (
        <select
            className={'height32 datepickselects' + ((validation) ? ' fieldError': '')}
            name={ref}
            value={preset}
            onChange={(event) => handler(event)}
        >
        {s}
        </select>
    )
}

export default makeDateDropDown