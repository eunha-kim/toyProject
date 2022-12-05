import AsyncStroage from "@react-native-async-storage/async-storage"


const DEPARTURE_STORAGE_KEY = "key_departure";  // 출발지 저장용 키
const DESTINATION_STORAGE_KEY = "key_destination";  // 목적지 저장용 키
const START_TIME_STORAGE_KEY = "key_start_time";  // 시작 시간 저장용 키
const END_TIME_STORAGE_KEY = "key_end_time";  // 끝나는 시간 저장용 키

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

/* 
    ========================================================
    departure & detination
    storage
    data 형식
    string 타입 miliiseconds
    ========================================================
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

/* 
    ========================================================
    start & endTime
    storage
    ========================================================
*/
export async function storeStartTime(time) {
    await saveStorage(START_TIME_STORAGE_KEY, time)
}

export async function storeEndTime(time) {
    await saveStorage(END_TIME_STORAGE_KEY, time)
}
export async function getStartTime() {
    return await getData(START_TIME_STORAGE_KEY)
}

export async function getEndTime() {
    return await getData(END_TIME_STORAGE_KEY)
}

export async function containsStartTime() {
    return await contains(START_TIME_STORAGE_KEY)
}

export async function containsEndTime() {
    return await contains(END_TIME_STORAGE_KEY)
}

export async function removeStartTime() {
    await removeData(START_TIME_STORAGE_KEY)
}

export async function removeEndTime() {
    await removeData(END_TIME_STORAGE_KEY)
}

async function saveStorage(key, data) {
    // storage 에 저장 object data 를 string 형식으로 변환
    try {
        const string = JSON.stringify(data)
        await AsyncStroage.setItem(key, string)
    } catch (e) {
        console.error(e.message)
    }
}

async function getData(key) {
    // storage 에서 데이터 가져오기 string 데이터를 object 형식으로 변환
    try {
        const data = await AsyncStroage.getItem(key)
        return JSON.parse(data)
    } catch (e) {
        console.error(e.message)
    }
}

async function removeData(key) {
    // 데이터 삭제
    try {
        await AsyncStroage.removeItem(key)
    } catch (e) {
        console.error(e.message)
    }
}

async function contains(key) {
    // 지정된 키가 storage 에 있는지 검사
    try {
        const keys = await AsyncStroage.getAllKeys()  // async storage 에 저장되어있는 모든 키를 가져옴
        return keys.includes(key)   // 저장된 키 중 지정된 키가 포함되어 있으면 true 리턴
    } catch (e) {
        console.error(e.message)
    }
}