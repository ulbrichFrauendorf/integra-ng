import { Injectable, effect, signal, WritableSignal } from '@angular/core';
import { Subject } from 'rxjs';

export const LocalStorageThemeKey = 'viewModeTheme';
export const LocalStorageColorSchemeKey = 'viewModeColorScheme';

export type MenuMode = 'static' | 'overlay';

export interface AppConfig {
  inputStyle: string;
  colorScheme: string;
  theme: string;
  ripple: boolean;
  menuMode: MenuMode;
  scale: number;
}

interface LayoutState {
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  profileSidebarVisible: boolean;
  staticMenuMobileActive: boolean;
  menuHoverActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  _config: AppConfig = {
    ripple: true,
    inputStyle: 'outlined',
    menuMode: 'static',
    colorScheme: localStorage.getItem(LocalStorageColorSchemeKey) || 'light',
    theme: localStorage.getItem(LocalStorageThemeKey) || 'aura-light-amber',
    scale: 12,
  };

  config: WritableSignal<AppConfig> = signal<AppConfig>(this._config);

  public colorScheme = signal(this.config().colorScheme);

  state: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
  };

  private configUpdate = new Subject<AppConfig>();

  private overlayOpen = new Subject<void>();

  configUpdate$ = this.configUpdate.asObservable();

  overlayOpen$ = this.overlayOpen.asObservable();

  constructor() {
    effect(() => {
      const config = this.config();

      if (this.updateStyle(config)) {
        this.changeTheme();
      }
      this.changeScale(config.scale);
      this.onConfigUpdate();
    });
  }

  updateStyle(config: AppConfig) {
    return (
      config.theme !== this._config.theme ||
      config.colorScheme !== this._config.colorScheme
    );
  }

  showProfileSidebar() {
    this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
    if (this.state.profileSidebarVisible) {
      this.overlayOpen.next();
    }
  }

  isOverlay() {
    return this.config().menuMode === 'overlay';
  }

  isDesktop() {
    return window.innerWidth > 991;
  }

  isMobile() {
    return !this.isDesktop();
  }

  onConfigUpdate() {
    this._config = { ...this.config() };
    this.configUpdate.next(this.config());
  }

  changeTheme() {
    const config = this.config();
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
    const themeLinkHref = themeLink.getAttribute('href')!;
    const newHref = themeLinkHref
      .split('/')
      .map((el) =>
        el == this._config.theme
          ? (el = config.theme)
          : el == `theme-${this._config.colorScheme}`
          ? (el = `theme-${config.colorScheme}`)
          : el
      )
      .join('/');

    this.replaceThemeLink(newHref);
  }

  replaceThemeLink(href: string) {
    const id = 'theme-css';
    const themeLink = <HTMLLinkElement>document.getElementById(id);
    const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

    cloneLinkElement.setAttribute('href', href);
    cloneLinkElement.setAttribute('id', id + '-clone');

    themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);
    cloneLinkElement.addEventListener('load', () => {
      themeLink.remove();
      cloneLinkElement.setAttribute('id', id);
    });
  }

  changeScale(value: number) {
    document.documentElement.style.fontSize = `${value}px`;
  }
}
