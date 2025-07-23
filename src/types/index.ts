export interface Camera {
  id: string;
  name: string;
  location: string;
  created_at?: string;
}
export interface Incident {
  id: string;
  camera_id: string;
  camera?: Camera;
  type: 'Unauthorised Access' | 'Gun Threat' | 'Face Recognised' | 'Traffic Congestion' | 'Multiple Events';
  ts_start: string;
  ts_end: string;
  thumbnail_url: string;
  resolved: boolean;
  created_at?: string;
}
export interface IncidentWithCamera extends Incident {camera: Camera;}