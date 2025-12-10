import { Component } from '@angular/core';

import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';
import {
  FilterEvent,
  ITable,
  SortEvent,
  TableAction,
  TableColumn,
  TableGroup,
  TableDownloadEvent,
} from '@shared/components/table/table.component';
import { IWhisper } from '../../../../../integra-ng/src/lib/components/whisper/whisper.component';
import { WhisperService } from '../../../../../integra-ng/src/lib/components/whisper/services/whisper.service';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  status: string;
  date: string;
}

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [ITable, DemoCardComponent, FeaturesListComponent, IWhisper],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss',
})
export class TablesComponent {
  constructor(private whisperService: WhisperService) {}

  // Empty data for empty state demo
  emptyProducts: Product[] = [];

  // Sample product data
  products: Product[] = [
    {
      id: 1,
      name: 'Laptop Pro',
      category: 'Electronics',
      price: 1299.99,
      quantity: 50,
      status: 'In Stock',
      date: '2024-01-15',
    },
    {
      id: 2,
      name: 'Wireless Mouse',
      category: 'Accessories',
      price: 29.99,
      quantity: 200,
      status: 'In Stock',
      date: '2024-02-20',
    },
    {
      id: 3,
      name: 'Mechanical Keyboard',
      category: 'Accessories',
      price: 149.99,
      quantity: 75,
      status: 'Low Stock',
      date: '2024-03-10',
    },
    {
      id: 4,
      name: 'Monitor 27"',
      category: 'Electronics',
      price: 399.99,
      quantity: 30,
      status: 'In Stock',
      date: '2024-04-05',
    },
    {
      id: 5,
      name: 'USB Hub',
      category: 'Accessories',
      price: 24.99,
      quantity: 150,
      status: 'In Stock',
      date: '2024-05-25',
    },
    {
      id: 6,
      name: 'Webcam HD',
      category: 'Electronics',
      price: 79.99,
      quantity: 0,
      status: 'Out of Stock',
      date: '2024-06-12',
    },
    {
      id: 7,
      name: 'Headphones',
      category: 'Audio',
      price: 199.99,
      quantity: 45,
      status: 'In Stock',
      date: '2024-07-18',
    },
    {
      id: 8,
      name: 'External SSD',
      category: 'Storage',
      price: 89.99,
      quantity: 100,
      status: 'In Stock',
      date: '2024-08-22',
    },
    {
      id: 9,
      name: 'Desk Lamp',
      category: 'Office',
      price: 34.99,
      quantity: 85,
      status: 'In Stock',
      date: '2024-09-05',
    },
    {
      id: 10,
      name: 'Monitor Stand',
      category: 'Office',
      price: 59.99,
      quantity: 60,
      status: 'In Stock',
      date: '2024-10-10',
    },
    {
      id: 11,
      name: 'Tablet 10"',
      category: 'Electronics',
      price: 449.99,
      quantity: 25,
      status: 'Low Stock',
      date: '2024-11-02',
    },
    {
      id: 12,
      name: 'Bluetooth Speaker',
      category: 'Audio',
      price: 69.99,
      quantity: 120,
      status: 'In Stock',
      date: '2024-12-15',
    },
  ];

  // Basic table columns
  basicColumns: TableColumn[] = [
    { field: 'name', header: 'Product Name' },
    { field: 'category', header: 'Category' },
    { field: 'price', header: 'Price', type: 'currency' },
    { field: 'quantity', header: 'Quantity', type: 'number' },
  ];

  // Sortable columns
  sortableColumns: TableColumn[] = [
    { field: 'name', header: 'Product Name', sortable: true },
    { field: 'category', header: 'Category', sortable: true },
    { field: 'price', header: 'Price', type: 'currency', sortable: true },
    { field: 'quantity', header: 'Quantity', type: 'number', sortable: true },
    { field: 'status', header: 'Status', sortable: true },
  ];

