import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked{

  currentAction!: string;
  categoryForm!: FormGroup;
  pageTitle: string | undefined;
  serverErrorMessage: string[] | undefined;
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private activeRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  private setPageTitle(): void {
    if (this.currentAction == 'new') {
      this.pageTitle = 'Cadastro de nova categoria'
    } else {
      const categoryName = this.category.name || "";
      this.pageTitle = 'Editando categoria: ' + categoryName;
    }
  }

  private setCurrentAction(): void {
    if (this.activeRouter.snapshot.url[0].path == 'new') {
      console.log(this.activeRouter.snapshot.url[0].path)
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildCategoryForm(): void {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory(): void {
      if (this.currentAction == 'edit') {

        this.activeRouter.paramMap.pipe(
          catchError(this.handlerError),
          switchMap(params => this.categoryService.getById(+params.get('id')))
          
        ).subscribe({next: (category) => {
          this.category = category;
          this.categoryForm?.patchValue(category);
        },

        error: () => alert('Ocorreu algum error no servidor. Volte em alguns instantes.')
        });

      }
  }

  private handlerError(error: any): Observable<any> {
    console.log('Error na requisição => ', error);
    return throwError(() => error);
  }
}