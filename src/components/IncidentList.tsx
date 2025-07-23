import React, { useState, useEffect } from 'react';
import { AlertTriangle, Sun as Gun, User, TrafficCone as Traffic, Layers, Check, Clock } from 'lucide-react';
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
      return 'text-red-400 bg-red-500/10';
    case 'Unauthorised Access':
      return 'text-orange-400 bg-orange-500/10';
    case 'Face Recognised':
      return 'text-blue-400 bg-blue-500/10';
    case 'Traffic Congestion':
      return 'text-green-400 bg-green-500/10';
    case 'Multiple Events':
      return 'text-purple-400 bg-purple-500/10';
    default:
      return 'text-gray-400 bg-gray-500/10';
  }
};
const IncidentList: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentWithCamera[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingIds, setResolvingIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    loadIncidents();
  }, []);
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
  const handleResolve = async (id: string) => {
    setResolvingIds(prev => new Set([...prev, id]));
    setIncidents(prev => prev.filter(incident => incident.id !== id));
    try {
      await resolveIncident(id);
    } catch (error) {
      console.error('Failed to resolve incident:', error);
      loadIncidents();
    } finally {
      setResolvingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };
  const unresolvedCount = incidents.length;
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="bg-slate-800 rounded-lg">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {unresolvedCount} Unresolved Incidents
            </h2>
          </div>
          <div className="text-sm text-slate-400">4 resolved incidents</div>
        </div>
      </div>
      <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
        {incidents.map((incident) => (
          <IncidentItem key={incident.id} incident={incident} onResolve={handleResolve} isResolving={resolvingIds.has(incident.id)}/>
        ))}
        {incidents.length === 0 && (
          <div className="text-center py-12">
            <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-slate-300 text-lg font-medium">All incidents resolved!</p>
            <p className="text-slate-500 text-sm">Great job maintaining security.</p>
          </div>
        )}
      </div>
    </div>
  );
};
interface IncidentItemProps {incident: IncidentWithCamera; onResolve: (id: string) => void; isResolving: boolean;}
const IncidentItem: React.FC<IncidentItemProps> = ({ incident, onResolve, isResolving }) => {
  const Icon = getIncidentIcon(incident.type);
  const colorClass = getIncidentColor(incident.type);
  return (
    <div className={`bg-slate-900 rounded-lg p-4 border border-slate-700 transition-all duration-300 ${
      isResolving ? 'opacity-50 scale-95' : 'hover:border-slate-600'
    }`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img src={incident.thumbnail_url} alt="Incident thumbnail" className="w-16 h-12 object-cover rounded-lg"/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${colorClass}`}>
              <Icon className="w-3 h-3" />
            </div>
            <span className="text-white font-medium text-sm">{incident.type}</span>
          </div>
          <div className="text-slate-400 text-sm mb-2">
            {incident.camera?.location || 'Unknown Location'}
          </div>
          <div className="flex items-center space-x-4 text-slate-500 text-xs">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>
                {format(new Date(incident.ts_start), 'HH:mm')} - {format(new Date(incident.ts_end), 'HH:mm')}
              </span>
            </div>
            <span>{format(new Date(incident.ts_start), 'dd-MMM-yyyy')}</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <button onClick={() => onResolve(incident.id)} disabled={isResolving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-2">
            {isResolving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Resolving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Resolve</span>
              </>
            )}
          </button>
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
    ts_start: '2025-07-07T14:35:00Z',
    ts_end: '2025-07-07T14:37:00Z',
    thumbnail_url: 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?w=300',
    resolved: false,
  },
  {
    id: '2',
    camera_id: '1',
    camera: { id: '1', name: 'Camera A', location: 'Shop Floor Camera A' },
    type: 'Gun Threat',
    ts_start: '2025-07-07T14:35:00Z',
    ts_end: '2025-07-07T14:37:00Z',
    thumbnail_url: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?w=300',
    resolved: false,
  },
  {
    id: '3',
    camera_id: '1',
    camera: { id: '1', name: 'Camera A', location: 'Shop Floor Camera A' },
    type: 'Unauthorised Access',
    ts_start: '2025-07-07T14:35:00Z',
    ts_end: '2025-07-07T14:37:00Z',
    thumbnail_url: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?w=300',
    resolved: false,
  },
  {
    id: '4',
    camera_id: '1',
    camera: { id: '1', name: 'Camera A', location: 'Shop Floor Camera A' },
    type: 'Face Recognised',
    ts_start: '2025-07-07T14:35:00Z',
    ts_end: '2025-07-07T14:37:00Z',
    thumbnail_url: 'https://images.pexels.com/photos/298825/pexels-photo-298825.jpeg?w=300',
    resolved: false,
  },
];
export default IncidentList;