import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Sale } from '../../models/sale.model';

@Component({
  selector: 'app-sale-detail-modal',
  templateUrl: './sale-detail-modal.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule],
  styleUrls: ['./sale-detail-modal.component.scss'],
})
export class SaleDetailModalComponent {
  displayedColumns: string[] = ['product', 'price', 'quantity', 'subtotal'];

  constructor(
    public dialogRef: MatDialogRef<SaleDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public sale: Sale,
  ) {}
  close(): void {
    this.dialogRef.close();
  }
}
