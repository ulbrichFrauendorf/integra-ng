import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { IMultiSelect } from '@shared/components/multi-select/multi-select.component';
import { IButton } from '@shared/components/button/button.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

export interface MultiSelectOption {
  value: any;
  label?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-multi-selects',
  imports: [
    IMultiSelect,
    IButton,
    ReactiveFormsModule,
    FormsModule,
    DemoCardComponent,
    FeaturesListComponent,
  ],
  templateUrl: './multi-selects.component.html',
  styleUrl: './multi-selects.component.scss',
})
export class MultiSelectsComponent implements OnInit {
  basicForm: FormGroup;
  validationForm: FormGroup;
  advancedForm: FormGroup;
  fluidForm: FormGroup;

  // NgModel examples
  skillsValue: string[] = [];
  departmentsValue: number[] = [];
  preselectedValue: string[] = ['javascript', 'angular'];

  // Sample data organized by category
  selectData = {
    skills: [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'angular', label: 'Angular' },
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue.js' },
      { value: 'nodejs', label: 'Node.js' },
      { value: 'python', label: 'Python' },
      { value: 'java', label: 'Java' },
      { value: 'csharp', label: 'C#' },
      { value: 'php', label: 'PHP' },
    ],

    departments: [
      { value: 1, label: 'Sales' },
      { value: 2, label: 'Marketing' },
      { value: 3, label: 'Engineering' },
      { value: 4, label: 'Human Resources' },
      { value: 5, label: 'Finance' },
      { value: 6, label: 'Operations' },
    ],

