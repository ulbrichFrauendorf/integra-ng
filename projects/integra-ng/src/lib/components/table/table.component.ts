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
  effect,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CdkVirtualScrollViewport,
  CdkVirtualForOf,
  CdkFixedSizeVirtualScroll,
} from '@angular/cdk/scrolling';
import { IInputText } from '../input-text/input-text.component';
import { IButton } from '../button/button.component';
import { ICheckbox } from '../checkbox/checkbox.component';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { ISeverity } from '@shared/enums/IButtonSeverity';
import { NoContentComponent } from '../no-content/no-content.component';
import { TooltipDirective } from '../../directives/tooltip/tooltip.directive';

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
  type?: 'text' | 'number' | 'date' | 'boolean' | 'currency' | 'icon';
  /** Format string for date/currency formatting */
  format?: string;
  /** Icon class for 'icon' type - can be a field name or a function that returns the icon class */
  iconClass?: string | ((row: any) => string);
  /** Severity/color for content - applies to text and icons, can be a field name or a function */
  severity?: ISeverity | string | ((row: any) => ISeverity | string);
  /** Icon size for 'icon' type */
  iconSize?: string;
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
  /** Tooltip text to display on hover */
  tooltip?: string | ((row: any) => string);
  /** Whether the action is visible (can be a function) */
  visible?: boolean | ((row: any) => boolean);
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
 * Grouped table data structure
 */
export interface TableGroup {
  /** Group name/label */
  label: string;
  /** Columns specific to this group (optional, uses table columns if not provided) */
  columns?: TableColumn[];
  /** Data rows for this group */
  data: any[];
  /** Whether this group is initially expanded */
  expanded?: boolean;
  /** Custom CSS class for the group */
  styleClass?: string;
}

/**
 * Download event configuration
 */
export interface TableDownloadEvent {
  /** Download format */
  format: 'csv' | 'excel' | 'json';
  /** Filtered data to download */
  data: any[];
  /** Columns to include in download */
  columns: TableColumn[];
}

/**
 * Virtual scroll configuration
 */
export interface VirtualScrollConfig {
  /** Enable virtual scrolling */
  enabled: boolean;
  /** Item size in pixels (height of each row) */
  itemSize?: number;
  /** Minimum buffer size in pixels */
  minBufferPx?: number;
  /** Maximum buffer size in pixels */
  maxBufferPx?: number;
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
    CdkVirtualScrollViewport,
    CdkVirtualForOf,
    CdkFixedSizeVirtualScroll,
    IInputText,
    IButton,
    ICheckbox,
    NoContentComponent,
    TooltipDirective,
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
   * Grouped data mode - when provided, table will render in grouped mode
   */
  groupedData: InputSignal<TableGroup[]> = input<TableGroup[]>([]);

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
   * Current sort field (backed by a signal so computed can track changes)
   */
  private _sortField = signal('');
  @Input()
  set sortField(val: string) {
    this._sortField.set(val ?? '');
  }
  get sortField(): string {
    return this._sortField();
  }

  /**
   * Sort direction (backed by a signal)
   * @default 'asc'
   */
  private _sortOrder = signal<'asc' | 'desc'>('asc');
  @Input()
  set sortOrder(val: 'asc' | 'desc') {
    this._sortOrder.set(val === 'desc' ? 'desc' : 'asc');
  }
  get sortOrder(): 'asc' | 'desc' {
    return this._sortOrder();
  }

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
   * Property name to uniquely identify rows (improves selection performance)
   * When provided, uses this property for row comparison instead of JSON.stringify
   */
  @Input() dataKey?: string;

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

  /**
   * Alias Input for convenience — developer can set `height` or `scrollHeight`.
   */
  @Input() height?: string;

  // ===== VIRTUAL SCROLL =====

  /**
   * Enable virtual scrolling for large datasets
   * @default false
   */
  @Input() virtualScroll = false;

  /**
   * Item size for virtual scroll (height of each row in pixels)
   * @default 48
   */
  @Input() virtualScrollItemSize = 48;

  /**
   * Minimum buffer size in pixels for virtual scroll
   * @default 200
   */
  @Input() virtualScrollMinBufferPx = 200;

  /**
   * Maximum buffer size in pixels for virtual scroll
   * @default 400
   */
  @Input() virtualScrollMaxBufferPx = 400;

  /**
   * Reference to the virtual scroll viewport
   * @internal
   */
  @ViewChild(CdkVirtualScrollViewport)
  virtualScrollViewport?: CdkVirtualScrollViewport;

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

  // ===== DOWNLOAD FEATURES =====

  /**
   * Enable download functionality
   * @default false
   */
  @Input() downloadable = false;

  /**
   * Download mode - 'direct' for client-side download, 'api' for server-side
   * @default 'direct'
   */
  @Input() downloadMode: 'direct' | 'api' = 'direct';

  /**
   * Default download format
   * @default 'csv'
   */
  @Input() downloadFormat: 'csv' | 'excel' | 'json' = 'csv';

