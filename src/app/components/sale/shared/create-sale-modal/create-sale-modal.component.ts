import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Product } from 'src/app/components/sale/models/sale.model';
import { ProductService } from '../services/product.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-create-sale-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatOptionModule,
  ],
  templateUrl: './create-sale-modal.component.html',
  styleUrls: ['./create-sale-modal.component.scss'],
})
export class CreateSaleModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreateSaleModalComponent>);
  private productService = inject(ProductService);

  saleForm: FormGroup;
  availableProducts: Product[] = [];
  selectedProductId: number | null = null;
  errorMessage: string | null = null;

  constructor() {
    this.saleForm = this.fb.group({
      items: this.fb.array([]),
    });
  }
  ngOnInit(): void {
    this.loadProducts();
  }
  get items(): FormArray {
    return this.saleForm.get('items') as FormArray;
  }
  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (response: any) => {
        this.availableProducts = response.data || response;
      },
      error: (err) => console.error('Error al cargar productos:', err),
    });
  }
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
  isProductSelected(productId: number): boolean {
    return this.items.controls.some(
      (control) => control.get('product_id')?.value === productId,
    );
  }
  addProduct(): void {
    if (!this.selectedProductId) return;
    const product = this.availableProducts.find(
      (p) => p.id === this.selectedProductId,
    );
    if (!product) return;
    if (product.stock < 1) {
      this.errorMessage = `El producto "${product.name}" no tiene stock disponible.`;
      return;
    }
    this.errorMessage = null;
    const itemGroup = this.fb.group({
      product_id: [product.id, Validators.required],
      name: [product.name],
      price: [Number(product.price)],
      stock: [product.stock],
      quantity: [
        1,
        [Validators.required, Validators.min(1), Validators.max(product.stock)],
      ],
      subtotal: [Number(product.price)],
    });
    itemGroup.get('quantity')?.valueChanges.subscribe((qty: number | null) => {
      const validQty = qty ?? 0;
      const price = itemGroup.get('price')?.value || 0;
      const subtotal = validQty * price;
      itemGroup.patchValue({ subtotal }, { emitEvent: false });
    });
    this.items.push(itemGroup);
    this.selectedProductId = null;
  }
  removeItem(index: number): void {
    this.items.removeAt(index);
  }
  getTotal(): number {
    return this.items.controls.reduce((sum, control) => {
      return sum + (control.get('subtotal')?.value || 0);
    }, 0);
  }
  onSubmit(): void {
    if (this.saleForm.invalid || this.items.length === 0) return;
    const payload = {
      items: this.items.value.map((item: any) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    };
    this.dialogRef.close(payload);
  }
  close(): void {
    this.dialogRef.close();
  }
}
