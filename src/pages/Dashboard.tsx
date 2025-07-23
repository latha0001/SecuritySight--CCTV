import React from 'react';
import IncidentPlayer from '../components/IncidentPlayer';
import IncidentList from '../components/IncidentList';
import Timeline from '../components/Timeline';
const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncidentPlayer />
        </div>
        <div className="lg:col-span-1">
          <IncidentList />
        </div>
      </div>
      <div>
        <Timeline />
      </div>
    </div>
  );
};
export default Dashboard;