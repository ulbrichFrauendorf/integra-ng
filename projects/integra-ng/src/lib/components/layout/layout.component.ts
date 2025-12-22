import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
  effect,
  Input,
  signal,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import { TopbarComponent } from './topbar/topbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LayoutService } from './services/layout.service';
import { LayoutConfig } from './models/layout-config.model';
import { MenuModel } from './models/menu.model';

@Component({
  selector: 'i-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [NgClass, TopbarComponent, SidebarComponent, RouterOutlet],
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() config!: LayoutConfig;
  @Input() menuModel: MenuModel[] = [];
  @ViewChild('mainContainer') mainContainer?: ElementRef<HTMLDivElement>;

  protected readonly Math = Math;

  private routerSubscription: Subscription;
  private touchStartY = 0;
  private touchCurrentY = 0;
  private isPulling = false;
  pullDistance = signal(0);
  isRefreshing = signal(false);

  private readonly PULL_THRESHOLD = 80;
  private readonly MAX_PULL_DISTANCE = 150;

  constructor(
    public layoutService: LayoutService,
    public router: Router
  ) {
    effect(() => {
      if (typeof document === 'undefined') {
        return;
      }

      const state = this.layoutService.state();
      const shouldBlockScroll = state.isMobileViewport && state.isSidebarOpen;
      document.body.classList.toggle('blocked-scroll', shouldBlockScroll);
    });

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const state = this.layoutService.state();
        if (state.isMobileViewport) {
          this.layoutService.closeSidebar();
        }
      });
  }

  ngOnInit(): void {
    this.syncViewportToCurrentWindow();
  }

  ngAfterViewInit(): void {
    this.setupPullToRefresh();
  }

  private setupPullToRefresh(): void {
    if (!this.config.enablePullToRefresh || typeof window === 'undefined') {
      return;
    }

    const container = this.mainContainer?.nativeElement;
    if (!container) {
      return;
    }

    container.addEventListener('touchstart', this.handleTouchStart.bind(this), {
      passive: false,
    });
    container.addEventListener('touchmove', this.handleTouchMove.bind(this), {
      passive: false,
    });
    container.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  private handleTouchStart(event: TouchEvent): void {
    const state = this.layoutService.state();
    if (!state.isMobileViewport) {
      return;
    }

    const container = this.mainContainer?.nativeElement;
    if (!container || container.scrollTop > 0) {
      return;
    }

    this.touchStartY = event.touches[0].clientY;
    this.isPulling = true;
  }

  private handleTouchMove(event: TouchEvent): void {
    if (!this.isPulling) {
      return;
    }

    const container = this.mainContainer?.nativeElement;
    if (!container || container.scrollTop > 0) {
      this.isPulling = false;
      this.pullDistance.set(0);
      return;
    }

    this.touchCurrentY = event.touches[0].clientY;
    const pullDistance = Math.max(
      0,
      Math.min(
        this.touchCurrentY - this.touchStartY,
        this.MAX_PULL_DISTANCE
      )
    );

    if (pullDistance > 0) {
      event.preventDefault();
      this.pullDistance.set(pullDistance);
    }
  }

  private handleTouchEnd(): void {
    if (!this.isPulling) {
      return;
    }

    this.isPulling = false;

    if (this.pullDistance() >= this.PULL_THRESHOLD) {
      this.refresh();
    } else {
      this.pullDistance.set(0);
    }
  }

  private refresh(): void {
    this.isRefreshing.set(true);
    
    // Delay reload slightly to show the refreshing state
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }, 300);
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.syncViewportToCurrentWindow();
  }

  hideMenu() {
    this.layoutService.closeSidebar();
  }

  private syncViewportToCurrentWindow() {
    if (typeof window === 'undefined') {
      return;
    }

    this.layoutService.syncViewport(window.innerWidth);
  }

  containerClass = computed(() => {
    const layoutConfig = this.layoutService.config();
    const state = this.layoutService.state();
    return {
      'layout-static': true,
      'layout-static-inactive': !state.isMobileViewport && !state.isSidebarOpen,
      'layout-mobile-active': state.isMobileViewport && state.isSidebarOpen,
      'p-input-filled': layoutConfig.inputStyle === 'filled',
      'p-ripple-disabled': !layoutConfig.ripple,
    };
  });

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
