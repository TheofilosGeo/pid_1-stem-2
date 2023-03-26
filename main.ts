radio.onReceivedNumber(function (receivedNumber) {
    Flag = "True"
    basic.showNumber(receivedNumber)
    Value = receivedNumber
})
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
function Position_B09 () {
    PID(0.15, "B", 8)
    PID(0.15, "W", 0)
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
function PID (Kp: number, B_W: string, Sensor: number) {
    if (B_W == "B") {
        F_Compare = 1
    } else {
        F_Compare = 0
    }
    if (Sensor == 0) {
        F_Sensor = pins.digitalReadPin(DigitalPin.P0)
    } else {
        F_Sensor = pins.digitalReadPin(DigitalPin.P8)
    }
    while (F_Sensor == F_Compare) {
        if (Sensor == 0) {
            F_Sensor = pins.digitalReadPin(DigitalPin.P0)
        } else {
            F_Sensor = pins.digitalReadPin(DigitalPin.P8)
        }
        P1_Sensor = Math.map(pins.analogReadPin(AnalogPin.P1), P1_Black, P1_White, 12, 90)
        P2_Sensor = Math.map(pins.analogReadPin(AnalogPin.P2), P2_Black, P2_White, 12, 90)
        error = P1_Sensor - P2_Sensor
        P = Kp * error
        M1_Power = 30 + P
        M2_Power = 30 - P
        wuKong.setAllMotor(M1_Power, M2_Power)
    }
}
function Position_B07_B15 (text5: string) {
    PID(0.3, "W", 0)
    while (pins.digitalReadPin(DigitalPin.P8) == 0) {
        wuKong.setAllMotor(30, 30)
    }
    wuKong.stopAllMotor()
    if (Pos_To == text5) {
        while (pins.digitalReadPin(DigitalPin.P0) == 0) {
            wuKong.setMotorSpeed(wuKong.MotorList.M2, 20)
        }
        while (pins.digitalReadPin(DigitalPin.P0) == 1) {
            wuKong.setMotorSpeed(wuKong.MotorList.M2, 20)
        }
        while (pins.digitalReadPin(DigitalPin.P0) == 0) {
            wuKong.setMotorSpeed(wuKong.MotorList.M2, 20)
        }
        wuKong.stopAllMotor()
        wuKong.setServoAngle(wuKong.ServoTypeList._360, wuKong.ServoList.S0, 20)
        radio.sendString("" + (MissionType_lst.shift()))
        while (Flag == "False") {
            basic.pause(100)
        }
        basic.pause(1000)
        if (Value == 1) {
            CompleteMission(MissionID_lst.shift(), "high")
        } else if (Value == 2) {
            CompleteMission(MissionID_lst.shift(), "medium")
        } else {
            CompleteMission(MissionID_lst.shift(), "low")
        }
        wuKong.setServoAngle(wuKong.ServoTypeList._360, wuKong.ServoList.S0, 180)
        Flag = "False"
        Pos_To = MissionArea_lst.shift()
        for (let index2 = 0; index2 < 2; index2++) {
            while (pins.digitalReadPin(DigitalPin.P0) == 0) {
                wuKong.setMotorSpeed(wuKong.MotorList.M2, -40)
            }
            while (pins.digitalReadPin(DigitalPin.P0) == 1) {
                wuKong.setMotorSpeed(wuKong.MotorList.M2, -40)
            }
        }
        wuKong.stopAllMotor()
        while (pins.digitalReadPin(DigitalPin.P0) == 0) {
            wuKong.setMotorSpeed(wuKong.MotorList.M1, 40)
        }
        while (pins.digitalReadPin(DigitalPin.P0) == 1) {
            wuKong.setMotorSpeed(wuKong.MotorList.M1, 40)
        }
        wuKong.stopAllMotor()
    } else {
        TurnRight_90()
    }
}
function Position_B06_B14 (text3: string) {
    PID(0.3, "W", 8)
    PID(0.3, "B", 8)
    wuKong.stopAllMotor()
    if (Pos_To == text3) {
        MissionType_lst.removeAt(0)
        Cars = 0
        for (let index2 = 0; index2 < 2; index2++) {
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
            PID(0.3, "W", 8)
            PID(0.3, "B", 8)
            wuKong.stopAllMotor()
        }
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
        Value = 3 - Cars
        CompleteMission(MissionID_lst.shift(), convertToText(Value))
        Pos_To = MissionArea_lst.shift()
    } else {
        for (let index2 = 0; index2 < 2; index2++) {
            PID(0.3, "W", 8)
            PID(0.3, "B", 8)
        }
        wuKong.stopAllMotor()
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
    CreateMission("lvl", 6)
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
function Position_B02_B10 (text2: string) {
    PID(0.3, "W", 8)
    PID(0.3, "B", 8)
    PID(0.3, "W", 8)
    wuKong.stopAllMotor()
    if (Pos_To == text2) {
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
function CompleteMission (MissionId: string, Data: string) {
    Response = "ERROR"
    Response_lst = []
    while (Response == "ERROR") {
        ServerMsg = WROHellasCloud.completeMission(MissionId, Data)
        Response_lst = ServerMsg.split(";")
        Response = Response_lst[0]
    }
}
function Position_B05_B13 (text: string) {
    PID(0.25, "B", 8)
    PID(0.25, "W", 8)
    PID(0.25, "B", 8)
    PID(0.25, "W", 0)
    while (pins.digitalReadPin(DigitalPin.P8) == 0) {
        wuKong.setAllMotor(20, 20)
    }
    wuKong.stopAllMotor()
    TurnRight_90()
    wuKong.stopAllMotor()
    PID(0.3, "W", 8)
    PID(0.3, "B", 8)
    PID(0.3, "W", 0)
    wuKong.setAllMotor(30, 30)
    basic.pause(500)
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
function Position_B08_B16 (text4: string) {
    PID(0.3, "W", 8)
    wuKong.stopAllMotor()
    while (Pos_To == text4) {
        if (MissionArea_lst[0] == "rnp") {
        	
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
    PID(0.3, "W", 0)
    while (pins.digitalReadPin(DigitalPin.P8) == 0) {
        wuKong.setAllMotor(20, 20)
    }
    wuKong.stopAllMotor()
    TurnRight_90()
    wuKong.stopAllMotor()
    Pos_To = MissionArea_lst.shift()
    while (Pos_To == "B01") {
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
let F_Sensor = 0
let F_Compare = 0
let Pos_To = ""
let MissionArea_lst: string[] = []
let MissionID_lst: string[] = []
let MissionType_lst: string[] = []
let ServerMsg = ""
let Response_lst: string[] = []
let Response = ""
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
