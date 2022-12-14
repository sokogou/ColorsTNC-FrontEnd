import { Component, OnInit } from '@angular/core';
import { ShopProduct } from '../models/shopProduct';
import { ShopProductService } from './shop-product.service';

@Component({
  selector: 'app-shop-product',
  templateUrl: './shop-product.component.html',
  styleUrls: ['./shop-product.component.css']
})
export class ShopProductComponent implements OnInit {

  loadingSpinner: boolean = true;
  shopProducts!: ShopProduct[];
  filteredShopProducts!: ShopProduct[];
  distinctCategories!:String[];
  cartProducts: Array<Array<ShopProduct>> = new Array<Array<ShopProduct>>;
  cartProductArray: ShopProduct[] = [];
  selectedDetailsProduct!: ShopProduct;
  searchCategory!:string;
  // showCartModal: boolean = false;
  showProductDetailsModal: boolean = false;
  showMiniCartView: boolean = false;
  sortPrice: boolean = true;
  emptyImageUrl: string = "assets/Images/uploadPhoto.jpg";
  page: number = 1;
  count: number = 0;
  tableSize: number = 9;
  tableSizes: number[] = [9, 18, 27, 51];

  constructor(public shopService: ShopProductService) { }

  GetProductsHandler(){
    this.shopService.GetShopProducts().subscribe(
      {
        next: response=> 
        {
          this.shopProducts = response,
          this.distinctCategories = [...new Set(this.shopProducts.map(x=>x.Category))],
          this.filteredShopProducts = this.shopProducts
        },
        error: error => {console.log(error),this.loadingSpinner = false},
        complete: () => {console.log("ShopProduct Done"),this.loadingSpinner = false}
      }
    ) 
  }

  ShowProductDetails(product: ShopProduct){
    this.showProductDetailsModal = true;
    this.selectedDetailsProduct = product;
  }

  ShowCart(){
    this.shopService.showCartModal = true;
    this.shopService.cartProductCount = parseFloat(this.shopService.cartProductCount.toFixed(2));
  }

  ShowProductCartMiniModal(){
     this.showMiniCartView = !this.showMiniCartView;
  }

  AddToCart(product:ShopProduct){
    let productExists: boolean = false;
    if(product.Quantity > 0){
      this.cartProductArray.push(product)
      if(this.cartProducts.length == 0){
        this.cartProducts.push(this.cartProductArray);
      }
      else{
        for(let i=0; i<this.cartProducts.length; i++){
         if(this.cartProducts[i].includes(product)){
          this.cartProducts[i].push(product);
          productExists = true;
        
         }
        }
        if(productExists == false){
          this.cartProducts.push(this.cartProductArray);
      
        }
      }
      product.Quantity -= 1;
    }
    this.cartProductArray = [];
    this.shopService.cartProductCount +=1;
    this.shopService.totalCartCost += product.Price;
  }

  SortingProductsByPrice(){
    this.sortPrice = !this.sortPrice;
    if(this.sortPrice){
      this.filteredShopProducts = this.filteredShopProducts.sort((a,b)=> a.Price > b.Price ? -1:1);
    }
    else{
      this.filteredShopProducts = this.filteredShopProducts.sort((a,b)=> a.Price < b.Price ? -1:1);
    }
  }

  onTableDataChange(event: any): void{
    this.page = event;
  }

  onTableSizeChange(event: any): void{
    this.tableSize = event.target.value;
    this.page = 1;
    this.FilterByCategory();
  }

  FilterByCategory(): void{
    this.filteredShopProducts = this.shopProducts;
    if(this.searchCategory){
      this.filteredShopProducts = this.filteredShopProducts.filter(x=>x.Category.toUpperCase().includes(this.searchCategory.toUpperCase()));
    }
    this.page = 1;
  }

  ShowClearBtn(): void{
    this.searchCategory = '';
    this.GetProductsHandler();
  }

  ngOnInit(): void {
    this.GetProductsHandler();
  }

}
