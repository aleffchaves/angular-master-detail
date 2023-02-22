import { Component, OnInit } from '@angular/core';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit{

  categories: Category[] = [];

  constructor(private categoryService: CategoryService){}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => this.categories = categories,
      error: (error) => alert("Error ao listar categorias!!!" + error)
    })
  }

  deleteCategory(category: Category) {
    const mustDelete = confirm("Deseja realmente deletar?");

    if (mustDelete) {
      this.categoryService.delete(category.id).subscribe({
        next: () => this.categories = this.categories.filter(element => element != category),
        error: (error) => alert("Error ao deletar a categoria!." + error)
      });
    }
  }
}
