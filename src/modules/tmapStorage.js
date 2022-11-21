import AsyncStroage from "@react-native-async-storage/async-storage"


const DEPARTURE_STORAGE_KEY = "key_departure";  // 출발지 저장용 키
const DESTINATION_STORAGE_KEY = "key_destination";  // 목적지 저장용 키

/*
    async storage 는 KEY 값 마다 string 을 저장함
    출발지, 도착지 키 마다 데이터 저장

    데이터 형식 ex) 예시임 
    const data = {
        addr: "(주소) 대구광역시 북구 어쩌구 저쩌구",
        lat: 31,
        lon: 123,
        name: "동성로"
    }

    위 같은 형식의 데이터를 JSON 이라함(쉽게말해서 하나의 object) 해당 데이터를 string으로 파싱 (JSON.stringify() 사용)
    파싱한 string 데이터 저장

    가져올 때는 키값으로 string 데이터를 가져와서 JSON 으로 파싱 (JSON.parse() 사용)
 */


export async function storeDeparture(data) {
    await saveStorage(DEPARTURE_STORAGE_KEY, data)
}

export async function storeDestination(data) {
    await saveStorage(DESTINATION_STORAGE_KEY, data)
}

export async function getDeparture() {
    return await getData(DEPARTURE_STORAGE_KEY)
}

export async function getDestination() {
    return await getData(DESTINATION_STORAGE_KEY)
}

export async function containsDeparture() {
    return await contains(DEPARTURE_STORAGE_KEY)
}

export async function containsDestination() {
    return await contains(DESTINATION_STORAGE_KEY)
}

export async function removeDeparture() {
    await removeData(DEPARTURE_STORAGE_KEY)
}

export async function removeDestination() {
    await removeData(DESTINATION_STORAGE_KEY)
}

async function saveStorage(key, data) {
    try {
        const string = JSON.stringify(data)
        await AsyncStroage.setItem(key, string)
    } catch (e) {
        console.error(e.message)
    }
}

async function getData(key) {
    try {
        await AsyncStroage.getItem(key)
        return JSON.parse(data)
    } catch (e) {
        console.error(e.message)
    }
}

async function removeData(key) {
    try {
        await AsyncStroage.removeItem(key)
    } catch (e) {
        console.error(e.message)
    }
}

async function contains(key) {
    try {
        const keys = AsyncStroage.getAllKeys()  // async storage 에 저장되어있는 모든 키를 가져옴
        return keys.includes(key)   // 저장된 키 중 지정된 키가 포함되어 있으면 true 리턴
    } catch (e) {
        console.error(e.message)
    }
}