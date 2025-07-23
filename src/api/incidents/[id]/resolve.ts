import { supabase } from '../../../lib/supabase';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const { data, error } = await supabase
      .from('incidents')
      .update({ resolved: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to resolve incident' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}