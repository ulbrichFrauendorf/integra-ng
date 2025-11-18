import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { ICard } from '../../../../../integra-ng/src/lib/components/card/card.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import { IDialogActions } from '@shared/components/dialog/inner/dialog-actions/dialog-actions.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'i-cards',
  imports: [ICard, DemoCardComponent, IDialogActions, FeaturesListComponent],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
})
export class CardsComponent {
  private cdr = inject(ChangeDetectorRef);
  
  onSubmit() {
    throw new Error('Method not implemented.');
  }
  onCancel() {
    throw new Error('Method not implemented.');
  }
  showClosableCard = true;

  // Code examples organized by category
  codeExamples = {
    basic: `
<i-card [title]="'Card Title'" sub[title]="'Optional subtitle'">
  <p>This is the card content in the body section.</p>
</i-card>`,

    withFooter: `<i-card [title]="'Card with Actions'">
  <p>This card includes footer content.</p>
  <div slot="footer">
    <i-button severity="primary">Action</i-button>
  </div>
</i-card>`,

    customHeader: `<i-card>
  <div slot="header">
    <h3>Custom Header Content</h3>
  </div>
  <p>Using the header slot for custom content.</p>
</i-card>`,

    contentOnly: `<i-card>
  <p>Simple card with just content, no title or footer.</p>
</i-card>`,

    closable: `<i-card
  [title]="'Closable Card'"
  [closable]="true"
  (closeCard)="onCardClosed()"
>
  <p>This card can be closed using the X button.</p>
</i-card>`,
  };

  features: Feature[] = [
    {
      title: 'Flexible Content',
      description:
        'Support for title, subtitle, body, header, and footer slots',
    },
    {
      title: 'Closable Cards',
      description: 'Optional close button with custom close event handling',
    },
    {
      title: 'Custom Headers',
      description: 'Use header slot for custom header content and layouts',
    },
    {
      title: 'Footer Actions',
      description: 'Footer slot for buttons and action elements',
    },
    {
      title: 'Minimal Design',
      description: 'Clean card design that fits any content',
    },
    {
      title: 'Responsive',
      description: 'Adapts to different screen sizes and containers',
    },
    {
      title: 'Theme Integration',
      description: 'Consistent styling with design system',
    },
    {
      title: 'Accessibility',
      description: 'Proper semantic structure and ARIA support',
    },
  ];

  onCardClosed() {
    this.showClosableCard = false;
    this.cdr.detectChanges();
    console.log('Card closed, will reappear in 3 seconds');
    
    // Reset after 3 seconds for demo purposes
    setTimeout(() => {
      this.showClosableCard = true;
      this.cdr.detectChanges();
      console.log('Card reshown');
    }, 3000);
  }
}
