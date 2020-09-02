var options = {
  "department": [0, 0, 0, 0, 0, 0, 0, 0]
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
  options["department"] = [0, 0, 0, 0, 0, 0, 0, 0]
  drive()
  if(document.getElementById('type').value!="book"){
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
  bookfilters.hidden = bookfilters.hidden ^ 1
  quesfilters.hidden = quesfilters.hidden ^ 1
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

  console.log(url)
  location.href = "/library?" + url

}

function setfilter() {
  console.log("What");
  let params = {}
  window.location.search.slice(1).split('&').forEach(elm => {
    if (elm === '') return
    let spl = elm.split('=')
    const d = decodeURIComponent
    params[d(spl[0])] = (spl.length >= 2 ? d(spl[1]) : true)
  })

  var type = document.getElementById('type')
  var year = document.getElementById('year')
  var sessionyear = document.getElementById('sessionyear')
  var semester = document.getElementById('semester')
  var department = document.getElementById('department')

  console.log(params);

  if(params.type && params.type=="ques"){
    type.value = "ques"
    changedtab()
  }

  if(params.year){
    year.value = params.year
  }

  if(params.sessionyear){
    sessionyear.value = params.sessionyear
  }

  if(params.semester){
    semester.value = params.semester
  }

  if(params.department){
    params.department = params.department.split(",")
    var i = 0
    for (var option of department.children) {
      if(params.department.includes(option.value)){
        option.selected = true
        options["department"][i] = 1
      }
      i++
    }
  }
}

window.onload = setfilter
