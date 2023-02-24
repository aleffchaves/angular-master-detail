import {Component, Injector, OnInit} from '@angular/core';
import {Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {Entry} from '../shared/entry.model';
import {EntryService} from '../shared/entry.service';
import {Category} from "../../categories/shared/category.model";
import {CategoryService} from "../../categories/shared/category.service";
import {BaseResourceFormComponent} from "../../../shared/components/base-resource-form/base-resource-form.component";

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit {

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
    protected override injector: Injector,
    protected entryService: EntryService,
    protected categoryService: CategoryService,
    protected override toastr: ToastrService)

  {
    super(injector, new Entry(),entryService, Entry.fromJson, toastr)
  }

  override ngOnInit(): void {
    this.loadCategories();
    super.ngOnInit();
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

  protected loadCategories(): void {
    this.categoryService.getAll()
      .subscribe((response) => this.categories = response);
  }

  protected override creationPageTitle(): string {
    return "Cadastro de novo lançamento ";
  }

  protected override editionPageTitle(): string {
    const resourceName = this.resource.name || "";

    return "Editando lançamento: " + resourceName;
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
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
}
