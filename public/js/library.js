var options = {
  "department": [0,0,0,0,0,0,0,0]
}

function drive() {
  var department = document.getElementById('department')
  for (var i = 0; i < department.children.length; i++) {
    department.children[i].selected = options["department"][i]
  }
}

function toggleselect(i) {
  options["department"][i]^=1;
  drive()
}

function filter() {
  var year = document.getElementById('year')
  var type = document.getElementById('type')
  var department = document.getElementById('department')
  var data = {}
  if(year.value!=""){
    data.year=year.value
  }

  if(department.selectedOptions.length){
    data.department = []
    for (var option of department.selectedOptions) {
      data.department.push(option.value)
    }
  }

  if(type.value!=""){
    data.type=type.value
  }

  var url = new URLSearchParams(data).toString();
  location.href="/library?"+url;

}
