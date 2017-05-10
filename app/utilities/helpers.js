import React from 'react'


export function ClassWrapper ({classNames, children}) {
  const Reducer = () => classNames.reduceRight((previousValue, currentValue, index, array) => {
    if (index == array.length - 2) {

      const LastChild = Array.isArray(previousValue) ? (lastChildProps) => React.createElement(previousValue[0], {className: previousValue[1]}, lastChildProps.children)
        : (lastChildProps) => <div className={previousValue}>{lastChildProps.children}</div>

      const NextChild = Array.isArray(currentValue) ? (nextChildProps) => React.createElement(currentValue[0], {className: currentValue[1]}, nextChildProps.children)
        : (nextChildProps) => <div className={currentValue}>{nextChildProps.children}</div>

      return <NextChild><LastChild>{children}</LastChild></NextChild>

    } else {

      const ThisChild = Array.isArray(currentValue) ? (thisChildProps) => React.createElement(currentValue[0], {className: currentValue[1]}, thisChildProps.children)
        : (thisChildProps) => <div className={currentValue}>{thisChildProps.children}</div>

      return <ThisChild>{previousValue}</ThisChild>
    }
  });
  return <Reducer />
}