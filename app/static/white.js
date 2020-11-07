var height = document.getElementById('00').clientHeight;
//var height = 20;
console.log('height', height);
var homeMove = true;
var temp;

var homeTimer = document.getElementById('homeTimer');
var awayTimer = document.getElementById('awayTimer');
var clock = {
	homeTime: '00:00',
	awayTime: '00:00',
  rawHome: 0,
  rawAway: 0
}

var isDraging = false;

function startFun(){
  populate();
  var homeCheck;
  var awayCheck;
  if(color == 'white'){
    homeCheck = data.position.WKing.check;
    homeOver = data.position.WKing.surrender;
    awayCheck = data.position.BKing.check;
    awayOver = data.position.BKing.surrender;
  } else {
    awayCheck = data.position.WKing.check;
    awayOver = data.position.WKing.surrender;
    homeCheck = data.position.BKing.check;
    homeOver = data.position.BKing.surrender;
  }
  if(awayCheck){
    document.getElementById('awayCheck').style.visibility = 'visible';
  } else{
    document.getElementById('awayCheck').style.visibility = 'hidden';
  } 
  if (homeCheck) {
    document.getElementById('homeCheck').style.visibility = 'visible';
  } else {
    document.getElementById('homeCheck').style.visibility = 'hidden';
  }
  if(awayOver){
    document.getElementById('awayCheck').style.visibility = 'visible';
    document.getElementById('awayCheck').innerText = 'GAME OVER';
  }
  if(homeOver) {
    document.getElementById('homeCheck').style.visibility = 'visible';
    document.getElementById('homeCheck').innerText = 'GAME OVER';
  }
  if(homeOver){
    gameOver('home')
  } else if(awayOver){
    gameOver('away')
  } else {
    if(color == data.move){
      homeMove = true;
    } else {
      homeMove = false;
    }
    if(typeof getNews !== 'undefined') {
      clearInterval(getNews);
    }
    if(!homeMove){
      start_getNews();
    }
    //populate();
    grab();
    time();
  }
}

startFun();

function start_getNews() {
    getNews = setInterval(refresh, 2000);
    //console.log('no news')
}

function refresh(){
  fetch('/chess/move',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({moveNumber: parseInt(data.move_number), gameId:
    data.game_id})
  }).then(response => response.json()).then(function(response){
    console.log('response', response);
    if (response){
    	data = response;
      clearBoard();
      startFun();
    }
  }).catch(function(err){
    console.log('err', err);
  })
}

var crazyTime;
homeTimer.innerText = clock.homeTime;
awayTimer.innerText = clock.awayTime;

function timer(someTime, someTimer, raw, backwards) {
  let game = gameId;
  if(backwards){
    clock[raw] -= 1;
  } else {
    clock[raw] += 1;
  }
  clock[someTime] = timePrinter(clock[raw]);
  someTimer.innerText = clock[someTime];
  if(clock[raw] <= 0){
    console.log('got 0');
    getMoving({'gameId': game});
  }
}

//console.log('outside crazyTime', crazyTime);

function time() {
  let moveStarted = Date.parse(data.date);
  let now = new Date();
  let locale = now.getTimezoneOffset() * 60 * 1000;
  let diff = Math.round((now - moveStarted + locale) / 1000); 
  var backwards = false;
  if (data.move == 'white'){
    if(data.time_limit == '0'){
      var whiteTime = data.white_timer + diff;
    } else {
      backwards = true;
      var whiteTime = data.white_timer - diff;
    }
    var blackTime = data.black_timer;
  } else {
    var whiteTime = data.white_timer;
    if(data.time_limit == '0'){
      var blackTime = data.black_timer + diff;
    } else {
      backwards = true;
      var blackTime = data.black_timer - diff;
    }
  }
	if(color == 'white'){
    clock.homeTime = timePrinter(whiteTime)
    clock.rawHome = whiteTime
    clock.awayTime = timePrinter(blackTime)
    clock.rawAway = blackTime
	} else {
    clock.homeTime = timePrinter(blackTime)
    clock.rawHome = blackTime
    clock.awayTime = timePrinter(whiteTime)
    clock.rawAway = whiteTime
  }

	if(typeof crazyTime !== 'undefined') {
		clearInterval(crazyTime);
	}

	if(homeMove){
    homeTimer.style.backgroundColor = "red";
    awayTimer.style.backgroundColor = "white";
		crazyTime = setInterval(timer, 1000, 'homeTime', homeTimer, 'rawHome', backwards);
	} else {
    awayTimer.style.backgroundColor = "red";
    homeTimer.style.backgroundColor = "white";
		crazyTime = setInterval(timer, 1000, 'awayTime', awayTimer, 'rawAway', backwards);
	}
}
// GET  

