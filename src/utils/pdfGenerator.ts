import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Cliente, Procedimiento } from '../types';
import { formatDate, calculateAge } from './dateUtils';

export async function generateClientePDF(
  cliente: Cliente,
  procedimientos: Procedimiento[]
): Promise<void> {
  // Crear contenido HTML temporal
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '800px';
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.padding = '40px';
  tempDiv.style.fontFamily = 'Arial, sans-serif';

  const age = calculateAge(cliente.fecha_nacimiento);
  const recentProcedimientos = procedimientos
    .filter(p => p.cliente_id === cliente.id)
    .sort((a, b) => new Date(b.fecha_procedimiento).getTime() - new Date(a.fecha_procedimiento).getTime())
    .slice(0, 5);

  tempDiv.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #7B61FF; padding-bottom: 20px;">
        <h1 style="color: #7B61FF; margin: 0; font-size: 28px;">CENTRO ESTÉTICO</h1>
        <p style="margin: 5px 0; color: #666;">Ficha Técnica del Cliente</p>
        <p style="margin: 0; color: #666; font-size: 14px;">Generada el ${formatDate(new Date())}</p>
      </div>

      <!-- Datos del Cliente -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #7B61FF; border-bottom: 2px solid #FFD9A6; padding-bottom: 10px;">DATOS PERSONALES</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
          <div>
            <p><strong>Nombre:</strong> ${cliente.nombre_completo}</p>
            <p><strong>Edad:</strong> ${age} años</p>
            <p><strong>Teléfono:</strong> ${cliente.telefono}</p>
            <p><strong>Email:</strong> ${cliente.email}</p>
          </div>
          <div>
            <p><strong>Género:</strong> ${cliente.genero}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${formatDate(cliente.fecha_nacimiento)}</p>
            <p><strong>Dirección:</strong> ${cliente.direccion}</p>
          </div>
        </div>
      </div>

      <!-- Información Médica -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #7B61FF; border-bottom: 2px solid #FFD9A6; padding-bottom: 10px;">INFORMACIÓN MÉDICA</h2>
        <div style="margin-top: 15px;">
          <p><strong>Alergias:</strong> ${cliente.alergias.length > 0 ? cliente.alergias.join(', ') : 'Ninguna conocida'}</p>
          <p><strong>Medicamentos Actuales:</strong> ${cliente.medicamentos_actuales.length > 0 ? cliente.medicamentos_actuales.join(', ') : 'Ninguno'}</p>
          <p><strong>Notas Médicas:</strong></p>
          <div style="background: #f8f9ff; padding: 15px; border-left: 4px solid #7B61FF; margin-top: 10px;">
            ${cliente.notas_medicas || 'Sin notas adicionales'}
          </div>
        </div>
      </div>

      <!-- Historial de Procedimientos -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #7B61FF; border-bottom: 2px solid #FFD9A6; padding-bottom: 10px;">HISTORIAL DE TRATAMIENTOS</h2>
        ${recentProcedimientos.length > 0 ? `
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <thead>
              <tr style="background: #f8f9ff;">
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Fecha</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Procedimiento</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Costo</th>
              </tr>
            </thead>
            <tbody>
              ${recentProcedimientos.map(proc => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px;">${formatDate(proc.fecha_procedimiento)}</td>
                  <td style="border: 1px solid #ddd; padding: 10px;">${proc.tipo_servicio}</td>
                  <td style="border: 1px solid #ddd; padding: 10px;">RD$ ${proc.costo.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p>No hay procedimientos registrados.</p>'}
      </div>

      <!-- Consentimientos -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #7B61FF; border-bottom: 2px solid #FFD9A6; padding-bottom: 10px;">CONSENTIMIENTOS</h2>
        ${cliente.consentimientos.length > 0 ? `
          <ul style="margin-top: 15px;">
            ${cliente.consentimientos.map(consent => `
              <li style="margin-bottom: 10px;">
                <strong>${consent.tipo}</strong> - ${formatDate(consent.fecha)} 
                <span style="color: #666;">(${consent.metodo === 'digital' ? 'Digital' : 'Físico'})</span>
              </li>
            `).join('')}
          </ul>
        ` : '<p>No hay consentimientos registrados.</p>'}
      </div>

      <!-- Recomendaciones -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #7B61FF; border-bottom: 2px solid #FFD9A6; padding-bottom: 10px;">RECOMENDACIONES POST-TRATAMIENTO</h2>
        <div style="background: #fff8f0; border: 1px solid #FFD9A6; padding: 20px; margin-top: 15px;">
          <ul style="margin: 0; padding-left: 20px;">
            <li>Aplicar protector solar SPF 50+ diariamente</li>
            <li>Evitar exposición solar directa por 48-72 horas</li>
            <li>Mantener la piel hidratada</li>
            <li>No utilizar productos exfoliantes por una semana</li>
            <li>Contactar al centro ante cualquier reacción adversa</li>
          </ul>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="margin: 0; color: #666; font-size: 12px;">
          Este documento contiene información médica confidencial.<br>
          Centro Estético - Tel: (809) 555-0000 - info@centroestetico.com
        </p>
      </div>
    </div>
  `;

  document.body.appendChild(tempDiv);

  try {
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const fileName = `ficha-tecnica-${cliente.nombre_completo.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    pdf.save(fileName);
  } finally {
    document.body.removeChild(tempDiv);
  }
}