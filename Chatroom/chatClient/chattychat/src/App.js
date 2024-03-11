import React from 'react'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import LoginPage from './components/LoginPage.js'; 
import SignupPage from './components/SignUpPage.js'; 
import Chats from './components/Chats.js';
import Chatroom from './components/Chatroom.js';
  
function App() { 
  return ( 
      <div className="App"> 
      <Router> 
  
            <Routes> 
            <Route path="/" element={<LoginPage/>} /> 
            <Route path="/signup" element={ <SignupPage/>} /> 
            <Route path = "/chats" element={<Chats/>}/> 
            <Route path = "/chatroom" element={<Chatroom/>}/> 
            </Routes> 
  
      </Router> 
      </div> 
  ); 
} 
  
export default App;
