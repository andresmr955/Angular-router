import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from '../../models/product.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  products: Product[] = [];
  limit = 10;
  offset = 0;
  categoryId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService  
  ){
    
  }

  ngOnInit(): void{
    this.route.paramMap
    .pipe(
      switchMap(params => {

      this.categoryId = params.get('id');
      if(this.categoryId){
        return this.productsService.getByCategory(this.categoryId, this.limit, this.offset)
      }
      return [];
      })
    )
    .subscribe(data => {
      this.products = data
    });
  }
  
}
