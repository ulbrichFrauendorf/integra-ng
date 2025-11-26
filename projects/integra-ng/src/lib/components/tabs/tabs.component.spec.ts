import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ITabs } from './tabs.component';
import { ITabPanel } from './tab-panel.component';

// Test host component
@Component({
  standalone: true,
  imports: [ITabs, ITabPanel],
  template: `
    <i-tabs [(activeIndex)]="activeIndex" (onChange)="onTabChange($event)">
      <i-tab-panel header="Tab 1" icon="pi pi-home">
        <p>Content 1</p>
      </i-tab-panel>
      <i-tab-panel header="Tab 2" icon="pi pi-user">
        <p>Content 2</p>
      </i-tab-panel>
      <i-tab-panel header="Tab 3" [disabled]="true">
        <p>Content 3</p>
      </i-tab-panel>
    </i-tabs>
  `,
})
class TestHostComponent {
  activeIndex = 0;
  lastChangeEvent: unknown = null;

  onTabChange(event: unknown) {
    this.lastChangeEvent = event;
  }
}

describe('ITabs', () => {
  let component: ITabs;
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let tabsElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();

    tabsElement = fixture.debugElement.query(By.directive(ITabs));
    component = tabsElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should have default activeIndex of 0', () => {
      expect(component.activeIndex).toBe(0);
    });

    it('should render all tab panels', () => {
      const tabs = fixture.debugElement.queryAll(By.css('.i-tabs__tab'));
      expect(tabs.length).toBe(3);
    });

    it('should display tab headers', () => {
      const tabLabels = fixture.debugElement.queryAll(
        By.css('.i-tabs__tab-label')
      );
      expect(tabLabels[0].nativeElement.textContent).toBe('Tab 1');
      expect(tabLabels[1].nativeElement.textContent).toBe('Tab 2');
      expect(tabLabels[2].nativeElement.textContent).toBe('Tab 3');
    });

    it('should display tab icons', () => {
      const tabIcons = fixture.debugElement.queryAll(
        By.css('.i-tabs__tab-icon')
      );
      expect(tabIcons.length).toBe(2); // Only 2 tabs have icons
      expect(tabIcons[0].nativeElement.classList.contains('pi-home')).toBe(
        true
      );
      expect(tabIcons[1].nativeElement.classList.contains('pi-user')).toBe(
        true
      );
    });
  });

  describe('Tab Selection', () => {
    it('should select first tab by default', () => {
      const tabs = fixture.debugElement.queryAll(By.css('.i-tabs__tab'));
      expect(tabs[0].nativeElement.classList.contains('i-tabs__tab--active')).toBe(true);
    });

    it('should change active tab on click', () => {
      const tabs = fixture.debugElement.queryAll(By.css('.i-tabs__tab'));
      tabs[1].nativeElement.click();
      fixture.detectChanges();

      expect(component.activeIndex).toBe(1);
      expect(hostComponent.activeIndex).toBe(1);
    });

    it('should emit onChange event when tab is selected', () => {
      const tabs = fixture.debugElement.queryAll(By.css('.i-tabs__tab'));
      tabs[1].nativeElement.click();
      fixture.detectChanges();

      expect(hostComponent.lastChangeEvent).toBeTruthy();
      expect((hostComponent.lastChangeEvent as { index: number }).index).toBe(1);
    });

    it('should not select disabled tab', () => {
      const tabs = fixture.debugElement.queryAll(By.css('.i-tabs__tab'));
      tabs[2].nativeElement.click();
      fixture.detectChanges();

      expect(component.activeIndex).toBe(0);
      expect(hostComponent.activeIndex).toBe(0);
    });
  });

  describe('Tab Content', () => {
    it('should display content of active tab', () => {
      const panels = fixture.debugElement.queryAll(By.css('.i-tabs__panel'));
      expect(panels[0].nativeElement.textContent).toContain('Content 1');
    });

    it('should hide content of inactive tabs', () => {
      const panels = fixture.debugElement.queryAll(By.css('.i-tabs__panel'));
      expect(panels[1].nativeElement.getAttribute('hidden')).toBe('true');
      expect(panels[2].nativeElement.getAttribute('hidden')).toBe('true');
    });

    it('should show content of selected tab', () => {
      const tabs = fixture.debugElement.queryAll(By.css('.i-tabs__tab'));
      tabs[1].nativeElement.click();
      fixture.detectChanges();

      const panels = fixture.debugElement.queryAll(By.css('.i-tabs__panel'));
      expect(panels[1].nativeElement.getAttribute('hidden')).toBeNull();
    });
  });

  describe('Disabled State', () => {
    it('should apply disabled class to disabled tabs', () => {
      const tabs = fixture.debugElement.queryAll(By.css('.i-tabs__tab'));
      expect(
        tabs[2].nativeElement.classList.contains('i-tabs__tab--disabled')
      ).toBe(true);
    });

    it('should set disabled attribute on disabled tabs', () => {
      const tabs = fixture.debugElement.queryAll(By.css('.i-tabs__tab'));
      expect(tabs[2].nativeElement.disabled).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have a unique component id', () => {
      expect(component.componentId).toContain('i-tabs-');
    });

    it('should set role="tablist" on header', () => {
      const header = fixture.debugElement.query(By.css('.i-tabs__header'));
      expect(header.nativeElement.getAttribute('role')).toBe('tablist');
    });

    it('should set role="tab" on tab buttons', () => {
      const tabs = fixture.debugElement.queryAll(By.css('.i-tabs__tab'));
      tabs.forEach((tab) => {
        expect(tab.nativeElement.getAttribute('role')).toBe('tab');
      });
    });

    it('should set role="tabpanel" on content panels', () => {
      const panels = fixture.debugElement.queryAll(By.css('.i-tabs__panel'));
      panels.forEach((panel) => {
        expect(panel.nativeElement.getAttribute('role')).toBe('tabpanel');
      });
    });

    it('should set aria-selected on active tab', () => {
      const tabs = fixture.debugElement.queryAll(By.css('.i-tabs__tab'));
      expect(tabs[0].nativeElement.getAttribute('aria-selected')).toBe('true');
      expect(tabs[1].nativeElement.getAttribute('aria-selected')).toBe('false');
    });

    it('should set tabindex appropriately', () => {
      const tabs = fixture.debugElement.queryAll(By.css('.i-tabs__tab'));
      expect(tabs[0].nativeElement.getAttribute('tabindex')).toBe('0');
      expect(tabs[2].nativeElement.getAttribute('tabindex')).toBe('-1'); // Disabled
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate to next tab on ArrowRight', () => {
      const tabs = fixture.debugElement.queryAll(By.css('.i-tabs__tab'));
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });

      spyOn(tabs[1].nativeElement, 'focus');
      tabs[0].nativeElement.dispatchEvent(event);

      expect(tabs[1].nativeElement.focus).toHaveBeenCalled();
    });

    it('should navigate to previous tab on ArrowLeft', () => {
      const tabs = fixture.debugElement.queryAll(By.css('.i-tabs__tab'));

      // First select tab 1
      tabs[1].nativeElement.click();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      spyOn(tabs[0].nativeElement, 'focus');
      tabs[1].nativeElement.dispatchEvent(event);

      expect(tabs[0].nativeElement.focus).toHaveBeenCalled();
    });

    it('should select tab on Enter', () => {
      const tabs = fixture.debugElement.queryAll(By.css('.i-tabs__tab'));

      // Focus second tab
      tabs[1].nativeElement.focus();
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      tabs[1].nativeElement.dispatchEvent(event);
      fixture.detectChanges();

      expect(component.activeIndex).toBe(1);
    });

    it('should select tab on Space', () => {
      const tabs = fixture.debugElement.queryAll(By.css('.i-tabs__tab'));

      // Focus second tab
      tabs[1].nativeElement.focus();
      const event = new KeyboardEvent('keydown', { key: ' ' });
      tabs[1].nativeElement.dispatchEvent(event);
      fixture.detectChanges();

      expect(component.activeIndex).toBe(1);
    });

    it('should skip disabled tabs during navigation', () => {
      // Tab 2 (index 2) is disabled, navigating right from Tab 1 should wrap
      const tabs = fixture.debugElement.queryAll(By.css('.i-tabs__tab'));

      tabs[1].nativeElement.click();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      spyOn(tabs[0].nativeElement, 'focus');
      tabs[1].nativeElement.dispatchEvent(event);

      // Should wrap to first tab since third is disabled
      expect(tabs[0].nativeElement.focus).toHaveBeenCalled();
    });
  });
});

