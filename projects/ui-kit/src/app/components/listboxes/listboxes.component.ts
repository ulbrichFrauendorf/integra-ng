import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, AsyncPipe, JsonPipe } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, BehaviorSubject, interval, map, takeWhile } from 'rxjs';
import {
  IListbox,
  ListboxOption,
} from '@shared/components/listbox/listbox.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'app-listboxes',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    JsonPipe,
    FormsModule,
    ReactiveFormsModule,
    IListbox,
    DemoCardComponent,
    FeaturesListComponent,
  ],
  templateUrl: './listboxes.component.html',
  styleUrls: ['./listboxes.component.scss', '../shared-demo-styles.scss'],
})
export class ListboxesComponent implements OnInit, OnDestroy {
  // Reactive form for departments example
  public departmentsForm: FormGroup;
  public departmentOptions$: Observable<ListboxOption[]>;
  private departmentSubject = new BehaviorSubject<ListboxOption[]>([]);
  private isComponentActive = true;

  // Simulated departments data that updates over time
  private initialDepartments: ListboxOption[] = [
    { id: 1, name: 'Engineering', code: 'ENG', employees: 25 },
    { id: 2, name: 'Marketing', code: 'MKT', employees: 12 },
    { id: 3, name: 'Sales', code: 'SAL', employees: 18 },
  ];

  // Sample data for the listbox
  countries = [
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' },
    { name: 'United Kingdom', code: 'UK' },
    { name: 'Germany', code: 'DE' },
    { name: 'France', code: 'FR' },
    { name: 'Italy', code: 'IT' },
    { name: 'Spain', code: 'ES' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'Belgium', code: 'BE' },
    { name: 'Australia', code: 'AU' },
  ];

  // Multiple selection listbox values
  selectedCountriesMultiple: string[] = ['US', 'CA'];

  // Single selection listbox value
  selectedCountrySingle: string | null = 'UK';

  constructor(private fb: FormBuilder) {
    // Initialize reactive form
    this.departmentsForm = this.fb.group({
      selectedDepartments: [
        [1, 2],
        [Validators.required, Validators.minLength(1)],
      ],
    });

    // Initialize the observable with the subject
    this.departmentOptions$ = this.departmentSubject.asObservable();

    // Start with initial data
    this.departmentSubject.next(this.initialDepartments);
  }

  ngOnInit() {
    // Simulate dynamic data updates every 5 seconds
    this.simulateDynamicData();

    // Debug form changes - listbox with reactive forms and observable data
    this.departmentsForm
      .get('selectedDepartments')
      ?.valueChanges.subscribe((value) => {
        console.log('Departments form value changed:', value);
      });
  }

  ngOnDestroy() {
    this.isComponentActive = false;
  }

  private simulateDynamicData() {
    // Simulate adding new departments over time
    const additionalDepartments = [
      { id: 4, name: 'Human Resources', code: 'HR', employees: 8 },
      { id: 5, name: 'Finance', code: 'FIN', employees: 15 },
      { id: 6, name: 'Operations', code: 'OPS', employees: 22 },
      { id: 7, name: 'Research & Development', code: 'RND', employees: 30 },
    ];

    // Add a new department every 5 seconds
    interval(5000)
      .pipe(
        takeWhile(() => this.isComponentActive),
        map((index) => index % additionalDepartments.length)
      )
      .subscribe((index) => {
        const currentDepartments = this.departmentSubject.value;
        const newDepartment = additionalDepartments[index];

        // Check if department already exists to avoid duplicates
        if (
          !currentDepartments.some((dept) => dept['id'] === newDepartment['id'])
        ) {
          const updatedDepartments = [...currentDepartments, newDepartment];
          this.departmentSubject.next(updatedDepartments);
        }
      });
  }

  onMultipleSelectionChange(value: string[]) {
    console.log('Multiple selection changed:', value);
    this.selectedCountriesMultiple = value;
  }

  onSingleSelectionChange(value: string | null) {
    console.log('Single selection changed:', value);
    this.selectedCountrySingle = value;
  }

  onClear() {
    console.log('Selection cleared');
  }

