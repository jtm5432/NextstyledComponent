import React from 'react';

const SavedQueriesComponent = ({ savedQueries, onSelect, onDelete, onEdit }) => {
  return (
    <div>
      <h3>Saved Queries</h3>
      <ul>
        {savedQueries.map(query => (
          <li key={query.id}>
            {query.name}
            <button onClick={() => onSelect(query)}>Load</button>
            <button onClick={() => onEdit(query)}>Edit</button>
            <button onClick={() => onDelete(query.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedQueriesComponent;
