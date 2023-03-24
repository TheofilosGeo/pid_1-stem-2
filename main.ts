radio.onReceivedNumber(function (receivedNumber) {
    Flag = "True"
    basic.showNumber(receivedNumber)
    Value = receivedNumber
})
function Position_B05_B13 (text: string) {
    PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
    PID_S2_UntilCross_P8(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
    PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
    PID_S2_UntilCross_P0(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
    while (pins.digitalReadPin(DigitalPin.P8) == 0) {
        wuKong.setAllMotor(20, 20)
    }
    while (pins.digitalReadPin(DigitalPin.P8) == 1) {
        wuKong.setAllMotor(20, 20)
    }
    wuKong.stopAllMotor()
    TurnRight_90()
    wuKong.stopAllMotor()
    PID_S2_UntilCross_P8(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    PID_S2_UntilCross_P0(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    while (pins.digitalReadPin(DigitalPin.P8) == 0) {
        wuKong.setAllMotor(20, 20)
    }
    wuKong.stopAllMotor()
    while (Pos_To == text) {
        radio.sendString("" + (MissionType_lst.shift()))
        while (Flag == "False") {
            basic.pause(100)
        }
        basic.pause(1000)
        CompleteMission(MissionID_lst.shift(), convertToText(Value))
        Flag = "False"
        Pos_To = MissionArea_lst.shift()
    }
}
function CreateMission (MissionType: string, Index_lst: number) {
    Response = "ERROR"
    Response_lst = []
    while (Response == "ERROR") {
        ServerMsg = WROHellasCloud.startMission(MissionType)
        Response_lst = ServerMsg.split(";")
        Response = Response_lst[0]
    }
    MissionType_lst[Index_lst] = MissionType
    MissionID_lst[Index_lst] = Response_lst[0]
    MissionArea_lst[Index_lst] = Response_lst[1]
}
function Position_B02_B10 (text: string) {
    PID_S2_UntilCross_P8(P1_Black, P1_White, P2_Black, P2_White, 20, 0.2)
    PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.2)
    PID_S2_UntilCross_P8(P1_Black, P1_White, P2_Black, P2_White, 20, 0.2)
    wuKong.stopAllMotor()
    if (Pos_To == text) {
        radio.sendString("" + (MissionType_lst.shift()))
        while (Flag == "False") {
            basic.pause(100)
        }
        basic.pause(1000)
        CompleteMission(MissionID_lst.shift(), convertToText(Value))
        Flag = "False"
        Pos_To = MissionArea_lst.shift()
    }
}
function TurnRight_90 () {
    while (pins.digitalReadPin(DigitalPin.P8) == 1) {
        wuKong.setMotorSpeed(wuKong.MotorList.M1, 20)
    }
    while (pins.digitalReadPin(DigitalPin.P8) == 0) {
        wuKong.setMotorSpeed(wuKong.MotorList.M1, 20)
    }
    while (pins.digitalReadPin(DigitalPin.P0) == 0) {
        wuKong.setMotorSpeed(wuKong.MotorList.M1, 20)
    }
    while (pins.digitalReadPin(DigitalPin.P0) == 1) {
        wuKong.setMotorSpeed(wuKong.MotorList.M1, 20)
    }
    wuKong.stopAllMotor()
}
input.onButtonPressed(Button.A, function () {
    basic.showIcon(IconNames.StickFigure)
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
    basic.showIcon(IconNames.Happy)
})
function Position_B09 () {
    PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
    PID_S2_UntilCross_P0(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
    while (pins.digitalReadPin(DigitalPin.P8) == 0) {
        wuKong.setAllMotor(20, 20)
    }
    while (pins.digitalReadPin(DigitalPin.P8) == 1) {
        wuKong.setAllMotor(20, 20)
    }
    wuKong.stopAllMotor()
    while (Pos_To == "B09") {
        radio.sendString("" + (MissionType_lst.shift()))
        while (Flag == "False") {
            basic.pause(100)
        }
        basic.pause(1000)
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
function Position_B06_B14 (text: string) {
    PID_S2_UntilCross_P8(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
    wuKong.stopAllMotor()
    if (Pos_To == text) {
        MissionType_lst.removeAt(0)
        Cars = 0
        for (let index2 = 0; index2 < 3; index2++) {
            ParkingDistance = sonar.ping(
            DigitalPin.P13,
            DigitalPin.P12,
            PingUnit.Centimeters
            )
            while (ParkingDistance == 0) {
                ParkingDistance = sonar.ping(
                DigitalPin.P13,
                DigitalPin.P12,
                PingUnit.Centimeters
                )
            }
            if (ParkingDistance < 8) {
                Cars += 1
            }
            PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
            PID_S2_UntilCross_P8(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
        }
        Value = 3 - Cars
        CompleteMission(MissionID_lst.shift(), convertToText(Value))
        Pos_To = MissionArea_lst.shift()
    } else {
        for (let index2 = 0; index2 < 2; index2++) {
            PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
            PID_S2_UntilCross_P8(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
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
function PID_S2_UntilCross_P8 (S1_Black: number, S1_White: number, S2_Black: number, S2_White: number, Power: number, Kp: number) {
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
function PID_S2_UntilCross_P0 (S1_Black: number, S1_White: number, S2_Black: number, S2_White: number, Power: number, Kp: number) {
    while (pins.digitalReadPin(DigitalPin.P0) == 0) {
        P1_Sensor = Math.map(pins.analogReadPin(AnalogPin.P1), S1_Black, S1_White, 12, 90)
        P2_Sensor = Math.map(pins.analogReadPin(AnalogPin.P2), S2_Black, S2_White, 12, 90)
        error = P1_Sensor - P2_Sensor
        P = Kp * error
        M1_Power = Power + P
        M2_Power = Power - P
        wuKong.setAllMotor(M1_Power, M2_Power)
    }
}
function Position_B08_B16 (text: string) {
    TurnRight_90()
    wuKong.stopAllMotor()
    PID_S2_UntilCross_P8(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
    wuKong.stopAllMotor()
    while (Pos_To == text) {
        basic.showIcon(IconNames.Happy)
        if (MissionArea_lst[0] == "rnp") {
            Εnergy_measurement()
        } else {
            radio.sendString("" + (MissionType_lst.shift()))
            while (Flag == "False") {
                basic.pause(100)
            }
            basic.pause(1000)
            CompleteMission(MissionID_lst.shift(), convertToText(Value))
            Flag = "False"
            Pos_To = MissionArea_lst.shift()
        }
    }
}
function Position_B01 () {
    PID_S2_UntilCross_P0(P1_Black, P1_White, P2_Black, P2_White, 20, 0.2)
    while (pins.digitalReadPin(DigitalPin.P8) == 0) {
        wuKong.setAllMotor(20, 20)
    }
    wuKong.stopAllMotor()
    TurnRight_90()
    wuKong.stopAllMotor()
    Pos_To = MissionArea_lst.shift()
    while (Pos_To == "B01") {
        basic.showIcon(IconNames.Happy)
        radio.sendString("" + (MissionType_lst.shift()))
        while (Flag == "False") {
            basic.pause(100)
        }
        basic.pause(1000)
        CompleteMission(MissionID_lst.shift(), convertToText(Value))
        Flag = "False"
        Pos_To = MissionArea_lst.shift()
    }
}
function Shorting () {
    i = 0
    while (i <= MissionArea_lst.length) {
        index = MissionArea_lst.length
        while (index >= i) {
            if (MissionArea_lst[index] < MissionArea_lst[index - 1]) {
                temp = MissionArea_lst[index]
                MissionArea_lst[index] = MissionArea_lst[index - 1]
                MissionArea_lst[index - 1] = temp
                temp = MissionType_lst[index]
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
function Position_B07_B15 (text: string) {
    PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    PID_S2_UntilCross_P0(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    while (pins.digitalReadPin(DigitalPin.P8) == 0) {
        wuKong.setAllMotor(20, 20)
    }
    while (pins.digitalReadPin(DigitalPin.P8) == 1) {
        wuKong.setAllMotor(20, 20)
    }
    wuKong.stopAllMotor()
    if (Pos_To == text) {
        radio.sendString("" + (MissionType_lst.shift()))
        while (Flag == "False") {
            basic.pause(100)
        }
        basic.pause(1000)
        CompleteMission(MissionID_lst.shift(), convertToText(Value))
        Flag = "False"
        Pos_To = MissionArea_lst.shift()
    }
}
function Εnergy_measurement () {
    PID_S2_UntilCross_P8(P1_Black, P1_White, P2_Black, P2_White, 20, 0.15)
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
}
let temp = ""
let index = 0
let i = 0
let ParkingDistance = 0
let Cars = 0
let M2_Power = 0
let M1_Power = 0
let P = 0
let error = 0
let P2_Sensor = 0
let P1_Sensor = 0
let ServerMsg = ""
let Response_lst: string[] = []
let Response = ""
let MissionArea_lst: string[] = []
let MissionID_lst: string[] = []
let MissionType_lst: string[] = []
let Pos_To = ""
let Value = 0
let Flag = ""
let P2_White = 0
let P2_Black = 0
let P1_White = 0
let P1_Black = 0
basic.showIcon(IconNames.No)
radio.setGroup(167)
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
