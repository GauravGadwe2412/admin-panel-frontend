import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { PaginatedProductResponse, Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['sku', 'name', 'price', 'images', 'actions'];

  searchTerm: string = '';
  currentPage = 1;
  pageSize = 5;
  totalProducts: number = 0;

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(): void {
    const params = {
      page: this.currentPage,
      limit: this.pageSize,
      search: this.searchTerm
    };

    this.productService.getAll(params).subscribe({
      next: (res: PaginatedProductResponse) => {
        this.products = res.data;
        this.totalProducts = res.total;
      },
      error: (err: unknown) => {
        if (err instanceof Error) {
          console.error('Error loading products:', err.message);
        } else {
          console.error('Unknown error loading products:', err);
        }
      }
    });
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.getAllProducts();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.getAllProducts();
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(id).subscribe(() => {
        this.getAllProducts(); // refresh list after deletion
      });
    }
  }

  editProduct(id: string): void {
    this.router.navigate(['/products/edit', id]);
  }
}