  // Filterable columns
  filterableColumns: TableColumn[] = [
    { field: 'name', header: 'Product Name', sortable: true, filterable: true },
    { field: 'category', header: 'Category', sortable: true, filterable: true },
    {
      field: 'price',
      header: 'Price',
      type: 'currency',
      sortable: true,
      filterable: true,
    },
    { field: 'status', header: 'Status', sortable: true, filterable: true },
  ];

  // Full featured columns
  fullColumns: TableColumn[] = [
    {
      field: 'id',
      header: 'ID',
      width: '80px',
      align: 'center',
      sortable: true,
    },
    { field: 'name', header: 'Product Name', sortable: true, filterable: true },
    { field: 'category', header: 'Category', sortable: true, filterable: true },
    {
      field: 'price',
      header: 'Price',
      type: 'currency',
      align: 'right',
      sortable: true,
    },
    {
      field: 'quantity',
      header: 'Qty',
      type: 'number',
      width: '100px',
      align: 'center',
      sortable: true,
    },
    { field: 'status', header: 'Status', sortable: true },
    { field: 'date', header: 'Date', type: 'date', sortable: true },
  ];

  // Table actions
  tableActions: TableAction[] = [
    { id: 'view', icon: 'pi pi-eye', severity: 'info' },
    { id: 'edit', icon: 'pi pi-pencil', severity: 'warning' },
    {
      id: 'delete',
      icon: 'pi pi-trash',
      severity: 'danger',
      disabled: (row) => row.status === 'Out of Stock',
    },
  ];

  // View action only (for grouped data)
  viewActions: TableAction[] = [
    { id: 'view', icon: 'pi pi-eye', severity: 'info' },
  ];

  // Selection state
  selectedProducts: Product[] = [];
  singleSelectedProduct: Product[] = [];

  // Grouped data for grouped table demo
  groupedProducts: TableGroup[] = [
    {
      label: 'Electronics',
      data: this.products.filter((p) => p.category === 'Electronics'),
      expanded: true,
    },
    {
      label: 'Accessories',
      data: this.products.filter((p) => p.category === 'Accessories'),
      expanded: true,
    },
    {
      label: 'Audio',
      data: this.products.filter((p) => p.category === 'Audio'),
      expanded: false,
    },
    {
      label: 'Storage',
      data: this.products.filter((p) => p.category === 'Storage'),
      expanded: false,
    },
    {
      label: 'Office',
      data: this.products.filter((p) => p.category === 'Office'),
      expanded: false,
    },
  ];

  // Grouped data with custom columns per group
  groupedProductsCustomColumns: TableGroup[] = [
    {
      label: 'High Value Items (>$100)',
      columns: [
        { field: 'name', header: 'Product', sortable: true },
        { field: 'price', header: 'Price', type: 'currency', align: 'right' },
        { field: 'status', header: 'Availability' },
      ],
      data: this.products.filter((p) => p.price > 100),
      expanded: true,
    },
    {
      label: 'Budget Items (<$100)',
      columns: [
        { field: 'name', header: 'Product', sortable: true },
        { field: 'price', header: 'Price', type: 'currency', align: 'right' },
        { field: 'quantity', header: 'Stock', type: 'number' },
      ],
      data: this.products.filter((p) => p.price <= 100),
      expanded: true,
    },
  ];

  // Grouped data with actions for full featured example
  groupedProductsWithActions: TableGroup[] = [
    {
      label: 'Electronics',
      data: this.products.filter((p) => p.category === 'Electronics'),
      expanded: true,
    },
    {
      label: 'Accessories',
      data: this.products.filter((p) => p.category === 'Accessories'),
      expanded: true,
    },
    {
      label: 'Audio',
      data: this.products.filter((p) => p.category === 'Audio'),
      expanded: true,
    },
  ];

