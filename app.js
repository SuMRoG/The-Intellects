const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const app = express();

//connect to database
const dbURI= 'mongodb+srv://blueedge:whatisthis@blogsiiest.xe0ag.mongodb.net/blogiiest?retryWrites=true&w=majority';
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((result) => app.listen(3004))
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

app.get('/add-blog', (req,res)=> {
  const blog = new Blog({
    title: 'dhfdfre',
    snippet: 'fdf fvdf efavv',
    body: 'hdfc ehwgqhf hegfqhb egfhefgef eggw',
    author: 'Rohan Gupta'
  });

  blog.save()
  .then((result) => {
    res.send(result)
  })
  .catch((err) =>{
    console.log(err);
  })
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
