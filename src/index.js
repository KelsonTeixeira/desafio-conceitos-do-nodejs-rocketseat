const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if(!user) return response.status(400).json({ error: "User not found!"});

  request.user = user;

  return next();
}


app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userAreadyExists = users.some(user => user.username === username);

  if(userAreadyExists) return response.status(400).json({ error: "User already exists!"});

  const userObject = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(userObject);

  return response.status(201).json(userObject);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  user.todos.push(todo);

  return response.status(201).send(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo) return response.status(404).json({ error: 'todo not found!'});

  todo.title = title;
  todo.deadline = new Date(deadline);

  const todoUpdated = user.todos.find(todo => todo.id === id);

  return response.status(200).json(todoUpdated);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo) return response.status(404).json({ error: 'todo not found!'});

  todo.done = true;

  const todoUpdated = user.todos.find(todo => todo.id === id);

  return response.status(200).json(todoUpdated);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo) return response.status(404).json({ error: "todo not found!"});

  user.todos.splice(todo, 1);

  return response.status(204).send();
});

module.exports = app;