import { Component, inject, ViewChild, TemplateRef } from '@angular/core';
import { ApiService } from 'src/app/services/generic.service';
import { Sale } from './models/sale.model';
import { MatDialog } from '@angular/material/dialog';
import { SaleDetailModalComponent } from './shared/sale-detail-modal/sale-detail-modal.component';
import { CreateSaleModalComponent } from './shared/create-sale-modal/create-sale-modal.component';
import {
  MatTableDataSource,
  MatTableDataSourcePaginator,
} from '@angular/material/table';
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
  @ViewChild('messageDialog') messageDialog!: TemplateRef<any>;
  @ViewChild('confirmDeleteDialog') confirmDeleteDialog!: TemplateRef<any>;

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
              this.showNotice('Venta registrada', res.message, true);
              this.getSales();
            }
          },
          error: (err) => {
            this.showNotice('Error al registrar la venta', err.error?.error || 'No se pudo procesar la venta.', false);
          },
        });
      }
    });
  }
  deleteSale(sale: Sale): void {
    const confirmRef = this.dialog.open(this.confirmDeleteDialog, {
      width: '400px',
      data: { id: sale.id },
    });
    if (!confirmRef) return;

    this.delete(sale.id).subscribe({
      next: (res: any) => {
        this.getSales();
      },
      error: (err) => {
        alert(err.error?.error || 'No se pudo eliminar la venta.');
      },
    });
  }
  private showNotice(title: string, message: string, isSuccess: boolean): void {
    this.dialog.open(this.messageDialog, {
      width: '400px',
      data: { title, message, isSuccess },
    });
  }
}
