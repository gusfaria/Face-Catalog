
#include "SoftwareSerial.h"
#include "Adafruit_Thermal.h"
#include "psychic_270.h"

//#include "adalogo.h"
//#include "adaqrcode.h"

#include <avr/pgmspace.h>

int printer_RX_Pin = 2;  // This is the green wire
int printer_TX_Pin = 3;  // This is the yellow wire
Adafruit_Thermal printer(printer_RX_Pin, printer_TX_Pin);

long data[3];
String tempStr = "";
String completeStr = "";

int counter = 0;
int lastIndex = 0;

void setup(){
  Serial.begin(9600);
  pinMode(7, OUTPUT); 
  digitalWrite(7, LOW); // To also work w/IoTP printer
  printer.begin();

  printer.doubleHeightOn();
  printer.println(" "); // Print line
  printer.println("IS WORKING..."); // Print line
  printer.println(" "); // Print line
  printer.doubleHeightOff();
}

void loop() {
  if (Serial.available() > 0) {
    char ch = Serial.read();
    if (ch == '*') {

      completeStr = tempStr;
      
//      completeStr = "This is..\n..a test..\n..testing";
      //then send string to thermal printer
      printer.println("");
      printer.printBitmap(psychic_270_width, psychic_270_height, psychic_270_data);
      
      printer.println("");
      printer.setSize('S');
      printer.justify('C');
      printer.println("****************");
      printer.println("");
      
      printer.boldOn();
      printer.doubleHeightOff();
      printer.doubleHeightOn();
      printer.justify('M');
      printer.println(completeStr);
      printer.boldOff();
      printer.doubleHeightOff();
      printer.doubleHeightOff();

      printer.setSize('S');
      printer.justify('C');
      printer.println("****************");
     
      printer.setSize('S');
      printer.justify('C');      
      printer.println("www.gusfaria.com");
      
      printer.println("");
      printer.setSize('M');
      printer.justify('C');
      
      
      tempStr = "";
    } 
    else {

      tempStr += ch;

    }
  }  
}




