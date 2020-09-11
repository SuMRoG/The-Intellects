function changetab() {
  var bookfilters = document.getElementById('bookinputs')
  var quesfilters = document.getElementById('paperinputs')
  var type = document.getElementById('type').value
  if(type=="ques"){
    bookfilters.hidden = true
    quesfilters.hidden = false
  }else{
    bookfilters.hidden = false
    quesfilters.hidden = true
  }
}
