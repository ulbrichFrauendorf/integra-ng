import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IChip } from '@shared/components/chip/chip.component';
import { DemoCardComponent } from '../demo-card/demo-card.component';

@Component({
  selector: 'app-chips',
  standalone: true,
  imports: [CommonModule, IChip, DemoCardComponent],
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
})
export class ChipsComponent implements OnInit {
  // Code examples organized by category
  codeExamples = {
    basicChips: `<i-chip label="Action" />
<i-chip label="Comedy" />
<i-chip label="Mystery" />
<i-chip label="Thriller" [removable]="true" (onRemove)="onChipRemove($event)" />
<i-chip label="Apple" icon="pi pi-apple" />`,
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
  ];

  constructor() {}

  ngOnInit() {}

  onChipRemove(event: Event) {
    console.log('Chip removed:', event);
  }
}
