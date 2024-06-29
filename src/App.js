import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Login from './routes/Login';
import SignUp from './routes/SignUp';
import StorageScreen from './routes/TypingStorage';
import TypingScreen from './routes/Typing';
import Result from './routes/Result';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/storage' element={<StorageScreen />} />
        <Route path='/typing/:id' element={<TypingScreen />} />
        <Route path='/result' element={<Result />} />
        <Route path='*' element={<div>미완성된 페이지입니다.</div>} />
      </Routes>
    </Router>
  );
}

export default App;
