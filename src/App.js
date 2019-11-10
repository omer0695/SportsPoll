import React, { useState } from 'react';
import Poll from './components/poll/Poll'
import './App.css';

function App() {

  const [sportImg, setSportImg] = useState(null);
  const currentSport = (val) => {
    if (sportImg === null) {
      setSportImg(val.toLowerCase() + Math.round(Math.random() * 1));
    }
  }

  return (
    <div className="App" style={{ backgroundImage: "url(/images/" + sportImg + ".jpg)" }}>

      <Poll currentSport={currentSport} />

      <div className="footer">
        <div className="copy">&copy; 2019</div>
      </div>

    </div>
  );
}


export default App;