  /**
   * Custom download filename (without extension)
   */
  @Input() downloadFilename?: string;

  /**
   * Event emitted when download is triggered in 'api' mode
   */
  @Output() onDownload = new EventEmitter<TableDownloadEvent>();

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
   * Expanded groups (for grouped data mode)
   * @internal
   */
  expandedGroups = signal<Set<string>>(new Set());

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

  constructor(private el: ElementRef) {
    effect(() => {
      const groups = this.groupedData();
      if (groups.length > 0) {
        const initialExpandedGroups = new Set<string>();
        groups.forEach((group, index) => {
          if (group.expanded !== false) {
            initialExpandedGroups.add(group.label || index.toString());
          }
        });
        this.expandedGroups.set(initialExpandedGroups);
      }
    });
  }

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
          return String(value)
            .toLowerCase()
            .includes(globalFilter.toLowerCase());
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
          return String(value)
            .toLowerCase()
            .includes(filterValue.toLowerCase());
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
      case 'icon':
        // Icons are rendered in the template, not as text
        return '';
      default:
        return String(value);
    }
  }

  /**
   * Gets the icon class for a cell
   * @internal
   */
  getCellIcon(row: any, column: TableColumn): string {
    if (column.type !== 'icon') return '';

    if (typeof column.iconClass === 'function') {
      return column.iconClass(row);
    } else if (typeof column.iconClass === 'string') {
      // Check if it's a field reference or a direct icon class
      const fieldValue = this.getCellValue(row, column.iconClass);
      return fieldValue || column.iconClass;
    }

    // Fallback to field value
    return this.getCellValue(row, column.field) || '';
  }

  /**
   * Gets the severity/color for a cell (applies to text and icons)
   * @internal
   */
  getCellSeverity(row: any, column: TableColumn): string {
    if (!column.severity) return '';

    if (typeof column.severity === 'function') {
      return String(column.severity(row));
    } else if (typeof column.severity === 'string') {
      // Check if it's a field reference or a direct severity value
      const fieldValue = this.getCellValue(row, column.severity);
      return fieldValue || column.severity;
    }

    return '';
  }

  /**
   * Checks if a column should render an icon
   * @internal
   */
  isIconColumn(column: TableColumn): boolean {
    return column.type === 'icon';
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
    return this.sortOrder === 'asc'
      ? 'pi pi-sort-amount-up'
      : 'pi pi-sort-amount-down';
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
        this.selection = this.selection.filter(
          (s) => !this.compareObjects(s, row)
        );
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

    const data = this.processedData();
    const allSelected = this.areAllRowsSelected();

    if (allSelected) {
      // Deselect all visible rows
      this.selection = this.selection.filter(
        (s: any) => !data.some((d: any) => this.compareObjects(s, d))
      );
    } else {
      // Select all visible rows
      const newSelections = data.filter(
        (d: any) => !this.selection.some((s: any) => this.compareObjects(s, d))
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
    const data = this.processedData();
    if (data.length === 0) return false;
    return data.every((d: any) =>
      this.selection?.some((s: any) => this.compareObjects(s, d))
    );
  }

  /**
   * Checks if some (but not all) rows are selected
   * @internal
   */
  areSomeRowsSelected(): boolean {
    const data = this.processedData();
    const selectedCount = data.filter((d: any) =>
      this.selection?.some((s: any) => this.compareObjects(s, d))
    ).length;
    return selectedCount > 0 && selectedCount < data.length;
  }

  /**
   * Compares two objects for equality using dataKey if provided,
   * otherwise falls back to JSON.stringify comparison
   * @internal
   */
  private compareObjects(obj1: any, obj2: any): boolean {
    if (this.dataKey) {
      return obj1?.[this.dataKey] === obj2?.[this.dataKey];
    }
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

  /**
   * Checks if an action is visible for a row
   * @internal
   */
  isActionVisible(action: TableAction, row: any): boolean {
    if (action.visible === undefined) return true;
    if (typeof action.visible === 'function') {
      return action.visible(row);
    }
    return action.visible;
  }

  /**
   * Gets the tooltip text for an action
   * @internal
   */
  getActionTooltip(action: TableAction, row: any): string {
    if (!action.tooltip) return '';
    if (typeof action.tooltip === 'function') {
      return action.tooltip(row);
    }
    return action.tooltip;
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

  // ===== GROUP EXPANSION METHODS =====

  /**
   * Toggles group expansion
   * @internal
   */
  toggleGroupExpansion(groupLabel: string): void {
    const expanded = this.expandedGroups();
    const isExpanded = expanded.has(groupLabel);
    const newExpanded = new Set(expanded);

    if (isExpanded) {
      newExpanded.delete(groupLabel);
    } else {
      newExpanded.add(groupLabel);
    }

    this.expandedGroups.set(newExpanded);
  }

  /**
   * Checks if a group is expanded
   * @internal
   */
  isGroupExpanded(groupLabel: string): boolean {
    return this.expandedGroups().has(groupLabel);
  }

  /**
   * Gets columns for a specific group
   * @internal
   */
  getGroupColumns(group: TableGroup): TableColumn[] {
    return group.columns || this.columns();
  }

  /**
   * Checks if table is in grouped mode
   * @internal
   */
  isGroupedMode(): boolean {
    return this.groupedData().length > 0;
  }

  // ===== DOWNLOAD METHODS =====

  /**
   * Handles download button click
   * @internal
   */
  handleDownload(): void {
    if (this.downloadMode === 'api') {
      // Emit event for API-based download
      this.onDownload.emit({
        format: this.downloadFormat,
        data: this.isGroupedMode()
          ? this.getFlattenedGroupedData()
          : this.processedData(),
        columns: this.columns(),
      });
    } else {
      // Direct download
      this.downloadData();
    }
  }

  /**
   * Gets flattened data from grouped data
   * @internal
   */
  private getFlattenedGroupedData(): any[] {
    const flattened: any[] = [];
    this.groupedData().forEach((group) => {
      flattened.push(...(group.data || []));
    });
    return flattened;
  }

  /**
   * Downloads table data directly (client-side)
   * @internal
   */
  private downloadData(): void {
    const data = this.isGroupedMode()
      ? this.getFlattenedGroupedData()
      : this.processedData();
    const columns = this.columns();
    const filename = this.downloadFilename || 'table-data';

    switch (this.downloadFormat) {
      case 'csv':
        this.downloadCSV(data, columns, filename);
        break;
      case 'json':
        this.downloadJSON(data, filename);
        break;
      case 'excel':
        // For Excel, we'll fall back to CSV with .xls extension
        // A full Excel implementation would require a library like xlsx
        this.downloadCSV(data, columns, filename, 'xls');
        break;
    }
  }

  /**
   * Downloads data as CSV
   * @internal
   */
  private downloadCSV(
    data: any[],
    columns: TableColumn[],
    filename: string,
    extension: string = 'csv'
  ): void {
    // Create CSV header
    const headers = columns
      .map((col) => {
        const escaped = String(col.header).replace(/"/g, '""');
        return escaped.includes(',') ||
          escaped.includes('"') ||
          escaped.includes('\n')
          ? `"${escaped}"`
          : escaped;
      })
      .join(',');

    // Create CSV rows
    const rows = data.map((row) => {
      return columns
        .map((col) => {
          const value = this.getCellValue(row, col.field);
          const formatted = this.formatCellValue(value, col);
          // Escape quotes and wrap in quotes if contains comma or quote
          const escaped = String(formatted).replace(/"/g, '""');
          return escaped.includes(',') ||
            escaped.includes('"') ||
            escaped.includes('\n')
            ? `"${escaped}"`
            : escaped;
        })
        .join(',');
    });

    // Combine header and rows
    const csv = [headers, ...rows].join('\n');

    // Create and download file
    this.downloadFile(csv, `${filename}.${extension}`, 'text/csv');
  }

  /**
   * Downloads data as JSON
   * @internal
   */
  private downloadJSON(data: any[], filename: string): void {
    const json = JSON.stringify(data, null, 2);
    this.downloadFile(json, `${filename}.json`, 'application/json');
  }

  /**
   * Creates and triggers file download
   * @internal
   */
  private downloadFile(
    content: string,
    filename: string,
    mimeType: string
  ): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
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
    this.resizeStartWidth =
      widths[column.field] || this.getColumnDefaultWidth(column);
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
      'i-table--scrollable':
        this.scrollable || !!(this.height || this.scrollHeight),
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

  // ===== VIRTUAL SCROLL METHODS =====

  /**
   * Scrolls to a specific index in the virtual scroll viewport
   * @param index - The index to scroll to
   * @param behavior - Scroll behavior ('auto' or 'smooth')
   */
  scrollToIndex(index: number, behavior: ScrollBehavior = 'auto'): void {
    if (this.virtualScroll && this.virtualScrollViewport) {
      this.virtualScrollViewport.scrollToIndex(index, behavior);
    }
  }

  /**
   * Scrolls to a specific offset in the virtual scroll viewport
   * @param offset - The offset in pixels to scroll to
   * @param behavior - Scroll behavior ('auto' or 'smooth')
   */
  scrollToOffset(offset: number, behavior: ScrollBehavior = 'auto'): void {
    if (this.virtualScroll && this.virtualScrollViewport) {
      this.virtualScrollViewport.scrollToOffset(offset, behavior);
    }
  }

  /**
   * Gets the total content size of the virtual scroll viewport
   * @returns The total content size in pixels
   */
  getVirtualScrollContentSize(): number {
    if (this.virtualScroll && this.virtualScrollViewport) {
      return this.virtualScrollViewport.measureScrollOffset('bottom');
    }
    return 0;
  }

  /**
   * Gets the current scroll offset of the virtual scroll viewport
   * @returns The current scroll offset in pixels
   */
  getVirtualScrollOffset(): number {
    if (this.virtualScroll && this.virtualScrollViewport) {
      return this.virtualScrollViewport.measureScrollOffset();
    }
    return 0;
  }
}