  // Code examples
  codeExamples = {
    basic: `<i-table
  [data]="products"
  [columns]="columns">
</i-table>`,

    sortable: `<i-table
  [data]="products"
  [columns]="sortableColumns"
  [sortable]="true">
</i-table>`,

    height: `
  [data]="products"
  [columns]="sortableColumns"
  [sortable]="true"
  [height]="'300px'">
</i-table>`,

    filtering: `<i-table
  [data]="products"
  [columns]="filterableColumns"
  [sortable]="true"
  [filterable]="true"
  [globalFilter]="true">
</i-table>`,

    selection: `<i-table
  [data]="products"
  [columns]="columns"
  selectionMode="multiple"
  [(selection)]="selectedProducts"
  (onSelectionChange)="onSelectionChange($event)">
</i-table>`,

    actions: `<i-table
  [data]="products"
  [columns]="columns"
  [showActions]="true"
  [actions]="tableActions"
  (onAction)="handleAction($event)">
</i-table>

// TypeScript
tableActions: TableAction[] = [
  { id: 'view', icon: 'pi pi-eye', severity: 'info' },
  { id: 'edit', icon: 'pi pi-pencil', severity: 'warning' },
  { id: 'delete', icon: 'pi pi-trash', severity: 'danger',
    disabled: (row) => row.status === 'Out of Stock' }
];`,

    visual: `<i-table
  [data]="products"
  [columns]="columns"
  [striped]="true"
  [bordered]="true"
  size="small">
</i-table>`,

    full: `
<i-table
  [data]="products"
  [columns]="fullColumns"
  [sortable]="true"
  [filterable]="true"
  [globalFilter]="true"
  selectionMode="multiple"
  [(selection)]="selectedProducts"
  [showActions]="true"
  [actions]="tableActions"
  [downloadable]="true"
  downloadMode="direct"
  downloadFormat="csv"
  downloadFilename="products-full"
  [striped]="true"
  [hoverable]="true"
  (onSort)="onSort($event)"
  (onFilter)="onFilter($event)"
  (onSelectionChange)="onSelectionChange($event)"
  (onAction)="handleAction($event)"
>
  <div header>
    <i class="pi pi-box" style="font-size: 1.25rem; color: var(--color-primary);"></i>
    <h3 style="margin: 0 0 0 8px">Product Inventory - Full</h3>
  </div>
</i-table>`,

    grouped: `<i-table
  [groupedData]="groupedProducts"
  [columns]="basicColumns"
  [sortable]="true"
  [striped]="true">
</i-table>

// TypeScript
groupedProducts: TableGroup[] = [
  {
    label: 'Electronics',
    data: this.products.filter(p => p.category === 'Electronics'),
    expanded: true
  },
  {
    label: 'Accessories',
    data: this.products.filter(p => p.category === 'Accessories'),
    expanded: false
  }
];`,

    groupedCustomColumns: `<i-table
  [groupedData]="groupedProductsCustomColumns"
  [striped]="true">
</i-table>

// TypeScript - Each group can have its own columns
groupedProductsCustomColumns: TableGroup[] = [
  {
    label: 'High Value Items (>$100)',
    columns: [
      { field: 'name', header: 'Product' },
      { field: 'price', header: 'Price', type: 'currency' }
    ],
    data: this.products.filter(p => p.price > 100),
    expanded: true
  }
];`,

    groupedWithActions: `<i-table
  [groupedData]="groupedProductsWithActions"
  [columns]="basicColumns"
  [sortable]="true"
  [showActions]="true"
  [actions]="viewActions"
  [striped]="true"
  (onAction)="handleAction($event)">
</i-table>

// TypeScript
groupedProductsWithActions: TableGroup[] = [
  {
    label: 'Electronics',
    data: this.products.filter(p => p.category === 'Electronics'),
    expanded: true,
  },
  {
    label: 'Accessories',
    data: this.products.filter(p => p.category === 'Accessories'),
    expanded: true,
  },
];

viewActions: TableAction[] = [
  { id: 'view', icon: 'pi pi-eye', severity: 'info' },
];`,

    customHeader: `<i-table
  [data]="products"
  [columns]="basicColumns"
  [globalFilter]="true"
  [downloadable]="true">
  <div header>
    <h3>Product Inventory</h3>
  </div>
</i-table>`,

    download: `<i-table
  [data]="products"
  [columns]="fullColumns"
  [downloadable]="true"
  downloadMode="direct"
  downloadFormat="csv"
  downloadFilename="products">
</i-table>`,

    downloadApi: `<i-table
  [data]="products"
  [columns]="fullColumns"
  [downloadable]="true"
  downloadMode="api"
  (onDownload)="handleDownload($event)">
</i-table>

// TypeScript
handleDownload(event: TableDownloadEvent): void {
  // Call your API to generate the file
  this.api.downloadReport(event.data, event.format)
    .subscribe(blob => {
      // Handle the downloaded file
    });
}`,

    emptyState: `<!-- Empty table automatically shows no-content component -->
<i-table
  [data]="emptyProducts"
  [columns]="basicColumns"
  [striped]="true">
</i-table>

// TypeScript
emptyProducts: Product[] = [];

// The table component automatically displays
// the i-no-content component when data is empty`,
  };

