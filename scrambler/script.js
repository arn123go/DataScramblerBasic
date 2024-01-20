// Initializing the variables... necessary for Website navigation and interaction...
let page = "";  // Name of the page with extension. For index.php, write 'index.php' or ''.
let taskSS = document.getElementById("taskSS").value;  // It tells JS about current task from PHP side.
let myTask = (taskSS === "encode" || taskSS === "generate-key" || taskSS === "decode") ? taskSS : "encode";
let myUrl = page + "?task=" + myTask;
let myProgram;

// Task selecting elements...
const taskEnc = document.getElementById("taskEnc");
const taskGen = document.getElementById("taskGen");
const taskDec = document.getElementById("taskDec");

// Program selecting elements...
const programSelectionMenu = document.getElementById("programSelect");
const progJS = document.getElementById("program1");
const progPHP = document.getElementById("program2");
const progBoth = document.getElementById("program3");

// Response related elements...
const phpResponse = document.getElementById("phpResponse");
const jsResponse = document.getElementById("jsResponse");
const jumpToJSResponse = document.getElementById("goToJSResponse");


// Initializing the variables related to key checking and data rearranging...
const form = document.getElementById("form");
const key = document.getElementById("key");
const data = document.getElementById("data");
const result = document.getElementById("result");
const progName = '<span class="progName">JavaScript:</span>';
const errLn1 =  '<span class="error">Error!</span> Invalid Key!';
const errKeyLength = 'Length of key does not meet the required standard!';
let errKeyChar = function(errSerial, keyChar){return `<br/><span class="error">${errSerial}.</span> Key character '${keyChar}' is invalid or found more than once!`;}
const successEnc = `Task complete! Encoded data located in the Result. You can again insert your key and data, and then "Execute"!`
const successDec = `Task complete! Decoded data located in the Result. You can again insert your key and data, and then "Execute"!`;


// Initializing the session... myProgram...
if(sessionStorage.getItem('myProgram') === 'PHP' || sessionStorage.getItem('myProgram') === 'JavaScript' || sessionStorage.getItem('myProgram') === 'Both'){
  myProgram = sessionStorage.getItem('myProgram');
  if(myProgram === "JavaScript"){
    progJS.style.color = "Chocolate";
  }
  else if(myProgram === "PHP"){
    progPHP.style.color = "Chocolate";
  }
  else if(myProgram === "Both"){
    progBoth.style.color = "Chocolate";
  }
}
else{
  sessionStorage.setItem('myProgram','JavaScript');
  myProgram = sessionStorage.getItem('myProgram');
  progJS.style.color = "Chocolate";

}

// Comment on
// addEventListener:
// First argument is the "event-name". It is standard terminology. See manual for different event-names.
// Second argument is the "function-name". This function - you can write it as you wish. But
// remember that, if you have something to do with the event mechanism, this function must take an argument.
// And whatever name you set for the argument, remember that, this argument is indeed pointing to the html element's
// event. So built-in 'event-methods/properties' associated with that html element are accessed by this argument 
// which is treated as a corresponding 'event object' for that element.

// Comment on
// EventListener's Name:
// "Value of a html element's id" and "name of an event function" can be same. 
// Because for JavaScript, the latter is a variable name, 
// and the premier is a value of some attribute of a html element.


// Checking the settings for how client side interaction will occur within the page...
taskSelectionSettings();

// Adding EventListener to program selection menu to toggle between/among the programs.
programSelectionMenu.addEventListener('click', programSelect);

// Adding EventListener to "Clear" button for clearing key input.
document.getElementById("clearKey").addEventListener('click', clearKey);

// Adding EventListener to "Clear" button for clearing data input.
document.getElementById("clearData").addEventListener('click', clearData);






//================================================== Function Definitions

//This function checks and sets how client side interaction will occur within the page...
function taskSelectionSettings(){
  if(myProgram !== "PHP"){
    // Adding EventListener to task selection menu.
    taskEnc.addEventListener('click', taskSelect);
    taskGen.addEventListener('click', taskSelect);
    taskDec.addEventListener('click', taskSelect);

    // Adding EventListener to form submition.
    form.addEventListener('submit', jsKeyCheck);

    // Telling server my situation.
    performPHPSession(myTask);

    return;
  }
}


// When "JavaScript" or "Both" is selected, the url becomes static and it gets stuck to the last url.
// In this situation, if you reload the page, it will take you to the last url address, even if you are doing
// a different task.
// To get rid of the problem, you must send the information about your current task to the server.
// This function uses ajax to send information about your current task to the server by:
// calling another php file that receives those information and starts a php session based on that.
// When "PHP" is selected as the program, the current situation is perceived from the session data, and then the session gets destroyed.
// This function will remain disabled when you are in php mode. Because the problem only appears when you
// are in the other two modes, not in php.
function performPHPSession(extraDataToPass) {
  const xhttp = new XMLHttpRequest();

  let fileName = "scrambler_session.php";
  let url = fileName + "?task=" + extraDataToPass;

  xhttp.open("GET", url);
  xhttp.send();
}

