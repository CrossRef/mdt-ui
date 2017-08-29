import $ from 'jquery'

export default function () {
  var firstError = $(".fieldError").first()
  if (firstError.length > 0) {
    $('.fullError').show()
    $('.fullError').find('.tooltips').css({
      'top': ((firstError.offset().top + (firstError.position().top - (firstError.position().top * .9)) - ($('.switchLicense').first().position().top + 15) - ($('.switchLicense').first().offset().top + 15))) + 25
    })
  } else {
    $('.fullError').hide()
  }
}
