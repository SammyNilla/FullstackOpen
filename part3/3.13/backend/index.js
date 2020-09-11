require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(cors());

morgan.token('body', (req, res) => {
  for (var i in req.body) {
    return JSON.stringify(req.body);
  }

  return null;
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const Person = require('./models/person')

app.use(express.static('build'));

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  });
});

app.post('/api/persons', (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number is missing'
    });
  }

  const personExists = persons.find(p => p.name === body.name);
  if (personExists) {
    return res.status(400).json({
      error: 'name must be unique'
    });
  }

  const id = Math.floor(Math.random() * 1000); // should give a number between 0 and 1000
  const person = {
    name: body.name,
    number: body.number,
    id: id
  };

  persons = persons.concat(person);

  res.json(person);
});

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person);
    })
    .catch(() => {
      res.status(404).end();
    })
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(p => p.id !== id);

  res.status(204).end();
});

app.get('/info', (req, res) => {
  const date = new Date();
  Person.find({}).then(persons => {
    res.send(
      `<p>Phonebook has info for ${persons.length} people</p>` +
      `<p>${date}</p>`
    );
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
