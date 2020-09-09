function changetab() {
  var bookfilters = document.getElementById('bookinputs')
  var quesfilters = document.getElementById('paperinputs')
  var type = document.getElementById('type').value
  if(type=="book"){
    bookfilters.hidden = false
    quesfilters.hidden = true
  }else{
    bookfilters.hidden = true
    quesfilters.hidden = false
  }
}
