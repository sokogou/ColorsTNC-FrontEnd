import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateProductService {

  showCreateProductForm: boolean = false;
  
  constructor() { }
}
