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
  converter = new showdown.Converter(),
  html = converter.makeHtml(body);
  document.querySelector("#blogbody").innerHTML = html;

  fullblogcontainer.hidden = false;
}

function togglepostoff() {
  // console.log("Called off");
  var fullblogcontainer = document.getElementById('fullblogcontainer')
  fullblogcontainer.hidden = true;
}

window.addEventListener('click', function(e){
  var fullblogcontainer = document.getElementById('fullblogoverlay')
  if(e.target==fullblogcontainer){
    togglepostoff()
  }
});
