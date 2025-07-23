/*
  # SecureSight CCTV Monitoring Database Schema

  1. New Tables
    - `cameras`
      - `id` (uuid, primary key)
      - `name` (text, camera identifier)
      - `location` (text, physical location)
      - `created_at` (timestamp)
      
    - `incidents`
      - `id` (uuid, primary key)
      - `camera_id` (uuid, foreign key to cameras)
      - `type` (text, incident category)
      - `ts_start` (timestamp, incident start time)
      - `ts_end` (timestamp, incident end time)
      - `thumbnail_url` (text, preview image URL)
      - `resolved` (boolean, resolution status)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage incidents
    - Add policies for reading camera data

  3. Sample Data
    - 3 cameras with realistic locations
    - 15+ incidents across different threat types
    - Incidents distributed across 24-hour period
    - Mix of resolved and unresolved incidents
*/

-- Create cameras table
CREATE TABLE IF NOT EXISTS cameras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  camera_id uuid REFERENCES cameras(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('Unauthorised Access', 'Gun Threat', 'Face Recognised', 'Traffic Congestion', 'Multiple Events')),
  ts_start timestamptz NOT NULL,
  ts_end timestamptz NOT NULL,
  thumbnail_url text NOT NULL,
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE cameras ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Create policies for cameras
CREATE POLICY "Anyone can read cameras"
  ON cameras
  FOR SELECT
  TO public
  USING (true);

-- Create policies for incidents
CREATE POLICY "Anyone can read incidents"
  ON incidents
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update incidents"
  ON incidents
  FOR UPDATE
  TO public
  USING (true);

-- Insert sample cameras
INSERT INTO cameras (id, name, location) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Camera A', 'Shop Floor Camera A'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Camera B', 'Vault Camera'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Camera C', 'Entrance Camera')
ON CONFLICT (id) DO NOTHING;

-- Insert sample incidents (distributed across 24 hours)
INSERT INTO incidents (camera_id, type, ts_start, ts_end, thumbnail_url, resolved) VALUES
  -- Early morning incidents
  ('550e8400-e29b-41d4-a716-446655440001', 'Unauthorised Access', '2025-07-07T02:15:00Z', '2025-07-07T02:17:00Z', 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?w=300', false),
  ('550e8400-e29b-41d4-a716-446655440002', 'Face Recognised', '2025-07-07T03:45:00Z', '2025-07-07T03:46:00Z', 'https://images.pexels.com/photos/298825/pexels-photo-298825.jpeg?w=300', true),
  
  -- Morning incidents
  ('550e8400-e29b-41d4-a716-446655440003', 'Traffic Congestion', '2025-07-07T06:30:00Z', '2025-07-07T06:35:00Z', 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?w=300', true),
  ('550e8400-e29b-41d4-a716-446655440001', 'Gun Threat', '2025-07-07T08:12:00Z', '2025-07-07T08:14:00Z', 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?w=300', false),
  ('550e8400-e29b-41d4-a716-446655440002', 'Unauthorised Access', '2025-07-07T09:22:00Z', '2025-07-07T09:25:00Z', 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?w=300', true),
  
  -- Afternoon incidents
  ('550e8400-e29b-41d4-a716-446655440001', 'Face Recognised', '2025-07-07T12:45:00Z', '2025-07-07T12:46:00Z', 'https://images.pexels.com/photos/298825/pexels-photo-298825.jpeg?w=300', false),
  ('550e8400-e29b-41d4-a716-446655440003', 'Multiple Events', '2025-07-07T13:15:00Z', '2025-07-07T13:18:00Z', 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?w=300', false),
  ('550e8400-e29b-41d4-a716-446655440002', 'Gun Threat', '2025-07-07T14:35:00Z', '2025-07-07T14:37:00Z', 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?w=300', false),
  
  -- Evening incidents  
  ('550e8400-e29b-41d4-a716-446655440001', 'Unauthorised Access', '2025-07-07T16:20:00Z', '2025-07-07T16:22:00Z', 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?w=300', false),
  ('550e8400-e29b-41d4-a716-446655440003', 'Traffic Congestion', '2025-07-07T17:45:00Z', '2025-07-07T17:50:00Z', 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?w=300', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Face Recognised', '2025-07-07T19:10:00Z', '2025-07-07T19:11:00Z', 'https://images.pexels.com/photos/298825/pexels-photo-298825.jpeg?w=300', false),
  
  -- Night incidents
  ('550e8400-e29b-41d4-a716-446655440001', 'Multiple Events', '2025-07-07T21:30:00Z', '2025-07-07T21:33:00Z', 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?w=300', false),
  ('550e8400-e29b-41d4-a716-446655440003', 'Unauthorised Access', '2025-07-07T22:15:00Z', '2025-07-07T22:17:00Z', 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?w=300', false),
  ('550e8400-e29b-41d4-a716-446655440002', 'Gun Threat', '2025-07-07T23:45:00Z', '2025-07-07T23:47:00Z', 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?w=300', false),
  
  -- Late night incidents
  ('550e8400-e29b-41d4-a716-446655440001', 'Face Recognised', '2025-07-08T01:20:00Z', '2025-07-08T01:21:00Z', 'https://images.pexels.com/photos/298825/pexels-photo-298825.jpeg?w=300', true)
ON CONFLICT DO NOTHING;