import { Component } from '@angular/core';
import { IInputText } from '../../../../../integra-ng/src/lib/components/input-text/input-text.component';
import { IButton } from '../../../../../integra-ng/src/lib/components/button/button.component';

@Component({
  selector: 'app-input-autofill-test',
  standalone: true,
  imports: [IInputText, IButton],
  templateUrl: './input-autofill-test.component.html',
  styleUrl: './input-autofill-test.component.scss',
})
export class InputAutofillTestComponent {}
