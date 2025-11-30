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

  // Large dataset for constrained height demo (50 items)
  largeDataset = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

  // Selected model for constrained large dataset demo
  selectedLargeItems: number | null = null;

  // Tasks data with icons
  tasks = [
    { name: 'Review Documents', value: 'review', icon: 'pi pi-file' },
    { name: 'Send Emails', value: 'email', icon: 'pi pi-envelope' },
    { name: 'Schedule Meeting', value: 'meeting', icon: 'pi pi-calendar' },
    { name: 'Update Database', value: 'database', icon: 'pi pi-database' },
    { name: 'Create Report', value: 'report', icon: 'pi pi-chart-bar' },
  ];

  // Users data with status icons
  users = [
    {
      name: 'John Doe',
      id: 1,
      status: 'online',
      statusIcon: 'pi pi-circle-fill',
    },
    {
      name: 'Jane Smith',
      id: 2,
      status: 'offline',
      statusIcon: 'pi pi-circle',
    },
    {
      name: 'Bob Johnson',
      id: 3,
      status: 'online',
      statusIcon: 'pi pi-circle-fill',
    },
    {
      name: 'Alice Brown',
      id: 4,
      status: 'away',
      statusIcon: 'pi pi-circle-fill',
    },
    {
      name: 'Charlie Wilson',
      id: 5,
      status: 'online',
      statusIcon: 'pi pi-circle-fill',
    },
  ];

  // Multiple selection listbox values
  selectedCountriesMultiple: string[] = ['US', 'CA'];

  // Single selection listbox value
  selectedCountrySingle: string | null = 'UK';

  // Tasks selection
  selectedTasks: string[] = ['review'];

  // Users selection
  selectedUser: number | null = null;

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

  onAddCountry() {
    console.log('Add country action clicked');
    alert('Add Country action triggered!');
  }

  onManageTasks() {
    console.log('Manage tasks action clicked');
    alert('Manage Tasks action triggered!');
  }

  onAddUser() {
    console.log('Add user action clicked');
    alert('Add User action triggered!');
  }

  // Features list for the component
  features: Feature[] = [
    {
      title: 'Modern Header',
      description:
        'Fixed header with title property and optional action button for quick actions.',
    },
    {
      title: 'Single & Multiple Selection',
      description:
        'Configure with [multiple] property. Checkboxes are hidden in single-select mode.',
    },
    {
      title: 'Chip Display',
      description:
        'Selected items in multiselect mode display as removable chips in the header area.',
    },
    {
      title: 'Option Icons',
      description:
        'Add icons to left or right edge of each option using optionLeftIcon and optionRightIcon.',
    },
    {
      title: 'Action Button',
      description:
        'Add an action button in the header using actionIcon, actionTooltip, and (onAction) output.',
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

// Template usage - Multiple select with chips in header
<i-listbox
  title="Countries"
  [options]="countries"
  optionLabel="name"
  optionValue="code"
  [multiple]="true"
  [showClear]="true"
  actionIcon="pi pi-plus"
  actionTooltip="Add Country"
  (onAction)="onAddCountry()"
  [(ngModel)]="selectedCountriesMultiple">
</i-listbox>`,

    single: `// Single select - no checkboxes shown
selectedCountrySingle: string | null = 'UK';

<i-listbox
  title="Select Country"
  [options]="countries"
  optionLabel="name"
  optionValue="code"
  [multiple]="false"
  [showClear]="true"
  [(ngModel)]="selectedCountrySingle">
</i-listbox>`,

    withIcons: `// Options with left icons - use property name
tasks = [
  { name: 'Review Documents', value: 'review', icon: 'pi pi-file' },
  { name: 'Send Emails', value: 'email', icon: 'pi pi-envelope' },
  { name: 'Schedule Meeting', value: 'meeting', icon: 'pi pi-calendar' }
];

<i-listbox
  title="Tasks"
  [options]="tasks"
  optionLabel="name"
  optionValue="value"
  [multiple]="true"
  optionLeftIcon="icon"
  actionIcon="pi pi-cog"
  actionTooltip="Manage Tasks"
  (onAction)="onManageTasks()">
</i-listbox>`,

    rightIcons: `// Options with right status icons
users = [
  { name: 'John Doe', id: 1, statusIcon: 'pi pi-circle-fill' },
  { name: 'Jane Smith', id: 2, statusIcon: 'pi pi-circle' },
  { name: 'Bob Johnson', id: 3, statusIcon: 'pi pi-circle-fill' }
];

<i-listbox
  title="Team Members"
  [options]="users"
  optionLabel="name"
  optionValue="id"
  [multiple]="false"
  optionRightIcon="statusIcon"
  actionIcon="pi pi-user-plus"
  actionTooltip="Add User"
  (onAction)="onAddUser()">
</i-listbox>`,

    filter: `<i-listbox
  title="Searchable Countries"
  [options]="countries"
  optionLabel="name"
  optionValue="code"
  [multiple]="true"
  [filter]="true"
  filterBy="name"
  [showClear]="true">
</i-listbox>`,

    fluid: `<i-listbox
  title="Full Width Listbox"
  [options]="countries"
  optionLabel="name"
  optionValue="code"
  [multiple]="true"
  [fluid]="true"
  [showClear]="true">
</i-listbox>`,

    disabled: `<i-listbox
  title="Disabled Listbox"
  [options]="countries"
  optionLabel="name"
  optionValue="code"
  [multiple]="true"
  [disabled]="true"
  [ngModel]="['US', 'CA']">
</i-listbox>`,

    constrained: `// Constrained container example (500px height)
// Provide a wrapper with a fixed height and allow the listbox to scroll.

<div class="wrapper">
  <i-listbox
    title="Items (50 total)"
    [options]="largeDataset"
    optionLabel="name"
    optionValue="id"
    [multiple]="false"
    [filter]="true"
    [showClear]="true"
    [(ngModel)]="selectedLargeItems"
  ></i-listbox>
</div>`,

    reactive: `// Component setup with reactive forms and observable data
departmentsForm = this.fb.group({
  selectedDepartments: [[1, 2], [Validators.required, Validators.minLength(1)]]
});

departmentOptions$ = this.departmentSubject.asObservable();

// Template usage with reactive forms
<form [formGroup]="departmentsForm">
  <i-listbox
    title="Departments"
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
