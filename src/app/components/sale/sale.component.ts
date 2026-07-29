import { Component, inject, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/generic.service';
import { Sale } from './models/sale.model';
import { MatDialog } from '@angular/material/dialog';
import { SaleDetailModalComponent } from './shared/sale-detail-modal/sale-detail-modal.component';
import { CreateSaleModalComponent } from './shared/create-sale-modal/create-sale-modal.component';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss'],
})
export class SaleComponent extends ApiService<Sale> {
  displayedColumns: string[] = ['user_name', 'total', 'created_at', 'actions'];
  salesData: Sale[] = [];
  dataSource = new MatTableDataSource<Sale>([]);
  @ViewChild(MatPaginator) paginator!: MatTableDataSourcePaginator;
  constructor() {
    super('sales');
  }
  private dialog = inject(MatDialog);
  ngOnInit(): void {
    this.getSales();
  }
  getSales(): void {
    this.getAll().subscribe({
      next: (response: any) => {
        this.dataSource.data = response.data || [];
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => console.error('Error al obtener ventas:', err),
    });
  }
  openDetailModal(sale: Sale): void {
    this.getById(sale.id).subscribe({
      next: (response: any) => {
        const fullSale: Sale = response.data || response;
        this.dialog.open(SaleDetailModalComponent, {
          width: '650px',
          data: fullSale,
        });
      },
      error: (err) =>
        console.error('Error al obtener el detalle de la venta:', err),
    });
  }
  openCreateSaleModal(): void {
    const dialogRef = this.dialog.open(CreateSaleModalComponent, {
      width: '700px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((payload) => {
      if (payload) {
        this.create(payload).subscribe({
          next: (res: any) => {
            if (res.error) {
              alert(`Error: ${res.error}`);
            } else {
              this.getSales();
            }
          },
          error: (err) => {
            console.error('Error al registrar la venta:', err);
            alert(err.error?.error || 'No se pudo procesar la venta.');
          },
        });
      }
    });
  }
}
