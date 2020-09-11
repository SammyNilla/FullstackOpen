require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(express.json());

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

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  })
});

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    })
});

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
});

/*app.get('/info', (req, res) => {
  const date = new Date();
  Person.find({}).then(persons => {
    res.send(
      `<p>Phonebook has info for ${persons.length} people</p>` +
      `<p>${date}</p>`
    );
  });
});*/

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
