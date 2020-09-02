function changetab() {
  var bookfilters = document.getElementById('bookinputs')
  var quesfilters = document.getElementById('paperinputs')
  bookfilters.hidden = bookfilters.hidden ^ 1
  quesfilters.hidden = quesfilters.hidden ^ 1
}
