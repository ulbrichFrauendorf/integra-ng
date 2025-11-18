import { inject, InjectionToken } from '@angular/core';
import { LayoutService } from './app.layout.service';


export const COLOR_SCHEME = new InjectionToken('COLOR_SCHEME', {
  providedIn: 'root',
  factory: () => {
    const layoutService = inject(LayoutService);
    return layoutService.colorScheme;
  },
});