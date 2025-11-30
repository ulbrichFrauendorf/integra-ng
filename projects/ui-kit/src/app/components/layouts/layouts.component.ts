import { Component } from '@angular/core';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'app-layouts',
  imports: [DemoCardComponent, FeaturesListComponent],
  templateUrl: './layouts.component.html',
  styleUrl: './layouts.component.scss',
})
export class LayoutsComponent {
  // Code examples
  codeExamples = {
    basic: `import { Component } from '@angular/core';
import { LayoutComponent, MenuModel, LayoutConfig } from 'integra-ng';

@Component({
  selector: 'app-root',
  template: \`
    <i-layout [config]="layoutConfig" [menuModel]="menuModel">
      <div topbarActions>
        <i-button [icon]="'pi pi-user'" />
      </div>
    </i-layout>
  \`,
  imports: [LayoutComponent]
})
export class AppComponent {
  layoutConfig: LayoutConfig = {
    websiteName: 'My Application',
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
        }
      ]
    }
  ];
}`,

    config: `interface LayoutConfig {
  websiteName: string;        // Required: Application name
  logoLight?: string;         // Logo for light theme
  logoDark?: string;          // Logo for dark theme
  showThemeToggle?: boolean;  // Show theme toggle (default: true)
}`,

    menu: `interface MenuItem {
  label: string;              // Menu item label
  icon?: string;              // PrimeIcons class name
  routerLink?: string[];      // Angular router link
  items?: MenuItem[];         // Nested menu items
}

interface MenuModel {
  label: string;              // Menu group label
  items: MenuItem[];          // Menu items in group
  separator?: boolean;        // Add separator after group
}`,

    customTopbar: `<i-layout [config]="layoutConfig" [menuModel]="menuModel">
  <div topbarActions>
    <!-- Custom buttons and actions -->
    <i-button [icon]="'pi pi-bell'" [text]="true" />
    <i-button [icon]="'pi pi-user'" [text]="true" />
    <i-button severity="primary" size="small">Logout</i-button>
  </div>
</i-layout>`,

    nestedMenu: `menuModel: MenuModel[] = [
  {
    label: 'Getting Started',
    items: [
      {
        label: 'Installation',
        icon: 'pi pi-download',
        routerLink: ['/installation']
      },
      {
        label: 'Configuration',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Basic Setup',
            routerLink: ['/config/basic']
          },
          {
            label: 'Advanced Options',
            routerLink: ['/config/advanced']
          }
        ]
      }
    ],
    separator: true
  },
  {
    label: 'Components',
    items: [
      {
        label: 'Buttons',
        icon: 'pi pi-check-square',
        routerLink: ['/components/buttons']
      }
    ]
  }
]`,

    installation: `// Install the library
npm install integra-ng

// Import in your component
import { LayoutComponent, MenuModel, LayoutConfig } from 'integra-ng';

// Use in your template
<i-layout [config]="layoutConfig" [menuModel]="menuModel" />`,
  };

  features: Feature[] = [
    {
      title: 'Responsive Design',
      description:
        'Automatically adapts to mobile and desktop with collapsible sidebar',
    },
    {
      title: 'Theme Support',
      description:
        'Built-in light/dark theme toggle with localStorage persistence',
    },
    {
      title: 'Router Integration',
      description:
        'Full Angular router support with active state highlighting',
    },
    {
      title: 'Customizable Topbar',
      description:
        'Add custom actions to the top-right section via ng-content',
    },
    {
      title: 'Nested Menus',
      description: 'Support for multi-level menu items with icons',
    },
    {
      title: 'Logo Theming',
      description:
        'Different logos for light and dark themes automatically switch',
    },
    {
      title: 'Mobile-Friendly',
      description:
        'Touch-optimized sidebar with overlay mode on mobile devices',
    },
    {
      title: 'State Management',
      description:
        'Built-in LayoutService for managing sidebar and viewport state',
    },
  ];

  components = [
    {
      name: 'i-layout',
      description: 'Main layout wrapper with sidebar, topbar, and content area',
    },
    {
      name: 'i-topbar',
      description: 'Top navigation bar with logo, menu toggle, and actions',
    },
    {
      name: 'i-sidebar',
      description: 'Sidebar container with menu navigation',
    },
    {
      name: 'i-menu',
      description: 'Recursive menu component with router integration',
    },
  ];
}
