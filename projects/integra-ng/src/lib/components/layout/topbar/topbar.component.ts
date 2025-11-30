import { Component, Input, OnInit } from '@angular/core';
import {
  LayoutService,
  LocalStorageColorSchemeKey,
  LocalStorageThemeKey,
} from '../services/layout.service';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IButton } from '../../button/button.component';
import { LayoutConfig } from '../models/layout-config.model';

@Component({
  selector: 'i-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  imports: [RouterLink, NgClass, IButton],
})
export class TopbarComponent implements OnInit {
  @Input() config!: LayoutConfig;
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

  get logo(): string {
    if (this.colorScheme === 'light' && this.config.logoLight) {
      return this.config.logoLight;
    } else if (this.colorScheme === 'dark' && this.config.logoDark) {
      return this.config.logoDark;
    }
    return this.config.logoLight || this.config.logoDark || '';
  }
}
