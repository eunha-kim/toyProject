import React from 'react';
import axios from 'axios';

const BaseUrl = 'https://apis.openapi.sk.com/tmap/';  // tmap요청을 하기 위한 기본url
const AppKey = 'l7xxaa988ec5c97f499186a2545e0ab433fe';  //  tmap에 넣을 appkey

// https://apis.openapi.sk.com/tmap/pois?version={version}&page={page}&count={count}&searchKeyword={searchKeyword}&areaLLCode={areaLLCode}&areaLMCode={areaLMCode}&resCoordType={resCoordType}&searchType={searchType}&searchtypCd={searchtypCd}&radius={radius}&reqCoordType={reqCoordType}&centerLon={centerLon}&centerLat={centerLat}&multiPoint={multiPoint}&callback={callback}&appKey={appKey}

/**
 * 통합검색
 * @param searchText 검색할 키워드
 * @return https://tmapapi.sktelecom.com/main.html#webservice/docs/tmapPoiSearch 참조
*/
export async function requestPoi(searchText) {
  // searchText 가 비어있을 경우  null 리턴
  if (searchText == null || searchText == '') return null;

  // count 결과 갯수 radius 검색반경 0일시 전국
  let url = BaseUrl + `pois?version=1&count=200&radius=0&appkey=${AppKey}&searchKeyword=${searchText}`;

  // http get 요청 catch -> 오류 처리
  const response = await axios.get(url).catch(error => {
    console.error(error); // 오류 로그
    throw error;
  });

  return response.data.searchPoiInfo.pois.poi;
}
