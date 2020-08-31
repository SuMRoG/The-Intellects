function togglepost(ele) {
  // console.log("Called");
  var fullblogcontainer = document.getElementById('fullblogcontainer')
  var title = ele.innerText
  var author = ele.parentElement.children[0].innerText
  var datecreated = ele.parentElement.parentElement.parentElement.children[0].innerText
  var snippet = ele.parentElement.parentElement.children[1].children[0].innerText
  var body = ele.parentElement.parentElement.children[1].children[1].innerText

  document.querySelector("body > div.fullblogcontainer > div > header > div > div > h1").innerText = title;
  document.querySelector("body > div.fullblogcontainer > div > header > div > div > h2 > span > span > a").innerText = author
  document.querySelector("body > div.fullblogcontainer > div > header > div > div > h2 > span > span.blog-date").innerText = datecreated
  fetch("/user/getProfileImage/"+author).then(res=> res.json()).then(res=>{
    document.querySelector("#fullblog > header > div > a > img").src = "uploads/"+res.image;
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
