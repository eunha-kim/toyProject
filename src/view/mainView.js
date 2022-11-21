import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, Button, TextInput } from 'react-native'

export default function MainView({ navigation }) {
    return (
        <View>
            <Button title="지정된 시간" onPress={() => console.log('clicked')} />

            <Button
                title="출발지 설정"
                onPress={() => {
                    navigation.navigate('Tmap Search', { type: 'departure' })
                }}
            />

            <Button
                title="도착지 설정"
                onPress={() => {
                    navigation.navigate('Tmap Search', { type: 'destination' })
                }}
            />

            <Button title="시간 설정" />
        </View>
    )
}
