import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/components/layout/layout.component';
import { AccordionsComponent } from './components/accordions/accordions.component';
import { ButtonsComponent } from './components/buttons/buttons.component';
import { InputTextsComponent } from './components/input-texts/input-texts.component';
import { CalendarsComponent } from './components/calendars/calendars.component';
import { CardsComponent } from './components/cards/cards.component';
import { DialogsComponent } from './components/dialogs/dialogs.component';
import { ConfirmationDialogsComponent } from './components/confirmation-dialogs/confirmation-dialogs.component';
import { TooltipsComponent } from './components/tooltips/tooltips.component';
import { MultiSelectsComponent } from './components/multi-selects/multi-selects.component';
import { SelectsComponent } from './components/selects/selects.component';
import { ChipsComponent } from './components/chips/chips.component';
import { ListboxesComponent } from './components/listboxes/listboxes.component';
import { MessagesComponent } from './components/messages/messages.component';
import { WhispersComponent } from './components/whispers/whispers.component';
import { CheckboxesComponent } from './components/checkboxes/checkboxes.component';
import { RadioButtonsComponent } from './components/radio-buttons/radio-buttons.component';
import { TreeViewsComponent } from './components/tree-views/tree-views.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { InstallationComponent } from './components/installation/installation.component';
import { ThemingComponent } from './components/theming/theming.component';
import { TablesComponent } from './components/tables/tables.component';
import { PanelsComponent } from './components/panels/panels.component';
import { PlaceholdersComponent } from './components/placeholders/placeholders.component';
import { ChartsComponent } from './components/charts/charts.component';
import { ComponentInteractionsComponent } from './components/component-interactions/component-interactions.component';
import { LayoutsComponent } from './components/layouts/layouts.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'getting-started/installation',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'getting-started',
        children: [
          { path: 'installation', component: InstallationComponent },
          { path: 'theming', component: ThemingComponent },
          { path: '', redirectTo: 'installation', pathMatch: 'full' },
        ],
      },
      {
        path: 'components',
        children: [
          { path: 'accordions', component: AccordionsComponent },
          { path: 'buttons', component: ButtonsComponent },
          { path: 'calendars', component: CalendarsComponent },
          { path: 'checkboxes', component: CheckboxesComponent },
          { path: 'radio-buttons', component: RadioButtonsComponent },
          { path: 'input-texts', component: InputTextsComponent },
          { path: 'cards', component: CardsComponent },
          { path: 'dialogs', component: DialogsComponent },
          {
            path: 'confirmation-dialogs',
            component: ConfirmationDialogsComponent,
          },
          { path: 'tooltips', component: TooltipsComponent },
          { path: 'selects', component: SelectsComponent },
          { path: 'multi-selects', component: MultiSelectsComponent },
          { path: 'chips', component: ChipsComponent },
          { path: 'listboxes', component: ListboxesComponent },
          { path: 'messages', component: MessagesComponent },
          { path: 'panels', component: PanelsComponent },
          { path: 'placeholders', component: PlaceholdersComponent },
          { path: 'tree-views', component: TreeViewsComponent },
          { path: 'tabs', component: TabsComponent },
          { path: 'whispers', component: WhispersComponent },
          { path: 'tables', component: TablesComponent },
          { path: 'charts', component: ChartsComponent },
          {
            path: 'component-interactions',
            component: ComponentInteractionsComponent,
          },
          { path: 'layouts', component: LayoutsComponent },
          { path: '', redirectTo: 'installation', pathMatch: 'full' },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'getting-started/installation' },
];
