import React, {useState, useEffect} from 'react'
import './game.css'
import * as gameUtil from './game.js'

const Game = () => {

    window.onload = function () {
        gameUtil.setGame();
    }

    var data = JSON.parse(localStorage.getItem('data'));
    var socketID = JSON.parse(localStorage.getItem('socketID'));
    useEffect(()=> {
        if (socketID == data.p1.socketID) {
            document.getElementById("user").innerText = data.p1.name;
            document.getElementById("oppUser").innerText = data.p2.name;
            document.getElementById("value").innerHTML = data.p1.value;
        }
        else {
            document.getElementById("user").innerText = data.p2.name;
            document.getElementById("oppUser").innerText = data.p1.name;
            document.getElementById("value").innerHTML = data.p2.value;
        }
    })

    return (
        <div id="game">
            <h1>Connect Four</h1>
            <h2 id="winner"></h2>

            <div className="row">
                <div >
                    <p id="userCont" className="col">You: <span id="user"></span> </p>
                </div>
                <div>
                <p id="valueCont">You are playing as <span id="value"></span> </p>
                {/* <p id="whosTurn">Red's Turn</p> */}
                <p id="board"></p>
                </div>
                    <p id="oppUserCont" className="col">Opponent: <span id="oppUser"></span> </p>
            </div>
        </div>
    )
}

export default Game
