import { Input, Output, EventEmitter, Directive } from '@angular/core';

export type DialogBreakpoints = Record<
  string,
  { width?: string; height?: string }
>;
export type DialogContentStyle = Record<string, string | number>;

@Directive()
export abstract class AbstractDialog {
  @Input() header?: string;
  @Input() width: string = '800px';
  @Input() height?: string;
  @Input() closable: boolean = true;
  @Input() modal: boolean = true;
  @Input() contentStyle?: DialogContentStyle;
  @Input() breakpoints?: DialogBreakpoints;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
}
