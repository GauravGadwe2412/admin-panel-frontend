import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  selectedImages: File[] = [];
  selectedImagesPreview: string[] = [];
  isEditMode = false;
  productId: string | null = null;
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      sku: ['', Validators.required],
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      images: ['']
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.productId = idParam;
        this.loadProduct(idParam);
      } else {
        this.isLoading = false;
      }
    });
  }

  loadProduct(id: string) {
    this.productService.getById(id).subscribe({
      next: (product: Product) => {
        this.productForm.patchValue({
          sku: product.sku,
          name: product.name,
          price: product.price
        });

        if (product.images && Array.isArray(product.images)) {
          this.selectedImagesPreview = product.images.map((img: string) => `http://localhost:3000/${img}`);
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.snackBar.open('Failed to load product.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach((file: File) => {
        this.selectedImages.push(file);

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const result = e.target?.result as string;
          this.selectedImagesPreview.push(result);
        };
        reader.readAsDataURL(file);
      });

      // Reset file input so same file can be added again
      input.value = '';
    }
  }

  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
    this.selectedImagesPreview.splice(index, 1);
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('sku', this.productForm.get('sku')?.value);
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('price', this.productForm.get('price')?.value);

    this.selectedImages.forEach((file) => {
      formData.append('images', file);
    });

    if (this.isEditMode && this.productId) {
      this.productService.update(this.productId, formData).subscribe(() => {
        this.snackBar.open('Product updated successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/products']);
      });
    } else {
      this.productService.create(formData).subscribe(() => {
        this.snackBar.open('Product added successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/products']);
      });
    }
  }

}
