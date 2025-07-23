import React, { useState, useEffect } from 'react';
import { AlertTriangle, Sun as Gun, User, TrafficCone as Traffic, Layers, Check, Clock, Filter, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { IncidentWithCamera } from '../types';
import { getIncidents, resolveIncident } from '../lib/api';
const getIncidentIcon = (type: string) => {
  switch (type) {
    case 'Gun Threat':
      return Gun;
    case 'Unauthorised Access':
      return AlertTriangle;
    case 'Face Recognised':
      return User;
    case 'Traffic Congestion':
      return Traffic;
    case 'Multiple Events':
      return Layers;
    default:
      return AlertTriangle;
  }
};
const getIncidentColor = (type: string) => {
  switch (type) {
    case 'Gun Threat':
      return 'text-red-400 bg-red-500/10 border-red-500/30';
    case 'Unauthorised Access':
      return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    case 'Face Recognised':
      return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    case 'Traffic Congestion':
      return 'text-green-400 bg-green-500/10 border-green-500/30';
    case 'Multiple Events':
      return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    default:
      return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
  }
};
const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentWithCamera[]>([]);
  const [resolvedIncidents, setResolvedIncidents] = useState<IncidentWithCamera[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingIds, setResolvingIds] = useState<Set<string>>(new Set());
  const [showResolved, setShowResolved] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  useEffect(() => {loadIncidents(); loadResolvedIncidents();}, []);
  const loadIncidents = async () => {
    try {
      const data = await getIncidents(false);
      setIncidents(data);
    } catch (error) {
      console.error('Failed to load incidents:', error);
      setIncidents(mockIncidents);
    } finally {
      setLoading(false);
    }
  };
  const loadResolvedIncidents = async () => {
    try {
      const data = await getIncidents(true);
      setResolvedIncidents(data);
    } catch (error) {
      console.error('Failed to load resolved incidents:', error);
      setResolvedIncidents(mockResolvedIncidents);
    }
  };
  const handleResolve = async (id: string) => {
    setResolvingIds(prev => new Set([...prev, id]));
    const incident = incidents.find(i => i.id === id);
    if (incident) {
      setIncidents(prev => prev.filter(i => i.id !== id));
      setResolvedIncidents(prev => [...prev, { ...incident, resolved: true }]);
    }
    try {
      await resolveIncident(id);
    } catch (error) {
      console.error('Failed to resolve incident:', error);
      loadIncidents();
      loadResolvedIncidents();
    } finally {
      setResolvingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };
  const currentIncidents = showResolved ? resolvedIncidents : incidents;
  const filteredIncidents = currentIncidents.filter(incident => {
    if (selectedType === 'all') return true;
    return incident.type === selectedType;
  });
  const incidentTypes = ['Unauthorised Access', 'Gun Threat', 'Face Recognised', 'Traffic Congestion', 'Multiple Events'];
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
          <h1 className="text-3xl font-bold text-white mb-2">Incident Management</h1>
          <p className="text-slate-400">Monitor and resolve security incidents</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowResolved(!showResolved)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${showResolved ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
            {showResolved ? 'Show Unresolved' : 'Show Resolved'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{incidents.length}</div>
              <div className="text-slate-400 text-sm">Unresolved</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{resolvedIncidents.length}</div>
              <div className="text-slate-400 text-sm">Resolved</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">Today</div>
              <div className="text-slate-400 text-sm">Time Range</div>
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
                {Math.round((resolvedIncidents.length / (incidents.length + resolvedIncidents.length)) * 100) || 0}%
              </div>
              <div className="text-slate-400 text-sm">Resolution Rate</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4 mb-8">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400 text-sm">Filter by type:</span>
        </div>
        <button onClick={() => setSelectedType('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedType === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}> All Types</button>
        {incidentTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedType === type ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
            {type}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIncidents.map((incident) => (
          <IncidentCard key={incident.id} incident={incident} onResolve={handleResolve} isResolving={resolvingIds.has(incident.id)} showResolveButton={!showResolved}/>
        ))}
      </div>
      {filteredIncidents.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            {showResolved ? (
              <Check className="w-8 h-8 text-green-400" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <p className="text-slate-300 text-lg font-medium">
            {showResolved ? 'No resolved incidents found' : 'No unresolved incidents'}
          </p>
          <p className="text-slate-500 text-sm">
            {showResolved ? 'Try adjusting your filters' : 'Great job maintaining security!'}
          </p>
        </div>
      )}
    </div>
  );
};
interface IncidentCardProps {
  incident: IncidentWithCamera;
  onResolve: (id: string) => void;
  isResolving: boolean;
  showResolveButton: boolean;
}
const IncidentCard: React.FC<IncidentCardProps> = ({ 
  incident, 
  onResolve, 
  isResolving, 
  showResolveButton 
}) => {
  const Icon = getIncidentIcon(incident.type);
  const colorClass = getIncidentColor(incident.type);
  return (
    <div className={`bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition-all duration-300 ${
      isResolving ? 'opacity-50 scale-95' : ''
    }`}>
      <div className="relative aspect-video bg-slate-900">
        <img src={incident.thumbnail_url} alt="Incident thumbnail" className="w-full h-full object-cover"/>
        <div className="absolute top-3 left-3">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
            <Icon className="w-3 h-3" />
            <span>{incident.type}</span>
          </div>
        </div>
        {incident.resolved && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs font-medium text-green-400">
              <Check className="w-3 h-3" />
              <span>RESOLVED</span>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-white font-medium mb-1">{incident.type}</h3>
          <div className="text-slate-400 text-sm">
            {incident.camera?.location || 'Unknown Location'}
          </div>
        </div>
        <div className="flex items-center space-x-4 text-slate-500 text-xs mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>
              {format(new Date(incident.ts_start), 'HH:mm')} - {format(new Date(incident.ts_end), 'HH:mm')}
            </span>
          </div>
          <span>{format(new Date(incident.ts_start), 'dd-MMM-yyyy')}</span>
        </div>
        <div className="flex items-center justify-between">
          <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded transition-colors"> View Details</button>
          {showResolveButton && (
            <button onClick={() => onResolve(incident.id)} disabled={isResolving} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white text-xs rounded transition-colors flex items-center space-x-1">
              {isResolving ? (
                <>
                  <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Resolving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3 h-3" />
                  <span>Resolve</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
const mockIncidents: IncidentWithCamera[] = [
  {
    id: '1',
    camera_id: '1',
    camera: { id: '1', name: 'Camera A', location: 'Shop Floor Camera A' },
    type: 'Unauthorised Access',
    ts_start: '2025-07-22T14:35:00Z',
    ts_end: '2025-07-22T14:37:00Z',
    thumbnail_url: 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?w=300',
    resolved: false,
  },
  {
    id: '2',
    camera_id: '1',
    camera: { id: '1', name: 'Camera A', location: 'Shop Floor Camera A' },
    type: 'Gun Threat',
    ts_start: '2025-07-22T14:35:00Z',
    ts_end: '2025-07-22T14:37:00Z',
    thumbnail_url: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?w=300',
    resolved: false,
  },
  {
    id: '3',
    camera_id: '1',
    camera: { id: '1', name: 'Camera A', location: 'Shop Floor Camera A' },
    type: 'Face Recognised',
    ts_start: '2025-07-22T14:35:00Z',
    ts_end: '2025-07-22T14:37:00Z',
    thumbnail_url: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?w=300',
    resolved: false,
  },
];
const mockResolvedIncidents: IncidentWithCamera[] = [
  {
    id: '4',
    camera_id: '2',
    camera: { id: '2', name: 'Camera B', location: 'Vault Security Camera' },
    type: 'Traffic Congestion',
    ts_start: '2025-07-22T10:15:00Z',
    ts_end: '2025-07-22T10:18:00Z',
    thumbnail_url: 'https://images.pexels.com/photos/298825/pexels-photo-298825.jpeg?w=300',
    resolved: true,
  },
  {
    id: '5',
    camera_id: '3',
    camera: { id: '3', name: 'Camera C', location: 'Main Entrance Camera' },
    type: 'Multiple Events',
    ts_start: '2025-07-22T08:20:00Z',
    ts_end: '2025-07-22T08:25:00Z',
    thumbnail_url: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?w=300',
    resolved: true,
  },
];
export default Incidents;