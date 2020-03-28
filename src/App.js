import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/Home';
import Document from './components/Document';
import './App.css';

function App() {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route exact path="/:id" component={Document} />
    </Router>
  );
}

export default App;