// This function performs (color/css) update to the task selection menu (Encode data, Generate key, Decode data).
// It also sends current task info to the server using "performPHPSession" function to keep info updated.
// When selected "Generate key", it runs genKey() and outputs a valid key.
// It updates "myUrl" variable to keep JavaScript and PHP task mode synchronized.
function taskSelect(click){
  click.preventDefault();
  this.setAttribute("class", "options selected");

  let id = this.getAttribute("id");

  switch(id){
    case "taskEnc":
      // system
      myTask = "encode";
      myUrl = page + "?task=" + myTask;
      form.setAttribute("action", myUrl + "#phpResponse");  // Form action update necessary when myProgram = "Both".
      performPHPSession(myTask);  // Telling PHP server my current task.

      // html-css
      taskGen.setAttribute("class", "options");
      taskDec.setAttribute("class", "options");
      phpResponse.innerHTML = "";  // Change of task will clear off phpResponse.
      jsResponse.innerHTML = "";  // Change of task will clear off jsResponse.
      result.value = "";  // Change of task will clear off result box.
      
      break;

    case "taskGen":
      // system
      myTask = "generate-key";
      myUrl = page + "?task=" + myTask;
      form.setAttribute("action", page + "?task=encode#phpResponse");  // Necessary when myProgram = "Both".
      performPHPSession(myTask);  // Telling PHP server my current task.
      genKey();  // Generates a valid key to the key-generator box.

      // html-css
      taskDec.setAttribute("class", "options");
      taskEnc.setAttribute("class", "options");
      phpResponse.innerHTML = "";  // Change of task will clear off phpResponse.
      jsResponse.innerHTML = "";  // Change of task will clear off jsResponse.
      result.value = "";  // Change of task will clear off result box.

      break;

    case "taskDec":
      // system
      myTask = "decode";
      myUrl = page + "?task=" + myTask;
      form.setAttribute("action", myUrl + "#phpResponse");  // Form action update necessary when myProgram = "Both".
      performPHPSession(myTask);  // Telling PHP server my current task.

      // html-css
      taskEnc.setAttribute("class", "options");
      taskGen.setAttribute("class", "options");
      phpResponse.innerHTML = "";  // Change of task will clear off phpResponse.
      jsResponse.innerHTML = "";  // Change of task will clear off jsResponse.
      result.value = "";  // Change of task will clear off result box.

      break;
  }
}

// This function selects the program for interactions and processings of the scrambler application.
// This functions performs (color/css) update to the program selection menu (JavaScript | PHP | Both) as well.
// If PHP is selected, it loads the page to "myUrl", because PHP needs current situation of the application.
// For every tapping, it clears out the result box as well as the program responses.
function programSelect(click){
  click.preventDefault();  
  if(myProgram == "JavaScript"){
    // system
    sessionStorage.setItem('myProgram','PHP');
    window.location.href = myUrl; // Jumping to myUrl.
  }
  else if(myProgram == "PHP"){
    // system
    myProgram = "Both";
    sessionStorage.setItem('myProgram','Both');
    taskSelectionSettings(); // Re-enabling the JS-things...

    // html-css
    progJS.style.color = "grey";
    progPHP.style.color = "grey";
    progBoth.style.color = "Chocolate";
    phpResponse.innerHTML = "";  // Change of program will clear off phpResponse.
    jsResponse.innerHTML = "";  // Change of program will clear off jsResponse.
  }
  else if(myProgram == "Both"){
    // system
    myProgram = "JavaScript";
    sessionStorage.setItem('myProgram','JavaScript');

    // html-css
    progJS.style.color = "Chocolate";
    progPHP.style.color = "grey";
    progBoth.style.color = "grey";
    phpResponse.innerHTML = "";  // Change of program will clear off phpResponse.
    jsResponse.innerHTML = "";  // Change of program will clear off jsResponse.
  }
  // html-css
  result.value = "";  // 'Change of program'/toggling will clear off result box.
  return;
}

//This function will clear the input box for "Key".
function clearKey(click){
  click.preventDefault();
  key.value = "";
}

//This function will clear the input box for "Data".
function clearData(click){
  click.preventDefault();
  data.value = "";
}

//This function generates a valid key and outputs it in the input box for "Key".
function genKey(){
  let keyOriginal, charsOriginal, charsMod, currentIndex, randomIndex;
  keyOriginal = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  charsOriginal = keyOriginal.split('');
  charsMod = charsOriginal;
  currentIndex = charsMod.length;

//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  while(currentIndex != 0){
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [charsMod[currentIndex], charsMod[randomIndex]] = [charsMod[randomIndex], charsMod[currentIndex]];
  }

  keyMod = charsMod.join('');
  key.value = keyMod;
  return;
}

