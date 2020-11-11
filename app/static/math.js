
var sequence = 0;
var good = 0;
var min = 10;
var sec = 0;

console.log('equations', equations);

function start(){
  console.log(sequence);
  if(sequence > 59){
    finished('end');
  } else {
    document.getElementById('salution').focus();
    let se = sequence.toString();
    let eq = equations[se];
    console.log(eq);
    console.log(typeof(eq[0]));
    let problem = eq[0] + ' ' + eq[1] + ' ' + eq[2] + '   =   ';
    console.log(eq[0] * eq[2]);
    document.getElementById('progress').innerText = se + ' of 60';
    document.getElementById('problem').innerText = problem;
  }
  
}

function finished(reason){
  if(typeof time !== 'undefined') {
      clearInterval(time);
    }
  let duration = 600 - ((min * 60) + sec);
  let s = duration % 60;
  let m = (duration - s) / 60;
  document.getElementById('equationContainer').remove();
  document.getElementById('result').style.visibility = 'visible';
  if(reason == 'end'){
    document.getElementById('resultp').innerText = good + ' out of 60 in ' + m + ' minutes and ' + s + ' seconds' ;
  } else{
    document.getElementById('resultp').innerText = 'Looks like your time has run out but you managed to solve ' + good + ' out of 60' ;
  }
}

function calculate(){
  let eq = equations[sequence];
  let answer = document.getElementById('salution').value
  console.log(answer)
  const history = document.createElement("small");
  history.innerText = eq[0] + ' ' + eq[1] + ' ' + eq[2] + ' = ' +  answer;
  if(answer == eq[0] * eq[2]){
    good += 1;
    document.getElementById('feedback').innerText = 'Correct!!';
    document.getElementById('feedback').style.color = 'green';
    history.style.color = 'green';
  } else{
    document.getElementById('feedback').innerText = 'Wrong!!';
    document.getElementById('feedback').style.color = 'red';
    history.style.color = 'red';
  }
  document.getElementById('history').append(history);
  document.getElementById('salution').value = '';
  sequence += 1;
  start();
}

document.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    calculate();
  }
})

function timer(){
  sec--;
  if(min <= 0 && sec <= 0){
    finished('time');
  }
  if(sec < 0){
    min--;
    sec = 59;
  }
  if(sec < 10){
    var strSec = '0' + sec.toString();
  } else{
    var strSec = sec.toString();
  }
  if(min < 10){
    var strMin = '0' + min.toString();
  } else{
    var strMin = min.toString();
  }
  document.getElementById('timer').innerText = strMin + ':' + strSec;
}

start();
var time = setInterval(timer, 1000);