import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  async downloadPdf(
    element: HTMLElement,
    fileName: string
  ): Promise<void> {

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // A4 dimensions
    const pageWidth = 210;
    const pageHeight = 297;

    // Add the complete PDF UI on ONE A4 page
    pdf.addImage(
      imgData,
      'PNG',
      0,
      0,
      pageWidth,
      pageHeight
    );

    pdf.save(fileName);
  }
}