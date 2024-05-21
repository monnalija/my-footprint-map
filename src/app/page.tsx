"use client";


import useLocationStore from "@/stores/locationStore";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [map, setMap] = useState(null);

  const { locationItems, fetchLocations} = useLocationStore(state => state);

  const [userLocation, setUserLocation] = useState({ lat: 33.450701, lng: 126.570667 });

  useEffect(() => {
    fetchLocations(); // Fetch items on component mount
    console.log('ws', '패치를 해버려!')
  }, [fetchLocations]);

  useEffect(()=>{
    // console.log('ws', locationItems)
  },[locationItems])

  useEffect(() => {
    // 현재 위치를 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        error => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {

      kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const mapOption = {
          center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
          level: 5
        };
        const mapInstance = new kakao.maps.Map(mapContainer, mapOption);
        setMap(mapInstance);

         // 현재 위치에 마커 추가
         const userMarkerPosition = new kakao.maps.LatLng(userLocation.lat, userLocation.lng);
         const userMarker = new kakao.maps.Marker({
           position: userMarkerPosition,
           title: "현재 위치"
         });
         userMarker.setMap(mapInstance);

        // restaurants.forEach(restaurant => {
        //   const { Name, Address, Latitude, Longitude } = restaurant.properties;
        //   const markerPosition = new kakao.maps.LatLng(Latitude.number, Longitude.number);
        //   const marker = new kakao.maps.Marker({
        //     position: markerPosition
        //   });
        //   marker.setMap(map);

        //   const infowindow = new kakao.maps.InfoWindow({
        //     content: `<div>${Name.title[0].text.content}<br/>${Address.rich_text[0].text.content}</div>`
        //   });
        //   kakao.maps.event.addListener(marker, 'mouseover', () => infowindow.open(map, marker));
        //   kakao.maps.event.addListener(marker, 'mouseout', () => infowindow.close());
        // });
      });
    }
  }, [userLocation]);

  // 지도타입 컨트롤의 지도 또는 스카이뷰 버튼을 클릭하면 호출되어 지도타입을 바꾸는 함수입니다
function setMapType(maptype:string) {
  var roadmapControl = document.getElementById('btnRoadmap');
  var skyviewControl = document.getElementById('btnSkyview');
  if (maptype === 'roadmap') {
      map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
      roadmapControl.className = 'selected_btn block w-16 h-7 float-left text-center leading-7 cursor-pointer bg-blue-800 bg-gradient-to-b from-blue-800 to-blue-600 text-white';
      skyviewControl.className = 'btn block w-16 h-7 float-left text-center leading-7 cursor-pointer bg-white bg-gradient-to-b from-white to-gray-200 text-black';
  } else {
      map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
      skyviewControl.className = 'selected_btn block w-16 h-7 float-left text-center leading-7 cursor-pointer bg-blue-800 bg-gradient-to-b from-blue-800 to-blue-600 text-white';
      roadmapControl.className = 'btn block w-16 h-7 float-left text-center leading-7 cursor-pointer bg-white bg-gradient-to-b from-white to-gray-200 text-black';
  }
}

const zoomIn = () => {
  if (map) map.setLevel(map.getLevel() - 1);
};

const zoomOut = () => {
  if (map) map.setLevel(map.getLevel() + 1);
};

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
      <h1>맛집 지도</h1>
    </div>

    <div className="map_wrap relative overflow-hidden w-full h-96">
      <div id="map" className="w-full h-full relative overflow-hidden"></div>
      <div className="absolute top-2.5 right-2.5 overflow-hidden w-32 h-7 m-0 p-0 z-10 text-xs font-sans">
        <span id="btnRoadmap" className="selected_btn block w-16 h-7 float-left text-center leading-7 cursor-pointer bg-blue-800 bg-gradient-to-b from-blue-800 to-blue-600 text-white" onClick={() => setMapType('roadmap')}>지도</span>
        <span id="btnSkyview" className="btn block w-16 h-7 float-left text-center leading-7 cursor-pointer bg-white bg-gradient-to-b from-white to-gray-200 text-black" onClick={() => setMapType('skyview')}>스카이뷰</span>
      </div>
      <div className="absolute top-12 right-2.5 w-9 h-20 overflow-hidden z-10 bg-gray-200 border border-gray-500 rounded">
        <span className="flex w-full h-10 text-center cursor-pointer border-b border-gray-300 justify-center center items-center" onClick={zoomIn}>
          <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_plus.png" alt="확대" className="h-4 w-4 border-none"  />
        </span>
        <span className="flex w-full h-10 text-center cursor-pointer justify-center center items-center" onClick={zoomOut}>
          <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_minus.png" alt="축소" className="w-4 h-4 border-none"  />
        </span>
      </div>
    </div>
    </main>
  );
}
