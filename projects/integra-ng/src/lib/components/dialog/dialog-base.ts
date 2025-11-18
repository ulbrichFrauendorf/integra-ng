import { Input, Output, EventEmitter, Directive } from '@angular/core';

export type DialogBreakpoints = Record<string, string>;
export type DialogContentStyle = Record<string, string | number>;

@Directive()
export abstract class AbstractDialog {
  @Input() header?: string;
  @Input() width: string = '50rem';
  @Input() height?: string;
  @Input() closable: boolean = true;
  @Input() modal: boolean = true;
  @Input() contentStyle?: DialogContentStyle;
  @Input() breakpoints?: DialogBreakpoints;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
}
