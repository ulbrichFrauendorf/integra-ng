import { Component, Input } from '@angular/core';
import { MenuModel } from '../models/menu.model';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'i-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [RouterLink, RouterLinkActive],
})
export class MenuComponent {
  @Input() model: MenuModel[] = [];
}
