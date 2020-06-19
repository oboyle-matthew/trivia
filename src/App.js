import React from 'react';
import HomePage from "./components/old_stuff/HomePage";
import app from 'firebase/app';
import 'antd/dist/antd.css'

var config = {
    apiKey: "AIzaSyBfCWC3nO4Dm6t_Mdi023zABHHKzrOdQkI",
    authDomain: "trivia-7b47d.firebaseapp.com",
    databaseURL: "https://trivia-7b47d.firebaseio.com",
    projectId: "trivia-7b47d",
    storageBucket: "trivia-7b47d.appspot.com",
    messagingSenderId: "1017757056711",
};

app.initializeApp(config);

function App() {
  return (
    <div className="App">
        <HomePage/>
    </div>
  );
}

export default App;
