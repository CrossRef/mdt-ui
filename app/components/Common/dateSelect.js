import React from 'react'
import is from 'prop-types'




DateSelect.propTypes = {
  handler: is.func.isRequired,
  name: is.string.isRequired,
  type: is.oneOf(['y', 'year', 'm', 'month', 'd', 'day']).isRequired,
  value: is.oneOfType([is.string, is.number]).isRequired,
  validation: is.bool,
  style: is.string,
  nodeRef: is.object,
  startYear: is.oneOfType([is.string, is.number])
}

export default function DateSelect ({
  handler,
  name,
  type,
  value,
  validation,
  style,
  nodeRef,
  startYear
}) {

  const currentYear = (new Date).getFullYear()

  let s = [<option key='-1' />], start = 0, end = 0
  if (type === 'y' || type === 'year') {
    start = Number(startYear) > currentYear ? Number(startYear) : currentYear
    end = 1980
  } else if (type === 'd' || type === 'day') {
    start = 1
    end = 31
  } else if (type === 'm' || type === 'month') {
    start = 1
    end = 12
  }

  if (type === 'y' || type === 'year') {
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
      className={'height32 datepickselects' + ((validation) ? ' fieldError': '' + style ? ` ${style}` : '')}
      name={name}
      onChange={handler}
      value={Number(value)}
      ref={nodeRef ? (node)=>nodeRef[name] = node : null}
    >
      {s}
    </select>
  )
}