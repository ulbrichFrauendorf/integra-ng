import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ExampleDialogComponent } from '../example-dialog/example-dialog.component';
import { IDialog } from '@shared/components/dialog/dialog.component';
import { IButton } from '@shared/components/button/button.component';
import { IDynamicDialogRef } from '@shared/components/dialog/services/dialog.interfaces';
import { DialogService } from '@shared/components/dialog/services/dialog.service';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';
import { IDialogActions } from '@shared/components/dialog/inner/dialog-actions/dialog-actions.component';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import {
  IListbox,
  ListboxOption,
} from '@shared/components/listbox/listbox.component';

@Component({
  selector: 'app-dialogs',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AsyncPipe,
    IDialog,
    IButton,
    DemoCardComponent,
    FeaturesListComponent,
    IDialogActions,
    IListbox,
  ],
  templateUrl: './dialogs.component.html',
  styleUrl: './dialogs.component.scss',
})
export class DialogsComponent implements OnInit, OnDestroy {
  ref: IDynamicDialogRef | undefined;
  dialogService = inject(DialogService);
  private fb = inject(FormBuilder);

  showBasicDialog = false;
  showSingleButtonDialog = false;
  showResponsiveDialog = false;
  showFullscreenDialog = false;

  // Form for the large dialog listbox
  largeDialogForm: FormGroup;

  // Observable data for the listbox
  departmentOptions$: Observable<ListboxOption[]>;
  private departmentSubject = new BehaviorSubject<ListboxOption[]>([]);

  // Initial data
  private initialDepartments: ListboxOption[] = [
    { label: 'Engineering', value: 'eng', selected: false },
    { label: 'Marketing', value: 'mkt', selected: false },
    { label: 'Sales', value: 'sales', selected: false },
    { label: 'Human Resources', value: 'hr', selected: false },
    { label: 'Finance', value: 'fin', selected: false },
    { label: 'Operations', value: 'ops', selected: false },
    { label: 'Customer Support', value: 'support', selected: false },
    { label: 'Product Management', value: 'pm', selected: false },
  ];

  private intervalSub: any;

  constructor() {
    // Initialize the form with the selectedDepartments field
    this.largeDialogForm = this.fb.group({
      selectedDepartments: [[], [Validators.required, Validators.minLength(1)]],
    });

    // Set up the observable
    this.departmentOptions$ = this.departmentSubject.asObservable();
  }

  ngOnInit() {
    // Initialize with the initial data
    this.departmentSubject.next([...this.initialDepartments]);

    // Start simulating dynamic data updates
    this.simulateDynamicData();
  }

  ngOnDestroy() {
    if (this.intervalSub) {
      clearInterval(this.intervalSub);
    }
  }

  simulateDynamicData() {
    // Simulate dynamic updates every 10 seconds
    this.intervalSub = setInterval(() => {
      const currentOptions = [...this.initialDepartments];

      // Randomly add/remove a "New Department" option
      const hasNewDept = Math.random() > 0.5;
      if (hasNewDept) {
        currentOptions.push({
          label: `New Department (${new Date().getSeconds()})`,
          value: `new-dept-${Date.now()}`,
          selected: false,
        });
      }

      // Randomly modify availability of some departments
      currentOptions.forEach((option) => {
        if (option['value'] !== 'eng') {
          // Keep Engineering always available
          option['disabled'] = Math.random() > 0.8; // 20% chance to be disabled
        }
      });

      console.log('Updated department options:', currentOptions);
      this.departmentSubject.next(currentOptions);
    }, 10000);
  }

  // TypeScript code example for Dynamic Dialog Service
  dynamicDialogTsCode = `import { Component, inject } from '@angular/core';
import { DialogService } from 'integra-ng';
import { IDynamicDialogRef } from 'integra-ng';
import { ExampleDialogComponent } from './example-dialog.component';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  ref: IDynamicDialogRef | undefined;
  dialogService = inject(DialogService);

  displayExampleDialog() {
    this.ref = this.dialogService.open(ExampleDialogComponent, {
      header: 'Example Dynamic Dialog',
      width: '600px',
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        message: 'Hello from Dialog Service!',
        timestamp: new Date().toISOString(),
        user: 'Test User',
      },
    });

    // Optional: Handle dialog close event
    this.ref.onClose.subscribe((result) => {
      console.log('Dialog closed with result:', result);
    });
  }
}`;

