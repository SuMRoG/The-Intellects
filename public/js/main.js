function togglenav() {
  const nav2 = document.getElementsByClassName('nav2')[0]
  nav2.classList.toggle('hidden')
}

function toggletheme() {
  const checkbox = document.getElementById('bopis')
  const themeicon = document.getElementById('theme')
  if (checkbox.checked) {
    document.body.setAttribute('theme', 'dark');
    themeicon.classList.toggle('fa-sun')
    themeicon.classList.toggle('fa-moon')
  } else {
    document.body.setAttribute('theme', 'light');
    themeicon.classList.toggle('fa-sun')
    themeicon.classList.toggle('fa-moon')
  }
}
