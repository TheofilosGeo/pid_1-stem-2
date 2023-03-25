def on_received_number(receivedNumber):
    global Flag, Value
    Flag = "True"
    basic.show_number(receivedNumber)
    Value = receivedNumber
radio.on_received_number(on_received_number)

def CreateMission(MissionType: str, Index_lst: number):
    global Response, Response_lst, ServerMsg
    Response = "ERROR"
    Response_lst = []
    while Response == "ERROR":
        ServerMsg = WROHellasCloud.start_mission(MissionType)
        Response_lst = ServerMsg.split(";")
        Response = Response_lst[0]
    MissionType_lst[Index_lst] = MissionType
    MissionID_lst[Index_lst] = Response_lst[0]
    MissionArea_lst[Index_lst] = Response_lst[1]
def Position_B09():
    global Flag, Pos_To
    PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
    PID_S2_UntilCross_P0(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
    while pins.digital_read_pin(DigitalPin.P8) == 0:
        wuKong.set_all_motor(20, 20)
    while pins.digital_read_pin(DigitalPin.P8) == 1:
        wuKong.set_all_motor(20, 20)
    wuKong.stop_all_motor()
    while Pos_To == "B09":
        radio.send_string("" + (MissionType_lst.shift()))
        while Flag == "False":
            basic.pause(100)
        basic.pause(1000)
        CompleteMission(MissionID_lst.shift(), convert_to_text(Value))
        Flag = "False"
        Pos_To = MissionArea_lst.shift()
def TurnRight_90():
    while pins.digital_read_pin(DigitalPin.P8) == 1:
        wuKong.set_motor_speed(wuKong.MotorList.M1, 20)
    while pins.digital_read_pin(DigitalPin.P8) == 0:
        wuKong.set_motor_speed(wuKong.MotorList.M1, 20)
    while pins.digital_read_pin(DigitalPin.P0) == 0:
        wuKong.set_motor_speed(wuKong.MotorList.M1, 20)
    while pins.digital_read_pin(DigitalPin.P0) == 1:
        wuKong.set_motor_speed(wuKong.MotorList.M1, 20)
    wuKong.stop_all_motor()
def Position_B07_B15(text5: str):
    global Flag, Pos_To
    PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    PID_S2_UntilCross_P0(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    while pins.digital_read_pin(DigitalPin.P8) == 0:
        wuKong.set_all_motor(20, 20)
    while pins.digital_read_pin(DigitalPin.P8) == 1:
        wuKong.set_all_motor(20, 20)
    wuKong.stop_all_motor()
    if Pos_To == text5:
        radio.send_string("" + (MissionType_lst.shift()))
        while Flag == "False":
            basic.pause(100)
        basic.pause(1000)
        CompleteMission(MissionID_lst.shift(), convert_to_text(Value))
        Flag = "False"
        Pos_To = MissionArea_lst.shift()
def Position_B06_B14(text3: str):
    global Cars, ParkingDistance, Value, Pos_To
    PID_S2_UntilCross_P8(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
    wuKong.stop_all_motor()
    if Pos_To == text3:
        MissionType_lst.remove_at(0)
        Cars = 0
        for index2 in range(3):
            ParkingDistance = sonar.ping(DigitalPin.P13, DigitalPin.P12, PingUnit.CENTIMETERS)
            while ParkingDistance == 0:
                ParkingDistance = sonar.ping(DigitalPin.P13, DigitalPin.P12, PingUnit.CENTIMETERS)
            if ParkingDistance < 8:
                Cars += 1
            PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
            PID_S2_UntilCross_P8(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
        Value = 3 - Cars
        CompleteMission(MissionID_lst.shift(), convert_to_text(Value))
        Pos_To = MissionArea_lst.shift()
    else:
        for index22 in range(2):
            PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
            PID_S2_UntilCross_P8(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
        wuKong.stop_all_motor()

def on_button_pressed_a():
    global Flag
    Flag = "False"
    CreateMission("tmp", 0)
    CreateMission("hum", 1)
    CreateMission("hpa", 2)
    CreateMission("umv", 3)
    CreateMission("dbm", 4)
    CreateMission("prk", 5)
    Shorting()
    Position_B01()
    Position_B02_B10("B02")
    Position_B05_B13("B05")
    Position_B06_B14("B06")
    Position_B07_B15("B07")
    Position_B08_B16("B08")
    Position_B09()
    Position_B02_B10("B10")
    Position_B05_B13("B13")
    Position_B06_B14("B14")
    Position_B07_B15("B15")
    Position_B08_B16("B16")
    basic.show_icon(IconNames.HAPPY)
input.on_button_pressed(Button.A, on_button_pressed_a)

def PID_S2_UntilBlack(S1_Black: number, S1_White: number, S2_Black: number, S2_White: number, Power: number, Kp: number):
    global P1_Sensor, P2_Sensor, error, P, M1_Power, M2_Power
    while pins.digital_read_pin(DigitalPin.P8) == 1:
        P1_Sensor = Math.map(pins.analog_read_pin(AnalogPin.P1),
            S1_Black,
            S1_White,
            12,
            90)
        P2_Sensor = Math.map(pins.analog_read_pin(AnalogPin.P2),
            S2_Black,
            S2_White,
            12,
            90)
        error = P1_Sensor - P2_Sensor
        P = Kp * error
        M1_Power = Power - P
        M2_Power = Power + P
        wuKong.set_all_motor(M1_Power, M2_Power)
def Position_B02_B10(text2: str):
    global Flag, Pos_To
    PID_S2_UntilCross_P8(P1_Black, P1_White, P2_Black, P2_White, 20, 0.2)
    PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.2)
    PID_S2_UntilCross_P8(P1_Black, P1_White, P2_Black, P2_White, 20, 0.2)
    wuKong.stop_all_motor()
    if Pos_To == text2:
        radio.send_string("" + (MissionType_lst.shift()))
        while Flag == "False":
            basic.pause(100)
        basic.pause(1000)
        CompleteMission(MissionID_lst.shift(), convert_to_text(Value))
        Flag = "False"
        Pos_To = MissionArea_lst.shift()
def CompleteMission(MissionId: str, Data: str):
    global Response, Response_lst, ServerMsg
    Response = "ERROR"
    Response_lst = []
    while Response == "ERROR":
        ServerMsg = WROHellasCloud.complete_mission(MissionId, Data)
        Response_lst = ServerMsg.split(";")
        Response = Response_lst[0]
def PID_S2_UntilCross_P8(S1_Black2: number, S1_White2: number, S2_Black2: number, S2_White2: number, Power2: number, Kp2: number):
    global P1_Sensor, P2_Sensor, error, P, M1_Power, M2_Power
    while pins.digital_read_pin(DigitalPin.P8) == 0:
        P1_Sensor = Math.map(pins.analog_read_pin(AnalogPin.P1),
            S1_Black2,
            S1_White2,
            12,
            90)
        P2_Sensor = Math.map(pins.analog_read_pin(AnalogPin.P2),
            S2_Black2,
            S2_White2,
            12,
            90)
        error = P1_Sensor - P2_Sensor
        P = Kp2 * error
        M1_Power = Power2 + P
        M2_Power = Power2 - P
        wuKong.set_all_motor(M1_Power, M2_Power)
def Εnergy_measurement():
    PID_S2_UntilCross_P8(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
    wuKong.set_all_motor(20, 20)
    basic.pause(1100)
    wuKong.stop_all_motor()
    while pins.digital_read_pin(DigitalPin.P8) == 1:
        wuKong.set_all_motor(70, -70)
    while pins.digital_read_pin(DigitalPin.P8) == 0:
        wuKong.set_all_motor(70, -70)
    while pins.digital_read_pin(DigitalPin.P8) == 1:
        wuKong.set_all_motor(70, -70)
    wuKong.set_all_motor(70, -70)
    basic.pause(100)
    wuKong.stop_all_motor()
    while pins.digital_read_pin(DigitalPin.P0) == 0:
        wuKong.set_all_motor(-70, -70)
    while pins.digital_read_pin(DigitalPin.P0) == 1:
        wuKong.set_all_motor(70, 70)
    wuKong.stop_all_motor()
    wuKong.set_motor_speed(wuKong.MotorList.M2, 30)
    basic.pause(200)
    while pins.digital_read_pin(DigitalPin.P0) == 0:
        wuKong.set_motor_speed(wuKong.MotorList.M2, 30)
    wuKong.stop_all_motor()
def Position_B05_B13(text: str):
    global Flag, Pos_To
    PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
    PID_S2_UntilCross_P8(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
    PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
    PID_S2_UntilCross_P0(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
    while pins.digital_read_pin(DigitalPin.P8) == 0:
        wuKong.set_all_motor(20, 20)
    while pins.digital_read_pin(DigitalPin.P8) == 1:
        wuKong.set_all_motor(20, 20)
    wuKong.stop_all_motor()
    TurnRight_90()
    wuKong.stop_all_motor()
    PID_S2_UntilCross_P8(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    PID_S2_UntilCross_P0(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    while pins.digital_read_pin(DigitalPin.P8) == 0:
        wuKong.set_all_motor(20, 20)
    wuKong.stop_all_motor()
    while Pos_To == text:
        radio.send_string("" + (MissionType_lst.shift()))
        while Flag == "False":
            basic.pause(100)
        basic.pause(1000)
        CompleteMission(MissionID_lst.shift(), convert_to_text(Value))
        Flag = "False"
        Pos_To = MissionArea_lst.shift()

def on_button_pressed_b():
    PID_S2_UntilCross_P0(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
    while pins.digital_read_pin(DigitalPin.P0) != 0:
        wuKong.set_all_motor(20, 20)
    wuKong.stop_all_motor()
    while pins.digital_read_pin(DigitalPin.P0) != 1:
        wuKong.set_motor_speed(wuKong.MotorList.M2, 20)
    wuKong.stop_motor(wuKong.MotorList.M2)
input.on_button_pressed(Button.B, on_button_pressed_b)

def PID_S2_UntilCross_P0(S1_Black3: number, S1_White3: number, S2_Black3: number, S2_White3: number, Power3: number, Kp3: number):
    global P1_Sensor, P2_Sensor, error, P, M1_Power, M2_Power
    while pins.digital_read_pin(DigitalPin.P0) == 0:
        P1_Sensor = Math.map(pins.analog_read_pin(AnalogPin.P1),
            S1_Black3,
            S1_White3,
            12,
            90)
        P2_Sensor = Math.map(pins.analog_read_pin(AnalogPin.P2),
            S2_Black3,
            S2_White3,
            12,
            90)
        error = P1_Sensor - P2_Sensor
        P = Kp3 * error
        M1_Power = Power3 + P
        M2_Power = Power3 - P
        wuKong.set_all_motor(M1_Power, M2_Power)
def Position_B08_B16(text4: str):
    global Flag, Pos_To
    TurnRight_90()
    wuKong.stop_all_motor()
    PID_S2_UntilCross_P8(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
    wuKong.stop_all_motor()
    while Pos_To == text4:
        basic.show_icon(IconNames.HAPPY)
        if MissionArea_lst[0] == "rnp":
            Εnergy_measurement()
        else:
            radio.send_string("" + (MissionType_lst.shift()))
            while Flag == "False":
                basic.pause(100)
            basic.pause(1000)
            CompleteMission(MissionID_lst.shift(), convert_to_text(Value))
            Flag = "False"
            Pos_To = MissionArea_lst.shift()
def Position_B01():
    global Pos_To, Flag
    PID_S2_UntilCross_P0(P1_Black, P1_White, P2_Black, P2_White, 20, 0.2)
    while pins.digital_read_pin(DigitalPin.P8) == 0:
        wuKong.set_all_motor(20, 20)
    wuKong.stop_all_motor()
    TurnRight_90()
    wuKong.stop_all_motor()
    Pos_To = MissionArea_lst.shift()
    while Pos_To == "B01":
        basic.show_icon(IconNames.HAPPY)
        radio.send_string("" + (MissionType_lst.shift()))
        while Flag == "False":
            basic.pause(100)
        basic.pause(1000)
        CompleteMission(MissionID_lst.shift(), convert_to_text(Value))
        Flag = "False"
        Pos_To = MissionArea_lst.shift()
def Shorting():
    global i, index, temp
    i = 0
    while i <= len(MissionArea_lst):
        index = len(MissionArea_lst)
        while index >= i:
            if MissionArea_lst[index] < MissionArea_lst[index - 1]:
                temp = MissionArea_lst[index]
                MissionArea_lst[index] = MissionArea_lst[index - 1]
                MissionArea_lst[index - 1] = temp
                temp = MissionType_lst[index]
                MissionType_lst[index] = MissionType_lst[index - 1]
                MissionType_lst[index - 1] = temp
                temp = MissionID_lst[index]
                MissionID_lst[index] = MissionID_lst[index - 1]
                MissionID_lst[index - 1] = temp
            index += -1
        i += 1
temp = ""
index = 0
i = 0
M2_Power = 0
M1_Power = 0
P = 0
error = 0
P2_Sensor = 0
P1_Sensor = 0
ParkingDistance = 0
Cars = 0
Pos_To = ""
MissionArea_lst: List[str] = []
MissionID_lst: List[str] = []
MissionType_lst: List[str] = []
ServerMsg = ""
Response_lst: List[str] = []
Response = ""
Value = 0
Flag = ""
P2_White = 0
P2_Black = 0
P1_White = 0
P1_Black = 0
basic.show_icon(IconNames.NO)
radio.set_group(167)
P1_Black = 843
P1_White = 1023
P1_Offset = 51
P2_Black = 846
P2_White = 1023
WROHellasCloud.wifi_settings(SerialPin.P14,
    SerialPin.P15,
    BaudRate.BAUD_RATE115200,
    "smartbirds",
    "strawberry")
WROHellasCloud.cloud_settings("164.90.177.227", "3040", "XEAUD")
WROHellasCloud.wifi_connect()
while not (WROHellasCloud.wifi_status()):
    WROHellasCloud.wifi_connect()
basic.show_icon(IconNames.YES)