var peer = null;
var dc = null;
var initialize;
var onOpen;
var onConnection;
var onDCOpen;
var onDCData;
var sendChoice;
var playRock;
var playPaper;
var playScissors;
var resetGame;
var yourChoice = null;
var theirChoice = null;

var initialize = function() {
    peer = new Peer();
    peer.on("open", onOpen);
    peer.on('connection',onConnection);
    document.getElementById('rock').addEventListener('click',playRock);
    document.getElementById('paper').addEventListener('click',playPaper);
    document.getElementById('scissors').addEventListener('click',playScissors);
}
var togglerps = function() {
    document.getElementById('rock').disabled = !document.getElementById('rock').disabled;
    document.getElementById('paper').disabled = !document.getElementById('paper').disabled;
    document.getElementById('scissors').disabled = !document.getElementById('scissors').disabled;
}
var onOpen = function(id) {
    document.getElementById('loading').hidden = true;
    //alert('this happened');
    var code = (new URL(window.location.href)).searchParams.get('code');
    //alert('this also happened');
    if (code) {
        document.getElementById('rps').hidden = false;
        dc = peer.connect(code);
        dc.on('open',onDCOpen);
    } else {
        document.getElementById('hosting').hidden = false;
        document.getElementById('link').value = window.location.href+'?code='+peer.id;
        //alert('this should have happened');
    }
}
var onConnection = function(dataC) {
    dc = dataC;
    dc.on('open',onDCOpen);
    document.getElementById('hosting').hidden = true;
    document.getElementById('rps').hidden = false;
}
var onDCOpen = function() {
    togglerps();
    dc.on('data',onDCData);
}
var onDCData = function(data) {
    // This should, if we still haven't chosen, recieve true
    // If we have chosen, it should recieve what they chose
    //alert(data);
    if (yourChoice) {
        document.getElementById('theyChose').innerText = 'They chose '+data;
        if (!theirChoice) {
            theirChoice = data;
            sendChoice();
        }
        theirChoice = data;
        resetGame();
    } else {
        document.getElementById('theyChose').innerText = 'They have chosen.';
        theirChoice = data;
    }
}
var sendChoice = function() {
    // This should, if they haven't chosen, send true
    // If they have chosen, then send what we chose
    if (theirChoice) {
        dc.send(yourChoice);
        //alert(yourChoice);
    } else {
        dc.send(true);
        //alert(true);
    }
    document.getElementById('youChose').innerText = 'You chose '+yourChoice;
}
playRock = function() {
    togglerps();
    yourChoice = 'rock';
    sendChoice();
}
playPaper = function() {
    togglerps();
    yourChoice = 'paper';
    sendChoice();
}
playScissors = function() {
    togglerps();
    yourChoice = 'scissors';
    sendChoice();
}
resetGame = function() {
    // See and output who won
    // reset choices
    // toggle buttons
    var output = 'You lost! ';
    var beats = {'rock':'paper','scissors':'rock','paper':'scissors'};
    if (yourChoice == theirChoice) {
        output = 'You tied! ';
    }
    if (yourChoice == beats[theirChoice]) {
        output = 'You won! ';
    }
    var v = document.getElementById('log').innerText;
    document.getElementById('log').innerText = output+yourChoice+' vs '+theirChoice+'\n'+v;
    document.getElementById('youChose').innerText = "You haven't chosen yet.";
    document.getElementById('theyChose').innerText = "They haven't chosen yet.";
    yourChoice = null;
    theirChoice = null;
    togglerps();
}
initialize();