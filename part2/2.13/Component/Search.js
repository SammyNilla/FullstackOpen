import React from 'react';

const Search = ({query, handleChange}) => {
  return (
    <div>find countries <input value={query.toLowerCase()} onChange={handleChange} /></div>
  )
};

export default Search;