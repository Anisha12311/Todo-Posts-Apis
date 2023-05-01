
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require("dotenv");
const {UserSignup,SignIn,EditUserByAdmin} = require("./controllers/user.ts")
const {auth,isAdmin} = require('./middleware/authorize.ts')
const {createTodo,getTodos,updateTodo,deleteTodo,markTodoAsComplete} = require('./controllers/todo.ts')
const {createPosts,getPosts,createComment} = require("./controllers/post.ts")
const port = 4000;
const session = require("express-session")
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(
  session({
    secret: process.env.SECRET_KEY|| 'HYURTSCT543FGTWESZ',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }))

//Routers

app.post('/user', UserSignup) 
app.post('/login',SignIn)
app.put('/user/:id',auth,isAdmin,EditUserByAdmin)
app.post('/todo',auth,createTodo)
app.get('/todo',auth,getTodos)
app.post('/updateTodo/:id',auth,updateTodo)
app.delete('/deleteTodo/:id',auth,deleteTodo)
app.post('/markascompleteTodo/:id',auth,markTodoAsComplete)
app.post('/posts',auth,createPosts)
app.get('/posts',auth,getPosts)
app.post('/posts/:id',auth,createComment)

app.listen(port,()=> {
  console.log(`Server is running ${port}`)
})