describe('ITabPanel', () => {
  let component: ITabPanel;
  let fixture: ComponentFixture<ITabPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITabPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(ITabPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.header).toBeUndefined();
      expect(component.icon).toBeUndefined();
      expect(component.disabled).toBe(false);
      expect(component.closable).toBe(false);
    });

    it('should accept header input', () => {
      component.header = 'Test Header';
      fixture.detectChanges();
      expect(component.header).toBe('Test Header');
    });

    it('should accept icon input', () => {
      component.icon = 'pi pi-home';
      fixture.detectChanges();
      expect(component.icon).toBe('pi pi-home');
    });

    it('should accept disabled input', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(component.disabled).toBe(true);
    });

    it('should accept closable input', () => {
      component.closable = true;
      fixture.detectChanges();
      expect(component.closable).toBe(true);
    });
  });

  describe('Component ID', () => {
    it('should have a unique component id', () => {
      expect(component.componentId).toContain('i-tab-panel-');
    });
  });
});

// Test for icon-only and text-only tabs
@Component({
  standalone: true,
  imports: [ITabs, ITabPanel],
  template: `
    <i-tabs [(activeIndex)]="activeIndex">
      <i-tab-panel icon="pi pi-home">
        <p>Icon only content</p>
      </i-tab-panel>
      <i-tab-panel header="Text Only">
        <p>Text only content</p>
      </i-tab-panel>
    </i-tabs>
  `,
})
class IconTextTestComponent {
  activeIndex = 0;
}

