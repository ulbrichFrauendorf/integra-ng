import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UniqueComponentId } from '../../utils/uniquecomponentid';
import { ICheckbox } from '../checkbox/checkbox.component';
import { IInputText } from '../input-text/input-text.component';

export interface ITreeNode {
  key?: string;
  label?: string;
  data?: any;
  icon?: string;
  expandedIcon?: string;
  collapsedIcon?: string;
  children?: ITreeNode[];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: ITreeNode;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
  loading?: boolean;
}

export type TreeSelectionMode = 'single' | 'multiple' | 'checkbox';

@Component({
  selector: 'i-tree-view',
  standalone: true,
  imports: [CommonModule, FormsModule, ICheckbox, IInputText],
  templateUrl: './tree-view.component.html',
  styleUrl: './tree-view.component.scss',
})
export class ITreeView implements OnInit, OnChanges {
  @Input() value: ITreeNode[] = [];
  @Input() selectionMode: TreeSelectionMode = 'single';
  @Input() selection: ITreeNode | ITreeNode[] | null = null;
  @Input() scrollHeight?: string;
  @Input() loading = false;
  @Input() emptyMessage = 'No data found';
  @Input() togglerTemplate?: string;
  @Input() filter = false;
  @Input() filterBy = 'label';
  @Input() filterMode = 'lenient';
  @Input() filterPlaceholder = 'Search';
  @Input() filteredNodes: ITreeNode[] = [];
  @Input() validateDrop = false;
  @Input() propagateSelectionUp = true;
  @Input() propagateSelectionDown = true;
  @Input() selectAll = false; // Show select all checkbox for checkbox mode

  @Output() onNodeSelect = new EventEmitter<{
    originalEvent: Event;
    node: ITreeNode;
  }>();
  @Output() onNodeUnselect = new EventEmitter<{
    originalEvent: Event;
    node: ITreeNode;
  }>();
  @Output() onNodeExpand = new EventEmitter<{
    originalEvent: Event;
    node: ITreeNode;
  }>();
  @Output() onNodeCollapse = new EventEmitter<{
    originalEvent: Event;
    node: ITreeNode;
  }>();
  @Output() selectionChange = new EventEmitter<ITreeNode | ITreeNode[]>();

