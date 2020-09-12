import React, { useState, useEffect } from 'react';

import Filter from './Component/Filter';
import PersonForm from './Component/PersonForm';
import Persons from './Component/Persons';

import PersonsService from './Services/Persons';

import './index.css'

const Notification = ({details}) => {
  if (details.message === null) {
    return null;
  }

  return (
    <div className={details.type}>
      {details.message}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([]);
  const [ notifDetails, setNotifDetails ] = useState({message: null, type: 'notif'});

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
    const personDetails = {name: newName, number: newNumber};
    const person = persons.find(p => p.name === personDetails.name);
    if (person) {
      const updatedPerson = {...person, number: newNumber};
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        updatePerson(person.id, updatedPerson);
      }
      return;
    }

    PersonsService
      .create(personDetails)
      .then(ret => {
        setPersons(persons.concat(ret))
        setNewName('');
        setNewNumber('');
        const newNotif = {
          message: `Added ${personDetails.name}.`,
          type: 'notif'
        };
        setNotifDetails(newNotif);
        setTimeout(() => {
          setNotifDetails({message: null});
        }, 3000);
      })
      .catch((err) => {
        const newNotif = {
          message: `${err.response.data.error}`,
          type: 'error'
        };
        setNotifDetails(newNotif);
        setTimeout(() => {
          setNotifDetails({message: null});
        }, 5000);
      });
  };

  const updatePerson = (id, person) => {
    PersonsService
      .update(id, person)
      .then((ret) => {
        // In the event that the person is deleted from the backend prior to it being updated 
        // on the front end, we need to check that the return value is not null.
        if (!ret) {
          return Promise.reject(`Information of ${person.name} has already been removed from the server.`);
        }
        setPersons(persons.map(p => p.id !== id ? p : ret));
        setNewName('');
        setNewNumber('');
        const newNotif = {
          message: `${person.name} has updated their number.`,
          type: 'notif'
        };
        setNotifDetails(newNotif);
        setTimeout(() => {
          setNotifDetails({message: null});
        }, 3000);
      })
      .catch((err) => {
        // Validation error case
        if (err.response) {
          const newNotif = {
            message: `${err.response.data.error}`,
            type: 'error'
          };
          setNotifDetails(newNotif);
          setTimeout(() => {
            setNotifDetails({message: null});
          }, 5000);
          return;
        }
        // User already deleted case
        setPersons(persons.filter(p => p.id !== id));
        const newNotif = {
          message: err,
          type: 'error'
        };
        setNotifDetails(newNotif);
        setTimeout(() => {
          setNotifDetails({message: null});
        }, 5000);
      });
  };

  const removePerson = (id) => {
    const person = persons.filter(p => p.id === id)[0];
    if (window.confirm(`Delete ${person.name} ?`)) {
      PersonsService
      .remove(id)
      .then(ret => {
        setPersons(persons.filter(p => p.id !== id))
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification details={notifDetails} />
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