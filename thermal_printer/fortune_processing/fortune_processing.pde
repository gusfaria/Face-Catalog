import spacebrew.*;
import processing.serial.*;

String server="sandbox.spacebrew.cc";
String name="processing_printer";
String description ="soon string";
//
////values in the arduino are 2 to 11 in this case. 
////This variable holds the mapped value from 0-1023 range from Spacebrew to the 2-11 range.
//int sendValueToArduino = 2;
//
Spacebrew sb; //our spacebrew object
Serial myPort; //the serial port
int value = 0;
void setup() {

  //This doesn't matter. Processing is not drawing anything. 
  //See description at the top.
  size(500, 500);

  sb = new Spacebrew( this );

  // adding the range and the on/off button
  sb.addSubscribe( "js_input", "string" );

  // connect!
  sb.connect("ws://"+server+":9000", name, description );

  //print available serial ports to console
  int i = 0;
  for (String s : Serial.list()) {
    println(Integer.toString(i) + ": " + s);
    i++;
  }
 
  myPort = new Serial(this, Serial.list()[(Serial.list().length-1)], 9600); 
  myPort.bufferUntil('\n');
}

void draw() {
  fill(value);
  rect(25, 25, 50, 50);
}

void onStringMessage( String name, String value ){
  text(value, 150, 120);  
  myPort.write(value + "\n"); 
}
