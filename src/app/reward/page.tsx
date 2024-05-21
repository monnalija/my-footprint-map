"use client";

import { useEffect, useRef, useState } from 'react';

export default function Reward(params) {
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentState, setCurrentState] = useState('Idle');

  console.log('ws', params.searchParams)

  useEffect(() => {
    const onPlayerReady = (event) => {
      console.log('Player is ready');
    };

    const extractYouTubeVideoID = (url) => {
      const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url?.match(regex);
      return match ? match[1] : null;
    };

    const onPlayerStateChange = (event) => {
      switch (event.data) {
        case window.YT.PlayerState.PLAYING:
          console.log('Playing');
          setCurrentState('Playing')
          break;
          case window.YT.PlayerState.PAUSED:
            console.log('Paused');
            setCurrentState('Paused')
            break;
            case window.YT.PlayerState.ENDED:
              console.log('Ended');
              setCurrentState('Ended')
          break;
        default:
          break;
      }
    };

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '390',
        width: '640',
        videoId: extractYouTubeVideoID(params.searchParams?.youtubeUrl), // 여기에 재생하고 싶은 YouTube 비디오 ID를 넣습니다.
        playerVars: {
          controls: 0, // 제어 버튼 숨기기
          modestbranding: 1, // YouTube 로고 숨기기
          disablekb: 1, // 키보드 제어 비활성화
          fs: 0, // 전체 화면 버튼 비활성화
          rel: 0, // 관련 동영상 표시 비활성화
          showinfo: 0, // 비디오 정보 숨기기
          playsinline: 0, // iOS에서 동영상을 인라인으로 재생할지 전체 화면에서 재생할지 설정합니다.
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    // 현재 재생 위치를 주기적으로 업데이트
    const intervalId = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 1000); // 1초마다 업데이트

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">YouTube Player</h1>
      <div id="youtube-player" className="w-full max-w-xl"></div>
      <div className="mt-4 text-lg">
        Current Time: {Math.floor(currentTime)} seconds
      </div>
      <div className="mt-4 text-lg">
        Current Sta†e: {currentState}
      </div>
    </div>
  );
}