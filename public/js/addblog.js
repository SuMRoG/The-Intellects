showdown.extension('codehighlight', function() {
  function htmlunencode(text) {
    return (
      text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
      );
  }
  return [
    {
      type: 'output',
      filter: function (text, converter, options) {
        var left  = '<pre><code\\b[^>]*>',
            right = '</code></pre>',
            flags = 'g',
            replacement = function (wholeMatch, match, left, right) {
              // unescape match to prevent double escaping
              match = htmlunencode(match);
              return left + hljs.highlightAuto(match).value + right;
            };
        return showdown.helper.replaceRecursiveRegExp(text, replacement, left, right, flags);
      }
    }
  ];
});
showdown.setFlavor('github')

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
      converter = new showdown.Converter({ extensions: ['codehighlight'] }),
      html = converter.makeHtml(text);

    target.innerHTML = html;
}

async function modify(imgurl) {
  return imgurl.split("").reverse().join("").replace("051","0821").split("").reverse().join("")
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

    url = "https://pixabay.com/api/?key=16584935-732689d72ee72861d5f1ced4c&per_page=200&image_type=photo&min_width=1000&q="+url.join("+")
    fetch(url).then(res=> res.json()).then(async function(res){
      var imgprev = document.getElementById("blogimagepreview")
      var i = Math.floor(Math.random()*res.hits.length)
      var imgurl = res.hits[i].previewURL;
      imgurl = await modify(imgurl)
      console.log(imgurl);
      imgprev.src = imgurl;
      document.getElementById('inputbanner').value = imgurl;
    }).catch(err=> console.log(err))
  }else{
    var imgprev = document.getElementById("blogimagepreview")
    imgprev.src = url;
    document.getElementById('inputbanner').value = url;
  }
}
