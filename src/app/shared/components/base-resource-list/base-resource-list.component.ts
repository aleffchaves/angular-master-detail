import {Directive, OnInit} from '@angular/core';
import {BaseResourceService} from "../../services/base-resource.service";
import {BaseResourceModel} from "../../models/base-resource.model";

@Directive()
export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit{

  resources: T[] = [];

  protected constructor(private baseResourceService: BaseResourceService<T>){}

  ngOnInit(): void {
    this.baseResourceService.getAll().subscribe({
      next: (resource: T[]) => this.resources = resource.reverse(),
      error: (error: any) => console.log("Erro ao listar lançamentos" + error)
    })
  }

  deleteResource(resource: T): void {
    const mustDelete = confirm("Deseja realmente deletar?");

    if (mustDelete) {
      this.baseResourceService.delete(resource.id).subscribe({
        next: () => this.resources = this.resources.filter(element => element != resource),
        error: (error) => alert("Error ao deletar lançamento!." + error)
      });
    }
  }
}
