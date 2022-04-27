// ****************************************************
// ***** LSU DDEM Pathway:                            *
// ***** Programming Digital Media                    *
// Jesse Allison & Anthony T. Marasco                 *
// PDM - Serial Communication between P5 and Arduino  *

#include "PDMSerial.h"
// #include <PDMSerial.h>   // use if PDMSerial is in your libraries folder

PDMSerial pdm;

const int analogPin = A0;  //the analog input pin sensor is attached to
const int ledPin = 13;    // a digital output pin
const int outPWMPin = 9;  // a pwm (analog) output pin

/////////

int sensorValue = 0;
int sensorTransmitValue = 0;

///////////



void setup() {
  // put your setup code here, to run once:
  
    // Input setup – add more inputs if desired
  pinMode(analogPin, INPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(outPWMPin, OUTPUT);

  Serial.begin(9600);

}

void loop() {
  
  sensorValue = analogRead(analogPin);//read the value from the analog sensor
  
  
  float sensorFloatValue = sensorValue/1023.0;
  
  pdm.transmitSensor("a0", sensorValue);
  pdm.transmitSensor("led",ledPin);
  pdm.transmitSensor("end");

  boolean newData = pdm.checkSerial();
  
  if(newData) {
    if (pdm.getName().equals(String("fade"))) {
      analogWrite(outPWMPin, pdm.getValue());
    }
    else if(pdm.getName().equals(String("led"))){
      digitalWrite(ledPin, pdm.getValue());
    }
  }

}
