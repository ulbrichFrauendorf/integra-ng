import { Component } from '@angular/core';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { LayoutConfig } from '@shared/components/layout/models/layout-config.model';
import { MenuModel } from '@shared/components/layout/models/menu.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [LayoutComponent],
  template: `
    <i-layout [config]="layoutConfig" [menuModel]="menuModel">
      <ng-container topbarActions>
        <!-- Additional topbar actions can be added here if needed -->
      </ng-container>
    </i-layout>
  `,
})
export class AppLayoutComponent {
  layoutConfig: LayoutConfig = {
    websiteName: 'Integra-NG',
    logoLight: 'assets/layout/images/invensys-icon-light.png',
    logoDark: 'assets/layout/images/invensys-icon-dark.png',
    showThemeToggle: true,
  };

  menuModel: MenuModel[] = [
    {
      label: 'Getting Started',
      items: [
        {
          label: 'Installation',
          icon: 'pi pi-fw pi-download',
          routerLink: ['/getting-started/installation'],
        },
        {
          label: 'Theming',
          icon: 'pi pi-fw pi-palette',
          routerLink: ['/getting-started/theming'],
        },
      ],
    },
    {
      label: 'UI Components',
      items: [
        {
          label: 'Layouts',
          icon: 'pi pi-fw pi-objects-column',
          routerLink: ['/components/layouts'],
        },
        {
          label: 'Accordions',
          icon: 'pi pi-fw pi-list',
          routerLink: ['/components/accordions'],
        },
        {
          label: 'Input Texts',
          icon: 'pi pi-fw pi-pencil',
          routerLink: ['/components/input-texts'],
        },
        {
          label: 'Calendars',
          icon: 'pi pi-fw pi-calendar',
          routerLink: ['/components/calendars'],
        },
        {
          label: 'Buttons',
          icon: 'pi pi-fw pi-external-link',
          routerLink: ['/components/buttons'],
        },
        {
          label: 'Checkboxes',
          icon: 'pi pi-fw pi-check-square',
          routerLink: ['/components/checkboxes'],
        },
        {
          label: 'Radio Buttons',
          icon: 'pi pi-fw pi-circle',
          routerLink: ['/components/radio-buttons'],
        },
        {
          label: 'Cards',
          icon: 'pi pi-fw pi-id-card',
          routerLink: ['/components/cards'],
        },
        {
          label: 'Dialogs',
          icon: 'pi pi-fw pi-window-maximize',
          routerLink: ['/components/dialogs'],
        },
        {
          label: 'Confirmation Dialogs',
          icon: 'pi pi-fw pi-question-circle',
          routerLink: ['/components/confirmation-dialogs'],
        },
        {
          label: 'Tooltips',
          icon: 'pi pi-fw pi-info-circle',
          routerLink: ['/components/tooltips'],
        },
        {
          label: 'Selects',
          icon: 'pi pi-fw pi-list',
          routerLink: ['/components/selects'],
        },
        {
          label: 'Multi Selects',
          icon: 'pi pi-fw pi-th-large',
          routerLink: ['/components/multi-selects'],
        },
        {
          label: 'Chips',
          icon: 'pi pi-fw pi-tag',
          routerLink: ['/components/chips'],
        },
        {
          label: 'Listboxes',
          icon: 'pi pi-fw pi-list',
          routerLink: ['/components/listboxes'],
        },
        {
          label: 'Messages',
          icon: 'pi pi-fw pi-info-circle',
          routerLink: ['/components/messages'],
        },
        {
          label: 'Tree Views',
          icon: 'pi pi-fw pi-sitemap',
          routerLink: ['/components/tree-views'],
        },
        {
          label: 'Tables',
          icon: 'pi pi-fw pi-table',
          routerLink: ['/components/tables'],
        },
        {
          label: 'Charts',
          icon: 'pi pi-fw pi-chart-bar',
          routerLink: ['/components/charts'],
        },
        {
          label: 'Tabs',
          icon: 'pi pi-fw pi-folder',
          routerLink: ['/components/tabs'],
        },
        {
          label: 'Panels',
          icon: 'pi pi-fw pi-window-maximize',
          routerLink: ['/components/panels'],
        },
        {
          label: 'Placeholders',
          icon: 'pi pi-fw pi-stop',
          routerLink: ['/components/placeholders'],
        },
        {
          label: 'Whispers',
          icon: 'pi pi-fw pi-comment',
          routerLink: ['/components/whispers'],
        },
      ],
      separator: false,
    },
  ];
}
