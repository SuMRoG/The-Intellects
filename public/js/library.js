var options = {
  "year": [0,0,0,0],
  "department": [0,0,0,0,0,0,0,0],
  "subject": [0,0,0,0,0,0,0,0]
}

function drive() {
  var year = document.getElementById('year')
  var department = document.getElementById('department')
  var subject = document.getElementById('subject')

  for (var child of year.children) {
    child.selected = options["year"][child.value-1]
  }

  for (var child of department.children) {
    child.selected = options["department"][child.value-1]
  }

  for (var child of subject.children) {
    child.selected = options["subject"][child.value-1]
  }
}

function toggleselect(ele) {
  options[ele.parentElement.id][ele.value-1]^=1;
  drive()
}
