import { Component, ElementRef } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-side-bar-sticky',
  templateUrl: './side-bar-sticky.component.html',
  styleUrls: ['./side-bar-sticky.component.scss'],
  imports: [MenuComponent],
})
export class SideBarStickyComponent {
  constructor(public el: ElementRef) {}
}
