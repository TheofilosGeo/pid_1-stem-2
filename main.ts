radio.onReceivedNumber(function (receivedNumber) {
    Value = receivedNumber
})
function PID_S2_UntilCross (S1_Black: number, S1_White: number, S2_Black: number, S2_White: number, Power: number, Kp: number) {
    while (pins.digitalReadPin(DigitalPin.P8) == 0) {
        P1_Sensor = Math.map(pins.analogReadPin(AnalogPin.P1), S1_Black, S1_White, 12, 90)
        P2_Sensor = Math.map(pins.analogReadPin(AnalogPin.P2), S2_Black, S2_White, 12, 90)
        error = P1_Sensor - P2_Sensor
        P = Kp * error
        M1_Power = Power - P
        M2_Power = Power + P
        wuKong.setAllMotor(M1_Power, M2_Power)
    }
}
function TurnRight_90 () {
    while (pins.digitalReadPin(DigitalPin.P8) == 1) {
        wuKong.setMotorSpeed(wuKong.MotorList.M1, 20)
    }
    while (pins.digitalReadPin(DigitalPin.P8) == 0) {
        wuKong.setMotorSpeed(wuKong.MotorList.M1, 20)
    }
    P1_Sensor = Math.map(pins.analogReadPin(AnalogPin.P1), P1_Black, P1_White, 12, 90)
    while (P1_Sensor < 60) {
        wuKong.setMotorSpeed(wuKong.MotorList.M1, 20)
        P1_Sensor = Math.map(pins.analogReadPin(AnalogPin.P1), P1_Black, P1_White, 12, 90)
    }
}
input.onButtonPressed(Button.A, function () {
    Index = 0
    Positions = ["B06", "B01", "B03"]
    Pos_To = Positions[Index]
    Position_B01()
    Position_B03()
    Position_B05()
    PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    wuKong.stopAllMotor()
    if (Pos_To == "B06") {
        for (let index = 0; index < 2; index++) {
            PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
            PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
            wuKong.stopAllMotor()
        }
        music.playTone(262, music.beat(BeatFraction.Whole))
    }
})
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
    TurnRight_90()
    wuKong.stopAllMotor()
    for (let index = 0; index < 2; index++) {
        PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
        PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    }
    wuKong.stopAllMotor()
    if (Pos_To == "B05") {
        basic.showIcon(IconNames.Happy)
        music.playTone(262, music.beat(BeatFraction.Whole))
        Index += 1
        Pos_To = Positions[Index]
        while (Pos_To == "B05") {
            basic.pause(1000)
            Index += 1
            Pos_To = Positions[Index]
            music.playTone(262, music.beat(BeatFraction.Whole))
        }
    }
}
function Position_B03 () {
    TurnRight_90()
    wuKong.stopAllMotor()
    for (let index = 0; index < 3; index++) {
        PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
        PID_S2_UntilBlack(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    }
    PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    wuKong.stopAllMotor()
    if (Pos_To == "B03") {
        basic.showIcon(IconNames.Happy)
        music.playTone(262, music.beat(BeatFraction.Whole))
        Index += 1
        Pos_To = Positions[Index]
        while (Pos_To == "B03") {
            basic.pause(1000)
            Index += 1
            Pos_To = Positions[Index]
            music.playTone(262, music.beat(BeatFraction.Whole))
        }
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
    basic.showNumber(pins.analogReadPin(AnalogPin.P1))
    basic.pause(500)
    basic.showNumber(pins.analogReadPin(AnalogPin.P2))
    basic.pause(500)
    basic.showNumber(pins.digitalReadPin(DigitalPin.P8))
})
function Position_B01 () {
    PID_S2_UntilCross(P1_Black, P1_White, P2_Black, P2_White, 20, 0.1)
    wuKong.stopAllMotor()
    if (Pos_To == "B01") {
        basic.showIcon(IconNames.Happy)
        music.playTone(262, music.beat(BeatFraction.Whole))
        Index += 1
        Pos_To = Positions[Index]
        while (Pos_To == "B01") {
            basic.pause(1000)
            Index += 1
            Pos_To = Positions[Index]
            music.playTone(262, music.beat(BeatFraction.Whole))
        }
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
    P1_Sensor = Math.map(pins.analogReadPin(AnalogPin.P1), P1_Black, P1_White, 12, 90)
    basic.showNumber(P1_Sensor)
})
let S_Distance = 0
let Pos_To = ""
let Positions: string[] = []
let Index = 0
let M2_Power = 0
let M1_Power = 0
let P = 0
let error = 0
let P2_Sensor = 0
let P1_Sensor = 0
let Value = 0
let P2_White = 0
let P2_Black = 0
let P1_White = 0
let P1_Black = 0
basic.showIcon(IconNames.Yes)
radio.setGroup(1)
P1_Black = 855
P1_White = 1023
let P1_Offset = 51
P2_Black = 846
P2_White = 996
let power = 20
