import { Injectable } from '@angular/core';

import { DataSource } from './data.source';
import { Product } from './product.model';

@Injectable()
export class ProductRepository {
    private products: Product[] = [];
    private categories: string[] = [];

    constructor(private _dataSource: DataSource) {
        _dataSource.getProducts().subscribe(data => {
            this.products = data;
            this.categories = data.map(product => product.category)
            .filter((category, index, array) => array.indexOf(category) === index).sort();
        });
    }

    getProducts(categories: Set<string> = new Set): Product[] {
        if (categories.size === 0) {
            return this.products;
        } else {
            return this.products.filter(
                p => (categories.has(p.category))
                );
        }
    }
    getProduct(id: number): Product {
        return this.products.find(p => p.id === id);
    }
    getCategories(): string[] {
        return this.categories;
    }
}
