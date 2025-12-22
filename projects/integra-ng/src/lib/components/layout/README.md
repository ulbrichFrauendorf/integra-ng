# Layout Component

The `i-layout` component provides a complete application layout with sidebar navigation, top bar, and theme toggle functionality.

## Features

- Responsive sidebar navigation
- Configurable top bar with logo and website name
- Built-in theme toggle (light/dark mode)
- Customizable top-right section via ng-content
- Mobile-friendly with automatic sidebar behavior
- Router integration for navigation

## Usage

### Basic Example

```typescript
import { Component } from '@angular/core';
import { LayoutComponent, MenuModel, LayoutConfig } from 'integra-ng';

@Component({
  selector: 'app-root',
  template: `
    <i-layout [config]="layoutConfig" [menuModel]="menuModel">
      <div topbarActions>
        <!-- Custom content for top-right section -->
        <button>Profile</button>
      </div>
    </i-layout>
  `,
  imports: [LayoutComponent]
})
export class AppComponent {
  layoutConfig: LayoutConfig = {
    websiteName: 'My App',
    logoLight: 'assets/logo-light.png',
    logoDark: 'assets/logo-dark.png',
    showThemeToggle: true
  };

  menuModel: MenuModel[] = [
    {
      label: 'Main Menu',
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          routerLink: ['/dashboard']
        },
        {
          label: 'Settings',
          icon: 'pi pi-cog',
          routerLink: ['/settings']
        }
      ]
    }
  ];
}
```

### Configuration

#### LayoutConfig

```typescript
interface LayoutConfig {
  websiteName: string;        // Required: Name displayed in top bar
  logoLight?: string;         // Optional: Logo URL for light theme
  logoDark?: string;          // Optional: Logo URL for dark theme
  showThemeToggle?: boolean;  // Optional: Show/hide theme toggle (default: true)
  enablePullToRefresh?: boolean; // Optional: Enable pull-to-refresh on mobile (default: false)
}
```

#### MenuModel

```typescript
interface MenuItem {
  label: string;              // Menu item label
  icon?: string;              // Optional PrimeIcons class
  routerLink?: string[];      // Angular router link
  items?: MenuItem[];         // Optional sub-menu items
}

interface MenuModel {
  label: string;              // Menu group label
  items: MenuItem[];          // Menu items in this group
  separator?: boolean;        // Optional separator after group
}
```

### Content Projection

You can add custom content to the top-right section of the top bar using the `topbarActions` selector:

```html
<i-layout [config]="layoutConfig" [menuModel]="menuModel">
  <div topbarActions>
    <button>Custom Button</button>
    <i-button [icon]="'pi pi-user'" />
  </div>
</i-layout>
```

### Theme Toggle

The theme toggle is enabled by default and allows users to switch between light and dark themes. The selected theme is persisted in localStorage. To disable it:

```typescript
layoutConfig: LayoutConfig = {
  websiteName: 'My App',
  showThemeToggle: false
};
```

### Pull-to-Refresh

On mobile devices (viewport width ≤ 991px), you can enable pull-to-refresh functionality that allows users to refresh the page by pulling down from the top of the content area:

```typescript
layoutConfig: LayoutConfig = {
  websiteName: 'My App',
  enablePullToRefresh: true
};
```

When enabled, users can:
1. Pull down from the top of the page (when scrolled to the top)
2. See a visual indicator showing the pull distance
3. Release to trigger a page refresh when the threshold is reached

The feature only activates on mobile viewports and when the content is scrolled to the top.

## Components

The layout package includes:

- `i-layout` - Main layout component
- `i-topbar` - Top navigation bar
- `i-sidebar` - Sidebar container
- `i-menu` - Menu navigation component

## Services

- `LayoutService` - Manages layout state, theme switching, and responsive behavior

## Styling

The layout components use CSS variables from your theme. Make sure you have the PrimeNG theme CSS loaded in your application.
