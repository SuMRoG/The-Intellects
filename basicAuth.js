function authUser(req,res,next){
  if(req.user==null)
  {
    res.redirect("/login")
  }
  next()
}
function notauthUser(req,res,next){
  if(req.user!=null)
  {
    res.redirect("/front")
  }
  next()
}
module.exports= {
  authUser,
  notauthUser
}
