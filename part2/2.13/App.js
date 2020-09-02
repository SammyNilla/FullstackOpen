import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Search from './Component/Search';
import CountryList from './Component/CountryList';
import CountryDetailed from './Component/CountryDetailed';

const App = () => {
  const [ countries, setCountries ] = useState([]);

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        //console.log(response.data)
        setCountries(response.data);
      })
  }, []);

  const [ searchQuery, setSearchQuery ] = useState('');
  const handleSearchQueryChange = (event) => setSearchQuery(event.target.value);

  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchQuery)
  );

  const showCountryList = () =>
  {
    const countryCount = filteredCountries.length;
    if (countryCount <= 10 && countryCount > 1) {
      return <CountryList countries={filteredCountries} handleClick={setSearchQuery} />;
    } else if (countryCount > 10) {
      return <div>Too many matches, specify another filter</div>;
    }
  }
  const showCountryDetails = () =>
  {
    if (filteredCountries.length === 1) {
      return <CountryDetailed country={filteredCountries[0]} />;
    }
  }

  return (
    <>
      <Search query={searchQuery} handleChange={handleSearchQueryChange} />
      {showCountryList()}
      {showCountryDetails()}
    </>
  )
};

export default App;