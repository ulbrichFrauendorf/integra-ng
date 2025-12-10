import { Component } from '@angular/core';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';
import { IButton } from '@shared/components/button/button.component';
import { IOverlayPanel } from '@shared/components/overlay-panel/overlay-panel.component';

@Component({
  selector: 'app-overlay-panels',
  imports: [IButton, IOverlayPanel, DemoCardComponent, FeaturesListComponent],
  templateUrl: './overlay-panels.component.html',
  styleUrls: ['./overlay-panels.component.scss', '../shared-demo-styles.scss'],
})
export class OverlayPanelsComponent {
  // Code examples organized by category
  codeExamples = {
    basic: `<!-- Basic overlay panel -->
<i-button (clicked)="panel.toggle($event)">Toggle Panel</i-button>
<i-overlay-panel #panel>
  <p>This is the content of the overlay panel.</p>
  <p>It positions itself automatically relative to the button.</p>
</i-overlay-panel>`,

    positions: `<!-- Bottom (default) -->
<i-button (clicked)="bottomPanel.toggle($event)">Bottom</i-button>
<i-overlay-panel #bottomPanel position="bottom">
  <p>Panel appears below the button</p>
</i-overlay-panel>

<!-- Top -->
<i-button (clicked)="topPanel.toggle($event)">Top</i-button>
<i-overlay-panel #topPanel position="top">
  <p>Panel appears above the button</p>
</i-overlay-panel>

<!-- Left -->
<i-button (clicked)="leftPanel.toggle($event)">Left</i-button>
<i-overlay-panel #leftPanel position="left">
  <p>Panel appears to the left</p>
</i-overlay-panel>

<!-- Right -->
<i-button (clicked)="rightPanel.toggle($event)">Right</i-button>
<i-overlay-panel #rightPanel position="right">
  <p>Panel appears to the right</p>
</i-overlay-panel>

<!-- Auto (collision detection) -->
<i-button (clicked)="autoPanel.toggle($event)">Auto</i-button>
<i-overlay-panel #autoPanel position="auto">
  <p>Panel automatically chooses the best position</p>
</i-overlay-panel>`,

    closeButton: `<!-- With close button -->
<i-button (clicked)="panelWithClose.toggle($event)">Open Panel</i-button>
<i-overlay-panel #panelWithClose [showCloseButton]="true">
  <h3>Panel with Close Button</h3>
  <p>Click the X button to close this panel.</p>
</i-overlay-panel>`,

    dismissable: `<!-- Non-dismissable panel -->
<i-button (clicked)="persistentPanel.toggle($event)">Persistent Panel</i-button>
<i-overlay-panel #persistentPanel [dismissable]="false" [showCloseButton]="true">
  <p>This panel won't close when clicking outside.</p>
  <p>Use the close button or toggle button to close it.</p>
</i-overlay-panel>`,

    richContent: `<!-- Panel with rich content -->
<i-button (clicked)="richPanel.toggle($event)">Show User Menu</i-button>
<i-overlay-panel #richPanel [showCloseButton]="true">
  <div class="user-menu">
    <div class="user-header">
      <i class="pi pi-user"></i>
      <div>
        <strong>John Doe</strong>
        <div class="user-email">john.doe@example.com</div>
      </div>
    </div>
    <div class="menu-items">
      <i-button [text]="true" [fluid]="true" icon="pi pi-user">Profile</i-button>
      <i-button [text]="true" [fluid]="true" icon="pi pi-cog">Settings</i-button>
      <i-button [text]="true" [fluid]="true" icon="pi pi-sign-out" severity="danger">Logout</i-button>
    </div>
  </div>
</i-overlay-panel>`,
  };

  features: Feature[] = [
    {
      title: 'Auto Positioning',
      description:
        'Automatically positions itself to avoid viewport overflow with collision detection',
    },
    {
      title: 'Manual Positioning',
      description:
        'Support for top, bottom, left, and right positioning relative to trigger element',
    },
    {
      title: 'Arrow Indicator',
      description:
        'Visual arrow pointer connecting panel to its trigger element',
    },
    {
      title: 'Dismissable',
      description: 'Click outside or press Escape to close (configurable)',
    },
    {
      title: 'Close Button',
      description: 'Optional close button in top-right corner',
    },
    {
      title: 'Rich Content',
      description:
        'Supports any content via ng-content including forms, menus, and other components',
    },
    {
      title: 'Keyboard Support',
      description: 'Escape key closes the panel when dismissable',
    },
    {
      title: 'Theme Integration',
      description: 'Seamlessly integrates with light and dark themes',
    },
  ];
}
