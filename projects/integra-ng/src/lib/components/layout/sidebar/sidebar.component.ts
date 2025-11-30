import { Component, ElementRef, Input } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { MenuModel } from '../models/menu.model';

@Component({
  selector: 'i-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [MenuComponent],
})
export class SidebarComponent {
  @Input() menuModel: MenuModel[] = [];

  constructor(public el: ElementRef) {}
}
