import { Component } from '@angular/core';
import { IButton } from '../../../../../invensys-angular-shared/src/lib/components/button/button.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

interface ButtonExample {
  severity:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'contrast';
  text?: boolean;
  outlined?: boolean;
  raised?: boolean;
  fluid?: boolean;
  icon?: string;
  label?: string;
  size?: 'small' | 'medium' | 'large';
}

@Component({
  selector: 'app-buttons',
  imports: [IButton, DemoCardComponent, FeaturesListComponent],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.scss',
})
export class ButtonsComponent {
  // Organized button examples by category
  buttonExamples = {
    contrast: [
      {
        severity: 'contrast' as const,
        text: true,
        icon: 'pi pi-cloud-download',
        size: 'small' as const,
      },
      {
        severity: 'contrast' as const,
        text: true,
        icon: 'pi pi-cloud-download',
        size: 'medium' as const,
      },
      {
        severity: 'contrast' as const,
        text: true,
        icon: 'pi pi-cloud-download',
        size: 'large' as const,
      },
    ],
    success: [
      {
        severity: 'success' as const,
        raised: true,
        label: 'Hello Button',
        size: 'small' as const,
      },
      {
        severity: 'success' as const,
        raised: true,
        label: 'Hello Button',
        size: 'medium' as const,
      },
      {
        severity: 'success' as const,
        raised: true,
        label: 'Hello Button',
        size: 'large' as const,
      },
    ],
    warning: [
      {
        severity: 'warning' as const,
        outlined: true,
        label: 'Hello Button',
        size: 'small' as const,
      },
      {
        severity: 'warning' as const,
        outlined: true,
        label: 'Hello Button',
        size: 'medium' as const,
      },
      {
        severity: 'warning' as const,
        outlined: true,
        label: 'Hello Button',
        size: 'large' as const,
      },
    ],
    info: [
      {
        severity: 'info' as const,
        text: true,
        icon: 'pi pi-user',
        label: 'Button with icon',
      },
      {
        severity: 'info' as const,
        outlined: true,
        icon: 'pi pi-user',
        label: 'Button with icon',
      },
      {
        severity: 'info' as const,
        icon: 'pi pi-user',
        label: 'Button with icon',
      },
    ],
    fluid: [
      {
        severity: 'primary' as const,
        fluid: true,
        label: 'Fluid Primary Button',
      },
      {
        severity: 'secondary' as const,
        fluid: true,
        outlined: true,
        label: 'Fluid Outlined Button',
      },
      {
        severity: 'success' as const,
        fluid: true,
        raised: true,
        label: 'Fluid Raised Button',
      },
    ],
  };

  // Code examples organized by category
  codeExamples = {
    contrast: `<i-button severity="contrast" [text]="true" icon="pi pi-cloud-download" size="small" />
<i-button severity="contrast" [text]="true" icon="pi pi-cloud-download" size="medium" />
<i-button severity="contrast" [text]="true" icon="pi pi-cloud-download" size="large" />`,

    success: `<i-button severity="success" [raised]="true" size="small">Hello Button</i-button>
<i-button severity="success" [raised]="true" size="medium">Hello Button</i-button>
<i-button severity="success" [raised]="true" size="large">Hello Button</i-button>`,

    warning: `<i-button severity="warning" [outlined]="true" size="small">Hello Button</i-button>
<i-button severity="warning" [outlined]="true" size="medium">Hello Button</i-button>
<i-button severity="warning" [outlined]="true" size="large">Hello Button</i-button>`,

    info: `<i-button severity="info" [text]="true" icon="pi pi-user">Button with icon</i-button>
<i-button severity="info" [outlined]="true" icon="pi pi-user">Button with icon</i-button>
<i-button severity="info" icon="pi pi-user">Button with icon</i-button>`,

    fluid: `<i-button severity="primary" [fluid]="true">Fluid Primary Button</i-button>
<i-button severity="secondary" [fluid]="true" [outlined]="true">Fluid Outlined Button</i-button>
<i-button severity="success" [fluid]="true" [raised]="true">Fluid Raised Button</i-button>`,
  };

  // TypeScript initialization example
  initializationCode = `import { IButton } from 'invensys-angular-shared';

@Component({
  selector: 'app-example',
  imports: [IButton],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  // Component is ready to use in template
}`;

  features: Feature[] = [
    {
      title: 'Multiple Severities',
      description:
        'Primary, secondary, success, info, warning, danger, and contrast variants',
    },
    {
      title: 'Size Variants',
      description: 'Small, medium, and large button sizes',
    },
    {
      title: 'Button Styles',
      description: 'Filled, outlined, text, and raised button styles',
    },
    { title: 'Icon Support', description: 'Leading icons using PrimeIcons' },
    {
      title: 'Fluid Layout',
      description: 'Full-width buttons for responsive designs',
    },
    {
      title: 'Disabled State',
      description: 'Proper disabled styling and interaction handling',
    },
    {
      title: 'Loading State',
      description: 'Built-in loading indicator support',
    },
    {
      title: 'Accessibility',
      description: 'ARIA attributes and keyboard navigation',
    },
  ];
}