//This function is JavaScript equivalent of PHP htmlspecialchars
//https://stackoverflow.com/questions/1787322/what-is-the-htmlspecialchars-equivalent-in-javascript
function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

//-------------------------------------------------- key checking and processing

//This function is a compound function that 
//checks for key length, key characters 
//and then it approaches the data and encodes/decodes accordingly.
//Holds the initializations for checking and rearranging(encoding/decoding).
function jsKeyCheck(submitEvent) {
  // When only "PHP" selected, we don't want to use JavaScript.
  if(myProgram === "PHP") return;
  // PHP must know that, form submitted from "generate-key" mode should be 
  // taken to encode data. (Specially required when "Both" is selected.)
  if(myTask === "generate-key") performPHPSession("encode");

  let keySubmitted, keyOriginal, lengthStandard;
  keySubmitted = document.getElementById('key').value.trim();
  keySubmitted = escapeHtml(keySubmitted);
  keyOriginal = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  lengthStandard = keyOriginal.length;
  phpResponse.innerHTML = "";
  if(keyLengthCheck(keySubmitted, lengthStandard, jsResponse, submitEvent) && keyCharCheck(keySubmitted, keyOriginal, jsResponse, submitEvent)) {
    //trimming and escaping html on data
    let data = escapeHtml(document.getElementById('data').value.trim());
    if(rearrangeData(data, keySubmitted, keyOriginal)){
      if(myProgram === "Both"){
        alert("JavaScript: Successfully done! Proceeding to the server!");
      }else{
        submitEvent.preventDefault();
        jumpToJSResponse.click();
      }
    }
    else{
      submitEvent.preventDefault();
      jsResponse.innerHTML = "Unknown Error!";
      jumpToJSResponse.click();
    }
  }
  else{
    jumpToJSResponse.click();
  }
}

//This function checks the key-length. Used inside of "jsKeyCheck" function.
function keyLengthCheck(keySubmitted, lengthStandard, errRespObj, eventName){
  if(keySubmitted.length !== lengthStandard){
    if(errRespObj){
      errRespObj.innerHTML = `${progName} ${errLn1} ${errKeyLength}`;
    }
    if(eventName) {
      eventName.preventDefault(); // this prevents the default "what is supposed to happed" of that event. In this case, submitting the form.
    }
    return false;
  }
  return true;
}

//This function checks for repeatition of characters in the input key. Used inside of "jsKeyCheck" function.
function keyCharCheck(keySubmitted='', keyOriginal='', errRespObj, eventName) {
  let charsOriginal, length, j;
  charsOriginal = keyOriginal.split('');
  length = keySubmitted.length;
  j = 0;
  for(let i = 0; i < length; i++){
    if(charsOriginal.includes(keySubmitted[i]) === true){
      let index = charsOriginal.indexOf(keySubmitted[i]);
      charsOriginal.splice(index, 1);
    }
    else{
      j++;
      if(errRespObj) {
        if(j == 1) {errRespObj.innerHTML = `${progName} ${errLn1}`;}
        errRespObj.innerHTML += errKeyChar(j, keySubmitted[i]);
      }
    }
  }
  if(j > 0){
    if(eventName) {
      eventName.preventDefault(); // this prevents the default "what is supposed to happed" of that event. In this case, submitting the form.
    }
    
    return false;
  }
  return true;
}

// This function does the encoding/decoding signaled out by the "myTask" variable.
// Used inside of "jsKeyCheck" function.
function rearrangeData(data, keySubmitted, keyOriginal){
  let charsOriginal, charsSubmitted, index;
  let output = [];
  charsOriginal = keyOriginal.split('');
  charsSubmitted = keySubmitted.split('');
  if(myTask === 'decode'){
    for(let i = 0; i < data.length; i++){
      index = charsSubmitted.indexOf(data[i]);
      if(index !== -1){
        output[i] = keyOriginal[index];
      }else{
        output[i] = data[i];
      }
    }
    jsResponse.innerHTML = `${progName} ${successDec}`;
    key.value = keySubmitted;
    data.value = data;
    result.value = output.join('');
    return true;
  }
  if(myTask === 'encode' || myTask === 'generate-key'){
    for(let i = 0; i < data.length; i++){
      index = charsOriginal.indexOf(data[i]);
      if(index !== -1){
        output[i] = keySubmitted[index];
      }
      else{
        output[i] = data[i];
      }
    }
    jsResponse.innerHTML = `${progName} ${successEnc}`;
    key.value = keySubmitted;
    data.value = data;
    result.value = output.join('');
    
    return true;
  }
}
