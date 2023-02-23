import {Component, Injector} from '@angular/core';
import {Validators} from '@angular/forms';
import {Category} from '../shared/category.model';
import {CategoryService} from '../shared/category.service';
import {BaseResourceFormComponent} from "../../../shared/components/base-resource-form/base-resource-form.component";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent extends BaseResourceFormComponent<Category>{

  constructor(
    protected override injector: Injector,
    protected categoryService: CategoryService,
    protected override toastr: ToastrService
  ) {
    super(injector, new Category(), categoryService, Category.fromJson, toastr);
  }

  protected buildResourceForm(): void{
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  protected override creationPageTitle(): string {
    return "Cadastro de nova categoria ";
  }

  protected override editionPageTitle(): string {
    const categoryName = this.resource.name || "";

    return "Editando categoria: " + categoryName;
  }
}
