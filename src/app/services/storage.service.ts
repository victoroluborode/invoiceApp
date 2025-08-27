import { Injectable } from '@angular/core';
import { Document } from '../interfaces/document.interface';

@Injectable({
  providedIn: 'root',
})
export class storageService {
  private readonly DB_NAME = 'invoice_db';
  private readonly STORE_NAME = 'documents';
  private readonly DB_VERSION = 1;
  private readonly MAXSIZE = 50;
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase> | null = null;

  constructor() {
    this.initDB().catch((error) => console.warn('IndexedDB init failed', error));
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'number' });
          store.createIndex('by_client_name', 'clientName', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.warn('Failed to open IndexedDB:', (event.target as IDBOpenDBRequest).error);
        this.initPromise = null;
        reject((event.target as IDBOpenDBRequest).error);
      };
    });

    return this.initPromise;
  }

  private async ensureDB(): Promise<IDBDatabase> {
    const db = await this.initDB();
    return db;
  }

  async saveDocuments(documents: Document[]): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction([this.STORE_NAME], 'readwrite');
    const store = transaction.objectStore(this.STORE_NAME);

    for (const doc of documents) {
      store.put(doc);
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log('Documents saved successfully.');
        resolve();
      };
      transaction.onerror = () => {
        console.error('Transaction failed:', transaction.error);
        reject(transaction.error);
      };
      transaction.onabort = () => {
        console.warn('Transaction aborted.');
        reject(transaction.error);
      };
    });
  }
    
    
  async getAllDocuments(): Promise<Document[]> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.getAll();

        request.onsuccess = () => {
          resolve(request.result as Document[]);
        };

        request.onerror = () => {
          const error = request.error;
          console.warn('Failed to get stored documents:', error);
          reject(error);
        };
      });
    } catch (err) {
      console.warn('Failed to get stored documents:', err);
      return Promise.reject(err);
    }
  }

  async getDocument(number: string): Promise<Document | null> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.get(number);

        request.onsuccess = () => {
          resolve((request.result as Document) || null);
        };

        request.onerror = () => {
          const error = request.error;
          console.warn('Failed to get document:', error);
          reject(error);
        };
      });
    } catch (err) {
      console.warn('Failed to get stored document:', err);
      return Promise.reject(err);
    }
  }

  async deleteDocument(number: string): Promise<void> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.delete(number);
        request.onsuccess = () => resolve();
        request.onerror = () => {
          console.warn('Failed to delete document:', request.error);
          reject(request.error);
        };
      });
    } catch (err) {
      console.warn('Failed to clear user:', err);
      return Promise.reject(err);
    }
  }
}
