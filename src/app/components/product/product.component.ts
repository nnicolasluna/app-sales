import { Component, inject } from '@angular/core';
import { ApiService } from 'src/app/services/generic.service';
import { Product } from './models/product.model';
import { ProductDetailModalComponent } from './shared/product-detail-modal/product-detail-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent extends ApiService<Product> {
  displayedColumns: string[] = ['name', 'price', 'stock', 'actions'];
  productsData: Product[] = [];

  constructor() {
    super('products');
  }
  private dialog = inject(MatDialog);
  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.getAll().subscribe({
      next: (data) => {
        this.productsData = data;
      },
    });
  }
  openDetailModal(product: Product): void {
    this.dialog.open(ProductDetailModalComponent, {
      width: '450px',
      data: product,
    });
  }
}
