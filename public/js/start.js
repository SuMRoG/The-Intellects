function slideit(i) {
  const slider = document.getElementsByClassName('slidebar')[0]
  const info = document.getElementsByClassName('info')[0]
  const a = [2, 34.8, 68.5]
  const infotext = [
    "Your very own platform for all feed and news about college",
    "All in one and consistent e-library for all your needs",
    "A better way to learn about your senior colleagues than meeting them in person :)"
  ]
  slider.style.left = a[i]+"%"
  info.innerHTML = infotext[i]
}

function myfunction2(){
  var x= document.getElementById('bar2');
  x.style.display="none";
  if(localStorage.getItem("closedSuggestion")==null){
    localStorage.setItem("closedSuggestion",2);
  }
  localStorage.setItem("closedSuggestion",localStorage.getItem("closedSuggestion")-1);
}
