import React, { useState, useEffect } from 'react';

import Filter from './Component/Filter';
import PersonForm from './Component/PersonForm';
import Persons from './Component/Persons';

import PersonsService from './Services/Persons';

const App = () => {
  const [ persons, setPersons ] = useState([]);

  useEffect(() => {
    PersonsService
      .getAll()
      .then(ret => {
        setPersons(ret)
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

    const person = {name: newName, number: newNumber};
    PersonsService
      .create(person)
      .then(ret => {
        setPersons(persons.concat(ret))
        setNewName('');
        setNewNumber('');
      });
  };

  const removePerson = (id) => {
    const person = persons.filter(p => p.id === id)[0];
    if (window.confirm(`Delete ${person.name} ?`)) {
      PersonsService
      .removeByID(id)
      .then(ret => {
        setPersons(persons.filter(p => p.id !== id))
      });
    }
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
      <Persons persons={filteredPersons} handleClick={removePerson} />
    </div>
  )
};

export default App;