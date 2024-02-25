#if defined(ESP32)
  #include <WiFiMulti.h>
  WiFiMulti wifiMulti;
  #define DEVICE "ESP32"
  #elif defined(ESP8266)
  #include <ESP8266WiFiMulti.h>
  ESP8266WiFiMulti wifiMulti;
  #define DEVICE "ESP8266"
  #endif
  
  #include <InfluxDbClient.h>
  #include <InfluxDbCloud.h>

#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128  // OLED display width, in pixels
#define SCREEN_HEIGHT 32  // OLED display height, in pixels

#define OLED_RESET -1        // Reset pin # (or -1 if sharing Arduino reset pin)
#define SCREEN_ADDRESS 0x3C  ///< See datasheet for Address; 0x3D for 128x64, 0x3C for 128x32
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
  


// WiFi AP SSID
#define WIFI_SSID "tc.pphbll_"  // Change as needed
// WiFi password
#define WIFI_PASSWORD "00000000" // Change as needed

byte mac[6];
String str_mac = "";

  #define INFLUXDB_URL "https://us-east-1-1.aws.cloud2.influxdata.com"
  #define INFLUXDB_TOKEN "Ic1ps4u_472wA1G7aY_-OJdI-kD_9-lFMIVEHmhLHFaUIAoaoZPgIvzct_QyVex57qDcaDLkss1NZXT5jZeePw=="
  #define INFLUXDB_ORG "74554ba6d34f8f12"
  #define INFLUXDB_BUCKET "dashboard37"
  
  // Time zone info
#define TZ_INFO "UTC7"
#define analog A0
// #define humidin D2
// #define Light D1
#define R D0
// #define Sonic D1

const int pingPin = D5;
int inPin = D6;

long microsecondsToCentimeters(long microseconds) {

  return microseconds / 29 / 2;
}


  
  // Declare InfluxDB client instance with preconfigured InfluxCloud certificate
InfluxDBClient client(INFLUXDB_URL, INFLUXDB_ORG, INFLUXDB_BUCKET, INFLUXDB_TOKEN, InfluxDbCloud2CACert);
  
  // Declare Data point
Point sensor("wifi_status");
  
void setup() {
  Serial.begin(115200);
   if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;)
      ;  // Don't proceed, loop forever
  }
  
    // Setup wifi
  WiFi.mode(WIFI_STA);
  wifiMulti.addAP(WIFI_SSID, WIFI_PASSWORD);

  // pinMode(analog, INPUT);
  pinMode(R, OUTPUT);
  pinMode(analog, INPUT_PULLUP);
  digitalWrite(R, HIGH);
  // pinMode(R, OUTPUT);
  // // pinMode(Sonic, OUTPUT);

  // pinMode(R, LOW);
  // // pinMode(Sonic, LOW);
  
  Serial.print("Connecting to wifi");
  while (wifiMulti.run() != WL_CONNECTED) {
    Serial.print(".");
    delay(100);
  }
  Serial.println();
  
    // Accurate time is necessary for certificate validation and writing in batches
    // We use the NTP servers in your area as provided by: https://www.pool.ntp.org/zone/
    // Syncing progress and the time will be printed to Serial.
  timeSync(TZ_INFO, "pool.ntp.org", "time.nis.gov");
  
  
    // Check server connection
    if (client.validateConnection()) {
      Serial.print("Connected to InfluxDB: ");
      Serial.println(client.getServerUrl());
    } else {
      Serial.print("InfluxDB connection failed: ");
      Serial.println(client.getLastErrorMessage());
    }
    // ... code in setup() from Initialize Client
      
    WiFi.macAddress(mac);
    str_mac += macToStr(mac);
    Serial.println(str_mac);

    // Add tags to the data point
    sensor.addTag("device", str_mac);
    sensor.addTag("SSID", WiFi.SSID());


  }

  int R1 = 0;
  // int loopCount = 0;
  // int Sonic1 = 0;
  
