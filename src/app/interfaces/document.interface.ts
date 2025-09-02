export interface InvoiceItem {
    description: string;
    quantity: number;
    price: number;
    total: number;
}

export interface Document {
    type: 'invoice' | 'quotation' | 'receipt';
    number: string;
    date: string;
    companyName: string;
    companyAddress: string;
    companyEmail: string;
    companyPhone: string;
    customerName: string;
    customerAddress: string;
    customerEmail: string;
    items: InvoiceItem[];
    subTotal: number;
    taxRate: number;
    taxAmount: number;
    total: number;
    notes?: string;
}