import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from './../../../models/product.model';

import { StoreService } from './../../../services/store.service';
import { ProductsService } from './../../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent{
  myShoppingCart: Product[] = [];
  total = 0;
  @Input() products: Product[] = [];
  @Output() loadMoreClicked = new EventEmitter<void>();

  @Input()
  set productId(id:string | null){
    console.log('Input recibido:', id);
    if(id){
      this.onShowDetail(id);
    }
  }
  showProductDetail = false;
  productChosen: Product | null = null;
 
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';
  imageRandom = `https://picsum.photos/200?random=${Math.floor(Math.random() * 1000)}`;

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

 
  ngOnInit(){
   
  }
  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string) {
    this.statusDetail = 'loading';
    this.toggleProductDetail();
    // if(!this.showProductDetail) {
    //   this.showProductDetail = true;
    // }
    this.productsService.getOne(id).subscribe(
      (data) => {
        this.productChosen = data;
        this.statusDetail = 'success';
      },
      (errorMsg) => {
        window.alert(errorMsg);
        this.statusDetail = 'error';
      }
    );
  }
 
  createNewProduct() {
    const product: CreateProductDTO = {
      title: 'Nuevo prodcuto',
      description: 'bla bla bla',
      images: [`https://picsum.photos/200`, 
              `https://picsum.photos/200`,
              `https://picsum.photos/200`
      ],
      price: 1000,
      categoryId: 2,
    };
    this.productsService.create(product)
    .subscribe(data => {
      console.log('created', data)
      this.products.unshift(data);
    });
  }

  updateProduct() {
    if (this.productChosen) {
      const changes: UpdateProductDTO = {
        title: 'change title',
      };
      const id = this.productChosen?.id;
      this.productsService.update(id, changes).subscribe((data) => {
        const productIndex = this.products.findIndex(
          (item) => item.id === this.productChosen?.id
        );
        this.products[productIndex] = data;
        this.productChosen = data;
      });
    }
  }

  deleteProduct() {
    if (this.productChosen) {
      const id = this.productChosen?.id;
      this.productsService.delete(id).subscribe(() => {
        const productIndex = this.products.findIndex(
          (item) => item.id === this.productChosen?.id
        );
        this.products.splice(productIndex, 1);
        this.showProductDetail = false;
      });
    }
  }
  
   loadMore() {
    this.loadMoreClicked.emit();  // 👈 Emitir evento al padre
  }
  

  
}