long duration, cm;

  void loop() {


  display.clearDisplay();

  pinMode(pingPin, OUTPUT);
  digitalWrite(pingPin, LOW);
  delayMicroseconds(1);
  digitalWrite(pingPin, HIGH);
  delayMicroseconds(1);
  digitalWrite(pingPin, LOW);
  pinMode(inPin, INPUT);
  duration = pulseIn(inPin, HIGH);
  cm = microsecondsToCentimeters(duration);
  Serial.print(cm);
  Serial.print("cm");
  Serial.println();

  // Serial.print(R1);
    
    // Clear fields for reusing the point. Tags will remain the same as set above.
    sensor.clearFields();
  
    // Store measured value into point
    // Report RSSI of currently connected network
    sensor.addField("rssi", WiFi.RSSI());
    sensor.addField("R", R1);
    sensor.addField("Sonic", cm);
  
    // Print what are we exactly writing
    Serial.print("Writing: ");
    Serial.println(sensor.toLineProtocol());
  
    // Check WiFi connection and reconnect if needed
    if (wifiMulti.run() != WL_CONNECTED) {
      Serial.println("Wifi connection lost");
    }
  
    // Write point
    if (!client.writePoint(sensor)) {
      Serial.print("InfluxDB write failed: ");
      Serial.println(client.getLastErrorMessage());
    }

display.clearDisplay();
display.setTextSize(1);
display.setTextColor(WHITE);

// Display your device ID
display.setCursor(0, 0);
display.print("651998037");

// Display Sonic value
display.setCursor(0, 10);
display.print("Dist :");
display.setCursor(55, 10); // Adjust the X-coordinate as needed
display.print(cm);
display.print(" cm");

// Display R value
display.setCursor(0, 20);
display.print("Man :  ");
display.setCursor(45, 20); // Adjust the X-coordinate as needed
display.print(R1);
display.print(" %");

// Display the OLED content
display.display();


    digitalWrite(R, HIGH);
    delay(100);
    R1 = (1024 - analogRead(analog));
    R1 = map(R1, 62, 1024, 37, 137);
    digitalWrite(R, LOW);
    delay(100);

    // Serial.println(R);

    // digitalWrite(R, HIGH);
    // delay(100);
    // R1 = (1024 - analogRead(analog));
    // // R1 = map(R1, 99, 1024, 0, 100);
    // digitalWrite(R, LOW);
    // delay(100);


//   if (loopCount == 100) {
//   digitalWrite(R, HIGH);
//   delay(5);
//   R1 = analogRead(analog);  // Change this line to use analogRead
//   R1 = map(R1, 16, 960, 17, 47);
//   Serial.println(R1);  // Change this line to print R1 instead of R
//   digitalWrite(R, LOW);
//   delay(5);
//   loopCount = 200;
// }


    // digitalWrite(Sonic, HIGH);
    // delay(100);
    // Sonic1 = (1024 - analogRead(analog));
    // Sonic1 = map(Sonic1, 99, 1022, 0, 100);
    // digitalWrite(Sonic, LOW);
    // delay(100);

    // readinflux();
    Serial.println("Waiting 1 second");
    delay(1000);
  }

  String macToStr(const uint8_t* mac)
  {
  String result;
  for (int i = 0; i < 6; ++i) {
  result += String(mac[i], 16);
  if (i < 5)
  result += ':';
  }
  return result;
  }

void readinflux(){
String query1;
        query1 = "from(bucket: \"dashboard37\")\n\
        |> range(start: -10m)\n\
        |> filter(fn: (r) => r[\"device\"] == \"8:f9:e0:6c:55:93\")\n\
        |> filter(fn: (r) => r[\"_field\"] == \"Sonic\")\n\
        |> last()";
        FluxQueryResult result = client.query(query1);
        while (result.next()) {
        Serial.println(result.getValueByName("_value").getDouble());
        }
        result.close();
}