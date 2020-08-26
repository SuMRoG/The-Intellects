function gocode() {
  var goahead = document.getElementsByClassName('goahead')[0]
  var addblogform = document.getElementById('addblogform')
  var previewarea = document.getElementById('previewarea')
  var code = goahead.children[0]
  var preview = goahead.children[1]
  code.classList.add("checked")
  preview.classList.remove("checked")
  addblogform.hidden = false;
  previewarea.hidden = true;
}

function gopreview() {
  var goahead = document.getElementsByClassName('goahead')[0]
  var addblogform = document.getElementById('addblogform')
  var previewarea = document.getElementById('previewarea')
  var code = goahead.children[0]
  var preview = goahead.children[1]
  code.classList.remove("checked")
  preview.classList.add("checked")
  addblogform.hidden = true;
  previewarea.hidden = false;
}

function updatepreview(){
  var rows = document.getElementById('blogbodyinput').value.split("\n").length
  document.getElementById('blogbodyinput').rows = rows;
  var text = document.getElementById('blogbodyinput').value,
      target = document.getElementById('previewarea'),
      converter = new showdown.Converter(),
      html = converter.makeHtml(text);

    target.innerHTML = html;
}
