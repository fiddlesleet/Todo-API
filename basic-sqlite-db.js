var Sequelize = require('sequelize');
var sequilize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequilize.define('todo', {
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      // length less than 250 chars
      len: [1,250]
    }
  },
  completed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
})

sequilize.sync().then(function() {
  console.log("Everything is synced!");

  Todo.findById(2).then(function (todo) {
    if (todo) {
      console.log(todo.toJSON());
    } else {
      console.log("To-do not found");
    }
  });
})
