import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import DocumentEditor from './components/DocumentEditor';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/document/:id" element={<DocumentEditor />} />
      </Routes>
    </div>
  );
};

export default App;
