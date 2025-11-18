import { ISeverity } from '@shared/enums/IButtonSeverity';
import { IPosition } from '@shared/enums/IPosition';

export interface IWhisperMessage {
  id?: string;
  severity: ISeverity;
  summary: string;
  detail?: string;
  key?: string;
  life?: number;
  sticky?: boolean;
  closable?: boolean;
  data?: any;
}

export interface IWhisperOptions {
  position?: IPosition;
  preventOpenDuplicates?: boolean;
  preventDuplicates?: boolean;
}
