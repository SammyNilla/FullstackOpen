import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [ countries, setCountries ] = useState([]);

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log(response.data)
        setCountries(response.data);
      })
  }, []);

  const [ searchQuery, setSearchQuery ] = useState('');
  const handleSearchQueryChange = (event) => setSearchQuery(event.target.value);

  const filteredCountries = countries.filter(country => country.name.toLowerCase().includes(searchQuery));
  const showResults = (filteredCountries.length <= 10) ? true : false;

  // These are temporary?
  const tooManyResults = () => <div>Too many matches, specify another filter</div>;
  const resultsToShow = () => {
    return (
      <div>
        {filteredCountries.map(country =>
          <div key={country.name}>{country.name}</div>
        )}
      </div>
    )
  };

  return (
    <div>
      <div>
        find countries <input value={searchQuery} onChange={handleSearchQueryChange} />
        {showResults ? 
          resultsToShow() : tooManyResults()
        }
      </div>
    </div>
  )
};

export default App;