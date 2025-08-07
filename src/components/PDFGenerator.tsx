import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Quote, Invoice, User } from '../lib/localStorage';
import { format } from 'date-fns';

interface PDFGeneratorProps {
  data: Quote | Invoice;
  user: User;
  type: 'quote' | 'invoice';
  onGenerated?: (blob: Blob) => void;
}

export const PDFGenerator: React.FC<PDFGeneratorProps> = ({ data, user, type, onGenerated }) => {
  const generatePDF = async () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
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

      const filename = `${type}-${type === 'quote' ? (data as Quote).quote_number : (data as Invoice).invoice_number}.pdf`;
      pdf.save(filename);

      if (onGenerated) {
        const blob = pdf.output('blob');
        onGenerated(blob);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const isInvoice = type === 'invoice';
  const documentNumber = isInvoice ? (data as Invoice).invoice_number : (data as Quote).quote_number;
  const documentTitle = isInvoice ? 'FACTURA' : 'COTIZACIÓN';

  return (
    <div>
      <button
        onClick={generatePDF}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Generar PDF
      </button>

      {/* Hidden PDF content */}
      <div id="pdf-content" className="fixed -left-[9999px] top-0 bg-white p-8 w-[210mm]" style={{ minHeight: '297mm' }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            {user.logo_url && (
              <img src={user.logo_url} alt="Logo" className="h-16 w-auto mb-4" />
            )}
            <h1 className="text-2xl font-bold text-gray-900">{user.company_name}</h1>
            {user.company_address && (
              <p className="text-gray-600 mt-2">{user.company_address}</p>
            )}
            <div className="flex gap-4 mt-2 text-sm text-gray-600">
              {user.company_phone && <span>Tel: {user.company_phone}</span>}
              {user.company_email && <span>Email: {user.company_email}</span>}
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-blue-600">{documentTitle}</h2>
            <p className="text-lg font-semibold">{documentNumber}</p>
            <p className="text-sm text-gray-600">
              Fecha: {format(new Date(data.created_at), 'dd/MM/yyyy')}
            </p>
            {isInvoice && (
              <p className="text-sm text-gray-600">
                Vencimiento: {format(new Date((data as Invoice).due_date), 'dd/MM/yyyy')}
              </p>
            )}
            {!isInvoice && data.valid_until && (
              <p className="text-sm text-gray-600">
                Válida hasta: {format(new Date(data.valid_until), 'dd/MM/yyyy')}
              </p>
            )}
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Cliente:</h3>
          <p className="text-gray-900 font-medium">{data.customer_name}</p>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-2 px-1">Descripción</th>
              <th className="text-right py-2 px-1">Cant.</th>
              <th className="text-right py-2 px-1">Precio Unit.</th>
              <th className="text-right py-2 px-1">Impuesto</th>
              <th className="text-right py-2 px-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2 px-1">
                  <div className="font-medium">{item.name}</div>
                  {item.description && (
                    <div className="text-sm text-gray-600">{item.description}</div>
                  )}
                </td>
                <td className="text-right py-2 px-1">{item.quantity}</td>
                <td className="text-right py-2 px-1">${item.unit_price.toFixed(2)}</td>
                <td className="text-right py-2 px-1">{item.tax_rate}%</td>
                <td className="text-right py-2 px-1">${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-1">
              <span>Subtotal:</span>
              <span>${data.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Impuestos:</span>
              <span>${data.tax_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-t-2 border-gray-300 font-bold text-lg">
              <span>Total:</span>
              <span>${data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        {data.payment_terms && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Términos de Pago:</h4>
            <p className="text-gray-700">{data.payment_terms}</p>
          </div>
        )}

        {/* Notes */}
        {data.notes && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Notas:</h4>
            <p className="text-gray-700">{data.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-600">
          <p>Gracias por su preferencia</p>
        </div>
      </div>
    </div>
  );
};

export default PDFGenerator;