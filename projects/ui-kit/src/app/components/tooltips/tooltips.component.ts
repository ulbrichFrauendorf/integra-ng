import { Component } from '@angular/core';
import { TooltipDirective } from '@shared/directives/tooltip/tooltip.directive';
import { IButton } from '@shared/components/button/button.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'app-tooltips',
  imports: [
    TooltipDirective,
    IButton,
    DemoCardComponent,
    FeaturesListComponent,
  ],
  templateUrl: './tooltips.component.html',
  styleUrl: './tooltips.component.scss',
})
export class TooltipsComponent {
  // HTML Code examples organized by category
  codeExamples = {
    basic: `<i-button iTooltip="This is a tooltip above" tooltipPosition="above">Hover Above</i-button>
<i-button iTooltip="This is a tooltip below" tooltipPosition="below">Hover Below</i-button>
<i-button iTooltip="This is a tooltip to the left" tooltipPosition="left">Hover Left</i-button>
<i-button iTooltip="This is a tooltip to the right" tooltipPosition="right">Hover Right</i-button>`,

    styled: `<i-button severity="primary" iTooltip="Primary action button" tooltipPosition="above">
  Primary Button
</i-button>
<i-button severity="secondary" [outlined]="true" iTooltip="Secondary action button" tooltipPosition="below">
  Secondary Button
</i-button>
<i-button severity="success" [raised]="true" iTooltip="Success action completed" tooltipPosition="left">
  Success Button
</i-button>
<i-button severity="warning" [text]="true" iTooltip="Warning: This action requires confirmation" tooltipPosition="right">
  Warning Button
</i-button>`,

    elements: `<span iTooltip="This is a span with tooltip" tooltipPosition="above" class="tooltip-span">
  Hover over this text
</span>

<div iTooltip="This is a div container" tooltipPosition="below" class="tooltip-div">
  Hover over this box
</div>

<p iTooltip="Paragraph with helpful information" tooltipPosition="right" class="tooltip-paragraph">
  This paragraph has a tooltip. Hover to see more information about this content.
</p>`,

    timing: `<i-button iTooltip="Fast tooltip (100ms)" tooltipPosition="above" [tooltipDelay]="100">
  Fast Tooltip
</i-button>
<i-button iTooltip="Normal tooltip (500ms)" tooltipPosition="above" [tooltipDelay]="500">
  Normal Tooltip  
</i-button>
<i-button iTooltip="Slow tooltip (1000ms)" tooltipPosition="above" [tooltipDelay]="1000">
  Slow Tooltip
</i-button>`,

    longText: `<i-button iTooltip="This is a very long tooltip text that will wrap to multiple lines when the content exceeds the maximum width of the tooltip container" tooltipPosition="above">
  Long Tooltip
</i-button>
<span iTooltip="Multi-line tooltip with detailed information about this specific feature and how to use it effectively" tooltipPosition="right" class="tooltip-span">
  Detailed Info
</span>`,
  };

  // TypeScript examples
  tsExamples = {
    basic: `import { TooltipDirective } from 'integra-ng';
import { IButton } from 'integra-ng';

@Component({
  selector: 'app-example',
  imports: [TooltipDirective, IButton],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  // Component ready to use tooltips
}`,

    advanced: `// Custom tooltip configuration
@Component({
  template: \`
    <i-button 
      iTooltip="Custom tooltip" 
      tooltipPosition="above"
      [tooltipDelay]="500">
      Custom Tooltip
    </i-button>
  \`
})
export class ExampleComponent {
  // Tooltip with custom delay
}`,
  };

  // Component setup
  initializationCode = `import { TooltipDirective } from 'integra-ng';

@Component({
  selector: 'app-example',
  imports: [TooltipDirective],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  // Component ready to use
}`;

  features: Feature[] = [
    {
      title: 'Positioning Options',
      description: 'Four directional positions: above, below, left, right',
    },
    {
      title: 'Any Element Support',
      description: 'Works with buttons, spans, divs, paragraphs, and more',
    },
    {
      title: 'Custom Delays',
      description: 'Configurable show/hide timing for different use cases',
    },
    {
      title: 'Auto Text Wrapping',
      description: 'Automatic line breaks for long tooltip content',
    },
    {
      title: 'Responsive Design',
      description: 'Adapts to screen boundaries and viewport constraints',
    },
    {
      title: 'Hover & Focus',
      description: 'Triggered by both mouse hover and keyboard focus',
    },
    {
      title: 'Accessibility',
      description: 'ARIA compliant with screen reader support',
    },
    {
      title: 'Lightweight',
      description: 'Minimal performance impact with efficient rendering',
    },
  ];
}
