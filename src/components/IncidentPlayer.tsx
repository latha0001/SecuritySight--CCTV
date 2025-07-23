import React from 'react';
import { Camera, Play } from 'lucide-react';
const IncidentPlayer: React.FC = () => {
  const mockCameras = [
    { id: 1, name: 'Camera - 01' },
    { id: 2, name: 'Camera - 02' },
    { id: 3, name: 'Camera - 03' },
  ];
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      <div className="relative aspect-video bg-slate-900">
        <img src="https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg" alt="CCTV Feed" className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <Play className="w-8 h-8 text-white ml-1" />
          </button>
        </div>
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-mono">11/7/2025 - 03:12:37</div>
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg flex items-center space-x-2">
          <Camera className="w-4 h-4" />
          <span className="text-sm font-medium">Camera - 01</span>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          {mockCameras.map((camera, index) => (
            <div key={camera.id} className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer transition-all ${
              index === 0 ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-400'
            }`}>
              <img src={`https://images.pexels.com/photos/${264547 + index * 100}/pexels-photo-${264547 + index * 100}.jpeg`} alt={camera.name} className="w-full h-full object-cover"/>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <div className="text-white text-xs font-medium flex items-center space-x-1">
                  <Camera className="w-3 h-3" />
                  <span>{camera.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default IncidentPlayer;