  // Code examples organized by category
  codeExamples = {
    dynamic: `
<i-button severity="primary" (clicked)="displayExampleDialog()">
  Open Dynamic Dialog
</i-button>`,

    basic: `<i-dialog
  [visible]="showBasicDialog"
  (visibleChange)="showBasicDialog = $event"
  (onHide)="onBasicDialogHide()"
  [closable]="true"
  header="Basic Dialog Example"
  width="20rem">
  <div class="dialog-content">
    <h4>Basic Dialog</h4>
    <p>This is a basic dialog component.</p>
  </div>
</i-dialog>`,

    singleButton: `<i-dialog
  [visible]="showSingleButtonDialog"
  (visibleChange)="showSingleButtonDialog = $event"
  header="Notification"
  width="24rem">
  <div class="dialog-content">
    <h4>Success!</h4>
    <p>Your changes have been saved successfully.</p>
  </div>
  <i-dialog-actions
    (submitEvent)="onSingleButtonDialogHide()"
    submitLabel="OK"
    [showCancel]="false"
  ></i-dialog-actions>
</i-dialog>`,

    responsive: `<i-dialog
  [visible]="showResponsiveDialog"
  (visibleChange)="showResponsiveDialog = $event"
  header="Responsive Dialog"
  width="50vw"
  [breakpoints]="{
    '960px': '75vw',
    '640px': '90vw'
  }">
  <div class="dialog-content">
    <p>This dialog adapts to different screen sizes.</p>
  </div>
</i-dialog>`,

    fullscreen: `<i-dialog
  [visible]="showFullscreenDialog"
  (visibleChange)="showFullscreenDialog = $event"
  header="Large Dialog"
  [modal]="true"
  width="80vw"
  height="80vh">
  <div class="dialog-content">
    <p>Large dialog for complex content.</p>
  </div>
</i-dialog>`,
  };

  features: Feature[] = [
    {
      title: 'Dynamic Dialog Service',
      description: 'Programmatically open dialogs with the DialogService',
    },
    {
      title: 'Template Dialogs',
      description: 'Declarative dialogs using the i-dialog component',
    },
    {
      title: 'Modal & Non-Modal',
      description: 'Support for both modal and non-modal dialog behaviors',
    },
    {
      title: 'Responsive Design',
      description: 'Breakpoint-based responsive sizing for mobile devices',
    },
    {
      title: 'Large Dialogs',
      description: 'Support for large viewport dimensions',
    },
    {
      title: 'Header & Footer',
      description: 'Customizable header and footer content areas',
    },
    {
      title: 'Keyboard Support',
      description: 'ESC key to close and focus management',
    },
    {
      title: 'Accessibility',
      description: 'ARIA compliant with proper focus trapping',
    },
  ];

  displayExampleDialog() {
    this.ref = this.dialogService.open(ExampleDialogComponent, {
      header: 'Example Dynamic Dialog',
      width: '600px',
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        message: 'Hello from Dialog Service!',
        timestamp: new Date().toISOString(),
        user: 'Test User',
      },
    });

    this.ref.onClose.subscribe((result) => {
      console.log('Dialog closed with result:', result);
    });
  }

  showBasicDialogModal() {
    this.showBasicDialog = true;
  }

  showResponsiveDialogModal() {
    this.showResponsiveDialog = true;
  }

  showFullscreenDialogModal() {
    this.showFullscreenDialog = true;
  }

  onBasicDialogHide() {
    this.showBasicDialog = false;
  }

  showSingleButtonDialogModal() {
    this.showSingleButtonDialog = true;
  }

  onSingleButtonDialogHide() {
    this.showSingleButtonDialog = false;
  }

  onResponsiveDialogHide() {
    this.showResponsiveDialog = false;
  }

  onFullscreenDialogHide() {
    this.showFullscreenDialog = false;
  }
}
