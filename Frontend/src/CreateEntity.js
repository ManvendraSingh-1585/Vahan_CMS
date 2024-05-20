import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const CreateEntity = () => {
  const [name, setName] = useState('');
  const [attributes, setAttributes] = useState([{ name: '', type: '' }]);
  const navigate = useNavigate();

  const handleAttributeChange = (index, event) => {
    const newAttributes = [...attributes];
    newAttributes[index][event.target.name] = event.target.value;
    setAttributes(newAttributes);
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: '', type: '' }]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:8000/entities', { name, attributes });
      alert('Entity created successfully');
      setName('');
      setAttributes([{ name: '', type: '' }]);
      navigate(`/manage/${name}`);
    } catch (err) {
      alert('Error creating entity');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Entity Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      {attributes.map((attr, index) => (
        <div key={index}>
          <label>Attribute Name:</label>
          <input
            type="text"
            name="name"
            value={attr.name}
            onChange={(e) => handleAttributeChange(index, e)}
            required
          />
          <label>Attribute Type:</label>
          <input
            type="text"
            name="type"
            value={attr.type}
            onChange={(e) => handleAttributeChange(index, e)}
            required
          />
        </div>
      ))}
      <button type="button" onClick={handleAddAttribute}>
        Add Attribute
      </button>
      <button type="submit">Create Entity</button>
    </form>
  );
};

export default CreateEntity;
