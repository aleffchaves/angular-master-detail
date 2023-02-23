import {AfterContentChecked, Directive, Injector, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import {BaseResourceModel} from "../../models/base-resource.model";
import {BaseResourceService} from "../../services/base-resource.service";

@Directive()
export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked{

  currentAction!: string;
  resourceForm!: FormGroup;
  pageTitle!: string;
  serverErrorMessage!: string[];
  submittingForm: boolean = false;

  protected activeRouter: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  protected constructor(
    protected injector: Injector,
    protected resource: T,
    protected baseResourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData: any) => T,
    protected toastr: ToastrService
  ) {

    this.router = this.injector.get(Router);
    this.activeRouter = this.injector.get(ActivatedRoute);
    this.formBuilder = this.injector.get(FormBuilder);
  }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  onSubmmit(): void {
    if (this.currentAction == 'new') {
      this.createResource();
    } else if(this.currentAction == 'edit') {
      this.updateResource();
    }
  }

  protected setCurrentAction(): void {
    if (this.activeRouter.snapshot.url[0].path == 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  protected loadResource(): void {
    if (this.currentAction == 'edit') {

      this.activeRouter.paramMap.pipe(
        catchError(this.handlerError),
        switchMap(params => this.baseResourceService.getById(+params.get('id')))

      ).subscribe({next: (resource) => {
          this.resource = resource;
          this.resourceForm.patchValue(resource);
        },

        error: () => alert('Ocorreu algum error no servidor. Volte em alguns instantes.')
      });
    }
  }

  protected setPageTitle(): void {
    if (this.currentAction == 'new') {
      this.pageTitle = this.creationPageTitle();
    } else {
      this.pageTitle = this.editionPageTitle();
    }
  }


  protected creationPageTitle(): string {
    return "Novo";
  }

  protected editionPageTitle(): string {
    return "Edição";
  }

  protected createResource(): void {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value)

    console.log(this.jsonDataToResourceFn(this.resourceForm.value));

    this.baseResourceService.create(resource).subscribe({
      next: (resource) => this.actionForSuccess(resource),
      error: (err) => this.actionForError(err)
    });
  }

  protected updateResource(): void {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value)

    console.log(this.jsonDataToResourceFn(this.resourceForm.value));

    this.baseResourceService.update(resource).subscribe({
      next: (resource) => this.actionForSuccess(resource),
      error: (err) => this.actionForError(err)
    });
  }

  protected actionForSuccess(resource: T): void {
    this.toastr.success("Solicitação processada com sucesso!");

    if (this.activeRouter.snapshot.parent != null) {

      const baseComponentPath: string = this.activeRouter.snapshot.parent.url[0].path;

      this.router.navigateByUrl(baseComponentPath, {skipLocationChange: true}).then(
        () => this.router.navigate([baseComponentPath, resource.id, 'edit'])
      );
    }
  }

  protected actionForError(error: any): void {
    this.toastr.error("Ocorreu um erro ao processar a sua solicitação!");

    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessage = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessage = ["Falha na comunicação com o servidor. Por favor, tente mais tarde."];
    }
  }

  protected handlerError(error: any): Observable<any> {
    return throwError(() => error);
  }

  protected abstract buildResourceForm(): void;
}
