const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors')


morgan.token('body', req => { 
  return JSON.stringify(req.body)
}) 

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(cors())

app.use(express.static('dist'))

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
  {
    id: 5,
    name: 'Tiara',
    number: '5559078254',
    important: false,
  },
  {
    id: 6,
    name: 'Luca',
    number: '1427371517',
    important: true,
  },
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  response.send(`Phonebook has info for ${persons.length} people </br> </br> ${new Date(Date.now())}`);
});

app.get('/api/persons/:id', (request, response) => {
  const id = parseInt(request.params.id)
  const person = persons.find(person => person.id === id);

  if(!person) {
    response.send(`People with id ${id} cannot be found`);
  }

  console.log(person);
  response.json(person);
});

const generateId = () => {
  const maxId = Math.floor(Math.random() * 100)
  return maxId
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  const isNameExist = persons.find(person => person.name === body.name);

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Both field need to be filled' 
    })
  } else if (isNameExist) {
    return response.status(401).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = parseInt(request.params.id)
  persons = persons.filter(person => person.id !== id);
  response.send(`People with id ${id} successfully deleted`);
  response.status(204).end()
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app