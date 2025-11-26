import { Component } from '@angular/core';

import { DemoCardComponent } from '../demo-card/demo-card.component';
import {
  FeaturesListComponent,
  Feature,
} from '../features-list/features-list.component';
import {
  FilterEvent,
  ITable,
  PageEvent,
  SortEvent,
  TableAction,
  TableColumn,
} from '@shared/components/table/table.component';

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
  imports: [ITable, DemoCardComponent, FeaturesListComponent],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss',
})
export class TablesComponent {
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

  // Selection state
  selectedProducts: Product[] = [];
  singleSelectedProduct: Product[] = [];

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

    filtering: `<i-table
  [data]="products"
  [columns]="filterableColumns"
  [sortable]="true"
  [filterable]="true"
  [globalFilter]="true">
</i-table>`,

    pagination: `<i-table
  [data]="products"
  [columns]="columns"
  [paginator]="true"
  [rows]="5"
  [rowsPerPageOptions]="[5, 10, 25]">
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

    full: `<i-table
  [data]="products"
  [columns]="fullColumns"
  [sortable]="true"
  [filterable]="true"
  [globalFilter]="true"
  [paginator]="true"
  [rows]="5"
  selectionMode="multiple"
  [(selection)]="selectedProducts"
  [showActions]="true"
  [actions]="tableActions"
  [striped]="true"
  [hoverable]="true"
  (onSort)="onSort($event)"
  (onFilter)="onFilter($event)"
  (onPage)="onPage($event)"
  (onAction)="handleAction($event)">
</i-table>`,
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
      title: 'Pagination',
      description:
        'Built-in paginator with configurable page sizes and navigation',
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
    console.log('Sort:', event);
  }

  onFilter(event: FilterEvent): void {
    console.log('Filter:', event);
  }

  onPage(event: PageEvent): void {
    console.log('Page:', event);
  }

  onSelectionChange(selection: Product[]): void {
    console.log('Selection:', selection);
  }

  handleAction(event: { action: string; row: Product }): void {
    console.log('Action:', event.action, 'Row:', event.row);
    switch (event.action) {
      case 'view':
        alert(`Viewing: ${event.row.name}`);
        break;
      case 'edit':
        alert(`Editing: ${event.row.name}`);
        break;
      case 'delete':
        alert(`Deleting: ${event.row.name}`);
        break;
    }
  }
}
