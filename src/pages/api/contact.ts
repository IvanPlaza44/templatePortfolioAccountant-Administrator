import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    
    // 1. Extraemos los campos usando los "id" y "name" de tu componente
    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const email = data.get('email');
    const phone = data.get('phone');
    const company = data.get('company');
    const service = data.get('service');
    const message = data.get('message');

    // 2. Validación: Verificamos los campos obligatorios definidos en tu HTML
    if (!firstName || !lastName || !email || !message) {
      return new Response(
        JSON.stringify({ message: "Por favor, completa los campos obligatorios." }), 
        { status: 400 }
      );
    }

    // 3. Formateamos el nombre completo para el asunto del correo
    const fullName = `${firstName} ${lastName}`;

    // 4. Envío a través de Resend
    const { error } = await resend.emails.send({
      from: 'Contacto Web <onboarding@resend.dev>',
      to: 'plazaivanalt@gmail.com',
      subject: `💼 Nueva consulta: ${service} de ${fullName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
          <div style="background-color: #1e3a8a; color: #ffffff; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Nueva Solicitud de Servicio</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.8;">Alexandra Morgan - Portfolio</p>
          </div>
          
          <div style="padding: 30px; color: #1f2937;">
            <h3 style="border-bottom: 2px solid #f3f4f6; padding-bottom: 10px; color: #1e3a8a;">Datos del Cliente</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;"><strong>Nombre:</strong></td>
                <td style="padding: 8px 0;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;"><strong>Email:</strong></td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #1e3a8a; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;"><strong>Teléfono:</strong></td>
                <td style="padding: 8px 0;">${phone || 'No proporcionado'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;"><strong>Empresa:</strong></td>
                <td style="padding: 8px 0;">${company || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;"><strong>Servicio:</strong></td>
                <td style="padding: 8px 0; background-color: #eff6ff; color: #1e3a8a; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${service}</td>
              </tr>
            </table>

            <h3 style="border-bottom: 2px solid #f3f4f6; padding-bottom: 10px; margin-top: 30px; color: #1e3a8a;">Mensaje</h3>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #1e3a8a; font-style: italic;">
              "${message}"
            </div>
          </div>

          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
            Este mensaje fue enviado desde el formulario de contacto de tu portfolio profesional.
          </div>
        </div>
      `,
    });

    if (error) {
      return new Response(
        JSON.stringify({ message: "Error al enviar el email vía Resend.", details: error }), 
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: "¡Mensaje enviado con éxito!" }), 
      { status: 200 }
    );

  } catch (e) {
    console.error("API Error:", e);
    return new Response(
      JSON.stringify({ message: "Error interno del servidor." }), 
      { status: 500 }
    );
  }
};