function populate() {
	var boardFigures = data.position;
  console.log(data);
  document.getElementById('awayCheck').style.visibility = 'hidden';
  document.getElementById('homeCheck').style.visibility = 'hidden';
	for (key in boardFigures){
		let holder = document.createElement("img");
		//holder.src = {{ url_for('/static', filename = boardFigures[key].pic) }};
    	holder.alt = boardFigures[key].name;
		//holder.src = 'https://game.supersharas.repl.co/static/'+ boardFigures[key].pic;
		holder.src = '/static/pics/'+ boardFigures[key].pic;
		holder.setAttribute("class", 'figure ' + boardFigures[key].color);
		holder.setAttribute("id", boardFigures[key].name);
		if(boardFigures[key].location == 'whiteHolder' || boardFigures[key].location == 'blackHolder') {
			holder.style.height = (height - (height / 100 * 53)).toString() + 'px';
			holder.style.width = (height - (height / 100 * 53)).toString() + 'px';
		} else {
			holder.style.height = (height - (height / 100 * 15)).toString() + 'px';
			holder.style.width = (height - (height / 100 * 15)).toString() + 'px';
		}
		document.getElementById(boardFigures[key].location).appendChild(holder);
	};
}

function clearBoard() {
	var toDestroy = document.getElementsByClassName("figure");
	var len = toDestroy.length;
	var list = [];
	for(x = 0; x < len; x += 1) {
		list.push(toDestroy[x].id);
	}
	list.forEach(function(node) {
		kid = document.getElementById(node);
		kid.parentNode.removeChild(kid);
	});
}

function getBack() {
	onTheMove.style.position = 'relative';
	onTheMove.style.left = 0;
	onTheMove.style.top = 0;
	return;
}

function getMoving(message) {
  fetch('/chess/move',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(message)
    }).then(response => response.json()).then(function(response){
      console.log('response', response);
      //console.log('crazyTime after fetch', crazyTime);
      if (response.move){
        data = response;
        moveNumber = response.move_number;
        clearBoard();
        startFun();
      } else if (response.promotion){
        console.log('promotion', promotion(onTheMove));
      }
      
    }).catch(function(err){
      console.log('err', err);
    })
}

function promotion() {
  document.getElementById('promotion').style.visibility = "visible";
}

function promote(wish) {
  let msg = wish + data.move_number.toString();
  temp.promote = msg;
  document.getElementById('promotion').style.visibility = "hidden";
  getMoving(temp);
}

function ifAllowed(fig, move){
  let figure = data.position[fig];
  console.log('fig', figure);
  let game = gameId;
	var posx = parseInt(figure.location[0]);
	var posy = parseInt(figure.location[1]);
	var desx = posx + move.x;
	var desy = posy + move.y;
	var destination = desx.toString() + desy.toString();
	if(figure.moves.includes(destination)) {
    var toGo = document.getElementById(destination);
    if(toGo.hasChildNodes()) {
      toGo.removeChild(toGo.lastChild);
    }
    toGo.appendChild(onTheMove);
    onTheMove.style.position = 'relative';
    onTheMove.style.left = '0';
    onTheMove.style.top = '0';
    homeMove = false;
    if(figure.name[1] == 'P'){
      if((figure.name[0] == 'W' && destination[1] == 7) || (figure.name[0] == 'B' && destination[1] == 0)){
        temp = {'figure': figure.name, 'move': destination, 'gameId': game};
        promotion(onTheMove);
      } else {
        getMoving({'figure': figure.name, 'move': destination, 'gameId': game});
        //promotion(onTheMove);
        //temp = {'figure': figure.name, 'move': destination, 'gameId': game};
      }
    } else {
      getMoving({'figure': figure.name, 'move': destination, 'gameId': game});
    }
	} else {
		return getBack();
  }
}

window.addEventListener('mouseup', e => {
	if (isDraging === true) {
		if (onTheMove) {
	      if(color == 'black'){
	        //var move = {x: -Math.round((startx - e.x)/60), y: -Math.round((starty - e.y)/60)};
	        var move = {x: -Math.round((startx - e.pageX)/60), y: -Math.round((starty - e.pageY)/60)};
	      } else{
	        //var move = {x: Math.round((startx - e.x)/60), y:Math.round((starty - e.y)/60)};
	        var move = {x: Math.round((startx - e.pageX)/60), y: Math.round((starty - e.pageY)/60)};
	      }
		ifAllowed(onTheMove.id, move);
		}
		isDraging = false;
	}
});

