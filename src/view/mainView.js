import React, { useEffect  } from 'react'
import { Text, View, Button, StyleSheet,TouchableOpacity } from 'react-native'
import { requestRoute } from '../modules/tMapPoi'
import { getDeparture, getDestination } from '../modules/tmapStorage'
import * as Notification from 'expo-notifications'
import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { Colors } from 'react-native/Libraries/NewAppScreen'

//알림 처리기 설정 알림 수신시 동작
Notification.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldShowAlert: true,
        shouldSetBadge: false,
    }),
})

export default function MainView({ navigation }) {
    useEffect(() => {
        // 처음 뷰 로드 시 실행
        registerForPushNotificationsAsync()
    }, [])

    async function testing() {
        const departure = await getDeparture()      // 출발지 정보 가져오기
        const destination = await getDestination()      // 도착지 정보 가져오기

        // 출발지 및 도착지 정보가 존재하는 경우에만 요청
        if (departure && destination) {
            const result = await requestRoute(departure.lat, departure.lon, destination.lat, destination.lon)
            const props = result.features[0].properties     //요청 결과중 맨 처음 데이터 의 properties 저장
            const hour = Math.floor(props.totalTime / 60 / 60)      // 총 소요시간(초단위) 시간계산 후 소수점 버림
            const min = Math.floor((props.totalTime / 60) % 60)     // 총 소요시간(초단위) 분계산 후 소수점 버림

            // props.description 경로에 대한 설명 totalDistance 미터 단위
            let body = `${props.description} 하는 길이 가장 빠릅니다. 총거리 ${props.totalDistance / 1000}KM, 최단시간`
            if (hour > 0) body = body.concat(` ${hour}시간`)        // hour 가 0보다 크면 body 에 시간설명 붙이기
            if (min > 0) body = body.concat(` ${min}분, `)        // min 이 0 보다 크면 body 에 분 설명 붙이기
            if (props.totalFare > 0) body = body.concat(` 총 요금${props.totalFare}원,`)     // totalFare -> 톨게이트 요금 0 이상 시 body 에 붙임
            if (props.taxiFare > 0) body = body.concat(` 택시 요금 예상${props.taxiFare}원`)    // taxiFare -> 예상 택시요금 0 이상 시 body 에 붙임

            // notification 발행 trigger -> 반복규칙
            // content{ title -> 알림 제목, body -> 알림 내용 }
            await Notification.scheduleNotificationAsync({
                content: {
                    title: '최단경로 알림',
                    body: body,
                },
                trigger: null,
            })
        }
    }

    return (
        <View>
            <TouchableOpacity
                style={style.buttons}
                onPress={() => {
                    navigation.navigate('Stroage View')
                }}
            >
                <Icon name="map-marker" size={20} color="#ef486f" />
                <Text style={style.btnText}>지정된 장소</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={style.buttons}
                onPress={() => {
                    navigation.navigate('Tmap Search', { type: 'departure' })
                }}
            >
                <Icon name="car" size={20} color="#24799e" />
                <Text style={style.btnText}>출발지 설정</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={style.buttons}
                onPress={() => {
                    navigation.navigate('Tmap Search', { type: 'destination' })
                }}
            >
                <Icon name="car" size={20} color="#b7bddc" />
                <Text style={style.btnText}>도착지 설정</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={style.buttons}
                onPress={() => {
                    navigation.navigate('Time Picker')
                }}
            >
                <Icon name="clock-o" size={20} color="#028192" />
                <Text style={style.btnText}>시간 설정</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={style.buttons}
                onPress={() => {
                    testing()
                }}
            >
                <Ionicon name="notifications" size={20} color="#fcc14a" />
                <Text style={style.btnText}>알림 테스트</Text>
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    buttons: {
        margin:10,
        alignItems: 'center',
        justifyContent:'center',
        width: "100%",
        display: 'flex',
        flexDirection: 'row'
    },
    btnText: {
        fontSize: 20,
        marginLeft:10
    }
})



//expo notification 토큰 발행 및 권한 체크
async function registerForPushNotificationsAsync() {
    let tokenData

    // 안드로이드 일 경우 notification channel 설정
    if (Platform.OS === 'android') {
        await Notification.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notification.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
        })
    }

    // 현재 권한 상태 가져오기
    let existingStatus = await Notification.getPermissionsAsync()

    // 권한 상태가 granted 가 아니면 권한 요청
    if (existingStatus !== 'granted') {
        const { status } = await Notification.requestPermissionsAsync()
        existingStatus = status
    }

    // 권한 요청 후에도 granted가 아닐시 알림
    if (existingStatus !== 'granted') {
        alert('Failed to grant notification Permission!')
        return
    }

    // token 은 expo에 로그인해야 가져올 수 있음 로그인 하지않으면 error
    tokenData = await Notification.getExpoPushTokenAsync().catch((err) => {
        console.log(err)
    })
    console.log(tokenData)
    if(tokenData){
        return tokenData.data
    }
}
