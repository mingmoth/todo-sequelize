const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const db = require('./models')

const app = express()
const PORT = 3000

const Todo = db.Todo
const User = db.User

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/users/login', (req, res) => {
  res.render('login')
})

app.post('/users/login', (req, res) => {
  res.send('login')
})

app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.create({ name, email, password })
    .then(user => res.redirect('/'))
})

app.get('/', (req, res) => {
  // 在 Sequelize 的語法裡，查詢多筆資料是 findAll()
  return Todo.findAll({
    raw: true,
    nest: true
  })
    .then((todos) => { return res.render('index', {todos: todos})})
    .catch((error => { return res.status(422).json(error)}))
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', {todos: todo.toJSON()}))
    .catch(error => console.log(error))
})

app.get('/users/logout', (req, res) => {
  res.send('logout')
})  

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})