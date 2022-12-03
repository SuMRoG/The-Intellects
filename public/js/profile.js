function allowEdit() {
  var cont1 = document.getElementById('editCont');
  var savebtn = document.getElementById('savename');
  var nameCont = document.getElementById('username');

  cont1.style.display = "none";
  savebtn.style.display = "block";
  nameCont.contentEditable = "true";
  nameCont.focus();
}

function saveName() {
  var savebtn = document.getElementById('savename');
  var nameIp = document.getElementById('nameInput');
  var nameCont = document.getElementById('username');

  nameIp.value = nameCont.innerText;
  savebtn.style.display = "none";
  nameCont.contentEditable = "false";
}
