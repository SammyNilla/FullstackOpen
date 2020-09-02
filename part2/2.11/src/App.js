import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Filter from './Component/Filter';
import PersonForm from './Component/PersonForm';
import Persons from './Component/Persons';

const App = () => {
  const [ persons, setPersons ] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, []);

  const [ newFilter, setNewFilter ] = useState('');
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(newFilter));
  const handleNewFilter = (event) => {
    setNewFilter(event.target.value);
  };

  const [ newName, setNewName ] = useState('');
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const [ newNumber, setNewNumber ] = useState('');
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