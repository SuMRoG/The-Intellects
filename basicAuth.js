function authUser(req, res, next) {
  if (req.session.user == null) {
    return res.redirect("/register")
  }
  next()
}

function notauthUser(req, res, next) {
  if (req.session.user != null) {
    res.redirect("/front")
  }
  next()
}
module.exports = {
  authUser,
  notauthUser
}
