import { supabase } from '../lib/supabase';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const resolved = url.searchParams.get('resolved') === 'true';

  try {
    const { data, error } = await supabase
      .from('incidents')
      .select(`
        *,
        camera:cameras(*)
      `)
      .eq('resolved', resolved)
      .order('ts_start', { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch incidents' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}