import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  InputSignal,
  input,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IInputText } from '../input-text/input-text.component';
import { IButton } from '../button/button.component';
import { ICheckbox } from '../checkbox/checkbox.component';
import { EmptyStateTableComponent } from '../empty-state-table/empty-state-table.component';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { ISeverity } from '@shared/enums/IButtonSeverity';

/**
 * Column definition for the table
 */
export interface TableColumn {
  /** Field name in the data object */
  field: string;
  /** Header text displayed for this column */
  header: string;
  /** Whether this column is sortable */
  sortable?: boolean;
  /** Whether this column is filterable */
  filterable?: boolean;
  /** Column width (e.g., '100px', '20%') */
  width?: string;
  /** Text alignment within the column */
  align?: 'left' | 'center' | 'right';
  /** Data type for formatting */
  type?: 'text' | 'number' | 'date' | 'boolean' | 'currency';
  /** Format string for date/currency formatting */
  format?: string;
}

/**
 * Action button definition for row actions
 */
export interface TableAction {
  /** Unique identifier for the action */
  id: string;
  /** Icon class (e.g., 'pi pi-edit') */
  icon?: string;
  /** Button label text */
  label?: string;
  /** Button severity/style */
  severity?: ISeverity;
  /** Whether the action is disabled (can be a function) */
  disabled?: boolean | ((row: any) => boolean);
}

/**
 * Sort event emitted when sorting changes
 */
export interface SortEvent {
  /** Field being sorted */
  field: string;
  /** Sort direction */
  order: 'asc' | 'desc';
}

/**
 * Filter event emitted when filtering changes
 */
export interface FilterEvent {
  /** Column filters keyed by field name */
  filters: { [field: string]: string };
  /** Global filter value */
  globalFilter?: string;
}

/**
 * Page event emitted when pagination changes
 */
export interface PageEvent {
  /** First row offset */
  first: number;
  /** Number of rows per page */
  rows: number;
  /** Current page number (0-indexed) */
  page: number;
  /** Total number of pages */
  pageCount: number;
}

/**
 * Table Component
 *
 * A comprehensive table component with sorting, filtering, pagination, selection,
 * and row actions. All features are configurable via props.
 * Uses Angular signals for reactive state management.
 *
 * @example
 * ```html
 * <!-- Basic table -->
 * <i-table
 *   [data]="products"
 *   [columns]="columns"
 *   [sortable]="true"
 *   [paginator]="true"
 *   [rows]="10">
 * </i-table>
 *
 * <!-- Table with selection -->
 * <i-table
 *   [data]="products"
 *   [columns]="columns"
 *   selectionMode="multiple"
 *   [(selection)]="selectedProducts"
 *   (onSelectionChange)="onSelect($event)">
 * </i-table>
 *
 * <!-- Table with actions -->
 * <i-table
 *   [data]="products"
 *   [columns]="columns"
 *   [showActions]="true"
 *   [actions]="tableActions"
 *   (onAction)="handleAction($event)">
 * </i-table>
 * ```
 *
 * @remarks
 * This component provides a feature-rich table implementation similar to
 * PrimeNG's table but configured entirely via props without templating.
 */
