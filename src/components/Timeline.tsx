import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
const Timeline: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date('2025-07-07T03:12:37'));
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrubberPosition, setScrubberPosition] = useState(13.02); // 03:12:37 as percentage of day
  const timelineRef = useRef<HTMLDivElement>(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const timelineIncidents = [
    { time: 4.5, type: 'Unauthorised Access', color: 'bg-orange-500' },
    { time: 8.2, type: 'Face Recognised', color: 'bg-blue-500' },
    { time: 13.02, type: 'Gun Threat', color: 'bg-red-500', active: true },
    { time: 15.7, type: 'Traffic Congestion', color: 'bg-green-500' },
    { time: 18.3, type: 'Unauthorised Access', color: 'bg-orange-500' },
    { time: 22.8, type: 'Multiple Events', color: 'bg-purple-500' },
  ];
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = (clickX / rect.width) * 100;
      setScrubberPosition(percentage);
      const totalMinutes = (percentage / 100) * 24 * 60;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = Math.floor(totalMinutes % 60);
      const seconds = Math.floor((totalMinutes % 1) * 60);
      const newTime = new Date('2025-07-07T00:00:00');
      newTime.setHours(hours, minutes, seconds);
      setCurrentTime(newTime);
    }
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  return (
    <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-lg p-6 border border-amber-800/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center transition-colors">
              <SkipBack className="w-4 h-4 text-white" />
            </button>
            <button  onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors">
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-1" />
              )}
            </button>
            <button className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center transition-colors">
              <SkipForward className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="text-white font-mono">
            <div className="text-lg font-bold">{formatTime(currentTime)}</div>
            <div className="text-sm text-slate-400">({formatDate(currentTime)})</div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
            <Volume2 className="w-4 h-4" />
            <span className="text-sm">Audio</span>
          </button>
          <div className="text-right text-slate-400">
            <div className="text-sm font-medium">Camera List</div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <div  ref={timelineRef} className="h-12 bg-slate-800 rounded-lg relative cursor-pointer overflow-hidden" onClick={handleTimelineClick}>
            {hours.map((hour) => (
              <div key={hour} className="absolute top-0 bottom-0 border-l border-slate-600" style={{ left: `${(hour / 24) * 100}%` }}>
                <div className="absolute -bottom-6 -ml-4 text-xs text-slate-400 font-mono">
                  {hour.toString().padStart(2, '0')}:00
                </div>
              </div>
            ))}
            <div className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-10" style={{ left: `${scrubberPosition}%` }}>
              <div className="absolute -top-2 -ml-2 w-4 h-4 bg-yellow-400 rounded-full shadow-lg"></div>
            </div>
            {timelineIncidents.map((incident, index) => (
              <div
                key={index}
                className={`absolute top-2 bottom-2 w-1 ${incident.color} rounded-full transition-all hover:w-2 cursor-pointer ${
                  incident.active ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''
                }`}
                style={{ left: `${(incident.time / 24) * 100}%` }}
                title={incident.type}
              />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {['Camera - 01', 'Camera - 02', 'Camera - 03'].map((camera, index) => (
            <div key={camera} className="flex items-center space-x-4">
              <div className="w-20 text-sm text-slate-300 flex items-center space-x-2">
                <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                <span>{camera}</span>
              </div>
              <div className="flex-1 h-8 bg-slate-800 rounded relative">
                {timelineIncidents
                  .filter((_, i) => (i + index) % 3 === 0)
                  .map((incident, i) => (
                    <div
                      key={i}
                      className={`absolute top-1 bottom-1 ${incident.color} rounded px-2 flex items-center cursor-pointer hover:brightness-110 transition-all`}
                      style={{  left: `${(incident.time / 24) * 100}%`, width: '4%', minWidth: '20px'}} title={incident.type}>
                      <div className="w-full h-1 bg-white/30 rounded"></div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Timeline;