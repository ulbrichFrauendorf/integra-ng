import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ISelect } from '@shared/components/select/select.component';
import { IButton } from '@shared/components/button/button.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';

export interface SelectOption {
  value: any;
  label?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-selects',
  imports: [ISelect, IButton, ReactiveFormsModule, DemoCardComponent],
  templateUrl: './selects.component.html',
  styleUrl: './selects.component.scss',
})
export class SelectsComponent implements OnInit {
  basicForm: FormGroup;
  validationForm: FormGroup;
  advancedForm: FormGroup;
  fluidForm: FormGroup;

  // Sample data organized by category
  selectData = {
    countries: [
      { value: 'us', label: 'United States', code: 'US' },
      { value: 'uk', label: 'United Kingdom', code: 'GB' },
      { value: 'de', label: 'Germany', code: 'DE' },
      { value: 'fr', label: 'France', code: 'FR' },
      { value: 'it', label: 'Italy', code: 'IT' },
      { value: 'es', label: 'Spain', code: 'ES' },
      { value: 'ca', label: 'Canada', code: 'CA' },
      { value: 'au', label: 'Australia', code: 'AU' },
      { value: 'jp', label: 'Japan', code: 'JP' },
      { value: 'br', label: 'Brazil', code: 'BR' },
    ],

    statuses: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
      { value: 'suspended', label: 'Suspended' },
    ],

    reports: [
      { value: 1, name: 'Monthly Sales Report', department: 'Sales' },
      { value: 2, name: 'Quarterly Performance Report', department: 'Finance' },
      {
        value: 3,
        name: 'Customer Satisfaction Report',
        department: 'Customer Service',
      },
      { value: 4, name: 'Inventory Status Report', department: 'Operations' },
      { value: 5, name: 'Employee Performance Report', department: 'HR' },
    ],
  };

  // Code examples organized by category
  codeExamples = {
    basic: `// Two approaches available:

// 1. Extract specific value (traditional approach)
<i-select 
  label="Country" 
  [options]="countries" 
  optionLabel="label" 
  optionValue="value"        // Stores just the value: "us"
  formControlName="country">
</i-select>

// 2. Store full object (new optional approach) 
<i-select 
  label="Country" 
  [options]="countries" 
  optionLabel="label"        // optionValue is now optional!
  formControlName="fullObjectSelect"> // Stores full object: {value: "us", label: "United States"}
</i-select>

// Form values comparison:
// With optionValue:    { country: "us" }
// Without optionValue: { fullObjectSelect: { value: "us", label: "United States" } }`,

    validation: `<i-select 
  label="Status (Required)" 
  [options]="statuses" 
  optionLabel="label" 
  optionValue="value"
  placeholder="Select status" 
  formControlName="status">
</i-select>`,

    advanced: `<i-select 
  [options]="reports" 
  [filter]="true" 
  [showClear]="true" 
  filterBy="name" 
  optionLabel="name" 
  optionValue="value" 
  placeholder="Select Report" 
  formControlName="selectedReport">
</i-select>`,

    fluid: `<i-select 
  label="Fluid Select" 
  [options]="countries" 
  optionLabel="label" 
  optionValue="value"
  [fluid]="true" 
  placeholder="Select option" 
  formControlName="fluidSelect">
</i-select>`,
  };

  features = [
    {
      title: 'Option Configuration',
      description:
        'Flexible option labels and values with custom object properties',
    },
    {
      title: 'Filtering',
      description: 'Built-in search functionality for large option lists',
    },
    {
      title: 'Clear Function',
      description: 'Optional clear button to reset selection',
    },
    {
      title: 'Form Integration',
      description: 'Full reactive forms support with validation',
    },
    {
      title: 'Disabled State',
      description: 'Support for disabled selects and individual options',
    },
    {
      title: 'Fluid Layout',
      description: 'Full-width selects for responsive designs',
    },
    {
      title: 'Custom Templates',
      description: 'Customizable option display and selection',
    },
    {
      title: 'Accessibility',
      description: 'ARIA support and keyboard navigation',
    },
  ];

  constructor(private fb: FormBuilder) {
    this.basicForm = this.fb.group({
      country: [''],
      status: [''],
      preselected: ['us'],
      disabled: [{ value: 'uk', disabled: true }],
      // New: Store full object instead of just value
      fullObjectSelect: [null],
    });

    this.validationForm = this.fb.group({
      status: ['', [Validators.required]],
    });

    this.advancedForm = this.fb.group({
      selectedReport: [''],
    });

    this.fluidForm = this.fb.group({
      fluidSelect: [''],
    });
  }

  ngOnInit() {
    // Demo validation state
    setTimeout(() => {
      this.validationForm.get('status')?.markAsTouched();
    }, 100);
  }

  onReportChange() {
    console.log(
      'Report changed:',
      this.advancedForm.get('selectedReport')?.value
    );
  }

  onReportClear() {
    console.log('Report cleared');
  }

  onSubmit(form: FormGroup, formName: string) {
    if (form.valid) {
      console.log(`${formName} form submitted:`, form.value);
    } else {
      this.markFormGroupTouched(form);
    }
  }

  onCountryValueChange(value: any) {
    console.log('Country Value Changed (optionValue="value"):', value);
    console.log('Form control value:', this.basicForm.get('country')?.value);
    console.log('Type:', typeof value);
  }

  onCountryObjectChange(value: any) {
    console.log('Country Object Changed (no optionValue):', value);
    console.log(
      'Form control value:',
      this.basicForm.get('fullObjectSelect')?.value
    );
    console.log('Type:', typeof value);
    console.log('Full object properties:', value ? Object.keys(value) : 'null');
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }
}
