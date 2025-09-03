import { Component, input } from '@angular/core';
import { CommonModule} from '@angular/common';
import { Document } from '../../interfaces/document.interface';

@Component({
  selector: 'app-invoice-view',
  standalone: true,
  templateUrl: './invoiceView.component.html',
  styleUrls: ['./invoiceView.component.css'],
  imports: [CommonModule]
})
export class InvoiceViewComponent {
  document = input<Document | undefined>(undefined);
}
