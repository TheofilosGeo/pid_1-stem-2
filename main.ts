radio.onReceivedNumber(function (receivedNumber) {
    Flag = "True"
    basic.showNumber(receivedNumber)
    Value = receivedNumber
})
function PID_S2_UntilCross (S1_Black: number, S1_White: number, S2_Black: number, S2_White: number, Power: number, Kp: number) {
    while (pins.digitalReadPin(DigitalPin.P8) == 0) {
        P1_Sensor = Math.map(pins.analogReadPin(AnalogPin.P1), S1_Black, S1_White, 12, 90)
        P2_Sensor = Math.map(pins.analogReadPin(AnalogPin.P2), S2_Black, S2_White, 12, 90)
        error = P1_Sensor - P2_Sensor
        P = Kp * error
        M1_Power = Power + P
        M2_Power = Power - P
        wuKong.setAllMotor(M1_Power, M2_Power)
    }
}
function CreateMission (MissionType: string, Index_lst: number) {
    Response = "ERROR"
    Response_lst = []
    while (Response == "ERROR") {
        ServerMsg = WROHellasCloud.startMission(MissionType)
        Response_lst = ServerMsg.split(";")
    }
    Response = Response_lst[0]
    MissionType_lst[Index_lst] = MissionType
    MissionID_lst[Index_lst] = Response_lst[0]
    MissionArea_lst[Index_lst] = Response_lst[1]
}
function TurnRight_90 () {
    while (pins.digitalReadPin(DigitalPin.P8) == 1) {
        wuKong.setMotorSpeed(wuKong.MotorList.M1, 10)
    }
    while (pins.digitalReadPin(DigitalPin.P8) == 0) {
        wuKong.setMotorSpeed(wuKong.MotorList.M1, 10)
    }
    P1_Sensor = Math.map(pins.analogReadPin(AnalogPin.P1), P1_Black, P1_White, 12, 90)
    while (P1_Sensor < 60) {
        wuKong.setMotorSpeed(wuKong.MotorList.M1, 10)
        P1_Sensor = Math.map(pins.analogReadPin(AnalogPin.P1), P1_Black, P1_White, 12, 90)
    }
    P2_Sensor = Math.map(pins.analogReadPin(AnalogPin.P2), P1_Black, P1_White, 12, 90)
    while (P2_Sensor < 60) {
        wuKong.setMotorSpeed(wuKong.MotorList.M1, 10)
        P2_Sensor = Math.map(pins.analogReadPin(AnalogPin.P2), P2_Black, P2_White, 12, 90)
    }
}
function Position_B02 () {
    TurnRight_90()
    wuKong.stopAllMotor()
    PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    wuKong.stopAllMotor()
    if (Pos_To == "B02") {
        radio.sendString("" + (MissionType_lst.shift()))
        while (Flag == "False") {
            basic.pause(100)
        }
        CompleteMission(MissionID_lst.shift(), convertToText(Value))
        Flag = "False"
        Pos_To = MissionArea_lst.shift()
    }
}
function Position_B13 () {
    for (let index2 = 0; index2 < 2; index2++) {
        PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
        PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    }
    wuKong.stopAllMotor()
    TurnRight_90()
    wuKong.stopAllMotor()
    for (let index2 = 0; index2 < 2; index2++) {
        PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
        PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    }
    wuKong.stopAllMotor()
    while (Pos_To == "B13") {
        radio.sendString("" + (MissionType_lst.shift()))
        while (Flag == "False") {
            basic.pause(100)
            CompleteMission(MissionID_lst.shift(), convertToText(Value))
            Flag = "False"
            Pos_To = MissionArea_lst.shift()
        }
    }
}
input.onButtonPressed(Button.A, function () {
    Flag = "False"
    CreateMission("tmp", 0)
    CreateMission("hum", 1)
    CreateMission("hpa", 2)
    CreateMission("umv", 3)
    CreateMission("dbm", 4)
    CreateMission("prk", 5)
    CreateMission("rnp", 6)
    Shorting()
    Position_B01()
    Position_B02()
    Position_B05()
    Position_B06()
    Position_B07()
    Position_B08()
    Position_B09()
    Position_10()
    Position_B13()
    Position_14()
})
function Position_B09 () {
    PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    wuKong.stopAllMotor()
    while (Pos_To == "B09") {
        radio.sendString("" + (MissionType_lst.shift()))
        while (Flag == "False") {
            basic.pause(100)
        }
        CompleteMission(MissionID_lst.shift(), convertToText(Value))
        Flag = "False"
        Pos_To = MissionArea_lst.shift()
    }
}
function Position_10 () {
    for (let index2 = 0; index2 < 2; index2++) {
        PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
        PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    }
    wuKong.stopAllMotor()
    if (Pos_To == "B10") {
        radio.sendString("" + (MissionType_lst.shift()))
        while (Flag == "False") {
            basic.pause(100)
        }
        CompleteMission(MissionID_lst.shift(), convertToText(Value))
        Flag = "False"
        Pos_To = MissionArea_lst.shift()
    }
}
function PID_S2_UntilBlack (S1_Black: number, S1_White: number, S2_Black: number, S2_White: number, Power: number, Kp: number) {
    while (pins.digitalReadPin(DigitalPin.P8) == 1) {
        P1_Sensor = Math.map(pins.analogReadPin(AnalogPin.P1), S1_Black, S1_White, 12, 90)
        P2_Sensor = Math.map(pins.analogReadPin(AnalogPin.P2), S2_Black, S2_White, 12, 90)
        error = P1_Sensor - P2_Sensor
        P = Kp * error
        M1_Power = Power - P
        M2_Power = Power + P
        wuKong.setAllMotor(M1_Power, M2_Power)
    }
}
function Position_B05 () {
    for (let index2 = 0; index2 < 2; index2++) {
        PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
        PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    }
    wuKong.stopAllMotor()
    TurnRight_90()
    wuKong.stopAllMotor()
    PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    wuKong.stopAllMotor()
    while (Pos_To == "B05") {
        radio.sendString("" + (MissionType_lst.shift()))
        while (Flag == "False") {
            basic.pause(100)
            CompleteMission(MissionID_lst.shift(), convertToText(Value))
            Flag = "False"
            Pos_To = MissionArea_lst.shift()
        }
    }
}
function Position_B08 () {
    TurnRight_90()
    wuKong.stopAllMotor()
    PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    wuKong.stopAllMotor()
    if (Pos_To == "B08") {
        radio.sendString("" + (MissionType_lst.shift()))
        while (Flag == "False") {
            basic.pause(100)
        }
        CompleteMission(MissionID_lst.shift(), convertToText(Value))
        Flag = "False"
        Pos_To = MissionArea_lst.shift()
    }
}
function PID_S2_UntilDistance (S1_Black: number, S1_White: number, S2_Black: number, S2_White: number, Power: number, Kp: number, Distance: number) {
    Front_Ultrasonic_Measure()
    while (S_Distance > Distance) {
        P1_Sensor = Math.map(pins.analogReadPin(AnalogPin.P1), S1_Black, S1_White, 12, 90)
        P2_Sensor = Math.map(pins.analogReadPin(AnalogPin.P2), S2_Black, S2_White, 12, 90)
        error = P1_Sensor - P2_Sensor
        P = Kp * error
        M1_Power = Power - P
        M2_Power = Power + P
        wuKong.setAllMotor(M1_Power, M2_Power)
        Front_Ultrasonic_Measure()
    }
}
function Position_B06 () {
    PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    wuKong.stopAllMotor()
    if (Pos_To == "B06") {
    	
    } else {
        for (let index2 = 0; index2 < 2; index2++) {
            PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
            PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
        }
        wuKong.stopAllMotor()
    }
}
function CompleteMission (MissionId: string, Data: string) {
    Response = "ERROR"
    Response_lst = []
    while (Response == "ERROR") {
        ServerMsg = WROHellasCloud.completeMission(MissionId, Data)
        Response_lst = ServerMsg.split(";")
        Response = Response_lst[0]
    }
}
function Front_Ultrasonic_Measure () {
    S_Distance = sonar.ping(
    DigitalPin.P12,
    DigitalPin.P13,
    PingUnit.Centimeters
    )
    while (S_Distance == 0) {
        S_Distance = sonar.ping(
        DigitalPin.P12,
        DigitalPin.P13,
        PingUnit.Centimeters
        )
    }
}
input.onButtonPressed(Button.B, function () {
    PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    wuKong.setAllMotor(20, 20)
    basic.pause(1100)
    wuKong.stopAllMotor()
    while (pins.digitalReadPin(DigitalPin.P8) == 1) {
        wuKong.setAllMotor(70, -70)
    }
    while (pins.digitalReadPin(DigitalPin.P8) == 0) {
        wuKong.setAllMotor(70, -70)
    }
    while (pins.digitalReadPin(DigitalPin.P8) == 1) {
        wuKong.setAllMotor(70, -70)
    }
    wuKong.setAllMotor(70, -70)
    basic.pause(100)
    wuKong.stopAllMotor()
    while (pins.digitalReadPin(DigitalPin.P0) == 0) {
        wuKong.setAllMotor(-70, -70)
    }
    while (pins.digitalReadPin(DigitalPin.P0) == 1) {
        wuKong.setAllMotor(70, 70)
    }
    wuKong.stopAllMotor()
    wuKong.setMotorSpeed(wuKong.MotorList.M2, 30)
    basic.pause(200)
    while (pins.digitalReadPin(DigitalPin.P0) == 0) {
        wuKong.setMotorSpeed(wuKong.MotorList.M2, 30)
    }
    wuKong.stopAllMotor()
})
function Position_B07 () {
    PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    wuKong.stopAllMotor()
    if (Pos_To == "B07") {
        radio.sendString("" + (MissionType_lst.shift()))
        while (Flag == "False") {
            basic.pause(100)
        }
        CompleteMission(MissionID_lst.shift(), convertToText(Value))
        Flag = "False"
        Pos_To = MissionArea_lst.shift()
    }
}
function Position_B01 () {
    PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    wuKong.stopAllMotor()
    Pos_To = MissionArea_lst.shift()
    while (Pos_To == "B01") {
        basic.showIcon(IconNames.Happy)
        radio.sendString("" + (MissionType_lst.shift()))
        while (Flag == "False") {
            basic.pause(100)
        }
        CompleteMission(MissionID_lst.shift(), convertToText(Value))
        Flag = "False"
        Pos_To = MissionArea_lst.shift()
    }
}
function PID_S2 (S1_Black: number, S1_White: number, S2_Black: number, S2_White: number, Power: number, Kp: number) {
    P1_Sensor = Math.map(pins.analogReadPin(AnalogPin.P1), S1_Black, S1_White, 12, 90)
    P2_Sensor = Math.map(pins.analogReadPin(AnalogPin.P2), S2_Black, S2_White, 12, 90)
    error = P1_Sensor - P2_Sensor
    P = Kp * error
    M1_Power = Power - P
    M2_Power = Power + P
    wuKong.setAllMotor(M1_Power, M2_Power)
}
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    while (pins.digitalReadPin(DigitalPin.P0) == 1) {
        wuKong.setMotorSpeed(wuKong.MotorList.M2, 30)
    }
    while (pins.digitalReadPin(DigitalPin.P0) == 0) {
        wuKong.setMotorSpeed(wuKong.MotorList.M2, 30)
    }
    wuKong.stopAllMotor()
})
function Position_14 () {
    PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    wuKong.stopAllMotor()
    if (Pos_To == "B06") {
    	
    } else {
        for (let index2 = 0; index2 < 2; index2++) {
            PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
            PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
        }
        wuKong.stopAllMotor()
    }
}
function Shorting () {
    i = 0
    while (i <= MissionArea_lst.length) {
        index = MissionArea_lst.length
        while (index >= i) {
            if (MissionArea_lst[index] == MissionArea_lst[index - 1]) {
                temp = MissionArea_lst[index]
                MissionArea_lst[index] = MissionArea_lst[index - 1]
                MissionArea_lst[index - 1] = temp
                temp = MissionArea_lst[index]
                MissionType_lst[index] = MissionType_lst[index - 1]
                MissionType_lst[index - 1] = temp
                temp = MissionID_lst[index]
                MissionID_lst[index] = MissionID_lst[index - 1]
                MissionID_lst[index - 1] = temp
            }
            index += -1
        }
        i += 1
    }
}
let temp = ""
let index = 0
let i = 0
let S_Distance = 0
let Pos_To = ""
let MissionArea_lst: string[] = []
let MissionID_lst: string[] = []
let MissionType_lst: string[] = []
let ServerMsg = ""
let Response_lst: string[] = []
let Response = ""
let M2_Power = 0
let M1_Power = 0
let P = 0
let error = 0
let P2_Sensor = 0
let P1_Sensor = 0
let Value = 0
let Flag = ""
let P2_White = 0
let P2_Black = 0
let P1_White = 0
let P1_Black = 0
basic.showIcon(IconNames.No)
radio.setGroup(1)
P1_Black = 843
P1_White = 1023
let P1_Offset = 51
P2_Black = 846
P2_White = 1023
let power = 20
WROHellasCloud.wifiSettings(
SerialPin.P14,
SerialPin.P15,
BaudRate.BaudRate115200,
"smartbirds",
"strawberry"
)
WROHellasCloud.cloudSettings("164.90.177.227", "3040", "XEAUD")
WROHellasCloud.wifiConnect()
while (!(WROHellasCloud.wifiStatus())) {
    WROHellasCloud.wifiConnect()
}
basic.showIcon(IconNames.Yes)
