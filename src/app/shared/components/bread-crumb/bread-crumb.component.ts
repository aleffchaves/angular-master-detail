import {Component, Input} from '@angular/core';

interface BreadCrumbItem {
  text: string;
  link?: string;
}

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent {

  @Input() items: Array<BreadCrumbItem> = [];

  isTheLastItem(item: BreadCrumbItem): boolean {
    return !!this.items.lastIndexOf(item);
  }
}
