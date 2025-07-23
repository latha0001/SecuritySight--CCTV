import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Plus, Settings, Eye, EyeOff } from 'lucide-react';
import { getCameras } from '../lib/api';
import { Camera as CameraType } from '../types';

const Cameras: React.FC = () => {
  const [cameras, setCameras] = useState<CameraType[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadCameras();
  }, []);
  const loadCameras = async () => {
    try {
      const data = await getCameras();
      setCameras(data);
    } catch (error) {
      console.error('Failed to load cameras:', error);
      setCameras(mockCameras);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Camera Management</h1>
          <p className="text-slate-400">Monitor and manage your CCTV cameras</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Camera</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{cameras.length}</div>
              <div className="text-slate-400 text-sm">Total Cameras</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{cameras.length}</div>
              <div className="text-slate-400 text-sm">Online</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <EyeOff className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-slate-400 text-sm">Offline</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-slate-400 text-sm">Maintenance</div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameras.map((camera) => (
          <CameraCard key={camera.id} camera={camera} />
        ))}
      </div>
    </div>
  );
};
interface CameraCardProps {camera: CameraType;}
const CameraCard: React.FC<CameraCardProps> = ({ camera }) => {
  const [isOnline] = useState(true);
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition-colors">
      <div className="relative aspect-video bg-slate-900">
        <img src={`https://images.pexels.com/photos/${264547 + parseInt(camera.id) * 100}/pexels-photo-${264547 + parseInt(camera.id) * 100}.jpeg`} alt={camera.name} className="w-full h-full object-cover"/>
        <div className="absolute top-3 left-3">
          <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${
            isOnline 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span>{isOnline ? 'LIVE' : 'OFFLINE'}</span>
          </div>
        </div>
        <div className="absolute top-3 right-3 opacity-0 hover:opacity-100 transition-opacity">
          <button className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
            <Settings className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Camera className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-medium">{camera.name}</h3>
            <div className="flex items-center space-x-1 text-slate-400 text-sm">
              <MapPin className="w-3 h-3" />
              <span>{camera.location}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-slate-500 text-xs">
            ID: {camera.id.slice(0, 8)}...
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded transition-colors">
              View
            </button>
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors">
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const mockCameras: CameraType[] = [
  { id: '1', name: 'Camera - 01', location: 'Shop Floor Camera A' },
  { id: '2', name: 'Camera - 02', location: 'Vault Security Camera' },
  { id: '3', name: 'Camera - 03', location: 'Main Entrance Camera' },
  { id: '4', name: 'Camera - 04', location: 'Parking Lot Camera' },
  { id: '5', name: 'Camera - 05', location: 'Storage Room Camera' },
  { id: '6', name: 'Camera - 06', location: 'Emergency Exit Camera' },
];
export default Cameras;