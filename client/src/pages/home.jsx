import React, { useState, useEffect } from 'react'
import logo from '/c4.webp'
import loading from '../assets/loading.gif'
import './home.css'
import socket from '../socket'

function Home() {
  const [isLoading, setVisible] = useState(false);
  let name;

  const handleButtonClick = () => {
    setVisible(true);
    name = document.getElementById("name").value;
    console.log(name)
    if (name == null || name == '') {
      alert("Please enter a name");
    }
    else {
      socket.emit("find", { name: name, socketID: socket.id })
      console.log(socket.id);
      document.getElementById("loading").style.display = "block";
      document.getElementById("find").disabled = true;

    }
  };

  socket.on("find", (e) => {
    if (name != '') {
      localStorage.clear();
      var foundObject = e.allPlayers.find(obj => obj.p1.socketID == `${socket.id}` || obj.p2.socketID == `${socket.id}`)
      localStorage.setItem('data', JSON.stringify(foundObject));
      localStorage.setItem('socketID', JSON.stringify(socket.id));;
      window.location.href = "http://localhost:5173/game";
    }
  });

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Logo" />
      </div>
      <h1>Connect Four</h1>
      <img id="loading" src={loading} className={`loading ${isLoading ? '' : 'hidden'}`} alt="loading" />
      <div className='card'>
        <p>
          Enter your username below:
        </p>
        <input type="text" placeholder="Name" id="name" />
      </div>
      <button id="find" onClick={handleButtonClick}>Search for game</button>
    </>
  )
}

export default Home