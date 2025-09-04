import { Component, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Document } from '../../interfaces/document.interface';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  templateUrl: './invoiceForm.component.html',
  styleUrls: ['./invoiceForm.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class InvoiceFormComponent implements OnInit {
  documentType = input<'invoice' | 'quotation' | 'receipt'>('invoice');
  formSubmit = output<FormGroup>();
  documentForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.documentForm = this.fb.group({
      type: [this.documentType()],
      number: [this.generateDocumentNumber(), Validators.required],
      date: ['', Validators.required],
      companyName: ['', Validators.required],
      companyAddress: ['', Validators.required],
      companyEmail: ['', [Validators.required, Validators.email]],
      companyPhone: ['', Validators.required],
      customerName: ['', Validators.required],
      customerAddress: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      items: this.fb.array([]),
      subTotal: [0],
      taxRate: [0],
      taxAmount: [0],
      total: [0],
      notes: [''],
    });

    this.addItem();
  }

  get items(): FormArray {
    return this.documentForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(
      this.fb.group({
        // Add a unique ID to each item
        id: Date.now(),
        description: ['', Validators.required],
        quantity: [1, [Validators.required, Validators.min(0)]],
        price: [0, [Validators.required, Validators.min(0)]],
        total: [0],
      })
    );
    this.calculateTotal();
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.calculateTotal();
  }

  calculateItems(index: number): void {
    const item = this.items.at(index);
    const quantity = item.get('quantity')?.value || 0;
    const price = item.get('price')?.value || 0;
    item.patchValue({
      total: quantity * price,
    });
    this.calculateTotal();
  }

  calculateTotal(): void {
    let subTotal = 0;
    this.items.controls.forEach((item) => {
      const amount = item.get('total')?.value || 0;
      subTotal += amount;
    });

    const taxRate = this.documentForm.get('taxRate')?.value || 0;
    const taxAmount = (subTotal * taxRate) / 100;
    const total = subTotal + taxAmount;
    this.documentForm.patchValue({
      subTotal: subTotal,
      taxAmount: taxAmount,
      total: total,
    });
  }

  generateDocumentNumber(): string {
    const prefix = this.documentType().charAt(0).toUpperCase();
    const rand = Math.floor(Math.random() * 9000) + 1000;
    return `${prefix}-${rand}`;
  }

  onSave(): void {
    if (this.documentForm.valid) {
      this.formSubmit.emit(this.documentForm);
    }
  }

  // Add the trackBy function to uniquely identify each item
  trackById(index: number, item: any): number {
    return item.value.id;
  }
}
