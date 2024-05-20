import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreateEntity from './CreateEntity';
import ManageEntries from './ManageEntries';
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Create Entity</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<CreateEntity />} />
          <Route path="/manage/:entityName" element={<ManageEntries />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
