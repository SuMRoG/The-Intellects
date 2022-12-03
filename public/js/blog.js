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

function fullblogpresent(){
  var body = document.querySelector('#rawblog').innerText;
  var target = document.getElementById('blogbody')
  const html = converter.makeHtml(body.trim())
  target.innerHTML = html;
}


function copylink(ele) {
  var input = document.createElement('textarea');
  input.innerHTML = location.href;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  ele.children[0].classList.add("copied")
  setTimeout(()=>{
    ele.children[0].classList.remove("copied")
  },800)
}

window.onload = fullblogpresent;
