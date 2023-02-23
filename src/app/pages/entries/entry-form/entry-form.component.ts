import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import {Category} from "../../categories/shared/category.model";
import {CategoryService} from "../../categories/shared/category.service";

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked{

  currentAction!: string;
  entryForm!: FormGroup;
  pageTitle: string | undefined;
  serverErrorMessage: string[] | undefined;
  submittingForm: boolean = false;
  entry: Entry = new Entry();
  categories: Array<Category> | undefined;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private entryService: EntryService,
    private categoryService: CategoryService,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  onSubmmit(): void {
    if (this.currentAction == 'new') {
      this.createEntry();
    } else if(this.currentAction == 'edit') {
      this.updateEntry();
    }
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types)
      .map(([value, text]) => {
          return {
            text: text,
            value: value
          }
        }
      )
  }

  private setPageTitle(): void {
    if (this.currentAction == 'new') {
      this.pageTitle = 'Cadastro de novo lançamento'
    } else {
      const entryName = this.entry.name || "";
      this.pageTitle = 'Editando lançamento: ' + entryName;
    }
  }

  private setCurrentAction(): void {
    if (this.activeRouter.snapshot.url[0].path == 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildEntryForm(): void {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid:  [true, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  private loadEntry(): void {
      if (this.currentAction == 'edit') {

        this.activeRouter.paramMap.pipe(
          catchError(this.handlerError),
          switchMap(params => this.entryService.getById(+params.get('id')))

        ).subscribe({next: (entry) => {
          this.entry = entry;
          this.entryForm?.patchValue(entry);
        },

        error: () => alert('Ocorreu algum error no servidor. Volte em alguns instantes.')
        });
      }
  }

  private loadCategories(): void {
    this.categoryService.getAll()
      .subscribe((response) => this.categories = response);
  }

  private handlerError(error: any): Observable<any> {
    console.log('Error na requisição => ', error);
    return throwError(() => error);
  }

  private createEntry(): void {
    const entry: Entry = Entry.fromJson(this.entryForm.value);

    console.log(this.entryForm.value);

    this.entryService.create(entry).subscribe({
      next: (entry) => this.actionForSuccess(entry),
      error: (err) => this.actionForError(err)
    });
  }

  private updateEntry(): void {
    const entry: Entry = Entry.fromJson(this.entryForm.value);

    this.entryService.update(entry).subscribe({
      next: (entry) => this.actionForSuccess(entry),
      error: (err) => this.actionForError(err)
    });
  }

  private actionForSuccess(entry: Entry): void {
    this.toastr.success("Solicitação processada com sucesso!");

    this.router.navigateByUrl('entries', {skipLocationChange: true}).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
    );
  }

  private actionForError(error: any): void {
    this.toastr.error("Ocorreu um erro ao processar a sua solicitação!");

    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessage = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessage = ["Falha na comunicação com o servidor. Por favor, tente mais tarde."];
    }
  }
}
