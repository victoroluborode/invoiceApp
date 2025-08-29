import { Injectable } from "@angular/core";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: "root",
})
export class PdfService {
    constructor() { }
    
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
                backgroundColor: '#ffffff'
            };

            const canvas = await html2canvas(element, options)
        } catch (err) {

        }
    }
}