var prevele = null;

function myfunction(ele) {
  if (window.screen.width < 450) {
    if (prevele) {
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

function clearfilter() {
  document.getElementById('state').value = "";
  document.getElementById('department').value = "";
  document.getElementById('year').value = "";
}

function filter() {
  var state = document.getElementById('state')
  var department = document.getElementById('department')
  var year = document.getElementById('year')

  var data = {}
  if (state.value != "") {
    data.state = state.value
  }
  if (department.value != "") {
    data.department = department.value
  }
  if (year.value != "") {
    data.year = year.value
  }

  var url = new URLSearchParams(data).toString()
  console.log(url);
  location.href = "/connect?" + url
}

function setfilter() {
  let params = {}
  window.location.search.slice(1).split('&').forEach(elm => {
    if (elm === '') return
    var spl = elm.split('=')
    const d = decodeURIComponent
    params[d(spl[0])] = (spl.length >= 2 ? d(spl[1]) : true)
  })

  var state = document.getElementById('state')
  var department = document.getElementById('department')
  var year = document.getElementById('year')

  if (params.year) {
    year.value = params.year
  }
  if (params.state) {
    state.value = params.state
  }
  if (params.department) {
    department.value = params.department
  }
}

window.onload = setfilter
