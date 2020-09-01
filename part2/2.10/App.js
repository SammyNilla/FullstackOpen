import React, { useState } from 'react';
import Filter from './Component/Filter';
import PersonForm from './Component/PersonForm';
import Persons from './Component/Persons';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]);

  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ newFilter, setNewFilter ] = useState('');
  
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(newFilter));

  const handleNewFilter = (event) => {
    setNewFilter(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const personExists = persons.find(person => person.name === newName);
    if (personExists) {
      window.alert(`${newName} is already added to phonebook.`);
      return;
    }

    setPersons(persons.concat({name: newName, number: newNumber}))
    setNewName('');
    setNewNumber('');
  };


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={newFilter} handleChange={handleNewFilter} />
      <h3>add a new</h3>
      <PersonForm handleSubmit={addPerson} 
                  inputValueName={newName} handleNameChange={handleNameChange} 
                  inputValueNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} />
    </div>
  )
};

export default App;