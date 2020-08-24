const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const app = express();

//connect to database
const dbURI= 'mongodb+srv://blueedge:whatisthis@blogsiiest.xe0ag.mongodb.net/blogiiest?retryWrites=true&w=majority';
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((result) => app.listen(3000))
  .catch(err => console.log(err))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/add-blog', async (req,res)=> {
  res.render('/add-blog')
})

app.post('/front',async (req,res)=> {
    let blog = new Blog({
      title: req.body.title,
      snippet: req.body.snippet,
      body: req.body.body,
      author: req.body.author,
    });
  try{
    blog = await blog.save()
    res.redirect('/front/${blog.id}')
  }
  catch(e){
    res.render('/views/body1',{blog: blog})
  }
})

app.post('/register',async (req,res)=> {
  try{
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        let account= new Account({
          // id: date.now().toString(),
          name: req.body.name,
          username: req.body.username,
          gender: req.body.gender,
          email: req.body.email,
          password: hashedPassword
        });
          account = await account.save()
          res.redirect('/login')
  }catch{
    res.redirect('/register')
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
