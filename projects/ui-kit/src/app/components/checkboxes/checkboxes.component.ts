import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { ICheckbox } from '../../../../../invensys-angular-shared/src/lib/components/checkbox/checkbox.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-checkboxes',
  imports: [
    ICheckbox,
    DemoCardComponent,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
  ],
  templateUrl: './checkboxes.component.html',
  styleUrl: './checkboxes.component.scss',
})
export class CheckboxesComponent {
  // ngModel examples
  basicChecked = false;
  checkedWithLabel = true;
  disabledChecked = false;
  readonlyChecked = true;

  // Size examples
  smallChecked = false;
  mediumChecked = true;
  largeChecked = false;

  // FormControl examples
  formControlExample = new FormControl(false);

  // FormGroup example
  userPreferencesForm = new FormGroup({
    notifications: new FormControl(true),
    newsletter: new FormControl(false),
    marketing: new FormControl(false),
    analytics: new FormControl(true),
  });

  // Code examples organized by category
  codeExamples = {
    basic: `// 1. Import the component and FormsModule
import { ICheckbox } from '../../../../../invensys-angular-shared/src/lib/components/checkbox/checkbox.component';
import { FormsModule } from '@angular/forms';

// 2. Add to your component imports
@Component({
  selector: 'your-component',
  imports: [ICheckbox, FormsModule],
  // ...
})

// 3. Component property
checked = false;

// 4. Use in template
<i-checkbox [(ngModel)]="checked" />

// 5. Handle changes
<i-checkbox [(ngModel)]="checked" (onChange)="onCheckboxChange($event)" />

onCheckboxChange(isChecked: boolean) {
  console.log('Checkbox is now:', isChecked);
}`,

    withLabel: `// Basic usage with label
<i-checkbox [(ngModel)]="checked" label="Accept terms and conditions" />

// Custom input id
<i-checkbox [(ngModel)]="checked" inputId="terms" label="Accept terms" />`,

    states: `// Disabled state
<i-checkbox [(ngModel)]="checked" [disabled]="true" label="Disabled checkbox" />

// Readonly state
<i-checkbox [(ngModel)]="checked" [readonly]="true" label="Readonly checkbox" />`,

    sizes: `// Different sizes
<i-checkbox [(ngModel)]="checked" size="small" label="Small checkbox" />
<i-checkbox [(ngModel)]="checked" size="medium" label="Medium checkbox" />
<i-checkbox [(ngModel)]="checked" size="large" label="Large checkbox" />`,

    formControl: `// 1. Import ReactiveFormsModule
import { ReactiveFormsModule, FormControl } from '@angular/forms';

// 2. Component property
checkboxControl = new FormControl(false);

// 3. Use in template
<i-checkbox [formControl]="checkboxControl" label="FormControl checkbox" />

// 4. Access value
console.log(this.checkboxControl.value);`,

    formGroup: `// FormGroup example
import { FormGroup, FormControl } from '@angular/forms';

// Component property
userForm = new FormGroup({
  notifications: new FormControl(true),
  newsletter: new FormControl(false)
});

// Template usage
<form [formGroup]="userForm">
  <i-checkbox formControlName="notifications" label="Email notifications" />
  <i-checkbox formControlName="newsletter" label="Subscribe to newsletter" />
</form>

// Access values
console.log(this.userForm.value);`,
  };

  features = [
    {
      title: 'Two-way Data Binding',
      description: 'Full support for ngModel and reactive forms',
    },
    {
      title: 'Size Variants',
      description: 'Small, medium, and large checkbox sizes',
    },
    {
      title: 'Label Support',
      description: 'Optional labels with proper accessibility',
    },
    {
      title: 'State Management',
      description: 'Disabled and readonly states',
    },
    {
      title: 'Form Integration',
      description: 'Works seamlessly with Angular forms',
    },
    {
      title: 'Custom Events',
      description: 'onChange event for custom handling',
    },
    {
      title: 'Accessibility',
      description: 'ARIA attributes and keyboard navigation',
    },
    {
      title: 'Custom Styling',
      description: 'Theme-aware styling with CSS custom properties',
    },
  ];

  // Event handlers
  onBasicChange(checked: boolean) {
    console.log('Basic checkbox changed:', checked);
    console.log('Current state:', this.basicChecked);
  }

  onFormSubmit() {
    console.log('Form submitted:', this.userPreferencesForm.value);
  }

  resetForm() {
    this.userPreferencesForm.reset({
      notifications: false,
      newsletter: false,
      marketing: false,
      analytics: false,
    });
  }

  selectAll() {
    this.userPreferencesForm.patchValue({
      notifications: true,
      newsletter: true,
      marketing: true,
      analytics: true,
    });
  }
}
