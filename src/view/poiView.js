import React from 'react'
import { Button, FlatList, TextInput, View, ActivityIndicator, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { requestPoi } from '../modules/tMapPoi'
import { useEffect, useState } from 'react'
import { storeDestination, storeDeparture } from '../modules/tmapStorage'

const PoiView = ({ navigation, route }) => {
    const [res, setRes] = useState(null)
    const [searchText, setText] = useState('')

    async function request() {
        // 데이터 요청
        const response = await requestPoi(searchText).catch((reason) => {
            // 오류 발생시 로그
            console.log(reason)
        })

        if (response != undefined) {
            // 요청 결과값이 존재할 때 res state 에 지정
            setRes(response)
        }
    }

    function onTextChange(str) {
        // 텍스트가 변경될 떄마다 자동으로 검색 요청
        setText(str)
        request()
    }

    async function onItemSel(data) {
        // 필요한 데이터만 가지고 저장할 데이터 만들기
        const saveData = {
            addr: data.newAddressList.newAddress[0].fullAddressRoad,
            lat: data.noorLat,
            lon: data.noorLon,
            name: data.name,
        }

        if (route.params.type == 'departure') {
            // route 패러미터로 전달된 타입이 departure 이면 출발지에 저장
            await storeDeparture(saveData)
        } else {
            // route 패러미터로 전달된 타입이 departure 이면 도착지에 저장
            await storeDestination(saveData)
        }

        // 저장 후 자동으로 뒤로감
        navigation.goBack()
    }

    function cellRender(item) {
        // 리스트 아이템 뷰
        return (
            // 터치가능한 뷰 터치 시 onItemSel 메소드 실행
            <TouchableWithoutFeedback style={styles.cellDivider} onPress={() => onItemSel(item.item)}>
                <View style={styles.cell}>
                    <Text style={styles.cellText}>이름: {item.item.name}</Text>
                    {item.item.newAddressList ? (
                        // newAddressList 가 있을때 도로명 주소 표시 fullAddressRoad
                        <Text style={styles.cellText}>주소: {item.item.newAddressList.newAddress[0].fullAddressRoad}</Text>
                    ) : (
                        // newAddressList 가 없을때 구 주소 사용
                        <Text style={styles.cellText}>
                            주소: {item.item.upperAddrName} {item.item.middleAddrName} {item.item.lowerAddrName} {item.item.detailAddrName}
                        </Text>
                    )}
                    <Text>
                        좌표 Lat {item.item.noorLat} / Lon {item.item.noorLon}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    return (
        <View>
            {/* route 패러미터 타입에 따라 제목 변경 */}
            {route.params.type == 'departure' ? <Text style={styles.title}>출발지 설정</Text> : <Text style={styles.title}>도착지 설정</Text>}
            <View style={styles.searchArea}>
                <TextInput onChangeText={onTextChange} style={styles.searchInput} />
                <Button title="Request" onPress={request} />
            </View>

            <FlatList
                style={styles.flatList}
                // 리스트 아이템 각각의 키를 item.pKey 로 지정해줌
                keyExtractor={(item) => item.pKey}
                // 리스트 아이템 데이터
                data={res}
                // 아이템을 렌더링 할 뷰
                renderItem={cellRender}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize:25
    },
    cell: {
        height: 60,
        marginLeft: 20,
        marginRight: 20,
        justifyContent: 'center',
    },
    cellDivider: {
        borderBottomWidth: 1,
        borderColor: '#000',
    },
    cellText: {
        color: '#000',
    },
    searchInput: {
        backgroundColor: '#aaaaaa',
        height: 40,
        width: '80%',
        color: '#fff',
        padding: 10,
    },
    searchArea: {
        display: 'flex',
        flexDirection: 'row',
        marginHorizontal: 20,
    },
    flatList: {
        borderWidth: 1,
        borderColor: '#333',
        marginTop: 10,
    },
})

export default PoiView
