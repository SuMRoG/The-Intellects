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

const converter = new showdown.Converter({extensions: ['codehighlight']})

function togglepost(ele) {
  // console.log("Called");
  var fullblogcontainer = document.getElementById('fullblogcontainer')
  var post = ele.parentElement.parentElement.parentElement

  var datecreated = post.children[0].innerText.trim()
  var title = post.children[1].children[0].children[1].innerText.trim()
  var author = post.children[1].children[0].children[0].innerText.trim()
  var snippet = post.children[1].children[1].children[0].innerText.trim()
  var body = post.children[1].children[1].children[1].innerText
  var imageurl = post.style.background.split('"')[1]

  document.querySelector("#fullblogtitle").innerText = title;
  document.querySelector("#fullblogauthor").innerText = author
  document.querySelector("#fullblogdate").innerText = datecreated
  document.querySelector("#fullblogimage").src = imageurl;
  document.querySelector("#fullblogauthorimage").src = ele.dataset.authorimage;
  document.querySelector("#fullblogauthorprofile").href = ele.dataset.authorprofile;
  document.querySelector('#fullbloglink').href = "/blog?id=" + ele.dataset.postid;
  document.querySelector('#sharebutton').dataset.link = location.host + "/blog?id=" + ele.dataset.postid;

  var target = document.getElementById('blogbody')
  const html = converter.makeHtml(body.trim())
  target.innerHTML = html;
  fullblogcontainer.hidden = false;
  document.body.style.overflowY = "hidden";
}

function copylink(ele) {
  var input = document.createElement('textarea');
  input.innerHTML = ele.dataset.link;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  ele.children[0].classList.add("copied")
  setTimeout(()=>{
    ele.children[0].classList.remove("copied")
  },1000)
}

function togglepostoff() {
  // console.log("Called off");
  var fullblogcontainer = document.getElementById('fullblogcontainer')
  fullblogcontainer.hidden = true;
  document.body.style.overflowY = "scroll";
}

window.addEventListener('click', function(e) {
  var fullblogcontainer = document.getElementById('fullblogoverlay')
  if (e.target == fullblogcontainer) {
    togglepostoff()
  }
});
