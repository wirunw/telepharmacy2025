'use client';

import { useEffect, useRef, useState } from 'react';
import Video, { Room, LocalVideoTrack, LocalAudioTrack, RemoteParticipant } from 'twilio-video';

interface VideoRoomProps {
  token: string;
  roomName: string;
  onDisconnect: () => void;
}

export default function VideoRoom({ token, roomName, onDisconnect }: VideoRoomProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const connectToRoom = async () => {
      try {
        const connectedRoom = await Video.connect(token, {
          name: roomName,
          audio: true,
          video: { width: 640, height: 480 },
          region: 'au1', // Australia region to match API Key region
        });

        setRoom(connectedRoom);

        // Handle local participant
        connectedRoom.localParticipant.videoTracks.forEach((publication) => {
          if (publication.track && localVideoRef.current) {
            const videoElement = publication.track.attach();
            videoElement.className = 'w-full h-full object-cover rounded-lg';
            localVideoRef.current.appendChild(videoElement);
          }
        });

        // Handle existing participants
        connectedRoom.participants.forEach((participant) => {
          handleParticipant(participant);
        });

        // Handle new participants joining
        connectedRoom.on('participantConnected', (participant) => {
          handleParticipant(participant);
          setParticipants((prev) => [...prev, participant]);
        });

        // Handle participants leaving
        connectedRoom.on('participantDisconnected', (participant) => {
          setParticipants((prev) => prev.filter((p) => p !== participant));
        });

        // Set initial participants
        setParticipants(Array.from(connectedRoom.participants.values()));
      } catch (error) {
        console.error('Error connecting to room:', error);
        alert('ไม่สามารถเชื่อมต่อห้องวิดีโอได้');
      }
    };

    connectToRoom();

    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [token, roomName]);

  const handleParticipant = (participant: RemoteParticipant) => {
    participant.tracks.forEach((publication) => {
      if (publication.isSubscribed && publication.track) {
        attachTrack(publication.track);
      }
    });

    participant.on('trackSubscribed', (track) => {
      attachTrack(track);
    });
  };

  const attachTrack = (track: any) => {
    if (track.kind === 'video' && remoteVideoRef.current) {
      const videoElement = track.attach();
      videoElement.className = 'w-full h-full object-cover rounded-lg';
      remoteVideoRef.current.appendChild(videoElement);
    } else if (track.kind === 'audio') {
      track.attach();
    }
  };

  const toggleAudio = () => {
    if (room) {
      room.localParticipant.audioTracks.forEach((publication) => {
        if (publication.track) {
          if (isAudioEnabled) {
            publication.track.disable();
          } else {
            publication.track.enable();
          }
        }
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (room) {
      room.localParticipant.videoTracks.forEach((publication) => {
        if (publication.track) {
          if (isVideoEnabled) {
            publication.track.disable();
          } else {
            publication.track.enable();
          }
        }
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const handleDisconnect = () => {
    if (room) {
      room.disconnect();
    }
    onDisconnect();
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Video Grid */}
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Remote Video */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden">
          <div ref={remoteVideoRef} className="w-full h-full">
            {participants.length === 0 && (
              <div className="flex items-center justify-center h-full text-white">
                <div className="text-center">
                  <div className="text-6xl mb-4">👤</div>
                  <p className="text-xl">รอผู้เข้าร่วม...</p>
                </div>
              </div>
            )}
          </div>
          {participants.length > 0 && (
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded">
              {participants[0].identity}
            </div>
          )}
        </div>

        {/* Local Video */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden">
          <div ref={localVideoRef} className="w-full h-full" />
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded">
            คุณ (ฉัน)
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-6">
        <div className="max-w-2xl mx-auto flex justify-center items-center gap-4">
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full transition ${
              isAudioEnabled
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            title={isAudioEnabled ? 'ปิดไมโครโฟน' : 'เปิดไมโครโฟน'}
          >
            {isAudioEnabled ? '🎤' : '🔇'}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition ${
              isVideoEnabled
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            title={isVideoEnabled ? 'ปิดกล้อง' : 'เปิดกล้อง'}
          >
            {isVideoEnabled ? '📹' : '📷'}
          </button>

          <button
            onClick={handleDisconnect}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-medium transition"
          >
            วางสาย
          </button>
        </div>
      </div>
    </div>
  );
}
