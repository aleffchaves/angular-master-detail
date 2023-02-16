import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  onSubmmit(): void {
    if (this.currentAction == 'new') {
      this.createCategory();
    } else if(this.currentAction == 'edit') {
      this.updateCategory();
    }
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

  private createCategory(): void {
    const category: Category = Object.assign(new Category, this.categoryForm.value);

    this.categoryService.create(category).subscribe({
      next: (category) => this.actionForSuccess(category),
      error: (err) => this.actionForError(err)
    });
  }

  private updateCategory(): void {
    const category: Category = Object.assign(new Category, this.categoryForm.value);

    this.categoryService.update(category).subscribe({
      next: (category) => this.actionForSuccess(category),
      error: (err) => this.actionForError(err)
    });
  }

  private actionForSuccess(category: Category): void {
    this.toastr.success("Solicitação processada com sucesso!");

    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
    );
  }

  private actionForError(error: any): void {
    this.toastr.error("Ocorreu um erro ao processar a sua solicitação!");

    this.submittingForm = false;
  }
}