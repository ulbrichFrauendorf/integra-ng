import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  LayoutService,
  LocalStorageColorSchemeKey,
  LocalStorageThemeKey,
} from '../../service/app.layout.service';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IButton } from '@shared/components/button/button.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  styleUrls: ['./app.topbar.component.scss'],
  imports: [RouterLink, NgClass, IButton],
})
export class AppTopBarComponent implements OnInit {
  @ViewChild('menubutton') menuButton!: ElementRef;

  isDark: boolean = false;

  constructor(public layoutService: LayoutService) {}
  ngOnInit(): void {
    this.isDark = this.colorScheme === 'dark';
  }

  set colorScheme(val: string) {
    this.layoutService.config.update((config) => ({
      ...config,
      colorScheme: val,
    }));
  }
  get colorScheme(): string {
    return this.layoutService.config().colorScheme;
  }

  set theme(val: string) {
    this.layoutService.config.update((config) => ({
      ...config,
      theme: val,
    }));
  }
  get theme(): string {
    return this.layoutService.config().theme;
  }

  changeTheme() {
    this.isDark = !this.isDark;
    if (this.isDark) {
      this.theme = 'aura-dark-amber';
      this.colorScheme = 'dark';
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      this.theme = 'aura-light-amber';
      this.colorScheme = 'light';
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }

    localStorage.setItem(LocalStorageThemeKey, this.theme);
    localStorage.setItem(LocalStorageColorSchemeKey, this.colorScheme);
  }
}
