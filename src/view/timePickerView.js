import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Button, Text, Platform } from 'react-native'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { containsStartTime, containsEndTime, getStartTime, getEndTime, storeStartTime, storeEndTime } from '../modules/tmapStorage'

const TimePickerView = () => {
    const [startDate, setStartDate] = useState(new Date())      // 출근시간 상태 변수
    const [endDate, setEndDate] = useState(new Date())          // 퇴근시간 상태 변수
    const [startShow, setStartShow] = useState(false)           // 출근시간 설정 뷰 보임 상태 변수
    const [endShow, setEndShow] = useState(false)               // 퇴근시간 설정 뷰 보임 상태 변수

    useEffect(() => {
        // 뷰 로드 시 실행
        getData()
    }, [])

    // 저장되어있는 startDate, endDate 가져와 Date 객체 생성 후 state 변수에 저장
    async function getData() {
        // startTime 키로 저장된 데이터가 있는지 검사
        if (await containsStartTime()) {
            // storage 에 저장되어있는 srting 타입 데이터 (milliseconds)를 숫자타입으로 변경 후 Date 객체 생성
            setStartDate(new Date(parseInt(await getStartTime())))
        }

        if (await containsEndTime()) {
            setEndDate(new Date(parseInt(await getEndTime())))
        }
    }

    // timePicker 의 값이 바뀔 경우 사용하는 method / isStart -> 시작 시간인지 구분
    const onPickerChange = (event, selectedDate, isStart) => {
        const currentDate = selectedDate
        if (isStart) {
            // 시작시간일 경우 startDate 상태변수에 지정
            setStartDate(currentDate)
        } else {
            // 시작시간이 아닐 경우 endDate 상태변수에 지정
            setEndDate(currentDate)
        }
    }

    // Android 에서 사용하는 timePicker Dialog / isStart -> 시작 시간인지 구분
    // 라이브러리에서 android 운영체제는 component 가 아닌 명령형 api(DateTimePickerAndroid 의 open method) 사용 권장
    const openPickerDialog = (isStart) => {
        DateTimePickerAndroid.open({
            // 시작시간이면 startDate 아니면 endDate를 value로 사용 / value -> time picker 의 초기값
            value: isStart ? startDate : endDate,
            onChange: (event, date) => {
                onPickerChange(event, date, isStart)
                // isStart 에 따라 startDate 또는 endDate storage에 저장
                isStart? storeStartTime(date.getTime()) : storeEndTime(date.getTime())
            },
            mode: 'time',   // 시간 설정만 필요하기때문에 time mode (date 모드도 있음)
            is24Hour: false, // 24시간제를 사용할것인가?
        })
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>출근, 등교 시간</Text>
                
                {!startShow && (
                    // 출근시간 설정이 false 일때만 보임
                    <View style={styles.setterView}>
                        <Text style={styles.textTime}>
                            {/* padStart -> 지정된 공간이 비었을때 해당하는 글자를 채워줌 ex) 7 -> 07 */}
                            {startDate.getHours().toString().padStart(2, '0') + ':' + startDate.getMinutes().toString().padStart(2, '0')}
                        </Text>
                        <Button
                            title="설정"
                            onPress={() => {
                                if (Platform.OS === 'android') {
                                    // 안드로이드 일 시 dialog open
                                    openPickerDialog(true)
                                } else {
                                    // ios 일 땐 숨겨진 Picker component가 보이게 startShow를 true 로 지정
                                    setStartShow(true)
                                }
                            }}
                        />
                    </View>
                )}
                {startShow && (
                    // 출근시간 설정이 true 일때만 보임
                    <View style={styles.pickerView}>
                        <DateTimePicker
                            mode="time"
                            is24Hour={false}
                            value={startDate}       // picker 초기값
                            onChange={(event, date) => {    // 값 변경시
                                onPickerChange(event, date, true)
                            }}
                        />
                        <Button
                            title="저장"
                            onPress={() => {
                                // picker component 다시 숨기기위해 start show를 false로 지정
                                setStartShow(false)
                                // startDate.getTime() -> milliseconds 리턴함 해당값 storage에 저장
                                storeStartTime(startDate.getTime())
                            }}
                        />
                    </View>
                )}
            </View>
            {/* 아래는 위와 같은 형식 */}
            <View>
                <Text style={styles.title}>퇴근, 하교 시간</Text>
                {!endShow && (
                    <View style={styles.setterView}>
                        <Text style={styles.textTime}>
                            {endDate.getHours().toString().padStart(2, '0') + ':' + endDate.getMinutes().toString().padStart(2, '0')}
                        </Text>

                        <Button
                            title="설정"
                            onPress={() => {
                                if (Platform.OS === 'android') {
                                    openPickerDialog(false)
                                } else {
                                    setEndShow(true)
                                }
                            }}
                        />
                    </View>
                )}
                {endShow && (
                    <View style={styles.pickerView}>
                        <DateTimePicker
                            mode="time"
                            is24Hour={false}
                            value={endDate}
                            onChange={(event, date) => {
                                onPickerChange(event, date, false)
                            }}
                        />
                        <Button
                            title="저장"
                            onPress={() => {
                                setEndShow(false)
                                storeEndTime(endDate.getTime())
                            }}
                        />
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        marginBottom: 20,
    },
    container: {
        margin: 20,
    },
    pickerView: {
        margin: 10,
        display: 'flex',
        flexDirection: 'row',
    },
    setterView: {
        margin: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    textTime: {
        fontSize: 20,
        marginRight:10
    }
    
})

export default TimePickerView
