import { supabase } from './supabase';
import { Incident, IncidentWithCamera } from '../types';
export async function getIncidents(resolved: boolean = false): Promise<IncidentWithCamera[]> {
  const { data, error } = await supabase
    .from('incidents')
    .select(`
      *,
      camera:cameras(*)
    `)
    .eq('resolved', resolved)
    .order('ts_start', { ascending: false });

  if (error) throw error;
  return data as IncidentWithCamera[];
}
export async function resolveIncident(id: string): Promise<Incident> {
  const { data, error } = await supabase
    .from('incidents')
    .update({ resolved: true })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Incident;
}
export async function getCameras() {
  const { data, error } = await supabase
    .from('cameras')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}