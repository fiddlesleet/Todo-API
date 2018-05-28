var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todoNextId = 1;

// middleware
app.use(bodyParser.json());

var todos = [{
  id: 1,
  description: "Write R Shiny App",
  completed: false
}, {
  id: 2,
  description: "Complete Node.js app",
  completed: true
}, {
  id: 3,
  description: "Add Bootstrap 4 formatting to Heroku App",
  completed: false
}


];

app.get('/', function(req, res) {
  res.send("Todo API Root");
});

// GET /todos
app.get('/todos', function(req, res) {
  res.json(todos);
});
// GET /todos/:id
app.get('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});

  // todos.forEach(function(todo) {
  //   if (todoId === todo.id) {
  //     matchedTodo = todo;
  //   }
  // });

  if (matchedTodo) {
    res.json(matchedTodo);
  } else {
    res.status(404).send();
  }
});

// POST /todos
app.post('/todos', function(req, res) {
  // use _.pick to restrict submitted fields to only description and completed
  var body = _.pick(req.body, 'description', 'completed');

  // validate body field entries
  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    return res.status(400); // req can't be completed bc bad data was provided
  }

  // remove unnecessary spaces from body field
  body.description = body.description.trim();

  // add id field
  body.id = todoNextId++;
  todos.push(body);
  res.json(body);
});

app.listen(PORT, function() {
  console.log("Express listening on port " + PORT + "!");
});
