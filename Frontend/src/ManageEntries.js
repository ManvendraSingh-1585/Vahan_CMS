import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ManageEntries = () => {
  const { entityName } = useParams();
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({});
  const [editingEntry, setEditingEntry] = useState(null);
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const result = await axios.get(`http://localhost:8000/entities/${entityName}/entries`);
        setEntries(result.data);
      } catch (err) {
        alert('Error fetching entries');
      }
    };

    const fetchAttributes = async () => {
      try {
        const result = await axios.get(`http://localhost:8000/entities/${entityName}/attributes`);
        setAttributes(result.data);
        const initialEntry = result.data.reduce((acc, attr) => {
          acc[attr.name] = '';
          return acc;
        }, {});
        setNewEntry(initialEntry);
      } catch (err) {
        alert('Error fetching attributes');
      }
    };

    fetchEntries();
    fetchAttributes();
  }, [entityName]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewEntry({ ...newEntry, [name]: value });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditingEntry({ ...editingEntry, [name]: value });
  };

  const handleCreate = async () => {
    try {
      const result = await axios.post(`http://localhost:8000/entities/${entityName}/entries`, newEntry);
      setEntries([...entries, result.data]);
      setNewEntry(attributes.reduce((acc, attr) => {
        acc[attr.name] = '';
        return acc;
      }, {}));
    } catch (err) {
      alert('Error creating entry');
    }
  };

  const handleUpdate = async (id) => {
    try {
      const result = await axios.put(`http://localhost:8000/entities/${entityName}/entries/${id}`, editingEntry);
      const updatedEntries = entries.map(entry => entry.id === id ? result.data : entry);
      setEntries(updatedEntries);
      setEditingEntry(null);
    } catch (err) {
      alert('Error updating entry');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/entities/${entityName}/entries/${id}`);
      setEntries(entries.filter(entry => entry.id !== id));
    } catch (err) {
      alert('Error deleting entry');
    }
  };

  return (
    <div>
      <h2>Manage Entries for {entityName}</h2>
      {entries.map(entry => (
        <div key={entry.id}>
          {editingEntry && editingEntry.id === entry.id ? (
            <div>
              {Object.keys(entry).map(key => (
                key !== 'id' && (
                  <div key={key}>
                    <label>{key}:</label>
                    <input
                      type="text"
                      name={key}
                      value={editingEntry[key] || ''}
                      onChange={handleEditChange}
                    />
                  </div>
                )
              ))}
              <button onClick={() => handleUpdate(entry.id)}>Save</button>
              <button onClick={() => setEditingEntry(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              {Object.keys(entry).map(key => (
                key !== 'id' && <p key={key}>{key}: {entry[key]}</p>
              ))}
              <button onClick={() => setEditingEntry(entry)}>Edit</button>
              <button onClick={() => handleDelete(entry.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
      <h3>Create New Entry</h3>
      {attributes.map(attr => (
        <div key={attr.name}>
          <label>{attr.name}:</label>
          <input
            type={attr.type === 'INT' ? 'number' : 'text'}
            name={attr.name}
            value={newEntry[attr.name]}
            onChange={handleChange}
          />
        </div>
      ))}
      <button onClick={handleCreate}>Create</button>
    </div>
  );
};

export default ManageEntries;
