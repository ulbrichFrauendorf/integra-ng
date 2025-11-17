import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IInputText } from '@shared/components/input-text/input-text.component';
import { IButton } from '@shared/components/button/button.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';

interface InputExample {
  label: string;
  type: string;
  placeholder?: string;
  fluid?: boolean;
  disabled?: boolean;
  formControlName: string;
}

@Component({
  selector: 'app-input-texts',
  imports: [IInputText, IButton, ReactiveFormsModule, DemoCardComponent],
  templateUrl: './input-texts.component.html',
  styleUrl: './input-texts.component.scss',
})
export class InputTextsComponent implements OnInit {
  basicForm: FormGroup;
  validationForm: FormGroup;
  fluidForm: FormGroup;

  // Organized input examples by category
  inputExamples = {
    basic: [
      { label: 'Text Input', type: 'text', formControlName: 'textInput' },
      { label: 'Email Input', type: 'email', formControlName: 'emailInput' },
      {
        label: 'Password Input',
        type: 'password',
        formControlName: 'passwordInput',
      },
      { label: 'Number Input', type: 'number', formControlName: 'numberInput' },
    ],
    validation: [
      {
        label: 'Required Field',
        type: 'text',
        formControlName: 'requiredField',
      },
      {
        label: 'Min Length (5 chars)',
        type: 'text',
        formControlName: 'minLengthField',
      },
      {
        label: 'Email Validation',
        type: 'email',
        formControlName: 'emailValidation',
      },
      {
        label: 'Pattern (Letters only)',
        type: 'text',
        formControlName: 'patternField',
      },
    ],
    fluid: [
      {
        label: 'Fluid Text Input',
        type: 'text',
        formControlName: 'fluidText',
        fluid: true,
      },
      {
        label: 'Fluid Email Input',
        type: 'email',
        formControlName: 'fluidEmail',
        fluid: true,
      },
      {
        label: 'Fluid Password Input',
        type: 'password',
        formControlName: 'fluidPassword',
        fluid: true,
      },
    ],
  };

  // Code examples organized by category
  codeExamples = {
    basic: `// 1. Import required modules and component
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { IInputText } from '../../../../../invensys-angular-shared/src/lib/components/input-text/input-text.component';

// 2. Create your form
form = this.fb.group({
  textInput: [''],
  emailInput: [''],
  passwordInput: [''],
  numberInput: ['']
});

// 3. Use in template
<form [formGroup]="form">
  <i-input-text label="Text Input" type="text" formControlName="textInput" />
  <i-input-text label="Email Input" type="email" formControlName="emailInput" />
  <i-input-text label="Password Input" type="password" formControlName="passwordInput" />
  <i-input-text label="Number Input" type="number" formControlName="numberInput" />
</form>`,

    validation: `// With validation
import { Validators } from '@angular/forms';

validationForm = this.fb.group({
  requiredField: ['', [Validators.required]],
  minLengthField: ['', [Validators.minLength(5)]],
  emailValidation: ['', [Validators.required, Validators.email]],
  patternField: ['', [Validators.pattern(/^[A-Za-z]+$/)]]
});

<form [formGroup]="validationForm">
  <i-input-text label="Required Field" type="text" formControlName="requiredField" />
  <i-input-text label="Min Length (5 chars)" type="text" formControlName="minLengthField" />
  <i-input-text label="Email Validation" type="email" formControlName="emailValidation" />
  <i-input-text label="Pattern (Letters only)" type="text" formControlName="patternField" />
</form>`,

    fluid: `<i-input-text label="Fluid Text Input" type="text" formControlName="fluidText" [fluid]="true" />
<i-input-text label="Fluid Email Input" type="email" formControlName="fluidEmail" [fluid]="true" />
<i-input-text label="Fluid Password Input" type="password" formControlName="fluidPassword" [fluid]="true" />`,
  };

  features = [
    {
      title: 'Input Types',
      description: 'Text, email, password, number, tel, url, and search inputs',
    },
    {
      title: 'Float Labels',
      description: 'Animated floating labels for better UX',
    },
    {
      title: 'Validation Support',
      description: 'Built-in Angular reactive forms validation',
    },
    {
      title: 'Custom Error Messages',
      description: 'Configurable error message display',
    },
    {
      title: 'Fluid Layout',
      description: 'Full-width inputs for responsive designs',
    },
    {
      title: 'Disabled State',
      description: 'Proper disabled styling and interaction handling',
    },
    {
      title: 'Accessibility',
      description: 'ARIA attributes and screen reader support',
    },
    {
      title: 'Theme Integration',
      description: 'Consistent styling with design system',
    },
  ];

  constructor(private fb: FormBuilder) {
    this.basicForm = this.fb.group({
      textInput: [''],
      emailInput: [''],
      passwordInput: [''],
      numberInput: [''],
    });

    this.validationForm = this.fb.group({
      requiredField: ['', [Validators.required]],
      minLengthField: ['', [Validators.minLength(5)]],
      emailValidation: ['', [Validators.required, Validators.email]],
      patternField: ['', [Validators.pattern(/^[A-Za-z]+$/)]],
    });

    this.fluidForm = this.fb.group({
      fluidText: [''],
      fluidEmail: [''],
      fluidPassword: [''],
    });
  }

  ngOnInit() {
    // Demo some validation states
    setTimeout(() => {
      this.validationForm.get('requiredField')?.markAsTouched();
      this.validationForm.get('minLengthField')?.setValue('abc');
      this.validationForm.get('minLengthField')?.markAsTouched();
      this.validationForm.get('patternField')?.setValue('123invalid');
      this.validationForm.get('patternField')?.markAsTouched();
    }, 100);
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
}
