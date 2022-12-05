import React from 'react'
import axios from 'axios'

const BaseUrl = 'https://apis.openapi.sk.com/tmap/' // tmap요청을 하기 위한 기본url
const AppKey = 'l7xxaa988ec5c97f499186a2545e0ab433fe' //  tmap에 넣을 appkey

// https://apis.openapi.sk.com/tmap/pois?version={version}&page={page}&count={count}&searchKeyword={searchKeyword}&areaLLCode={areaLLCode}&areaLMCode={areaLMCode}&resCoordType={resCoordType}&searchType={searchType}&searchtypCd={searchtypCd}&radius={radius}&reqCoordType={reqCoordType}&centerLon={centerLon}&centerLat={centerLat}&multiPoint={multiPoint}&callback={callback}&appKey={appKey}

/**
 * 통합검색
 * @param searchText 검색할 키워드
 * @return https://tmapapi.sktelecom.com/main.html#webservice/docs/tmapPoiSearch 참조
 */
export async function requestPoi(searchText) {
    // searchText 가 비어있을 경우  null 리턴
    if (searchText == null || searchText == '') return null

    // count 결과 갯수 radius 검색반경 0일시 전국
    let url = BaseUrl + `pois?version=1&count=200&radius=0&appkey=${AppKey}&searchKeyword=${searchText}`

    // http get 요청 catch -> 오류 처리
    const response = await axios.get(url).catch((error) => {
        console.error(error) // 오류 로그
        throw error
    })

    return response.data.searchPoiInfo.pois.poi
}

/* 
    참조
    https://tmapapi.sktelecom.com/main.html#webservice/docs/tmapRouteDoc

    searchOption
    0 -> 교통최적+추천(기본값)
    1 -> 교통최적+무료우선
    2 -> 교통최적+최소시간
    3 -> 교통최적+초보
    4 -> 교통최적+고속도로우선
    10 -> 최단거리+유/무료
    12 -> 이륜차도로우선
    19 -> 교통최적+어린이보호구역 회피

    totalValue
    1> 전체 경로 안내 및 전체 응답데이터
    2> 총길이, 소요시간, 요금정보, 택시요금 의 정보만 받을 경우

    trafficInfo Y -> 교통정보 포함 N -> 미포함
    mainRoadInfo Y -> 주요 도로정보 포함 N -> 미포함
*/
/**
 * 경로 탐색
 * @param startLat 출발 지점 latitude (x)
 * @param startLong 출발 지점 longtitude (y)
 * @param endLat 도착 지점 latitude (x)
 * @param endLong 도착 지점 longtitude (y)
 * */
export async function requestRoute(startLat, startLong, endLat, endLong) {
    const url = BaseUrl + `routes?version=1&appkey=${AppKey}`

    // http post 요청
    const response = await axios
        .post(url, {
            startX: startLong,
            startY: startLat,
            endX: endLong,
            endY: endLat,
            trafficInfo: 'Y',
            totalValue: 1,
            searchOption: 0,
            mainRoadInfo: 'Y',
        })
        .catch((err) => {
            console.log(err.response)
        })

    if (response) {
        return response.data
    }
}
