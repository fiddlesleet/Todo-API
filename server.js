var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

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

// GET /todos?completed=true&q=myKeyWord
app.get('/todos', function(req, res) {
  var query = req.query;
  var where = {};

  if (query.hasOwnProperty('completed') && query.completed === 'true') {
    where.completed = true;
  } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
    where.completed = false;
  }

  if (query.hasOwnProperty('q') && query.q.length > 0) {
    where.description = {
      $like: '%' + query.q + '%'
    };
  }

  db.todo.findAll({where: where}).then(function (todos) {
    res.json(todos);
  }, function (e) {
    res.status(500).send();
  });
});
// GET /todos/:id
app.get('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);

  db.todo.findById(todoId).then(function (todo) {
    if (!!todo) {
      res.json(todo.toJSON());
    } else {
      res.status(404).send();
    }
  }, function (e) {
    res.status(500).send();
  });
});

// POST /todos
app.post('/todos', function(req, res) {
  // use _.pick to restrict submitted fields to only description and completed
  var body = _.pick(req.body, 'description', 'completed');

  db.todo.create(body).then(function (todo) {
    res.json(todo.toJSON());
  }, function (e) {
    res.status(400).json(e);
  });
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);

  db.todo.destroy({
    where: {
      id: todoId
    }
  }).then(function (rowsDeleted) {
    if (rowsDeleted === 0) {
      res.status(404).json({
        error: "No to-do item in the list has this id"
      });
    } else {
      res.status(204).send();
    }
  }, function () {
    res.status(500).send();
  });
});


// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  // use _.pick to restrict submitted fields to only description and completed
  var body = _.pick(req.body, 'description', 'completed');
  var attributes = {};

  if (body.hasOwnProperty('completed')) {
    attributes.completed = body.completed;
  }

  if (body.hasOwnProperty('description')) {
    attributes.description = body.description;
  }

  db.todo.findById(todoId).then(function (todo) {
    if (todo) {
      todo.update(attributes).then(function (todo) {
        res.json(todo.toJSON());
      }, function(e) {
        res.status(400).json(e);
      });
    } else {
      res.status(404).send();
    }
  }, function () {
    res.status(500).send();
  });
});

db.sequelize.sync().then(function () {
  app.listen(PORT, function() {
    console.log("Express listening on port " + PORT + "!");
  });
});