function grab() {
  if(color == data.move) {
    var moving = document.querySelectorAll('.figure.' + data.move);
    moving.forEach(function(move) {
      move.addEventListener('mousedown', e => {
        e.preventDefault();
        console.log('e', e);
        //startx = e.x;
        //starty = e.y;
        startx = e.pageX;
        starty = e.pageY;
        isDraging = true;
        onTheMove = e.target;
        onTheMove.style.position = 'absolute';
        onTheMove.style.left = (e.pageX - (height/2.5)).toString() + 'px';
        onTheMove.style.top = (e.pageY - (height/2.5)).toString() + 'px';
      });
    });
  }
}

window.addEventListener('mousemove', e => {
	if (isDraging === true) {
		e.preventDefault();
		onTheMove.style.left = (e.pageX - (height/2.5)).toString() + 'px';
		onTheMove.style.top = (e.pageY - (height/2.5)).toString() + 'px';
	}
});


function timePrinter(time) {
  time = Math.round(time);
  let sec = time % 60;
  let allmin = Math.round((time - sec) / 60);
  let min = allmin % 60;
  let hours = Math.round((allmin - min) / 60);
  let smin = min.toString();
  if (smin.length == 1){
    smin = '0' + smin;
  }
  let ssec = sec.toString()
  if (ssec.length == 1){
    ssec = '0' + ssec
  }
  if (hours){
    let shours = hours.toString();
    if (shours.length == 1){
      shours =  '0' + shours;
    }
    return shours + ':' + smin + ':' + ssec;
  } else{
    return smin + ':' + ssec;
  }
}

// Game over logicks

function gameOver(where){
  if(typeof crazyTime !== 'undefined') {
    clearInterval(crazyTime);
  }
  if(typeof getNews !== 'undefined') {
    clearInterval(getNews);
  }
  rematchTime = setInterval(checkRematch, 2000);
  if(where == 'home'){
    console.log('home Over');
    document.querySelector('#looser').style.visibility = "visible";
  } else{
    console.log('away Over');
    document.querySelector('#winner').style.visibility = "visible";
  }
}

function closeWinner(){
  document.querySelector('#winner').style.visibility = "hidden";
}

function closeLooser(){
  document.querySelector('#looser').style.visibility = "hidden";
}

document.onkeydown = function(evt) {
  evt = evt || window.event;
  if (evt.keyCode == 27) {
    closeLooser();
    closeWinner();
  }
};

function checkRematch(){
  fetchPost('/chess/rematch', {gameId: data.game_id, oponent: oponent}).then(function(response){
    console.log(response);
    if(response.offered){
      closeLooser();
      closeWinner();
      document.querySelector('#rematchOffered').style.visibility = "visible";
    } else if(response.id){
      var rematchColor
      if(color = 'white'){
        rematchColor = 'black'
      } else {
        rematchColor = 'white'
      }
      window.location.href = 'chess/' + rematchColor + '/' + response.id;
    }
  })
}

function rematch(){
  console.log('rematch');
  fetchPost('/chess/rematch', {gameId: data.game_id, oponent: oponent, playAgain: true, player: player}).then(function(response){
    console.log('rematch ordered');
  })
}

function rematchOffered(){
  if(typeof rematchTime !== 'undefined') {
    clearInterval(rematchTime);
  }
  document.querySelector('#rematchOffered').style.visibility = "visible";
  document.getElementById('cover').style.visibility = "visible";
}

function accept(){
  console.log('accept');
  if(typeof rematchTime !== 'undefined') {
    clearInterval(rematchTime);
  }
  fetchPost('/chess/rematch', {'accepted': true, gameId: data.game_id}).then(function(response){
    if(response.id){
      console.log(response);
      var rematchColor
      if(color = 'white'){
        rematchColor = 'black'
      } else {
        rematchColor = 'white'
      }
      location.href = response.url + rematchColor + '/' + response.id;
    }
  })
}

function no(){
  console.log('no');
}

function newGame(){
  console.log('new game');
}

function fetchPost(address, message){
  return fetch(address,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(message)
  }).then(response => response.json()).then(function(response){
    return response
  })
}