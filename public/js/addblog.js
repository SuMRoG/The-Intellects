function gocode() {
  var goahead = document.getElementsByClassName('goahead')[0]
  var addblogform = document.getElementById('addblogform')
  var previewarea = document.getElementById('previewcontainer')
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
  var previewarea = document.getElementById('previewcontainer')
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

function setbannerimage(ele){
  var url = ele.value.trim()
  if(!url.includes("http")){
    var temp = url.trim().split(" ")
    url = []
    for (var i = 0; i < temp.length; i++) {
      temp[i] = temp[i].trim()
      if(temp[i].length) url.push(temp[i])
    }

    url = "https://pixabay.com/api/?key=16584935-732689d72ee72861d5f1ced4c&per_page=10&image_type=photo&min_width=1000&q="+url.join("+")
    fetch(url).then(res=> res.json()).then(res=>{
      var imgprev = document.getElementById("blogimagepreview")
      var i = Math.floor(Math.random()*res.hits.length)
      imgprev.src = res.hits[i].webformatURL;
      document.getElementById('inputbanner').value = res.hits[i].webformatURL;
    }).catch(err=> console.log(err))
  }else{
    var imgprev = document.getElementById("blogimagepreview")
    imgprev.src = url;
    document.getElementById('inputbanner').value = url;
  }
}
