import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
    getDeparture,
    getDestination,
    containsDeparture,
    containsDestination,
} from '../modules/tmapStorage';

const StorageView = ({navigation}) => {
    const [departure, setdeparture] = useState(null);
    const [destination, setdestination] = useState(null);

    useEffect(() => {
        // 뷰가 처음으로 화면에 나타날 시 getData() 실행됨
        getData();
    }, []);

    async function getData() {
        if (await containsDeparture()) {
            // departure 키가 있을때
            const dep = await getDeparture(); // 저장된 departure 정보 가져옴
            setdeparture(dep);  // departure state 에 저장
        }
        if (await containsDestination()) {
            // destination 키가 있을때
            const des = await getDestination(); // 저장된 destination 정보 가져옴
            setdestination(des); // destination state 에 저장
        }
    }

    return (
        <View>
            <View style={styles.box}>
                <Text style={styles.title}>출발지</Text>
                {departure ? (
                    // departure state 가 존재할때만(null 아님) 밑에 뷰 로드
                    <View>
                        <Text style={styles.item}>이름: {departure.name}</Text>
                        <Text style={styles.item}>주소: {departure.addr}</Text>
                        <Text style={styles.item}>
                            좌표: {departure.lat} / {departure.lon}
                        </Text>
                    </View>
                ) : (
                    <Text>지정되지 않음</Text>
                )}
            </View>
            <View style={styles.box}>
                <Text style={styles.title}>도착지</Text>
                {destination ? (
                    // destination state 가 존재할때만(null 아님) 밑에 뷰 로드
                    <View>
                        <Text style={styles.item}>
                            이름: {destination.name}
                        </Text>
                        <Text style={styles.item}>
                            주소: {destination.addr}
                        </Text>
                        <Text style={styles.item}>
                            좌표: {destination.lat} / {destination.lon}
                        </Text>
                    </View>
                ) : (
                    <Text>지정되지 않음</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        marginBottom: 20,
    },
    item: {
        fontSize: 15,
    },
    box: {
        margin: 20,
    },
});

export default StorageView;
