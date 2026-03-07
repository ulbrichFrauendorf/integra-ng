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
  TableData,
  TableGroup,
  TableDownloadEvent,
} from '@shared/components/table/table.component';
import { IWhisper } from '../../../../../integra-ng/src/lib/components/whisper/whisper.component';
import { WhisperService } from '../../../../../integra-ng/src/lib/components/whisper/services/whisper.service';
import { IMessage } from '@shared/components/message/message.component';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  status: string;
  date: string;
  _allWarning?: boolean;
}

interface ProductWithTags extends Product {
  tags: string[];
}

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [
    ITable,
    DemoCardComponent,
    FeaturesListComponent,
    IWhisper,
    IMessage,
  ],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss',
})
export class TablesComponent {
  constructor(private whisperService: WhisperService) {
    // Initialize large dataset for virtual scroll demo
    this.largeDataset = this.generateLargeDataset(10000);
    this.largeDatasetWithActions = {
      rows: this.largeDataset,
      actions: this.tableActions,
      onAction: (e) => this.handleGroupedDataAction(e),
    };
  }

  // Empty data for empty state demo
  emptyProducts: Product[] = [];

  // Large dataset for virtual scroll demo
  largeDataset: Product[] = [];
  largeDatasetWithActions!: TableData<Product>;

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
    // Demo row: make all columns show warning severity via column severity functions
    {
      id: 999,
      name: 'Demo — All Columns Warning',
      category: 'Demo',
      price: 0,
      quantity: 0,
      status: 'Low Stock',
      date: '2025-01-01',
      _allWarning: true,
    },
  ];

  // Basic table columns
  basicColumns: TableColumn[] = [
    {
      field: 'name',
      header: 'Product Name',
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
    {
      field: 'category',
      header: 'Category',
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
    {
      field: 'price',
      header: 'Price',
      type: 'currency',
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
    {
      field: 'quantity',
      header: 'Quantity',
      type: 'number',
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
  ];

  // Sortable columns
  sortableColumns: TableColumn[] = [
    {
      field: 'name',
      header: 'Product Name',
      sortable: true,
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
    {
      field: 'category',
      header: 'Category',
      sortable: true,
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
    {
      field: 'price',
      header: 'Price',
      type: 'currency',
      sortable: true,
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
    {
      field: 'quantity',
      header: 'Quantity',
      type: 'number',
      sortable: true,
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
    {
      field: 'status',
      header: 'Status',
      sortable: true,
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
  ];

  // Filterable columns
  filterableColumns: TableColumn[] = [
    {
      field: 'name',
      header: 'Product Name',
      sortable: true,
      filterable: true,
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
    {
      field: 'category',
      header: 'Category',
      sortable: true,
      filterable: true,
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
    {
      field: 'price',
      header: 'Price',
      type: 'currency',
      sortable: true,
      filterable: true,
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
    {
      field: 'status',
      header: 'Status',
      sortable: true,
      filterable: true,
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
  ];

  // Full featured columns
  fullColumns: TableColumn[] = [
    {
      field: 'id',
      header: 'ID',
      width: '80px',
      align: 'center',
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
      sortable: true,
    },
    {
      field: 'name',
      header: 'Product Name',
      sortable: true,
      filterable: true,
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
    {
      field: 'category',
      header: 'Category',
      sortable: true,
      filterable: true,
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
    {
      field: 'price',
      header: 'Price',
      type: 'currency',
      align: 'right',
      sortable: true,
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
    {
      field: 'quantity',
      header: 'Qty',
      type: 'number',
      width: '100px',
      align: 'center',
      sortable: true,
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
    {
      field: 'status',
      header: 'Status',
      sortable: true,
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
    {
      field: 'date',
      header: 'Date',
      type: 'date',
      sortable: true,
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
  ];

  // Icon columns - demonstrates dynamic icon rendering
  iconColumns: TableColumn[] = [
    {
      field: 'name',
      header: 'Product Name',
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
    {
      field: 'category',
      header: 'Category',
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
    {
      field: 'statusIcon',
      header: 'Status',
      type: 'icon',
      iconClass: (row: any) => {
        switch (row.status) {
          case 'In Stock':
            return 'pi pi-check-circle';
          case 'Low Stock':
            return 'pi pi-exclamation-triangle';
          case 'Out of Stock':
            return 'pi pi-times-circle';
          default:
            return 'pi pi-circle';
        }
      },
      severity: (row: any) => {
        switch (row.status) {
          case 'In Stock':
            return 'success';
          case 'Low Stock':
            return 'warning';
          case 'Out of Stock':
            return 'danger';
          default:
            return 'secondary';
        }
      },
      iconSize: '1.25rem',
      align: 'center',
      width: '80px',
    },
    {
      field: 'price',
      header: 'Price',
      type: 'currency',
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
    {
      field: 'quantity',
      header: 'Quantity',
      type: 'number',
      severity: (row: any) => (row._allWarning ? 'warning' : ''),
    },
  ];

  // Sample product data with tags for list column demo
  productsWithTags: ProductWithTags[] = [
    {
      id: 1,
      name: 'Laptop Pro',
      category: 'Electronics',
      price: 1299.99,
      quantity: 50,
      status: 'In Stock',
      date: '2024-01-15',
      tags: ['Featured', 'Best Seller', 'Premium'],
    },
    {
      id: 2,
      name: 'Wireless Mouse',
      category: 'Accessories',
      price: 29.99,
      quantity: 200,
      status: 'In Stock',
      date: '2024-02-20',
      tags: ['Ergonomic', 'Wireless'],
    },
    {
      id: 3,
      name: 'Mechanical Keyboard',
      category: 'Accessories',
      price: 149.99,
      quantity: 75,
      status: 'Low Stock',
      date: '2024-03-10',
      tags: ['RGB', 'Gaming', 'Mechanical'],
    },
    {
      id: 4,
      name: 'Monitor 27"',
      category: 'Electronics',
      price: 399.99,
      quantity: 30,
      status: 'In Stock',
      date: '2024-04-05',
      tags: ['4K', 'IPS'],
    },
    {
      id: 5,
      name: 'USB Hub',
      category: 'Accessories',
      price: 24.99,
      quantity: 150,
      status: 'In Stock',
      date: '2024-05-25',
      tags: ['USB-C'],
    },
  ];

  // List columns - demonstrates list/array rendering as chips
  listColumns: TableColumn[] = [
    { field: 'name', header: 'Product Name' },
    { field: 'category', header: 'Category' },
    {
      field: 'tags',
      header: 'Tags',
      type: 'list',
      width: '200px',
    },
    { field: 'price', header: 'Price', type: 'currency' },
  ];

  // Table actions
  tableActions: TableAction[] = [
    {
      id: 'view',
      icon: 'pi pi-eye',
      severity: 'info',
      tooltip: 'View details',
    },
    {
      id: 'edit',
      icon: 'pi pi-pencil',
      severity: 'warning',
      tooltip: 'Edit product',
    },
    {
      id: 'delete',
      icon: 'pi pi-trash',
      severity: 'danger',
      disabled: (row) => row.status === 'Out of Stock',
      tooltip: (row) =>
        row.status === 'Out of Stock'
          ? 'Cannot delete out of stock items'
          : 'Delete product',
      visible: (row) => row.status !== 'Low Stock', // Hide delete for low stock items
    },
  ];

  // View action only (for grouped data)
  viewActions: TableAction[] = [
    {
      id: 'view',
      icon: 'pi pi-eye',
      severity: 'info',
      tooltip: 'View product details',
    },
  ];

  // TableData configs for demos that need embedded actions
  productsWithActions: TableData<Product> = {
    rows: this.products,
    actions: this.tableActions,
    onAction: (e) => this.handleGroupedDataAction(e),
  };

  // Selection state
  selectedProducts: Product[] = [];
  singleSelectedProduct: Product[] = [];

  // Grouped data for grouped table demo
  groupedProducts: TableGroup[] = [
    {
      label: 'Electronics',
      data: this.products.filter((p) => p.category === 'Electronics'),
      expanded: false,
    },
    {
      label: 'Accessories',
      data: this.products.filter((p) => p.category === 'Accessories'),
      expanded: false,
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
      expanded: false,
    },
    {
      label: 'Budget Items (<$100)',
      columns: [
        { field: 'name', header: 'Product', sortable: true },
        { field: 'price', header: 'Price', type: 'currency', align: 'right' },
        { field: 'quantity', header: 'Stock', type: 'number' },
      ],
      data: this.products.filter((p) => p.price <= 100),
      expanded: false,
    },
  ];

  // Grouped data with actions for full featured example
  groupedProductsWithActions: TableGroup[] = [
    {
      label: 'Electronics',
      row: this.categoryRow(
        'Electronics',
        this.products.filter((p) => p.category === 'Electronics'),
      ),
      data: this.products.filter((p) => p.category === 'Electronics'),
      expanded: false,
      groupActions: this.viewActions,
      onGroupAction: (e) => this.handleGroupedDataAction(e),
      rowActions: this.tableActions,
      onRowAction: (e) => this.handleAction(e),
    },
    {
      label: 'Accessories',
      row: this.categoryRow(
        'Accessories',
        this.products.filter((p) => p.category === 'Accessories'),
      ),
      data: this.products.filter((p) => p.category === 'Accessories'),
      expanded: false,
      groupActions: this.viewActions,
      onGroupAction: (e) => this.handleGroupedDataAction(e),
      rowActions: this.tableActions,
      onRowAction: (e) => this.handleAction(e),
    },
    {
      label: 'Audio',
      row: this.categoryRow(
        'Audio',
        this.products.filter((p) => p.category === 'Audio'),
      ),
      data: this.products.filter((p) => p.category === 'Audio'),
      expanded: false,
      groupActions: this.viewActions,
      onGroupAction: (e) => this.handleGroupedDataAction(e),
      rowActions: this.tableActions,
      onRowAction: (e) => this.handleAction(e),
    },
  ];

  // Columns for the outer group-level table header row
  categoryGroupColumns: TableColumn[] = [
    { field: 'category', header: 'Category' },
    {
      field: 'totalValue',
      header: 'Total Stock Value',
      type: 'currency',
      align: 'right',
    },
    {
      field: 'avgPrice',
      header: 'Avg Unit Price',
      type: 'currency',
      align: 'right',
    },
    { field: 'inventoryStatus', header: 'Inventory Status' },
  ];

  /** Computes an aggregated summary row for a product category group. */
  private categoryRow(category: string, items: Product[]): any {
    const itemCount = items.length;
    const totalValue = items.reduce((s, p) => s + p.price * p.quantity, 0);
    const avgPrice = itemCount
      ? items.reduce((s, p) => s + p.price, 0) / itemCount
      : 0;
    const hasOutOfStock = items.some((p) => p.status === 'Out of Stock');
    const hasLowStock = items.some((p) => p.status === 'Low Stock');
    const inventoryStatus = hasOutOfStock
      ? 'Has Out of Stock'
      : hasLowStock
        ? 'Has Low Stock'
        : 'Fully Stocked';
    return { category, itemCount, totalValue, avgPrice, inventoryStatus };
  }

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

    actions: `// Actions are embedded directly in a TableData config object.
// No separate [actions] or (onAction) bindings needed on the template.
<i-table
  [data]="productsWithActions"
  [columns]="columns">
</i-table>

// TypeScript
productsWithActions: TableData<Product> = {
  rows: this.products,
  actions: [
    { id: 'view',   icon: 'pi pi-eye',    severity: 'info' },
    { id: 'edit',   icon: 'pi pi-pencil', severity: 'warning' },
    { id: 'delete', icon: 'pi pi-trash',  severity: 'danger',
      disabled: (row) => row.status === 'Out of Stock' }
  ],
  onAction: ({ action, row }) => {
    console.log(action, row);
  }
};`,

    visual: `<i-table
  [data]="products"
  [columns]="columns"
  [striped]="true"
  [bordered]="true"
  size="small">
</i-table>`,

    iconColumns: `<i-table
  [data]="products"
  [columns]="iconColumns"
  [striped]="true">
</i-table>

// TypeScript - Icon column with dynamic icon rendering
iconColumns: TableColumn[] = [
  { field: 'name', header: 'Product Name' },
  { field: 'category', header: 'Category' },
  { 
    field: 'statusIcon', 
    header: 'Status', 
    type: 'icon',
    iconClass: (row: any) => {
      switch (row.status) {
        case 'In Stock': return 'pi pi-check-circle';
        case 'Low Stock': return 'pi pi-exclamation-triangle';
        case 'Out of Stock': return 'pi pi-times-circle';
        default: return 'pi pi-circle';
      }
    },
    severity: (row: any) => {
      switch (row.status) {
        case 'In Stock': return 'success';
        case 'Low Stock': return 'warning';
        case 'Out of Stock': return 'danger';
        default: return 'secondary';
      }
    },
    iconSize: '1.25rem',
    align: 'center'
  },
  { field: 'price', header: 'Price', type: 'currency' }
];`,

    listColumns: `<i-table
  [data]="productsWithTags"
  [columns]="listColumns"
  [striped]="true">
</i-table>

// TypeScript - List column renders arrays as stacked chips
interface ProductWithTags {
  id: number;
  name: string;
  tags: string[];
  // ...other fields
}

productsWithTags: ProductWithTags[] = [
  { id: 1, name: 'Laptop Pro', tags: ['Featured', 'Best Seller', 'Premium'], ... },
  { id: 2, name: 'Wireless Mouse', tags: ['Ergonomic', 'Wireless'], ... }
];

listColumns: TableColumn[] = [
  { field: 'name', header: 'Product Name' },
  { field: 'category', header: 'Category' },
  { 
    field: 'tags', 
    header: 'Tags', 
    type: 'list',
    width: '200px'
  },
  { field: 'price', header: 'Price', type: 'currency' }
];`,

    full: `
<i-table
  [data]="productsWithActions"
  [columns]="fullColumns"
  [sortable]="true"
  [filterable]="true"
  [globalFilter]="true"
  selectionMode="multiple"
  [(selection)]="selectedProducts"
  [downloadable]="true"
  downloadMode="direct"
  downloadFormat="csv"
  downloadFilename="products-full"
  [striped]="true"
  [hoverable]="true"
  (onSort)="onSort($event)"
  (onFilter)="onFilter($event)"
  (onSelectionChange)="onSelectionChange($event)"
>
  <div header>
    <i class="pi pi-box" style="font-size: 1.25rem; color: var(--color-primary);"></i>
    <h3 style="margin: 0 0 0 8px">Product Inventory - Full</h3>
  </div>
</i-table>

// TypeScript
productsWithActions: TableData<Product> = {
  rows: this.products,
  actions: this.tableActions,
  onAction: (e) => this.handleGroupedDataAction(e),
};`,

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

    groupedCustomColumns: `// Omit [columns] on <i-table> and define columns per group instead.
// Each group\'s nested table renders only the columns you specify.
<i-table
  [groupedData]="groupedProductsCustomColumns"
  [striped]="true">
</i-table>

// TypeScript
groupedProductsCustomColumns: TableGroup[] = [
  {
    label: 'High Value Items (>\$100)',
    // This group shows price + availability
    columns: [
      { field: 'name',     header: 'Product',      sortable: true },
      { field: 'price',    header: 'Price',         type: 'currency', align: 'right' },
      { field: 'status',   header: 'Availability' },
    ],
    data: this.products.filter(p => p.price > 100),
    expanded: true,
  },
  {
    label: 'Budget Items (\u2264\$100)',
    // This group shows price + stock quantity instead
    columns: [
      { field: 'name',     header: 'Product',  sortable: true },
      { field: 'price',    header: 'Price',     type: 'currency', align: 'right' },
      { field: 'quantity', header: 'Stock',     type: 'number' },
    ],
    data: this.products.filter(p => p.price <= 100),
    expanded: true,
  },
];`,

    groupedWithActions: `// [groupColumns] defines the outer parent row columns shown in the table header.
// Each group's 'row' object provides aggregated data for those columns.
// [columns] defines the inner detail table rendered when a group is expanded.
// Actions are embedded in each TableGroup object — no bindings on the template.
// groupActions / onGroupAction — action buttons on the parent group summary rows.
// rowActions / onRowAction     — action buttons on child rows inside expanded groups.
// A trailing unnamed column is automatically added to show the item count (n).
<i-table
  [groupedData]="groupedProductsWithActions"
  [groupColumns]="categoryGroupColumns"
  [columns]="basicColumns"
  [sortable]="true"
  [striped]="true"
  [height]="'420px'">
</i-table>

// TypeScript
categoryGroupColumns: TableColumn[] = [
  { field: 'category',        header: 'Category' },
  { field: 'totalValue',      header: 'Total Stock Value', type: 'currency', align: 'right' },
  { field: 'avgPrice',        header: 'Avg Unit Price',    type: 'currency', align: 'right' },
  { field: 'inventoryStatus', header: 'Inventory Status' },
];

groupedProductsWithActions: TableGroup[] = [
  {
    label: 'Electronics',
    row: this.categoryRow('Electronics', ...),
    data: this.products.filter(p => p.category === 'Electronics'),
    expanded: false,
    // Parent group row actions:
    groupActions: [
      { id: 'view', icon: 'pi pi-eye', severity: 'info', tooltip: 'View category' },
    ],
    onGroupAction: (e) => this.handleGroupedDataAction(e),
    // Child row actions inside expanded group:
    rowActions: [
      { id: 'view',   icon: 'pi pi-eye',    severity: 'info' },
      { id: 'edit',   icon: 'pi pi-pencil', severity: 'warning' },
      { id: 'delete', icon: 'pi pi-trash',  severity: 'danger',
        disabled: (row) => row.status === 'Out of Stock' },
    ],
    onRowAction: (e) => this.handleAction(e),
  },
];

// Compute aggregated group row data dynamically:
categoryRow(category: string, items: Product[]): any {
  const totalValue = items.reduce((s, p) => s + p.price * p.quantity, 0);
  const avgPrice = items.length ? items.reduce((s, p) => s + p.price, 0) / items.length : 0;
  const inventoryStatus = items.some(p => p.status === 'Out of Stock') ? 'Has Out of Stock'
    : items.some(p => p.status === 'Low Stock') ? 'Has Low Stock' : 'Fully Stocked';
  return { category, totalValue, avgPrice, inventoryStatus };
}`,

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

    virtualScroll: `<i-table
  [data]="largeDataset"
  [columns]="sortableColumns"
  [virtualScroll]="true"
  [virtualScrollItemSize]="48"
  [height]="'500px'"
  [sortable]="true"
  [filterable]="true"
  [globalFilter]="true"
  [striped]="true">
</i-table>

// TypeScript - Generate large dataset
largeDataset = this.generateLargeDataset(10000);

generateLargeDataset(count: number): Product[] {
  const categories = ['Electronics', 'Accessories', 'Audio', 'Storage', 'Office'];
  const statuses = ['In Stock', 'Low Stock', 'Out of Stock'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: \`Product \${i + 1}\`,
    category: categories[i % categories.length],
    price: Math.round((Math.random() * 1000 + 10) * 100) / 100,
    quantity: Math.floor(Math.random() * 200),
    status: statuses[i % statuses.length],
    date: new Date(2024, (i % 12), (i % 28) + 1).toISOString().split('T')[0]
  }));
}`,

    virtualScrollWithSelection: `// Actions are embedded in a TableData config — no separate bindings.\n<i-table\n  [data]="largeDatasetWithActions"\n  [columns]="basicColumns"\n  [virtualScroll]="true"\n  [height]="'500px'"\n  selectionMode="multiple"\n  dataKey="id"\n  [(selection)]="selectedProducts"\n  [striped]="true">\n</i-table>\n\n// TypeScript\nlargeDatasetWithActions: TableData<Product> = {\n  rows: this.largeDataset,\n  actions: this.tableActions,\n  onAction: ({ action, row }) => this.handleAction({ action, row }),\n};\n\n// Important: Use dataKey="id" for better performance\n// with large datasets and selection`,

    virtualScrollPerformance: `// Performance comparison:
// Without Virtual Scroll (10,000 rows):
// - DOM Nodes: 10,000+
// - Initial Render: ~2-3 seconds
// - Memory: ~500MB
// - Scroll: Laggy

// With Virtual Scroll (10,000 rows):
// - DOM Nodes: ~30-50 (only visible)
// - Initial Render: ~50-100ms
// - Memory: ~50MB
// - Scroll: Smooth 60fps

// When to use:
// < 1,000 rows: Optional
// 1,000-10,000 rows: Recommended
// > 10,000 rows: Required`,
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
      title: 'Virtual Scroll',
      description:
        'Efficiently render large datasets (10,000+ rows) by only displaying visible items. Provides smooth scrolling and minimal memory footprint',
    },
    {
      title: 'Grouped Data',
      description:
        'Expandable group sections where each group renders as a fully independent nested table with its own column headers, sorting, filtering, actions, and selection. Groups can also define their own column set.',
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

  handleGroupedDataAction(event: { action: string; row: Product }): void {
    const row = event.row as any;
    switch (event.action) {
      case 'view':
        this.whisperService.add({
          severity: 'info',
          summary: 'Viewing Product',
          detail: `Viewing details for: ${row.name ?? row.category ?? row.label}`,
          key: 'global',
          life: 3000,
        });
        break;
    }
  }

  handleAction(event: { action: string; row: Product }): void {
    const row = event.row as any;
    switch (event.action) {
      case 'view':
        this.whisperService.add({
          severity: 'info',
          summary: 'Viewing Product',
          detail: `Viewing: ${row.name ?? row.category}`,
          key: 'global',
          life: 3000,
        });
        break;
      case 'edit':
        this.whisperService.add({
          severity: 'warning',
          summary: 'Editing Product',
          detail: `Editing: ${row.name ?? row.category ?? row.label}`,
          key: 'global',
          life: 3000,
        });
        break;
      case 'delete':
        this.whisperService.add({
          severity: 'danger',
          summary: 'Delete Product',
          detail: `Are you sure you want to delete ${row.name ?? row.category ?? row.label}?`,
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

  // Generate large dataset for virtual scroll demo
  generateLargeDataset(count: number): Product[] {
    const categories = [
      'Electronics',
      'Accessories',
      'Audio',
      'Storage',
      'Office',
    ];
    const statuses = ['In Stock', 'Low Stock', 'Out of Stock'];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      category: categories[i % categories.length],
      price: Math.round((Math.random() * 1000 + 10) * 100) / 100,
      quantity: Math.floor(Math.random() * 200),
      status: statuses[i % statuses.length],
      date: new Date(2024, i % 12, (i % 28) + 1).toISOString().split('T')[0],
    }));
  }
}
