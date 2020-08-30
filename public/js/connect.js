var prevele = null;

function myfunction(ele) {
  if(window.screen.width<450){
    if(prevele){
      prevele.classList.toggle("summaryselected");
      var x = prevele.parentElement.children[1];
      x.classList.toggle("wesrselected");
    }
    prevele = ele;
  }
  ele.classList.toggle("summaryselected");
  var x = ele.parentElement.children[1];
  x.classList.toggle("wesrselected");
}