  componentId = UniqueComponentId('i-tree-view-');
  filteredValue: ITreeNode[] = [];
  filterValue = '';
  selectAllChecked = false;
  private temporaryHighlighted = new Set<ITreeNode>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.updateSerializedValue();
    this.updateSelectAllState();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.updateSerializedValue();
      this.updateSelectAllState();
    }
    if (changes['selection']) {
      this.updateSelectAllState();
    }
  }

  updateSerializedValue() {
    this.filteredValue = this.value || [];
    this.initializeParentReferences(this.filteredValue);
    if (this.filter && this.filterValue) {
      this.applyFilter();
    }
  }

  initializeParentReferences(nodes: ITreeNode[], parent?: ITreeNode) {
    if (!nodes) return;

    for (let node of nodes) {
      node.parent = parent;
      if (node.children) {
        this.initializeParentReferences(node.children, node);
      }
    }
  }

  onFilterKeyup(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filterValue = target.value;
    this.applyFilter();
  }

  applyFilter() {
    if (!this.filterValue.trim()) {
      this.filteredValue = this.value;
      return;
    }

    this.filteredValue = this.filterNodes(
      this.value,
      this.filterValue.toLowerCase()
    );
  }

  filterNodes(nodes: ITreeNode[], filterValue: string): ITreeNode[] {
    const filteredNodes: ITreeNode[] = [];

    for (let node of nodes) {
      const nodeMatches = this.isNodeMatch(node, filterValue);
      const filteredChildren = node.children
        ? this.filterNodes(node.children, filterValue)
        : [];

      if (nodeMatches || filteredChildren.length > 0) {
        const clonedNode = { ...node };
        if (filteredChildren.length > 0) {
          clonedNode.children = filteredChildren;
          clonedNode.expanded = true;
        }
        filteredNodes.push(clonedNode);
      }
    }

    return filteredNodes;
  }

  isNodeMatch(node: ITreeNode, filterValue: string): boolean {
    const nodeValue = (node.label || '').toLowerCase();
    return nodeValue.includes(filterValue);
  }

  isSelected(node: ITreeNode): boolean {
    if (this.selectionMode === 'single') {
      return this.selection === node;
    } else if (
      this.selectionMode === 'multiple' ||
      this.selectionMode === 'checkbox'
    ) {
      return Array.isArray(this.selection)
        ? this.selection.includes(node)
        : false;
    }
    return false;
  }

  isNodeHighlighted(node: ITreeNode): boolean {
    // Only highlight selected nodes for single and multiple selection modes
    // For checkbox mode, only show temporary highlights
    if (this.selectionMode === 'checkbox') {
      return this.temporaryHighlighted.has(node);
    }
    return this.isSelected(node);
  }

  isTemporarilyHighlighted(node: ITreeNode): boolean {
    return this.temporaryHighlighted.has(node);
  }

  private addTemporaryHighlight(node: ITreeNode) {
    this.temporaryHighlighted.add(node);
    setTimeout(() => {
      this.temporaryHighlighted.delete(node);
      this.cdr.detectChanges();
    }, 400);
  }

  isPartiallySelected(node: ITreeNode): boolean {
    if (this.selectionMode !== 'checkbox' || !node.children) {
      return false;
    }

    const selection = Array.isArray(this.selection) ? this.selection : [];
    const selectedChildren = node.children.filter((child) =>
      selection.includes(child)
    );
    const totalChildren = node.children.length;

    // Node is partially selected when some (but not all) children are selected
    // This will trigger the indeterminate state in the checkbox
    return (
      selectedChildren.length > 0 && selectedChildren.length < totalChildren
    );
  }

  onNodeClick(event: Event, node: ITreeNode) {
    if (node.selectable === false) {
      return;
    }

    // In checkbox mode, don't handle node selection through node clicks
    // Selection should only happen through the checkbox component
    if (this.selectionMode === 'checkbox') {
      return;
    }

    if (this.selectionMode === 'single') {
      this.selectSingleNode(event, node);
    } else if (this.selectionMode === 'multiple') {
      this.selectMultipleNode(event, node);
    }
  }

  selectSingleNode(event: Event, node: ITreeNode) {
    if (this.selection === node) {
      this.selection = null;
      this.onNodeUnselect.emit({ originalEvent: event, node });
    } else {
      this.selection = node;
      this.onNodeSelect.emit({ originalEvent: event, node });
    }
    this.selectionChange.emit(this.selection || undefined);
  }

  selectMultipleNode(event: Event, node: ITreeNode) {
    const selection = Array.isArray(this.selection) ? [...this.selection] : [];
    const index = selection.indexOf(node);

    if (index >= 0) {
      selection.splice(index, 1);
      this.onNodeUnselect.emit({ originalEvent: event, node });
    } else {
      selection.push(node);
      this.onNodeSelect.emit({ originalEvent: event, node });
    }

    this.selection = selection;
    this.selectionChange.emit(this.selection);
  }

  selectCheckboxNode(event: Event, node: ITreeNode) {
    const selection = Array.isArray(this.selection) ? [...this.selection] : [];
    const selected = this.isSelected(node);

    if (selected) {
      this.unselectNode(node, selection);
      this.onNodeUnselect.emit({ originalEvent: event, node });
    } else {
      this.selectNode(node, selection);
      this.onNodeSelect.emit({ originalEvent: event, node });
    }

    if (this.propagateSelectionDown && node.children) {
      this.propagateDown(node, !selected, selection);
    }

    if (this.propagateSelectionUp && node.parent) {
      this.propagateUp(node.parent, selection);
    }

    this.selection = selection;
    this.updateSelectAllState();
    this.selectionChange.emit(this.selection);
  }

  onCheckboxChange(checked: boolean, node: ITreeNode) {
    // Add temporary highlight when checkbox is clicked
    this.addTemporaryHighlight(node);

    // Create a fake event for compatibility with existing methods
    const fakeEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    // Call the checkbox selection logic
    this.selectCheckboxNode(fakeEvent, node);
  }

  selectNode(node: ITreeNode, selection: ITreeNode[]) {
    if (!selection.includes(node)) {
      selection.push(node);
    }
  }

  unselectNode(node: ITreeNode, selection: ITreeNode[]) {
    const index = selection.indexOf(node);
    if (index >= 0) {
      selection.splice(index, 1);
    }
  }

  propagateDown(node: ITreeNode, select: boolean, selection: ITreeNode[]) {
    if (node.children) {
      for (let child of node.children) {
        if (select) {
          this.selectNode(child, selection);
        } else {
          this.unselectNode(child, selection);
        }

        if (child.children) {
          this.propagateDown(child, select, selection);
        }
      }
    }
  }

  propagateUp(node: ITreeNode, selection: ITreeNode[]) {
    if (node.children) {
      // Count selected children based on the working selection array
      const selectedChildren = node.children.filter((child) =>
        selection.includes(child)
      );
      const totalChildren = node.children.length;

      if (selectedChildren.length === totalChildren) {
        // All children selected - select parent (will show as fully checked)
        this.selectNode(node, selection);
      } else if (selectedChildren.length > 0) {
        // Some children selected - select parent (will show as indeterminate)
        this.selectNode(node, selection);
      } else {
        // No children selected - unselect parent
        this.unselectNode(node, selection);
      }

      if (node.parent) {
        this.propagateUp(node.parent, selection);
      }
    }
  }

  toggleNode(event: Event, node: ITreeNode) {
    if (node.expanded) {
      this.collapseNode(event, node);
    } else {
      this.expandNode(event, node);
    }
  }

  expandNode(event: Event, node: ITreeNode) {
    node.expanded = true;
    this.onNodeExpand.emit({ originalEvent: event, node });
  }

  collapseNode(event: Event, node: ITreeNode) {
    node.expanded = false;
    this.onNodeCollapse.emit({ originalEvent: event, node });
  }

  hasChildren(node: ITreeNode): boolean {
    return !!(node.children && node.children.length > 0);
  }

  getToggleIcon(node: ITreeNode): string {
    if (node.loading) {
      return 'pi pi-spin pi-spinner';
    }

    const expanded = node.expanded;

    if (node.expandedIcon && node.collapsedIcon) {
      return expanded ? node.expandedIcon : node.collapsedIcon;
    }

    return expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right';
  }

  getNodeIcon(node: ITreeNode): string {
    if (node.icon) {
      return node.icon;
    }

    if (this.hasChildren(node)) {
      return node.expanded ? 'pi pi-folder-open' : 'pi pi-folder';
    }

    return 'pi pi-file';
  }

  getCheckboxId(node: ITreeNode): string {
    // Generate a safe ID for the checkbox using the component ID and node key
    const safeKey = (node.key || node.label || 'node')
      .replace(/[^a-zA-Z0-9\-_]/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
    return `${this.componentId}-checkbox-${safeKey}`;
  }

  // Select All functionality
  onSelectAllChange() {
    if (this.selectionMode !== 'checkbox') return;

    if (this.selectAllChecked) {
      this.selection = this.flattenNodes(this.filteredValue);
    } else {
      this.selection = [];
    }
    this.selectionChange.emit(this.selection);
  }

  private flattenNodes(nodes: ITreeNode[]): ITreeNode[] {
    let result: ITreeNode[] = [];
    nodes.forEach((node) => {
      result.push(node);
      if (node.children) {
        result = result.concat(this.flattenNodes(node.children));
      }
    });
    return result;
  }

  updateSelectAllState() {
    if (this.selectionMode !== 'checkbox' || !this.selectAll) return;

    const allNodes = this.flattenNodes(this.filteredValue);
    const selectedNodes = Array.isArray(this.selection) ? this.selection : [];
    this.selectAllChecked =
      allNodes.length > 0 && selectedNodes.length === allNodes.length;
  }
}
