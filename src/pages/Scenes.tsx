import React, { useState } from 'react';
import { Play, Pause, Eye, Calendar, Clock, Filter } from 'lucide-react';
const Scenes: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const scenes = [
    {
      id: '1',
      name: 'Morning Security Check',
      camera: 'Camera - 01',
      location: 'Shop Floor Camera A',
      timestamp: '2025-07-22T08:30:00Z',
      duration: '00:02:45',
      thumbnail: 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?w=400',
      type: 'routine'
    },
    {
      id: '2',
      name: 'Vault Access Event',
      camera: 'Camera - 02',
      location: 'Vault Security Camera',
      timestamp: '2025-07-22T14:15:00Z',
      duration: '00:01:30',
      thumbnail: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?w=400',
      type: 'security'
    },
    {
      id: '3',
      name: 'Customer Activity',
      camera: 'Camera - 03',
      location: 'Main Entrance Camera',
      timestamp: '2025-07-22T16:45:00Z',
      duration: '00:03:20',
      thumbnail: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?w=400',
      type: 'activity'
    },
    {
      id: '4',
      name: 'After Hours Movement',
      camera: 'Camera - 01',
      location: 'Shop Floor Camera A',
      timestamp: '2025-07-22T22:10:00Z',
      duration: '00:01:15',
      thumbnail: 'https://images.pexels.com/photos/298825/pexels-photo-298825.jpeg?w=400',
      type: 'security'
    },
    {
      id: '5',
      name: 'Delivery Arrival',
      camera: 'Camera - 04',
      location: 'Parking Lot Camera',
      timestamp: '2025-07-22T10:20:00Z',
      duration: '00:04:10',
      thumbnail: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?w=400',
      type: 'activity'
    },
    {
      id: '6',
      name: 'Staff Break Time',
      camera: 'Camera - 05',
      location: 'Storage Room Camera',
      timestamp: '2025-07-22T12:00:00Z',
      duration: '00:15:30',
      thumbnail: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?w=400',
      type: 'routine'
    }
  ];
  const filteredScenes = scenes.filter(scene => {
    if (selectedFilter === 'all') return true;
    return scene.type === selectedFilter;
  });
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'security':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'activity':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'routine':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Scene Management</h1>
          <p className="text-slate-400">Review and analyze recorded scenes</p>
        </div>
        <div className="flex items-center space-x-4">
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
      </div>
      <div className="flex items-center space-x-4 mb-8">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400 text-sm">Filter by type:</span>
        </div>
        {['all', 'security', 'activity', 'routine'].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedFilter === filter ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{scenes.length}</div>
              <div className="text-slate-400 text-sm">Total Scenes</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {scenes.filter(s => s.type === 'security').length}
              </div>
              <div className="text-slate-400 text-sm">Security Events</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">Today</div>
              <div className="text-slate-400 text-sm">Date Range</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {scenes.reduce((total, scene) => {
                  const [minutes, seconds] = scene.duration.split(':').slice(1);
                  return total + parseInt(minutes) + parseInt(seconds) / 60;
                }, 0).toFixed(0)}m
              </div>
              <div className="text-slate-400 text-sm">Total Duration</div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScenes.map((scene) => (
          <SceneCard key={scene.id} scene={scene} />
        ))}
      </div>
    </div>
  );
};
interface SceneCardProps {
  scene: {id: string; name: string; camera: string; location: string; timestamp: string; duration: string; thumbnail: string; type: string;};
}
const SceneCard: React.FC<SceneCardProps> = ({ scene }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'security':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'activity':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'routine':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition-colors">
      <div className="relative aspect-video bg-slate-900 group cursor-pointer">
        <img src={scene.thumbnail} alt={scene.name} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>
        </div>
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-sm font-mono">
          {scene.duration}
        </div>
        <div className="absolute top-3 left-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(scene.type)}`}>
            {scene.type.toUpperCase()}
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-medium mb-2">{scene.name}</h3>
        <div className="space-y-2 text-sm text-slate-400">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>{scene.camera} - {scene.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>
              {new Date(scene.timestamp).toLocaleDateString()} at{' '}
              {new Date(scene.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded transition-colors"> Download</button>
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"> Analyze </button>
        </div>
      </div>
    </div>
  );
};
export default Scenes;