  // Features list for the component
  features: Feature[] = [
    {
      title: 'Always Visible Options',
      description:
        'Unlike dropdowns, all options are always visible on the screen.',
    },
    {
      title: 'Single & Multiple Selection',
      description:
        'Configure with [multiple] property to control selection behavior.',
    },
    {
      title: 'Chip Display',
      description:
        'Selected items are displayed as removable chips for both single and multiple selection modes.',
    },
    {
      title: 'Built-in Filtering',
      description:
        'Optional search functionality to filter through large option lists.',
    },
    {
      title: 'Form Integration',
      description:
        'Full support for Angular reactive forms and template-driven forms.',
    },
    {
      title: 'Observable Data Support',
      description:
        'Real-time data updates through RxJS observables with automatic change detection.',
    },
    {
      title: 'Dynamic Content',
      description:
        'Options can be updated dynamically at runtime with proper visual feedback.',
    },
    {
      title: 'Accessibility',
      description:
        'ARIA support and keyboard navigation for better user experience.',
    },
  ];

  // Code examples for demo cards
  codeExamples = {
    multiple: `// Component setup
countries = [
  { name: 'United States', code: 'US' },
  { name: 'Canada', code: 'CA' },
  { name: 'United Kingdom', code: 'UK' }
];

selectedCountriesMultiple: string[] = ['US', 'CA'];

// Template usage
<i-listbox
  label="Select Countries (Multiple)"
  [options]="countries"
  optionLabel="name"
  optionValue="code"
  [multiple]="true"
  [showClear]="true"
  [(ngModel)]="selectedCountriesMultiple"
  (onChange)="onMultipleSelectionChange($event)"
  (onClear)="onClear()">
</i-listbox>`,

    single: `// Component setup
selectedCountrySingle: string | null = 'UK';

// Template usage - Single select with chip display
<i-listbox
  label="Select Country (Single)"
  [options]="countries"
  optionLabel="name"
  optionValue="code"
  [multiple]="false"
  [showClear]="true"
  [(ngModel)]="selectedCountrySingle"
  (onChange)="onSingleSelectionChange($event)"
  (onClear)="onClear()">
</i-listbox>`,

    filter: `<i-listbox
  label="Searchable Countries"
  [options]="countries"
  optionLabel="name"
  optionValue="code"
  [multiple]="true"
  [filter]="true"
  filterBy="name"
  [showClear]="true">
</i-listbox>`,

    fluid: `<i-listbox
  label="Full Width Listbox"
  [options]="countries"
  optionLabel="name"
  optionValue="code"
  [multiple]="true"
  [fluid]="true"
  [showClear]="true">
</i-listbox>`,

    disabled: `<i-listbox
  label="Disabled Listbox"
  [options]="countries"
  optionLabel="name"
  optionValue="code"
  [multiple]="true"
  [disabled]="true"
  [ngModel]="['US', 'CA']">
</i-listbox>`,

    reactive: `// Component setup with reactive forms and observable data
departmentsForm = this.fb.group({
  selectedDepartments: [[1, 2], [Validators.required, Validators.minLength(1)]]
});

departmentOptions$ = this.departmentSubject.asObservable();

private initialDepartments = [
  { id: 1, name: 'Engineering', code: 'ENG', employees: 25 },
  { id: 2, name: 'Marketing', code: 'MKT', employees: 12 },
  { id: 3, name: 'Sales', code: 'SAL', employees: 18 }
];

// Simulate dynamic data updates every 5 seconds
simulateDynamicData() {
  interval(5000).pipe(
    takeWhile(() => this.isComponentActive)
  ).subscribe(() => {
    // Add new departments over time
    this.departmentSubject.next([...this.departmentSubject.value, newDept]);
  });
}

// Template usage with reactive forms
<form [formGroup]="departmentsForm">
  <i-listbox
    label="Departments (Reactive Forms + Observable)"
    [options]="departmentOptions$ | async"
    optionLabel="name"
    optionValue="id"
    formControlName="selectedDepartments"
    [multiple]="true"
    [filter]="true"
    [showClear]="true"
    [maxSelectedLabels]="2"
    selectedItemsLabel="{0} departments selected">
  </i-listbox>
</form>`,
  };
}