describe('ITabs Icon and Text Modes', () => {
  let fixture: ComponentFixture<IconTextTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconTextTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconTextTestComponent);
    fixture.detectChanges();
  });

  it('should render icon-only tab', () => {
    const tabs = fixture.debugElement.queryAll(By.css('.i-tabs__tab'));
    expect(
      tabs[0].nativeElement.classList.contains('i-tabs__tab--icon-only')
    ).toBe(true);

    const icon = tabs[0].query(By.css('.i-tabs__tab-icon'));
    expect(icon).toBeTruthy();

    const label = tabs[0].query(By.css('.i-tabs__tab-label'));
    expect(label).toBeFalsy();
  });

  it('should render text-only tab', () => {
    const tabs = fixture.debugElement.queryAll(By.css('.i-tabs__tab'));
    expect(
      tabs[1].nativeElement.classList.contains('i-tabs__tab--icon-only')
    ).toBe(false);

    const icon = tabs[1].query(By.css('.i-tabs__tab-icon'));
    expect(icon).toBeFalsy();

    const label = tabs[1].query(By.css('.i-tabs__tab-label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent).toBe('Text Only');
  });
});

// Test for closable tabs
@Component({
  standalone: true,
  imports: [ITabs, ITabPanel],
  template: `
    <i-tabs [(activeIndex)]="activeIndex" (onClose)="onTabClose($event)">
      <i-tab-panel header="Tab 1" [closable]="true">
        <p>Content 1</p>
      </i-tab-panel>
      <i-tab-panel header="Tab 2">
        <p>Content 2</p>
      </i-tab-panel>
    </i-tabs>
  `,
})
class ClosableTestComponent {
  activeIndex = 0;
  closeEvent: unknown = null;

  onTabClose(event: unknown) {
    this.closeEvent = event;
  }
}

describe('ITabs Closable Tabs', () => {
  let fixture: ComponentFixture<ClosableTestComponent>;
  let hostComponent: ClosableTestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClosableTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClosableTestComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render close button for closable tabs', () => {
    const closeButtons = fixture.debugElement.queryAll(
      By.css('.i-tabs__tab-close')
    );
    expect(closeButtons.length).toBe(1);
  });

  it('should emit onClose event when close button is clicked', () => {
    const closeButton = fixture.debugElement.query(By.css('.i-tabs__tab-close'));
    closeButton.nativeElement.click();
    fixture.detectChanges();

    expect(hostComponent.closeEvent).toBeTruthy();
    expect((hostComponent.closeEvent as { index: number }).index).toBe(0);
  });

  it('should not change active tab when close button is clicked', () => {
    const closeButton = fixture.debugElement.query(By.css('.i-tabs__tab-close'));
    closeButton.nativeElement.click();
    fixture.detectChanges();

    expect(hostComponent.activeIndex).toBe(0);
  });
});
