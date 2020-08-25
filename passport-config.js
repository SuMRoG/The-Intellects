const LocalStrategy= require('passport-local').Strategy
const bcrypt= require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateAccount = async (email,password,done)=>{
    const account= getUserByEmail(email)
    if(account==null){
      console.log("No user");
      return done(null,false,{message: 'No user with such email'})
    }
    try{
      if(await bcrypt.compare(password, account.password)) {
        return done(null,authenticateAccount)
      }else{
        console.log("Incorrect");
        return done(null, false,{ message: 'Password Incorrect'})
      }
    }catch(e){
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email'},authenticateAccount))
  passport.serializeUser((account,done)=> done(null, account.id))
  passport.deserializeUser((id,done)=> {
    return done( null, getUserById(id))
   })
}

module.exports = initialize