    categories: [
      {
        value: 'frontend',
        name: 'Frontend Development',
        description: 'User interface development',
      },
      {
        value: 'backend',
        name: 'Backend Development',
        description: 'Server-side development',
      },
      {
        value: 'mobile',
        name: 'Mobile Development',
        description: 'iOS and Android apps',
      },
      {
        value: 'devops',
        name: 'DevOps',
        description: 'Infrastructure and deployment',
      },
      {
        value: 'testing',
        name: 'Quality Assurance',
        description: 'Testing and validation',
      },
      {
        value: 'design',
        name: 'UI/UX Design',
        description: 'User experience design',
      },
    ],
  };

  // HTML Code examples organized by category
  codeExamples = {
    ngModel: `<i-multi-select
  label="Skills"
  [options]="skills"
  optionLabel="label"
  optionValue="value"
  [(ngModel)]="skillsValue"
  placeholder="Select your skills" />

<i-multi-select
  label="Departments"
  [options]="departments"
  optionLabel="label"
  optionValue="value"
  [(ngModel)]="departmentsValue"
  placeholder="Select departments" />`,

    reactiveForm: `<form [formGroup]="basicForm">
  <i-multi-select
    label="Skills"
    [options]="skills"
    optionLabel="label"
    optionValue="value"
    formControlName="skills"
    placeholder="Select your skills" />

  <i-multi-select
    label="Departments"
    [options]="departments"
    optionLabel="label"
    optionValue="value"
    formControlName="departments"
    placeholder="Select departments" />
</form>`,

    validation: `<form [formGroup]="validationForm">
  <i-multi-select
    label="Required Skills (At least 1)"
    [options]="skills"
    optionLabel="label"
    optionValue="value"
    placeholder="Select at least 1 skill"
    formControlName="requiredSkills" />

  <i-multi-select
    label="Minimum Skills (At least 2)"
    [options]="skills"
    optionLabel="label"
    optionValue="value"
    placeholder="Select at least 2 skills"
    formControlName="minimumSkills" />
</form>`,

    advanced: `<i-multi-select
  [options]="categories"
  [filter]="true"
  [showClear]="true"
  filterBy="name"
  optionLabel="name"
  optionValue="value"
  placeholder="Select Categories"
  [maxSelectedLabels]="3"
  formControlName="selectedCategories" />`,

    fluid: `<i-multi-select
  label="Fluid Multi-Select"
  [options]="skills"
  optionLabel="label"
  optionValue="value"
  [fluid]="true"
  placeholder="Select options"
  formControlName="fluidSelect" />`,
  };

  // TypeScript examples
  tsExamples = {
    ngModel: `import { FormsModule } from '@angular/forms';
import { IMultiSelect } from 'integra-ng';

@Component({
  selector: 'app-example',
  imports: [FormsModule, IMultiSelect],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  skillsValue: string[] = [];
  departmentsValue: number[] = [];
  
  skills = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'angular', label: 'Angular' }
  ];
}`,

    reactiveForm: `import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IMultiSelect } from 'integra-ng';

@Component({
  selector: 'app-example',
  imports: [ReactiveFormsModule, IMultiSelect],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  basicForm = this.fb.group({
    skills: [[]],
    departments: [[]],
    preselected: [['javascript', 'angular']]
  });

  constructor(private fb: FormBuilder) {}
}`,

    validation: `import { FormBuilder, Validators } from '@angular/forms';

validationForm = this.fb.group({
  requiredSkills: [[], [Validators.required]],
  minimumSkills: [[], [this.minArrayLengthValidator(2)]]
});

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
}`,
  };

  // Component setup
  initializationCode = `import { IMultiSelect } from 'integra-ng';

@Component({
  selector: 'app-example',
  imports: [IMultiSelect],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ];
}`;

  features: Feature[] = [
    {
      title: 'Multiple Selection',
      description: 'Select multiple options with chip-based display',
    },
    {
      title: 'Filtering',
      description: 'Built-in search functionality for large option lists',
    },
    {
      title: 'Clear Function',
      description: 'Optional clear button to reset all selections',
    },
    {
      title: 'Max Display Labels',
      description:
        'Configure how many selected items to show before truncation',
    },
    {
      title: 'Form Integration',
      description: 'Full reactive forms support with validation',
    },
    {
      title: 'Individual Removal',
      description: 'Remove individual selections via chip close buttons',
    },
    {
      title: 'Fluid Layout',
      description: 'Full-width multi-selects for responsive designs',
    },
    {
      title: 'Accessibility',
      description: 'ARIA support and keyboard navigation',
    },
  ];

  constructor(private fb: FormBuilder) {
    this.basicForm = this.fb.group({
      skills: [[]],
      departments: [[]],
      preselected: [['javascript', 'angular']],
      disabled: [{ value: [1, 2], disabled: true }],
      // New: Store full objects instead of just values
      fullObjectSkills: [[]],
    });

    this.validationForm = this.fb.group({
      requiredSkills: [[], [Validators.required]], // Just requires at least 1 selection
      minimumSkills: [[], [this.minArrayLengthValidator(2)]], // Requires at least 2 selections
    });

    this.advancedForm = this.fb.group({
      selectedCategories: [[]],
    });

    this.fluidForm = this.fb.group({
      fluidSelect: [[]],
    });
  }

  ngOnInit() {
    // Demo validation state
    setTimeout(() => {
      this.validationForm.get('requiredSkills')?.markAsTouched();
      this.validationForm.get('minimumSkills')?.markAsTouched();
    }, 100);
  }

  onSubmit(form: FormGroup, formName: string) {
    if (form.valid) {
      console.log(`${formName} form submitted:`, form.value);
    } else {
      this.markFormGroupTouched(form);
    }
  }

  onSkillsValueChange(values: any[]) {
    console.log('Skills Values Changed (optionValue="value"):', values);
    console.log('Form control value:', this.basicForm.get('skills')?.value);
    console.log('Array length:', values.length);
    console.log(
      'Types:',
      values.map((v) => typeof v)
    );
  }

  onSkillsObjectChange(values: any[]) {
    console.log('Skills Objects Changed (no optionValue):', values);
    console.log(
      'Form control value:',
      this.basicForm.get('fullObjectSkills')?.value
    );
    console.log('Array length:', values.length);
    console.log(
      'Types:',
      values.map((v) => typeof v)
    );
    console.log(
      'Object properties:',
      values.map((v) => (v ? Object.keys(v) : 'null'))
    );
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
