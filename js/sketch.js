///////Arduino Hardware///////

let serialPDM;
let portName = 'COM3';
let sensors;
let jCursorX, jCursorY;

let joyStickDirection;

let buttonState;

/////////////////////////////

let colorArr;

//////Tone.js/////////
let flag = true;

let currentNote = "F#4";



const synth = new Tone.PolySynth();
const synth2 = new Tone.PolySynth();

let notes = {
  '1': 'F#3',
  '2': 'G#3',
  '3': 'C#4',
  '4': 'B3',
  '5': 'D#4',
  '6': 'F#4',
  'a': 'F#4',
  's': 'G#4',
  'd': 'A#4',
  'f': 'C#5',
  'g': 'D#5',
  'h': 'F#5',
  'j': 'G#5',
  'k': 'A#5',
  'l': 'C#6',
  'i': 'D#6'

}

let colorList = {'#ff0000': 'F#4',
                  '#ffa500': 'G#4',
                  '#ffff00': 'A#4',
                  '#39ff14': 'C#5',
                  '#00ffff': 'D#5',
                  '#0000ff': 'F#5',
                  '#ff00ff': 'G#5',
                  '#76472d': 'A#5',
                  '#ffffff': 'C#6',
                  '#000000': 'D#6'};

let slider;

const now = Tone.now();

const delay = new Tone.FeedbackDelay("5n", 0.5);
const tremolo = new Tone.Tremolo(5, 0.75);

var Fs_chord = ["F#3", "G#3", "C#4"];
var B_chord = ["B3", "D#4", "F#4"];

var pianoPart = new Tone.Part(function(time, chord) {
    synth2.triggerAttackRelease(chord, "1n", time, 0.25);
    
  }, [
    ["0:0", Fs_chord],
    ["0:8", Fs_chord],
    ["0:16", B_chord],
    ["0:24", B_chord],
  ]).start();

  pianoPart.loop = true;
  pianoPart.loopEnd = "8m";

///////////////////////////////////////







function setup(){

  colorArr = ["#FF0000", '#ffa500', '#ffff00',
                  '#39FF14', '#00ffff', '#0000ff', 
                  '#ff00ff', '#76472d', '#ffffff', '#000000'];

  ///Arduino Hardware Setup///
  joyStickDirection = [0,0];

  serialPDM = new PDMSerial(portName);
  sensors = serialPDM.sensorData;

  jCursorX = 50;
  jCursorY = windowHeight - 50;
  buttonState = 0;
  

  //////Tone.js/////////

  createCanvas(windowWidth,windowHeight);

  pianoPart.start();
  Tone.Transport.start();

  synth2.toDestination();
  synth.connect(tremolo);
  
  tremolo.toDestination().start();

  //////////////////////


  

  

 
  
  
}

function draw(){

  strokeWeight(0);
  ///New Hardware Code///


  textSize(32);
  fill(32, 300, 268);
  buttonState = sensors.button;


  ///////////////////////
  
  



  ///////////Old Code from 2.4///////////

  
  
  // let colorArr = ["#FF0000", '#ffa500', '#ffff00',
  //                 '#39FF14', '#00ffff', '#0000ff', 
  //                 '#ff00ff', '#76472d', '#ffffff', '#000000'];



  
  
  if(flag){
    currentColor = color(colorArr[colorArr.length - 1]);  
  }
  
  
  createPallete(colorArr);
  
  //paint(currentColor);


  /// Testing Joystick ///
  
  joyStickDirection[0] = sensors.xVal;
  //console.log("x-values: " + sensors.xVal); //Logging x-values
  joyStickDirection[1] = sensors.yVal;
  
  joystickPaint(currentColor);
  fill(currentColor);
  ellipse(jCursorX, jCursorY, 10, 10);
  
  if(joyStickDirection[0] != undefined && joyStickDirection[1] != undefined){

    jCursorX = jCursorX + (1 * joyStickDirection[0]);
    jCursorY = jCursorY + (-1 * joyStickDirection[1]);

  }
  
  
  let squareSize = height / colorArr.length;

  
  

  

   //Need to add a check to see if button is pressed to change color.
  if(jCursorX < squareSize && buttonState == 1){
    
    synth.triggerRelease(currentNote);
    currentColor = selectColor(squareSize, colorArr);
    currentNote = colorList[currentColor.toString('#rrggbb')];
    
    console.log("Note is now: " + currentNote);
    flag = false;
    synth.triggerAttack(currentNote, '16n');
    buttonState = 0;
    serialPDM.transmit('button', buttonState);

    // TODO: Buzzer go off when color change

    serialPDM.transmit('buzzer', 200);
    
    
  }


  /////////////////////////////////////////////

  
  



}



function mousePressed(){

  
  console.log("Current Note: " + currentNote);
  
  synth.triggerAttack(currentNote);

}

function mouseReleased(){
  
  synth.triggerRelease(currentNote);

}




function createPallete(colorArray){
  
  let y = 0;
  let squareSize = height / colorArray.length;
  let currentColor = color(0);
  
  for(let i = 0; i < colorArray.length; i++){
    
    currentColor = color(colorArray[i]);
    fill(currentColor);
    square(0, y, squareSize);
    y = y + squareSize;
    
  }
   
}

function paint(colorSelected){
    
    strokeWeight(5);
    stroke(colorSelected);
    if(mouseIsPressed){
      line(mouseX, mouseY, pmouseX, pmouseY);
    }
    tremolo.frequency.value = (mouseX / 250) + 0.1;
  }



  function joystickPaint(colorSelected){
    
    strokeWeight(5);
    stroke(colorSelected);
    if(joyStickDirection[0] != 0 || joyStickDirection[1] != 0){ //Joystick has at least one direction
      
        console.log(joyStickDirection[0] + ", " + joyStickDirection[1]);
        if(joyStickDirection[0] != 0){
          

          
        }    

    }

  }




function selectColor(squareSize, colorArr){
  
  let hoveredSquare = floor(jCursorY / squareSize);
  
  let chosenColor = colorArr[hoveredSquare];
  
  console.log(chosenColor);
  
  let c = color(chosenColor);
  
  return c;
  
}


