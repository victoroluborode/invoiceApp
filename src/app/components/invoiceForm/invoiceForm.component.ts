import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Document} from '../../interfaces/document.interface';
import { storageService } from '../../services/storage.service';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoiceForm.component.html',
  styleUrls: ['./invoiceForm.component.css'],
})
export class InvoiceFormComponent implements OnInit {
    constructor(private storageService: storageService) { }
    
    document: Document = {
        type: 'invoice',
            number: '',
            date: '',
            companyName: '',
            companyAddress: '',
            companyEmail: '',
            companyPhone: '',
            customerName: '',
            customerAddress: '',
            customerEmail: '',
            items: [],
            subTotal: 0,
            taxRate: 0,
            taxAmount: 0,
            total: 0,
            notes: '',
    }
  ngOnInit(): void {}

    addItem(): void {
        this.document.items.push({
            description: '',
            quantity: 0,
            price: 0,
            total: 0
        })
    }

    removeItem(index: number): void {
        this.document.items.splice(index, 1)
    }

    calculateItems(index: number): void {
        const item = this.document.items[index];
        item.total = item.quantity * item.price
    }

    calculateTotals(index: number): void {
        this.document.subTotal = this.
    }
}
