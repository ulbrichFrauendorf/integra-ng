# integra-ng

A comprehensive Angular component library containing reusable UI components, directives, services, and themes.

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.0.

## Components

The library includes the following components:

- **Button** - Customizable button component with various severity levels
- **Card** - Card layout component for displaying content
- **Checkbox** - Checkbox input component
- **Chip** - Chip/tag component for displaying labels
- **Confirmation Dialog** - Dialog component for user confirmations
- **Dialog** - Base dialog component for modal interactions
- **Empty State** - Component for displaying empty state UI
- **Empty State Table** - Empty state component specifically for tables
- **Input Text** - Text input component
- **Listbox** - Listbox selection component
- **Multi-Select** - Multi-select dropdown component
- **Select** - Single select dropdown component
- **Tree View** - Hierarchical tree view component
- **Whisper** - Tooltip/whisper component

## Getting Started

### Development

To view and test the components in the UI Kit showcase:

```bash
npm run start
```

This will launch the ui-kit project at `http://localhost:4200/` where you can see all available components and their usage examples.

### Code Scaffolding

To generate a new component:

```bash
ng generate component component-name --project integra-ng
```

You can also generate other artifacts:

```bash
ng generate directive|pipe|service|class|guard|interface|enum|module --project integra-ng
```

> Note: Always include `--project integra-ng` or the artifact will be added to the default project in your `angular.json` file.

## Build

To build the library:

```bash
ng build integra-ng
```

The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library:

```bash
cd dist/integra-ng
npm publish
```

## Running Unit Tests

To execute the unit tests via [Karma](https://karma-runner.github.io):

```bash
ng test integra-ng
```

## Further Help

For more information about the Angular CLI, use:

```bash
ng help
```

Or visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
