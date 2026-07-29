import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/generic.service';
import { Product } from 'src/app/components/sale/models/sale.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends ApiService<Product> {
  constructor() {
    super('products');
  }
}
