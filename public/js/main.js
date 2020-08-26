function togglenav() {
  const nav2 = document.getElementsByClassName('nav2')[0]
  nav2.classList.toggle('hidden')
}

function settheme() {
  var checkbox = document.querySelector('input[id=bopis]')
  const currentTheme = localStorage.getItem("theme");
  const themeicon = document.getElementById('theme')
  if (currentTheme == "dark") {
    document.body.setAttribute('theme','dark');
    themeicon.setAttribute('class','far fa-moon');
    checkbox.checked = true;
  }else{
    document.body.setAttribute('theme','light');
    themeicon.setAttribute('class','far fa-sun');
    checkbox.checked = false;
  }
}

function toggletheme() {
  const checkbox = document.getElementById('bopis')
  const themeicon = document.getElementById('theme')
  if (checkbox.checked) {
    document.body.setAttribute('theme', 'dark');
    themeicon.classList.toggle('fa-sun')
    themeicon.classList.toggle('fa-moon')
    localStorage.setItem("theme", "dark");
  } else {
    document.body.setAttribute('theme', 'light');
    themeicon.classList.toggle('fa-sun')
    themeicon.classList.toggle('fa-moon')
    localStorage.setItem("theme", "light");
  }
}

// window.onload = settheme;
