import { Component } from '@angular/core';
import { ITabs } from '../../../../../integra-ng/src/lib/components/tabs/tabs.component';
import { ITabPanel } from '../../../../../integra-ng/src/lib/components/tabs/tab-panel.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';

@Component({
  selector: 'app-tabs',
  imports: [ITabs, ITabPanel, DemoCardComponent, FeaturesListComponent],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  // Active tab indices for each demo
  iconTextTabIndex = 0;
  iconOnlyTabIndex = 0;
  textOnlyTabIndex = 0;
  closableTabIndex = 0;

  // Closable tabs state
  closableTabs = [
    { header: 'Dashboard', icon: 'pi pi-home', content: 'Dashboard content' },
    { header: 'Reports', icon: 'pi pi-chart-bar', content: 'Reports content' },
    { header: 'Settings', icon: 'pi pi-cog', content: 'Settings content' },
  ];

  // Code examples
  codeExamples = {
    iconText: `<i-tabs [(activeIndex)]="activeTab">
  <i-tab-panel header="Home" icon="pi pi-home">
    <p>Home content</p>
  </i-tab-panel>
  <i-tab-panel header="Profile" icon="pi pi-user">
    <p>Profile content</p>
  </i-tab-panel>
  <i-tab-panel header="Settings" icon="pi pi-cog">
    <p>Settings content</p>
  </i-tab-panel>
</i-tabs>`,

    iconOnly: `<i-tabs [(activeIndex)]="activeTab">
  <i-tab-panel icon="pi pi-home">
    <p>Home content</p>
  </i-tab-panel>
  <i-tab-panel icon="pi pi-user">
    <p>Profile content</p>
  </i-tab-panel>
  <i-tab-panel icon="pi pi-cog">
    <p>Settings content</p>
  </i-tab-panel>
</i-tabs>`,

    textOnly: `<i-tabs [(activeIndex)]="activeTab">
  <i-tab-panel header="Tab 1">
    <p>Tab 1 content</p>
  </i-tab-panel>
  <i-tab-panel header="Tab 2">
    <p>Tab 2 content</p>
  </i-tab-panel>
  <i-tab-panel header="Tab 3" [disabled]="true">
    <p>Tab 3 content (disabled)</p>
  </i-tab-panel>
</i-tabs>`,

    closable: `<i-tabs [(activeIndex)]="activeTab" (onClose)="onTabClose($event)">
  @for (tab of tabs; track $index) {
    <i-tab-panel [header]="tab.header" [icon]="tab.icon" [closable]="true">
      <p>{{ tab.content }}</p>
    </i-tab-panel>
  }
</i-tabs>`,
  };

  // TypeScript initialization example
  initializationCode = `import { ITabs, ITabPanel } from 'integra-ng';

@Component({
  selector: 'app-example',
  imports: [ITabs, ITabPanel],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  activeTab = 0;
  
  onTabChange(event: { originalEvent: Event, index: number }) {
    console.log('Tab changed to:', event.index);
  }
}`;

  features: Feature[] = [
    {
      title: 'Multiple Display Modes',
      description: 'Icon only, text only, or icon + text tabs',
    },
    {
      title: 'Keyboard Navigation',
      description: 'Arrow keys, Enter/Space for tab selection',
    },
    {
      title: 'Two-way Binding',
      description: 'Use [(activeIndex)] for reactive tab control',
    },
    {
      title: 'Disabled Tabs',
      description: 'Individual tabs can be disabled',
    },
    {
      title: 'Closable Tabs',
      description: 'Optional close button for removable tabs',
    },
    {
      title: 'Accessibility',
      description: 'ARIA attributes and proper focus management',
    },
    {
      title: 'Theming',
      description: 'Supports light and dark themes via CSS variables',
    },
    {
      title: 'Events',
      description: 'onChange and onClose event callbacks',
    },
  ];

  onTabClose(event: { originalEvent: Event; index: number }) {
    this.closableTabs.splice(event.index, 1);
    // Adjust active index if needed
    if (this.closableTabIndex >= this.closableTabs.length) {
      this.closableTabIndex = Math.max(0, this.closableTabs.length - 1);
    }
  }

  resetClosableTabs() {
    this.closableTabs = [
      { header: 'Dashboard', icon: 'pi pi-home', content: 'Dashboard content' },
      { header: 'Reports', icon: 'pi pi-chart-bar', content: 'Reports content' },
      { header: 'Settings', icon: 'pi pi-cog', content: 'Settings content' },
    ];
    this.closableTabIndex = 0;
  }
}
