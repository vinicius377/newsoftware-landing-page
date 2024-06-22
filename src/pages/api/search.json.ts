import type { APIRoute } from 'astro'
import { supabase } from '../../lib/supabase'
import type { Form } from '../../types/form'

export const POST: APIRoute = async ({ request  }) => {
  try {
    let data
    if (request.headers.get('Content-type') === 'application/json') {
      data = await request.json() as Form;
      data = {
        name: data.name,
        tel: Number(data.tel),
        type: data.type,
        value: Number(data.value)
      }
      const { error } = await supabase.from('pesquisa').insert(data);
      if (error) throw error
    }
    const response = JSON.stringify({
      message: 'sucess',
      data
    })
    return new Response(response, { status: 200 })
  } catch (err) {
    console.log(err)
    return new Response(JSON.stringify({ message: 'error' }), { status: 400 })
  }

}
