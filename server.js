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

// GET /todos?completed=true
app.get('/todos', function(req, res) {
  var queryParams = req.query;
  var filteredTodos = todos;

  // if has property && completed == 'true'
  if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    filteredTodos = _.where(filteredTodos, {completed: true});
  } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    filteredTodos = _.where(filteredTodos, {completed: false});
  }

  res.json(filteredTodos);
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

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});

  if (!matchedTodo) {
    res.status(404).json({"error": "No to-do item found with that ID"});
  } else {
    todos = _.without(todos, matchedTodo);
    res.json(matchedTodo);
  }
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});
  // use _.pick to restrict submitted fields to only description and completed
  var body = _.pick(req.body, 'description', 'completed');
  var validAttributes = {};

  if (!matchedTodo) {
    return res.status(404).send();
  }

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
      return res.status(400).send();
  }

  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')) {
    return res.status(400).send();
  }

  matchedTodo = _.extend(matchedTodo, validAttributes);
  res.json(matchedTodo);
});

app.listen(PORT, function() {
  console.log("Express listening on port " + PORT + "!");
});
