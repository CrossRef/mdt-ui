import React from 'react'
import is from 'prop-types'

export default {
  '': ['','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28'],
  '01': ['','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
  '02': ['','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28'],
  '03': ['','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
  '04': ['','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'],
  '05': ['','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
  '06': ['','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'],
  '07': ['','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
  '08': ['','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
  '09': ['','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'],
  '10': ['','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
  '11': ['','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'],
  '12': ['','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
  months: ['', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
  years: yearOptionsFunc()
}

function yearOptionsFunc () {
  const optionsArray = [''];
  let i = '2017';
  while (i > 1980) {
    optionsArray.push(i);
    i--
  }
  return optionsArray
}


export function makeDateDropDown (handler, name, type, value, validation) {
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
      name={name}
      ref={name}
      onChange={handler}
      value={parseInt(value)}
    >
      {s}
    </select>
  )
}



MakeDateDropDown.propTypes = {
  handler: is.func.isRequired,
  name: is.string.isRequired,
  type: is.oneOf(['y', 'year', 'm', 'month', 'd', 'day']).isRequired,
  value: is.oneOfType([is.string, is.number]).isRequired,
  validation: is.bool,
  style: is.string
}

export function MakeDateDropDown ({handler, name, type, value, validation, style}) {
  var s = [<option key='-1'></option>], start = 0, end = 0
  if (type === 'y' || type === 'year') {
    start = 2017
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
      value={parseInt(value)}
    >
      {s}
    </select>
  )
}




export function validDate ( yearfield, monthfield, dayfield ){
  yearfield = parseInt(yearfield); monthfield = parseInt(monthfield); dayfield = parseInt(dayfield);
  if (!dayfield || !monthfield || !yearfield){
    return true;
  }
  // we have a year, month and day.
  const dayobj = new Date(yearfield, monthfield-1, dayfield)

  if ((dayobj.getMonth()+1 !== monthfield)||(dayobj.getDate() !== dayfield)||(dayobj.getFullYear() !== yearfield)) return false

  return true;
}