@Component({
  selector: 'i-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IInputText,
    IButton,
    ICheckbox,
    EmptyStateTableComponent,
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class ITable {
  // ===== DATA DISPLAY =====

  /**
   * Table data as a signal input
   */
  data: InputSignal<any[]> = input<any[]>([]);

  /**
   * Column definitions with field, header, sortable, filterable, width properties
   */
  columns: InputSignal<TableColumn[]> = input<TableColumn[]>([]);

  /**
   * Message displayed when table has no data
   * @default 'No data available'
   */
  @Input() emptyMessage = 'No data available';

  // ===== SORTING =====

  /**
   * Enable/disable sorting globally
   * @default false
   */
  @Input() sortable = false;

  /**
   * Current sort field
   */
  @Input() sortField = '';

  /**
   * Sort direction
   * @default 'asc'
   */
  @Input() sortOrder: 'asc' | 'desc' = 'asc';

  /**
   * Event emitted when sort changes
   */
  @Output() onSort = new EventEmitter<SortEvent>();

  // ===== FILTERING =====

  /**
   * Enable column filtering
   * @default false
   */
  @Input() filterable = false;

  /**
   * Enable global search
   * @default false
   */
  @Input() globalFilter = false;

  /**
   * Debounce delay for filtering in milliseconds
   * @default 300
   */
  @Input() filterDelay = 300;

  /**
   * Event emitted when filter changes
   */
  @Output() onFilter = new EventEmitter<FilterEvent>();

  // ===== PAGINATION =====

  /**
   * Enable pagination
   * @default false
   */
  @Input() paginator = false;

  /**
   * Number of rows per page
   * @default 10
   */
  @Input() rows = 10;

  /**
   * Options for rows per page dropdown
   * @default [10, 25, 50, 100]
   */
  @Input() rowsPerPageOptions: number[] = [10, 25, 50, 100];

  /**
   * Total records for server-side pagination
   */
  @Input() totalRecords?: number;

  /**
   * First row offset
   * @default 0
   */
  @Input() first = 0;

  /**
   * Event emitted when page changes
   */
  @Output() onPage = new EventEmitter<PageEvent>();

  // ===== SELECTION =====

  /**
   * Selection mode
   */
  @Input() selectionMode: 'single' | 'multiple' | null = null;

  /**
   * Selected rows
   */
  @Input() selection: any[] = [];

  /**
   * Event emitted when selection changes
   */
  @Output() selectionChange = new EventEmitter<any[]>();

  /**
   * Event emitted when selection changes (alias for two-way binding)
   */
  @Output() onSelectionChange = new EventEmitter<any[]>();

  /**
   * Event emitted when a row is selected
   */
  @Output() onRowSelect = new EventEmitter<any>();

  /**
   * Event emitted when a row is unselected
   */
  @Output() onRowUnselect = new EventEmitter<any>();

  // ===== ROW ACTIONS =====

  /**
   * Show action column
   * @default false
   */
  @Input() showActions = false;

  /**
   * Action button definitions
   */
  @Input() actions: TableAction[] = [];

  /**
   * Event emitted when an action is clicked
   */
  @Output() onAction = new EventEmitter<{ action: string; row: any }>();

  // ===== VISUAL FEATURES =====

  /**
   * Show striped rows
   * @default false
   */
  @Input() striped = false;

  /**
   * Enable row hover effect
   * @default true
   */
  @Input() hoverable = true;

  /**
   * Show borders
   * @default false
   */
  @Input() bordered = false;

  /**
   * Table size
   * @default 'medium'
   */
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Show loading state
   * @default false
   */
  @Input() loading = false;

  /**
   * Enable horizontal scrolling
   * @default false
   */
  @Input() scrollable = false;

  /**
   * Fixed height with vertical scroll
   */
  @Input() scrollHeight?: string;

  // ===== ADDITIONAL FEATURES =====

  /**
   * Allow column resizing
   * @default false
   */
  @Input() resizableColumns = false;

  /**
   * Allow column reordering
   * @default false
   */
  @Input() reorderableColumns = false;

  /**
   * Enable row expansion
   * @default false
   */
  @Input() rowExpandable = false;

  /**
   * Event emitted when a row is expanded
   */
  @Output() onRowExpand = new EventEmitter<any>();

  /**
   * Event emitted when a row is collapsed
   */
  @Output() onRowCollapse = new EventEmitter<any>();

  // ===== INTERNAL STATE =====

  /**
   * Unique component identifier
   * @internal
   */
  componentId = UniqueComponentId('i-table-');

  /**
   * Global filter value signal
   * @internal
   */
  globalFilterValue = signal('');

  /**
   * Column filter values signal
   * @internal
   */
  columnFilters = signal<{ [field: string]: string }>({});

  /**
   * Expanded rows
   * @internal
   */
  expandedRows = signal<Set<any>>(new Set());

  /**
   * Filter debounce timer
   * @internal
   */
  private filterTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Column being resized
   * @internal
   */
  private resizingColumn: TableColumn | null = null;

  /**
   * Starting X position for resize
   * @internal
   */
  private resizeStartX = 0;

  /**
   * Starting width for resize
   * @internal
   */
  private resizeStartWidth = 0;

  /**
   * Column widths (for resizing)
   * @internal
   */
  columnWidths = signal<{ [field: string]: number }>({});

  constructor(private el: ElementRef) {}

  /**
   * Computed filtered and sorted data
   * @internal
   */
  processedData = computed(() => {
    let result = [...(this.data() || [])];

    // Apply global filter
    const globalFilter = this.globalFilterValue();
    if (globalFilter) {
      const cols = this.columns();
      result = result.filter((row) =>
        cols.some((col) => {
          const value = this.getCellValue(row, col.field);
          return String(value).toLowerCase().includes(globalFilter.toLowerCase());
        })
      );
    }

    // Apply column filters
    const filters = this.columnFilters();
    Object.keys(filters).forEach((field) => {
      const filterValue = filters[field];
      if (filterValue) {
        result = result.filter((row) => {
          const value = this.getCellValue(row, field);
          return String(value).toLowerCase().includes(filterValue.toLowerCase());
        });
      }
    });

    // Apply sorting
    if (this.sortField) {
      result.sort((a, b) => {
        const aValue = this.getCellValue(a, this.sortField);
        const bValue = this.getCellValue(b, this.sortField);
        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;
        return this.sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  });

  /**
   * Get paginated data
   * Note: Using a getter method instead of a computed signal because 
   * pagination properties (paginator, first, rows) are regular @Input()
   * properties that aren't tracked by computed signals.
   * @internal
   */
  get paginatedDataValue(): any[] {
    const data = this.processedData();
    if (!this.paginator) {
      return data;
    }
    const start = this.first;
    const end = start + this.rows;
    return data.slice(start, end);
  }

  /**
   * Computed paginated data (signal wrapper)
   * @internal
   */
  paginatedData = () => this.paginatedDataValue;

  /**
   * Total number of records (computed or provided)
   * @internal
   */
  get totalRecordsCount(): number {
    return this.totalRecords ?? this.processedData().length;
  }

  /**
   * Total number of pages
   * @internal
   */
  get pageCount(): number {
    return Math.ceil(this.totalRecordsCount / this.rows);
  }

  /**
   * Current page number (0-indexed)
   * @internal
   */
  get currentPage(): number {
    return Math.floor(this.first / this.rows);
  }

  /**
   * Gets a cell value from a row
   * @internal
   */
  getCellValue(row: any, field: string): any {
    if (!row || !field) return '';
    // Support nested properties with dot notation
    const parts = field.split('.');
    let value = row;
    for (const part of parts) {
      if (value === null || value === undefined) return '';
      value = value[part];
    }
    return value ?? '';
  }

  /**
   * Formats a cell value based on column type
   * @internal
   */
  formatCellValue(value: any, column: TableColumn): string {
    if (value === null || value === undefined) return '';

    switch (column.type) {
      case 'date':
        try {
          const date = new Date(value);
          return column.format
            ? this.formatDate(date, column.format)
            : date.toLocaleDateString();
        } catch {
          return String(value);
        }
      case 'currency':
        try {
          const num = Number(value);
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: column.format || 'USD',
          }).format(num);
        } catch {
          return String(value);
        }
      case 'number':
        return Number(value).toLocaleString();
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return String(value);
    }
  }

  /**
   * Simple date formatter
   * @internal
   */
  private formatDate(date: Date, format: string): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return format
      .replace('yyyy', date.getFullYear().toString())
      .replace('MM', pad(date.getMonth() + 1))
      .replace('dd', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('mm', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()));
  }

  // ===== SORTING METHODS =====

  /**
   * Handles column sort click
   * @internal
   */
  onSortColumn(column: TableColumn): void {
    if (!this.sortable || !column.sortable) return;

    if (this.sortField === column.field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = column.field;
      this.sortOrder = 'asc';
    }

    this.onSort.emit({
      field: this.sortField,
      order: this.sortOrder,
    });
  }

  /**
   * Gets the sort icon for a column
   * @internal
   */
  getSortIcon(column: TableColumn): string {
    if (this.sortField !== column.field) {
      return 'pi pi-sort-alt';
    }
    return this.sortOrder === 'asc' ? 'pi pi-sort-amount-up' : 'pi pi-sort-amount-down';
  }

  // ===== FILTERING METHODS =====

  /**
   * Handles global filter input
   * @internal
   */
  onGlobalFilterInput(value: string): void {
    if (this.filterTimer) {
      clearTimeout(this.filterTimer);
    }

    this.filterTimer = setTimeout(() => {
      this.globalFilterValue.set(value);
      this.emitFilterEvent();
      this.resetPagination();
    }, this.filterDelay);
  }

  /**
   * Handles column filter input
   * @internal
   */
  onColumnFilterInput(field: string, value: string): void {
    if (this.filterTimer) {
      clearTimeout(this.filterTimer);
    }

    this.filterTimer = setTimeout(() => {
      this.columnFilters.update((filters) => ({
        ...filters,
        [field]: value,
      }));
      this.emitFilterEvent();
      this.resetPagination();
    }, this.filterDelay);
  }

  /**
   * Emits filter event
   * @internal
   */
  private emitFilterEvent(): void {
    this.onFilter.emit({
      filters: this.columnFilters(),
      globalFilter: this.globalFilterValue(),
    });
  }

  // ===== PAGINATION METHODS =====

  /**
   * Navigates to a specific page
   * @internal
   */
  goToPage(page: number): void {
    if (page < 0 || page >= this.pageCount) return;

    this.first = page * this.rows;
    this.emitPageEvent();
  }

  /**
   * Goes to first page
   * @internal
   */
  goToFirstPage(): void {
    this.goToPage(0);
  }

  /**
   * Goes to last page
   * @internal
   */
  goToLastPage(): void {
    this.goToPage(this.pageCount - 1);
  }

  /**
   * Goes to previous page
   * @internal
   */
  goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  /**
   * Goes to next page
   * @internal
   */
  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  /**
   * Changes rows per page
   * @internal
   */
  onRowsPerPageChange(rows: number): void {
    this.rows = rows;
    this.first = 0;
    this.emitPageEvent();
  }

  /**
   * Resets pagination to first page
   * @internal
   */
  private resetPagination(): void {
    if (this.first !== 0) {
      this.first = 0;
      this.emitPageEvent();
    }
  }

  /**
   * Emits page event
   * @internal
   */
  private emitPageEvent(): void {
    this.onPage.emit({
      first: this.first,
      rows: this.rows,
      page: this.currentPage,
      pageCount: this.pageCount,
    });
  }

  /**
   * Gets array of page numbers to display
   * @internal
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    const half = Math.floor(maxPages / 2);

    let start = Math.max(0, this.currentPage - half);
    let end = Math.min(this.pageCount, start + maxPages);

    if (end - start < maxPages) {
      start = Math.max(0, end - maxPages);
    }

    for (let i = start; i < end; i++) {
      pages.push(i);
    }

    return pages;
  }

  // ===== SELECTION METHODS =====

  /**
   * Checks if a row is selected
   * @internal
   */
  isRowSelected(row: any): boolean {
    if (!this.selectionMode) return false;
    return this.selection?.some((s) => this.compareObjects(s, row)) ?? false;
  }

  /**
   * Toggles row selection
   * @internal
   */
  toggleRowSelection(row: any, event?: Event): void {
    if (!this.selectionMode) return;

    // Prevent checkbox from triggering twice
    if (event) {
      event.stopPropagation();
    }

    const isSelected = this.isRowSelected(row);

    if (this.selectionMode === 'single') {
      if (isSelected) {
        this.selection = [];
        this.onRowUnselect.emit(row);
      } else {
        this.selection = [row];
        this.onRowSelect.emit(row);
      }
    } else if (this.selectionMode === 'multiple') {
      if (isSelected) {
        this.selection = this.selection.filter((s) => !this.compareObjects(s, row));
        this.onRowUnselect.emit(row);
      } else {
        this.selection = [...this.selection, row];
        this.onRowSelect.emit(row);
      }
    }

    this.selectionChange.emit(this.selection);
    this.onSelectionChange.emit(this.selection);
  }

  /**
   * Toggles all rows selection
   * @internal
   */
  toggleAllSelection(): void {
    if (this.selectionMode !== 'multiple') return;

    const data = this.paginatedData();
    const allSelected = this.areAllRowsSelected();

    if (allSelected) {
      // Deselect all visible rows
      this.selection = this.selection.filter(
        (s) => !data.some((d) => this.compareObjects(s, d))
      );
    } else {
      // Select all visible rows
      const newSelections = data.filter(
        (d) => !this.selection.some((s) => this.compareObjects(s, d))
      );
      this.selection = [...this.selection, ...newSelections];
    }

    this.selectionChange.emit(this.selection);
    this.onSelectionChange.emit(this.selection);
  }

  /**
   * Checks if all visible rows are selected
   * @internal
   */
  areAllRowsSelected(): boolean {
    const data = this.paginatedData();
    if (data.length === 0) return false;
    return data.every((d) => this.selection?.some((s) => this.compareObjects(s, d)));
  }

  /**
   * Checks if some (but not all) rows are selected
   * @internal
   */
  areSomeRowsSelected(): boolean {
    const data = this.paginatedData();
    const selectedCount = data.filter((d) =>
      this.selection?.some((s) => this.compareObjects(s, d))
    ).length;
    return selectedCount > 0 && selectedCount < data.length;
  }

  /**
   * Compares two objects for equality
   * @internal
   */
  private compareObjects(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  // ===== ACTION METHODS =====

  /**
   * Handles action button click
   * @internal
   */
  onActionClick(action: TableAction, row: any, event: Event): void {
    event.stopPropagation();
    this.onAction.emit({ action: action.id, row });
  }

  /**
   * Checks if an action is disabled for a row
   * @internal
   */
  isActionDisabled(action: TableAction, row: any): boolean {
    if (typeof action.disabled === 'function') {
      return action.disabled(row);
    }
    return action.disabled ?? false;
  }

  // ===== ROW EXPANSION METHODS =====

  /**
   * Toggles row expansion
   * @internal
   */
  toggleRowExpansion(row: any, event: Event): void {
    event.stopPropagation();
    if (!this.rowExpandable) return;

    const expanded = this.expandedRows();
    const isExpanded = expanded.has(row);

    if (isExpanded) {
      expanded.delete(row);
      this.onRowCollapse.emit(row);
    } else {
      expanded.add(row);
      this.onRowExpand.emit(row);
    }

    this.expandedRows.set(new Set(expanded));
  }

  /**
   * Checks if a row is expanded
   * @internal
   */
  isRowExpanded(row: any): boolean {
    return this.expandedRows().has(row);
  }

  // ===== COLUMN RESIZE METHODS =====

  /**
   * Starts column resize
   * @internal
   */
  onColumnResizeStart(event: MouseEvent, column: TableColumn): void {
    if (!this.resizableColumns) return;

    event.preventDefault();
    this.resizingColumn = column;
    this.resizeStartX = event.pageX;

    const widths = this.columnWidths();
    this.resizeStartWidth = widths[column.field] || this.getColumnDefaultWidth(column);
  }

  /**
   * Gets default column width
   * @internal
   */
  private getColumnDefaultWidth(column: TableColumn): number {
    if (column.width) {
      const match = column.width.match(/^(\d+)px$/);
      if (match) return parseInt(match[1], 10);
    }
    return 150;
  }

  /**
   * Handles document mouse move for column resize
   * @internal
   */
  @HostListener('document:mousemove', ['$event'])
  onColumnResize(event: MouseEvent): void {
    if (!this.resizingColumn) return;

    const delta = event.pageX - this.resizeStartX;
    const newWidth = Math.max(50, this.resizeStartWidth + delta);

    this.columnWidths.update((widths) => ({
      ...widths,
      [this.resizingColumn!.field]: newWidth,
    }));
  }

  /**
   * Handles document mouse up to end column resize
   * @internal
   */
  @HostListener('document:mouseup')
  onColumnResizeEnd(): void {
    this.resizingColumn = null;
  }

  /**
   * Gets the width style for a column
   * @internal
   */
  getColumnWidth(column: TableColumn): string {
    const widths = this.columnWidths();
    if (widths[column.field]) {
      return `${widths[column.field]}px`;
    }
    return column.width || 'auto';
  }

  // ===== UTILITY METHODS =====

  /**
   * Gets CSS classes for the table
   * @internal
   */
  getTableClasses(): { [key: string]: boolean } {
    return {
      'i-table': true,
      'i-table--striped': this.striped,
      'i-table--hoverable': this.hoverable,
      'i-table--bordered': this.bordered,
      'i-table--small': this.size === 'small',
      'i-table--medium': this.size === 'medium',
      'i-table--large': this.size === 'large',
      'i-table--scrollable': this.scrollable,
      'i-table--loading': this.loading,
    };
  }

  /**
   * Track by function for rows
   * @internal
   */
  trackByRow(index: number, row: any): any {
    return row.id ?? index;
  }

  /**
   * Track by function for columns
   * @internal
   */
  trackByColumn(index: number, column: TableColumn): string {
    return column.field;
  }

  /**
   * Helper to get Math.min in template
   * @internal
   */
  Math = Math;
}
