import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IChip } from '@shared/components/chip/chip.component';
import { IChips } from '@shared/components/chips/chips.component';
import { IButton } from '@shared/components/button/button.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';

@Component({
  selector: 'app-chips',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IChip,
    IChips,
    IButton,
    DemoCardComponent,
  ],
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
})
export class ChipsComponent implements OnInit {
  basicForm: FormGroup;
  validationForm: FormGroup;

  // Code examples organized by category
  codeExamples = {
    basicChips: `<i-chip label="Action" />
<i-chip label="Comedy" />
<i-chip label="Mystery" />
<i-chip label="Thriller" [removable]="true" (onRemove)="onChipRemove($event)" />
<i-chip label="Apple" icon="pi pi-apple" />`,

    chipsInput: `// 1. Import required modules and component
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { IChips } from 'invensys-angular-shared/components/chips/chips.component';

// 2. Create your form
form = this.fb.group({
  tags: [['angular', 'typescript']]
});

// 3. Use in template with enhanced features
<form [formGroup]="form">
  <i-chips
    label="Tags"
    placeholder="Enter tags and press Enter"
    formControlName="tags"
    [showClear]="true"
    [fluid]="true">
  </i-chips>
</form>`,

    validation: `// With validation and clear functionality
form = this.fb.group({
  requiredTags: [[], [Validators.required, this.minArrayLengthValidator(2)]]
});

<form [formGroup]="form">
  <i-chips
    label="Required Tags"
    placeholder="Enter at least 2 tags"
    formControlName="requiredTags"
    [showClear]="true"
    [fluid]="true">
  </i-chips>
  @if (form.get('requiredTags')?.invalid && form.get('requiredTags')?.touched) {
    <div class="error-message">At least 2 tags are required</div>
  }
</form>`,
  };

  // Chip examples data
  chipExamples = [
    { label: 'Action' },
    { label: 'Comedy' },
    { label: 'Mystery' },
    { label: 'Thriller', removable: true },
    { label: 'Apple', icon: 'pi pi-apple' },
  ];

  features = [
    {
      title: 'Basic Chips',
      description: 'Display static information as compact chips',
    },
    {
      title: 'Removable Chips',
      description: 'Chips with remove functionality',
    },
    {
      title: 'Icon Support',
      description: 'Chips can display icons (using PrimeIcons)',
    },
    {
      title: 'Chips Input',
      description: 'Interactive input for creating multiple chips/tags',
    },
    {
      title: 'Reactive Forms',
      description: 'Full integration with Angular reactive forms',
    },
    {
      title: 'Float Labels',
      description:
        'PrimeNG-style float label support with input-text integration',
    },
    {
      title: 'Validation',
      description: 'Works with Angular form validators',
    },
    {
      title: 'Clear All',
      description: 'Clear all chips at once with a single click',
    },
    {
      title: 'Fluid Layout',
      description: 'Responsive width adjustment to container',
    },
    {
      title: 'Keyboard Support',
      description: 'Enter, Tab, and Backspace key handling',
    },
    {
      title: 'Paste Support',
      description: 'Parse multiple values from clipboard',
    },
  ];

  constructor(private fb: FormBuilder) {
    this.basicForm = this.fb.group({
      tags: [['angular', 'typescript']],
    });

    this.validationForm = this.fb.group({
      requiredTags: [
        [],
        [Validators.required, this.minArrayLengthValidator(2)],
      ],
    });
  }

  ngOnInit() {}

  onChipRemove(event: Event) {
    console.log('Chip removed:', event);
  }

  onSubmit(form: FormGroup, formName: string) {
    if (form.valid) {
      console.log(`${formName} form submitted:`, form.value);
    } else {
      this.markFormGroupTouched(form);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  private minArrayLengthValidator(minLength: number) {
    return (control: any) => {
      const value = control.value;
      if (!value || !Array.isArray(value) || value.length < minLength) {
        return {
          minArrayLength: {
            requiredLength: minLength,
            actualLength: value?.length || 0,
          },
        };
      }
      return null;
    };
  }
}
