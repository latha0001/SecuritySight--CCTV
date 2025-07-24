# SecureSight CCTV Monitoring Dashboard
A comprehensive CCTV monitoring dashboard built for SecureSight, featuring real-time incident management, video playback, and interactive timeline controls.
### Mandatory Features 
- **Navbar**: Professional navigation with SecureSight branding
- **Incident Player**: Large video display with camera thumbnail strip
- **Incident List**: Real-time incident management with resolve functionality
- **Database Schema**: Complete data models for cameras and incidents
- **API Routes**: RESTful endpoints for incident management
- **Optimistic UI**: Smooth resolve actions with proper error handling
### Optional Features 
- **Interactive Timeline**: 24-hour timeline with incident markers and scrubber
- **Responsive Design**: Optimized for dashboard viewing
- **Professional Styling**: Dark theme with color-coded incident types
### Cameras Table
- `id` (uuid, primary key)
- `name` (text, camera identifier)
- `location` (text, physical location)
- `created_at` (timestamp)
### Incidents Table
- `id` (uuid, primary key)
- `camera_id` (uuid, foreign key to cameras)
- `type` (text, incident category)
- `ts_start` (timestamp, incident start time)
- `ts_end` (timestamp, incident end time)
- `thumbnail_url` (text, preview image URL)
- `resolved` (boolean, resolution status)
- `created_at` (timestamp)
## API Endpoints
- `GET /api/incidents?resolved=false` - Fetch unresolved incidents
- `PATCH /api/incidents/:id/resolve` - Resolve specific incident
### Setup Instructions
1. **Clone and Install**:
   ```bash
   npm install
   ```
2. **Database Setup**:
   - Create a Supabase project
   - Run the migration file `supabase/migrations/create_securesight_schema.sql`
   - Copy `.env.example` to `.env` and add your Supabase credentials
   - github Repo : https://github.com/latha0001/SecuritySight--CCTV
   - Netlify Live Demo Link : https://rad-mochi-8030ce.netlify.app/
3. **Run Development Server**:
   ```bash
   npm run dev
   ```
### Technologies Used
- **Frontend**: React, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Date Handling**: date-fns
### Design Features
- Professional dark theme optimized for security monitoring
- Color-coded incident types for quick identification
- Smooth animations and micro-interactions
- Responsive layout for various screen sizes
- Optimistic UI updates for better user experience