  // TypeScript initialization example
  initializationCode = `import { ITable, TableColumn, TableAction } from 'integra-ng';

@Component({
  selector: 'app-example',
  imports: [ITable],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  products = [...]; // Your data array

  columns: TableColumn[] = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'price', header: 'Price', type: 'currency' },
    { field: 'quantity', header: 'Qty', type: 'number' }
  ];
}`;

  // Features list
  features: Feature[] = [
    {
      title: 'Data Display',
      description:
        'Flexible column configuration with custom formatting for text, numbers, dates, currency, and booleans',
    },
    {
      title: 'Sorting',
      description:
        'Column-based sorting with visual indicators for sort direction',
    },
    {
      title: 'Filtering',
      description:
        'Global search and column-specific filtering with debounce support',
    },
    {
      title: 'Selection',
      description:
        'Single and multiple row selection with checkbox support and two-way binding',
    },
    {
      title: 'Row Actions',
      description:
        'Configurable action buttons per row with conditional disable support',
    },
    {
      title: 'Grouped Data',
      description:
        'Support for nested/grouped data with expandable groups and custom columns per group',
    },
    {
      title: 'Custom Header Content',
      description:
        'Add custom content to the table header using ng-content, with search and download on the right',
    },
    {
      title: 'Download Functionality',
      description:
        'Export table data to CSV, JSON, or Excel formats with direct download or API integration',
    },
    {
      title: 'Visual Customization',
      description:
        'Striped rows, borders, hover effects, and multiple size options',
    },
    {
      title: 'Responsive Design',
      description: 'Scrollable containers and responsive pagination',
    },
  ];

  // Event handlers
  onSort(event: SortEvent): void {
    // Sorting handled by table; no global whisper should be shown for sort.
    // Keep hook for consumers to react if needed.
    console.debug('Table sorted', event);
  }

  onFilter(event: FilterEvent): void {
    // Filtering handled by table; no global whisper should be shown for filter.
    console.debug('Filter applied', event);
  }

  onSelectionChange(selection: Product[]): void {
    // Selection changes should not trigger global whispers in the demo.
    console.debug('Selection changed', selection.length);
  }

  handleAction(event: { action: string; row: Product }): void {
    switch (event.action) {
      case 'view':
        this.whisperService.add({
          severity: 'info',
          summary: 'Viewing Product',
          detail: `Viewing details for: ${event.row.name}`,
          key: 'global',
          life: 3000,
        });
        break;
      case 'edit':
        this.whisperService.add({
          severity: 'warning',
          summary: 'Editing Product',
          detail: `Editing: ${event.row.name}`,
          key: 'global',
          life: 3000,
        });
        break;
      case 'delete':
        this.whisperService.add({
          severity: 'danger',
          summary: 'Delete Product',
          detail: `Are you sure you want to delete ${event.row.name}?`,
          key: 'global',
          life: 5000,
        });
        break;
    }
  }

  handleDownload(event: TableDownloadEvent): void {
    console.log('Download requested', event);
    this.whisperService.add({
      severity: 'info',
      summary: 'Download Started',
      detail: `Downloading ${
        event.data.length
      } records as ${event.format.toUpperCase()}`,
      key: 'global',
      life: 3000,
    });
    // In a real app, you would call your API here
    // this.api.downloadReport(event.data, event.format).subscribe(...)
  }
}
