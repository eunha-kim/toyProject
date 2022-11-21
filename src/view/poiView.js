import React from 'react';
import {
    Button,
    FlatList,
    TextInput,
    View,
    ActivityIndicator,
    Text,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import {requestPoi} from '../modules/tMapPoi';
import { useEffect, useState } from 'react';
import { storeDestination, storeDeparture } from "../modules/tmapStorage"


/* 
    뒤로가기 방법
    
    navigation.goBack();
 */


const PoiView = ({navigation, route}) => {
    const [loading, setLoading] = useState(false);
    const [res, setRes] = useState(null);
    const [searchText, setText] = useState('');

    async function request() {
        setLoading(true);

        const response = await requestPoi(searchText).catch(reason => {
            console.log(reason);
        });

        if (response != undefined) {
            console.log('response is not undefined ');
            setRes(response);
        }

        setLoading(false);
    }

    function onTextChange(str) {
        setText(str);
        request();
    }
    
    async function onItemSel(data) {
        const saveData = {
            addr: data.newAddressList.newAddress[0].fullAddressRoad,
            lat: data.noorLat,
            lon: data.noorLon,
            name: data.name
        }
        if (route.params.type == "departure") {
            // 요기 타입이 출발지임
            await storeDeparture(saveData)
        } else {
            await storeDestination(saveData)
        }
        navigation.goBack()
    }

    function cellRender(item) {
        return (
            <TouchableWithoutFeedback style={styles.cellDivider} onPress={()=>onItemSel(item.item)}>
                <View style={styles.cell}>
                    <Text style={styles.cellText}>이름: {item.item.name}</Text>
                    {item.item.newAddressList ? (
                        <Text style={styles.cellText}>
                            주소:{' '}
                            {
                                item.item.newAddressList.newAddress[0]
                                    .fullAddressRoad
                            }
                        </Text>
                    ) : (
                        <Text style={styles.cellText}>
                            주소: {item.item.upperAddrName}{' '}
                            {item.item.middleAddrName} {item.item.lowerAddrName}{' '}
                            {item.item.detailAddrName}
                        </Text>
                    )}
                    <Text>
                        좌표 Lat {item.item.noorLat} / Lon {item.item.noorLon}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    return (
        <View>
            {route.params.type == "departure" ? <Text>출발지 설정</Text> : <Text>도착지 설정</Text>}
            <View style={styles.searchArea}>
                <TextInput
                    onChangeText={onTextChange}
                    style={styles.searchInput}
                />
                <Button title="Request" onPress={request} />
            </View>
            <FlatList
                style={styles.flatList}
                keyExtractor={item => item.pKey}
                data={res}
                renderItem={cellRender}
                ListFooterComponent={loading && <ActivityIndicator />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default PoiView;
