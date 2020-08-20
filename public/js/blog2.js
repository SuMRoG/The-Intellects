function togglepost(ele) {
  var fullblog = document.getElementsByClassName('fullblogcontainer')[0]
  var title = ele.innerText
var author = ele.parentElement.children[0].innerText
  var datecreated = ele.parentElement.parentElement.parentElement.children[0].innerText
  var snippet = ele.parentElement.parentElement.children[1].children[0].innerText
  var body = ele.parentElement.parentElement.children[1].children[1].innerText

  document.querySelector("body > div.fullblogcontainer > div > header > div > div > h1").innerText = title;
  document.querySelector("body > div.fullblogcontainer > div > header > div > div > h2 > span > span > a").innerText = author
  document.querySelector("body > div.fullblogcontainer > div > header > div > div > h2 > span > span.blog-date").innerText = datecreated
  document.querySelector("body > div.fullblogcontainer > div > section:nth-child(3) > div").innerText = body

  fullblog.hidden = false;
}

function togglepostoff() {
  var fullblog = document.getElementsByClassName('fullblogcontainer')[0]
  fullblog.hidden = true;
}
