function myfunction(){
  var x= document.getElementsByClassName("wesr");
  if(x.style.display==="none")
  {
    x.style.display="block";
  } else{
    x.style.display="none";
  }
}

function clearfilter(){
  document.getElementById('state')="";
  document.getElementById('department')="";
  document.getElementById('year')="";
}

function filter(){
  var state= document.getElementById('state')
  var department= document.getElementById('department')
  var year = document.getElementById('year')

  var data={}
  if(state.value!=""){
    data.state= state.value
  }
  if(department.value!=""){
    data.department= department.value
  }
  if(year.value!=""){
    data.year= year.value
  }

  var url= new URLSearchParams(data).toString()
  console.log(url);
  location.href= "/connect?" + url
}

function setfilter(){
  let params={}
  window.location.search.slice(1).split('&').forEach(elm =>{
    if(elm==='')
      return
    let spl= elm.sprit('=')
    const d=decodeURIComponent
    params[d(spl[0])]= (spl.length >= 2? d(spl[1]): true)
  })

  var state= document.getElementById('state')
  var department= document.getElementById('department')
  var year = document.getElementById('year')

  console.log(params);

  if(params.year){
    year.value= params.year
  }
  if(params.state){
    state.value= params.state
  }
  if(params.department){
    department.value= params.department
  }

window.onload= setfilter()

}
