import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  async generatePdf(elementId: string, filename: string): Promise<void> {
    try {
      const element = document.getElementById(elementId);

      if (!element) {
        throw new Error('Element not found');
      }

      const options = {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
      };

      const canvas = await html2canvas(element, options);
      const imageData = canvas.toDataURL('image/png', 1);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imageWidth = 210;
      const pageHeight = 247;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;

        let heightLeft = imageHeight;
        let position = 0;

      pdf.addImage(imageData, 'PNG', 0, position, imageWidth, imageHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = imageHeight - heightLeft;
        pdf.addPage();
        pdf.addImage(imageData, 'PNG', 0, position, imageWidth, imageHeight);
        heightLeft -= pageHeight;
      }

       pdf.save(filename);

    } catch (err) {
      console.error('Error generating PDF: ', err);
      throw err;
    }
  }
}
