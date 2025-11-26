import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMessage } from '../../../../../integra-ng/src/lib/components/message/message.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, IMessage, DemoCardComponent, FeaturesListComponent],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent {
  // Message visibility state for closable demo
  showClosableInfo = true;
  showClosableWarning = true;

  // Code examples
  codeExamples = {
    basic: `<i-message severity="info">
  All components automatically use these CSS variables,
  so changing the theme is as simple as switching the body class!
</i-message>

<i-message severity="warning">
  Important: Use the exact variable names shown above.
</i-message>

<i-message severity="success">
  That's it! Your app now supports light and dark themes.
</i-message>`,

    customIcon: `<i-message severity="primary" icon="pi pi-star">
  Pro Tip: You can customize these colors to match your brand.
</i-message>`,

    closable: `<i-message severity="info" [closable]="true">
  This message can be closed by clicking the X button.
</i-message>`,

    allSeverities: `<i-message severity="success">
  Success message - Operation completed successfully
</i-message>

<i-message severity="info">
  Info message - Here is some helpful information
</i-message>

<i-message severity="warning">
  Warning message - Please review before proceeding
</i-message>

<i-message severity="danger">
  Error message - Something went wrong
</i-message>

<i-message severity="primary">
  Primary message - Important information
</i-message>`,
  };

  features: Feature[] = [
    {
      title: 'Multiple Severities',
      description: 'Success, info, warning, danger, primary, secondary, and contrast message types',
    },
    {
      title: 'Custom Icons',
      description: 'Override default icons with PrimeIcons',
    },
    {
      title: 'Closable Messages',
      description: 'Optional close button for dismissible messages',
    },
    {
      title: 'Flexible Content',
      description: 'Use ng-content for any HTML content inside messages',
    },
    {
      title: 'Themed',
      description: 'Automatically adapts to light and dark themes',
    },
    {
      title: 'Accessible',
      description: 'Includes proper ARIA role for screen readers',
    },
  ];

  resetClosableMessages(): void {
    this.showClosableInfo = true;
    this.showClosableWarning = true;
  }
}
