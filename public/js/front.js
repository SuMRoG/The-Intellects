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


function togglepost(ele) {
  // console.log("Called");
  var fullblogcontainer = document.getElementById('fullblogcontainer')
  var post = ele.parentElement.parentElement.parentElement

  var datecreated = post.children[0].innerText.trim()
  var title = post.children[1].children[0].children[1].innerText.trim()
  var author = post.children[1].children[0].children[0].innerText.trim()
  var snippet = post.children[1].children[1].children[0].innerText.trim()
  var body = post.children[1].children[1].children[1].innerText
  var imageurl = post.style.background.split("\"")[1]

  document.querySelector("body > div.fullblogcontainer > div > header > div > div > h1").innerText = title;
  document.querySelector("body > div.fullblogcontainer > div > header > div > div > h2 > span > span > a").innerText = author
  document.querySelector("body > div.fullblogcontainer > div > header > div > div > h2 > span > span.blog-date").innerText = datecreated
  document.querySelector("#fullblog > section:nth-child(2) > div > img").src = imageurl;
  fetch("/user/getProfileImage/"+author).then(res=> res.json()).then(res=>{
    document.querySelector("#fullblog > header > div > a > img").src = res.image;
  }).catch(err=> console.log(err))

  // const converter = new showdown.Converter();
  const converter = new showdown.Converter({ extensions: ['codehighlight'] });
  const html = converter.makeHtml(body);
  document.querySelector("#blogbody").innerHTML = html;
  fullblogcontainer.hidden = false;
  document.body.style.overflowY = "hidden";
}

function togglepostoff() {
  // console.log("Called off");
  var fullblogcontainer = document.getElementById('fullblogcontainer')
  fullblogcontainer.hidden = true;
  document.body.style.overflowY = "scroll";
}

window.addEventListener('click', function(e){
  var fullblogcontainer = document.getElementById('fullblogoverlay')
  if(e.target==fullblogcontainer){
    togglepostoff()
  }
});
