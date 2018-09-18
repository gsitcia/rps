var peer = new Peer();
var dataConnection = null;
var joinGame = function() {
    document.getElementById('joinordie').hidden = true;
    document.getElementById('joining').hidden = false;
}
var hostGame = function() {
    document.getElementById('joinordie').hidden = true;
    document.getElementById('hosting').hidden = false;
}
var sendstuff = function() {
    dataConnection.send(document.getElementById('chat').value);
    var it = document.getElementById('cha').innerText;
    document.getElementById('cha').innerText = 'You said: ' + document.getElementById('chat').value + '\n' + it;
    document.getElementById('chat').value = '';
}
var ondc = function() {
    dataConnection.on('data', function(d) {
        var it = document.getElementById('cha').innerText;
        document.getElementById('cha').innerText = 'They said: ' + d + '\n' + it;
    });
    document.getElementById('cat').addEventListener('click', sendstuff);
}
var readCode = function() {
    dataConnection = peer.connect(document.getElementById('codeEntry').value);
    document.getElementById('joining').hidden = true;
    document.getElementById('rps_buttons').hidden = false;
    dataConnection.on('open', ondc);
}
document.getElementById('Join').addEventListener('click', joinGame);
document.getElementById('Host').addEventListener('click', hostGame);
document.getElementById('enterCode').addEventListener('click', readCode);
document.getElementById('codeEntry').addEventListener('keyup', function(k) {
    if (k.keyCode === 13) {
        document.getElementById('enterCode').click();
    }
});
document.getElementById('chat').addEventListener('keyup', function(k) {
    if (k.keyCode === 13) {
        document.getElementById('cat').click();
    }
});
peer.on('open', function(id) {
    document.getElementById('codeOut').value = id;
});
peer.on('connection', function(dc) {
    dataConnection = dc;
    document.getElementById('hosting').hidden = true;
    document.getElementById('rps_buttons').hidden = false;
    dataConnection.on('open', ondc);
});
peer.on('error', function(err) {
    alert('' + err);
});