import { Component, OnInit} from '@angular/core';

import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

import { Product } from '../../data/product.model';
import { ProductRepository } from '../../data/product.repo';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})

export class StoreComponent implements OnInit {

  columns: number;
  observerSubscription: Subscription;

  public selectedCategories: Set<string> = new Set;

  public productsPerPage = 4;
  public selectedPage = 0;

  constructor(private _repository: ProductRepository, breakpointObserver: BreakpointObserver) {
    this.observerSubscription = breakpointObserver.observe([Breakpoints.XSmall])
    .subscribe((result: BreakpointState) => {
      if (result.matches) {
        this.columns = 1;
      } else {
        this.columns = 4;
      }
    });
  }

  ngOnInit() {}


  get categories(): string[] {
    return this._repository.getCategories();
  }
  changeCategory(newCategory?: string) {
    if (this.selectedCategories.has(newCategory)) {
      this.selectedCategories.delete(newCategory);
    } else {
      this.selectedCategories.add(newCategory);
    }
  }
  get productsInCategory(): Product[] {
    return this._repository.getProducts(this.selectedCategories);
  }
  get productsOnPage(): Product[] {
    const pageIndex = this.selectedPage * this.productsPerPage;
    const singlePageOfProducts = this.productsInCategory.slice(pageIndex, pageIndex + this.productsPerPage);
    return singlePageOfProducts;
  }

  changePage(newPage: number) {
    this.selectedPage = newPage;
  }
  changePageSize(newPageSize: number) {
    this.productsPerPage = newPageSize;
    this.changePage(0);
  }
  get numberOfPages(): number {
    return Math.ceil
    (this.productsInCategory.length / this.productsPerPage);
  }

  pageEvent(event) {
    const newPageIndex = event.pageIndex;
    const newPageSize = event.pageSize;
    if (this.productsPerPage !== newPageSize) {
      this.changePageSize(newPageSize);
    }
    if (this.selectedPage !== newPageIndex) {
      this.changePage(newPageIndex);
    }
  }
}
