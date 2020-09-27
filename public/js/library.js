var options = {
  "department": [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ]
}

function drive() {
  var department = document.getElementById('department')
  for (var i = 0; i < department.children.length; i++) {
    department.children[i].selected = options["department"][i]
  }
}

function toggleselect(i) {
  options["department"][i] ^= 1
  drive()
}

function clearfilter() {
  options["department"] = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ]
  drive()
  if (document.getElementById('type').value != "book") {
    changedtab()
  }
  document.getElementById('type').value = "book"
  document.getElementById('year').value = ""
  document.getElementById('sessionyear').value = ""
  document.getElementById('semester').value = ""
}

function changedtab() {
  var bookfilters = document.getElementById('bookfilters')
  var quesfilters = document.getElementById('quesfilters')
  var type = document.getElementById('type').value
  if (type != "ques") {
    bookfilters.hidden = false
    quesfilters.hidden = true
  } else {
    bookfilters.hidden = true
    quesfilters.hidden = false
  }
}

function filter() {
  var type = document.getElementById('type')
  var year = document.getElementById('year')
  var sessionyear = document.getElementById('sessionyear')
  var semester = document.getElementById('semester')
  var department = document.getElementById('department')

  var data = {}

  if (type.value == "ques") {
    if (sessionyear.value != "") {
      data.sessionyear = sessionyear.value
    }
    if (semester.value != "") {
      data.semester = semester.value
    }
  } else {
    if (year.value != "") {
      data.year = year.value
    }
  }

  if (department.selectedOptions.length) {
    data.department = []
    for (var option of department.selectedOptions) {
      data.department.push(option.value)
    }
  }

  if (type.value != "") {
    data.type = type.value
  }

  var url = new URLSearchParams(data).toString()

  location.href = "/library?" + url

}

function setfilter() {
  let params = {}
  window.location.search.slice(1).split('&').forEach(elm => {
    if (elm === '')
      return
    var spl = elm.split('=')
    const d = decodeURIComponent
    params[d(spl[0])] = (
      spl.length >= 2
      ? d(spl[1])
      : true)
  })

  var type = document.getElementById('type')
  var year = document.getElementById('year')
  var sessionyear = document.getElementById('sessionyear')
  var semester = document.getElementById('semester')
  var department = document.getElementById('department')

  if (params.type && params.type == "ques") {
    type.value = "ques"
    changedtab()
  } else if (params.type && params.type == "other") {
    type.value = "other"
  }

  if (params.year) {
    year.value = params.year
  }

  if (params.sessionyear) {
    sessionyear.value = params.sessionyear
  }

  if (params.semester) {
    semester.value = params.semester
  }

  if (params.department) {
    params.department = params.department.split(",")
    var i = 0
    for (var option of department.children) {
      if (params.department.includes(option.value)) {
        option.selected = true
        options["department"][i] = 1
      }
      i++
    }
  }

  var bookyear = document.getElementsByClassName('bookyear')
  for (var oneyear of bookyear) {
    if (oneyear.innerText == "1 year") {
      oneyear.innerText = "1st year"
    } else if (oneyear.innerText == "2 year") {
      oneyear.innerText = "2nd year"
    } else if (oneyear.innerText == "3 year") {
      oneyear.innerText = "3rd year"
    } else if (oneyear.innerText == "4 year") {
      oneyear.innerText = "4th year"
    } else {
      oneyear.innerText = "All year"
    }
  }

  var url = new URL(location.href);
  if (url.searchParams.get("page") == null) {
    url.searchParams.set("page", 1)
  }

  var books = document.getElementById('book-container')
  var papers = document.getElementById('paper-container')
  var btn = document.getElementById('more')

  if((books.children.length + papers.children.length)<url.searchParams.get("page")*12){
    btn.hidden = true;
  }
}

function loadmore() {
  var url = new URL(location.href);
  if (url.searchParams.get("page") == null) {
    url.searchParams.set("page", 1)
  }
  url.searchParams.set("page", parseInt(url.searchParams.get("page")) + 1)
  location.href = url.href
}

window.onload = setfilter
