showdown.extension('codehighlight', function() {
  function htmlunencode(text) {
    return (text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
  }
  return [
    {
      type: 'output',
      filter: function(text, converter, options) {
        var left = '<pre><code\\b[^>]*>',
          right = '</code></pre>',
          flags = 'g',
          replacement = function(wholeMatch, match, left, right) {
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
  addblogform.style.display = "block";
  previewarea.style.display = "none";
}

function gopreview() {
  var goahead = document.getElementsByClassName('goahead')[0]
  var addblogform = document.getElementById('addblogform')
  var previewarea = document.getElementById('previewcontainer')
  var code = goahead.children[0]
  var preview = goahead.children[1]
  code.classList.remove("checked")
  preview.classList.add("checked")
  addblogform.style.display = "none";
  previewarea.style.display = "flex";
}

function updatepreview() {
  var rows = document.getElementById('blogbodyinput').value.split("\n").length
  document.getElementById('blogbodyinput').rows = Math.max(8, rows);
  var text = document.getElementById('blogbodyinput').value,
    target = document.getElementById('previewarea'),
    converter = new showdown.Converter({extensions: ['codehighlight']}),
    html = converter.makeHtml(text);

  target.innerHTML = html;
}

function pixabay(url) {
  var query = url
  url = "https://pixabay.com/api/?key=16584935-732689d72ee72861d5f1ced4c&per_page=200&image_type=photo&min_width=1000&q=" + url.join("+")
  fetch(url).then(res => res.json()).then(function(res) {
    var imgprev = document.getElementById("blogimagepreview")
    var i = Math.floor(Math.random() * res.hits.length)
    var imgurl = res.hits[i].largeImageURL;
    console.log(imgurl);
    imgprev.src = imgurl;
    document.getElementById('inputbanner').value = imgurl;
  }).catch(err => {
    console.log(err)
  })
}

function pexels(url) {
  var page = 1
  if (0) {
    page = Math.floor(Math.random() * 20 + 1)
  }
  url = "https://api.pexels.com/v1/search?per_page=80&page=" + page + "&query=" + url.join("%20")
  fetch(url, {
    "method": "GET",
    "headers": {
      "Authorization": "563492ad6f917000010000013907bc8d6c2645b7a2cc156eb8765c51"
    }
  }).then(res => res.json()).then(res => {
    var imgprev = document.getElementById("blogimagepreview")
    var i = Math.floor(Math.random() * res.photos.length)
    var imgurl = res.photos[i].src.large;
    console.log(imgurl);
    imgprev.src = imgurl;
    document.getElementById('inputbanner').value = imgurl;
  }).catch(err => {
    console.log(err)
  })
}

function unsplash(url) {
  url = "https://source.unsplash.com/1600x900/?" + url.join(",")
  fetch(url).then(res => {
    var imgprev = document.getElementById("blogimagepreview")
    console.log(res.url);
    imgprev.src = res.url;
    document.getElementById('inputbanner').value = res.url;
  })
}

function imagur(url) {
  url = "https://api.imgur.com/3/gallery/search/?q=" + url.join(",")
  fetch(url, {
    "method": "GET",
    "headers": {
      "Authorization": "Client-ID 0c0a8f4a14c6223"
    }
  }).then(res => res.json()).then(res => {
    var imgprev = document.getElementById("blogimagepreview")
    var i = Math.floor(Math.random() * res.data.length)
    var j = Math.floor(Math.random() * res.data[i].images.length)
    var imgurl = res.data[i].images[j].link;
    console.log(imgurl);
    imgprev.src = imgurl;
    document.getElementById('inputbanner').value = imgurl;
  }).catch(err => {
    console.log(err);
  })
}

function setbannerimage() {
  var url = document.getElementById('pseudoimageinput').value.trim()
  if (!url.includes("http")) {
    document.getElementById('searchoptions').style.display = "block"
    var temp = url.trim().split(" ")
    url = []
    for (var i = 0; i < temp.length; i++) {
      temp[i] = temp[i].trim()
      if (temp[i].length)
        url.push(temp[i])
    }

    var val = document.getElementById('imageprovider').value
    if (val == 0) {
      pixabay(url)
    }
    if (val == 1) {
      pexels(url)
    }
    if (val == 2) {
      unsplash(url)
    }
    if (val == 3) {
      imagur(url)
    }

  } else {
    document.getElementById('searchoptions').style.display = "none"
    var imgprev = document.getElementById("blogimagepreview")
    imgprev.src = url;
    document.getElementById('inputbanner').value = url;
  }
}
