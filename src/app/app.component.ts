import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceFormComponent } from './components/invoiceForm/invoiceForm.component';
import { InvoiceViewComponent } from './components/invoiceView/invoiceView.component';
import { FormGroup } from '@angular/forms';
import { PdfService } from './services/pdf.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, InvoiceFormComponent, InvoiceViewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App {
  documentData: any;
  constructor(private pdfService: PdfService) {}

  onFormSubmit(documentForm: FormGroup): void {
    this.documentData = documentForm.value;
  }

  onDownloadPdf(): void {
    if (this.documentData) {
      const docType = this.documentData.type || 'document';
      const docNumber = this.documentData.number || '0000';
      const filename = `${docType}-${docNumber}.pdf`;

      this.pdfService.generatePdf('documentPreview', filename);
    }
  }
}
