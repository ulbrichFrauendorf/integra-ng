import { Injectable, effect, signal, WritableSignal } from '@angular/core';
import { Subject } from 'rxjs';

export const LocalStorageThemeKey = 'viewModeTheme';
export const LocalStorageColorSchemeKey = 'viewModeColorScheme';

const MOBILE_BREAKPOINT = 991;

export interface AppConfig {
  inputStyle: string;
  colorScheme: string;
  theme: string;
  ripple: boolean;
  scale: number;
}

interface LayoutState {
  isSidebarOpen: boolean;
  isMobileViewport: boolean;
  profileSidebarVisible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private readonly mobileBreakpoint = MOBILE_BREAKPOINT;

  _config: AppConfig = {
    ripple: true,
    inputStyle: 'outlined',
    colorScheme: localStorage.getItem(LocalStorageColorSchemeKey) || 'light',
    theme: localStorage.getItem(LocalStorageThemeKey) || 'aura-light-amber',
    scale: 12,
  };

  config: WritableSignal<AppConfig> = signal<AppConfig>(this._config);

  public colorScheme = signal(this.config().colorScheme);

  state: WritableSignal<LayoutState> = signal<LayoutState>(
    this.createInitialLayoutState()
  );

  private configUpdate = new Subject<AppConfig>();

  configUpdate$ = this.configUpdate.asObservable();

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

  private createInitialLayoutState(): LayoutState {
    const isMobileViewport = this.isMobileViewport();
    return {
      isSidebarOpen: !isMobileViewport,
      isMobileViewport,
      profileSidebarVisible: false,
    };
  }

  updateStyle(config: AppConfig) {
    return (
      config.theme !== this._config.theme ||
      config.colorScheme !== this._config.colorScheme
    );
  }

  toggleSidebar() {
    this.state.update((currentState) => ({
      ...currentState,
      isSidebarOpen: !currentState.isSidebarOpen,
    }));
  }

  closeSidebar() {
    this.state.update((currentState) =>
      currentState.isSidebarOpen
        ? { ...currentState, isSidebarOpen: false }
        : currentState
    );
  }

  syncViewport(width: number) {
    const isMobileViewport = this.isMobileViewport(width);
    this.state.update((currentState) => {
      if (currentState.isMobileViewport === isMobileViewport) {
        return currentState;
      }

      return {
        ...currentState,
        isMobileViewport,
        isSidebarOpen: isMobileViewport ? false : true,
      };
    });
  }

  showProfileSidebar() {
    this.state.update((currentState) => ({
      ...currentState,
      profileSidebarVisible: !currentState.profileSidebarVisible,
    }));
  }

  private isMobileViewport(width: number = this.getViewportWidth()) {
    return width <= this.mobileBreakpoint;
  }

  private getViewportWidth(): number {
    if (typeof window !== 'undefined' && window?.innerWidth) {
      return window.innerWidth;
    }

    return 0;
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
