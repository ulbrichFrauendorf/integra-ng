import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ITreeView, ITreeNode } from './tree-view.component';

describe('ITreeView', () => {
  let component: ITreeView;
  let fixture: ComponentFixture<ITreeView>;

  const mockTreeData: ITreeNode[] = [
    {
      key: '1',
      label: 'Parent 1',
      children: [
        { key: '1-1', label: 'Child 1-1', leaf: true },
        { key: '1-2', label: 'Child 1-2', leaf: true },
      ],
    },
    {
      key: '2',
      label: 'Parent 2',
      children: [{ key: '2-1', label: 'Child 2-1', leaf: true }],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITreeView, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ITreeView);
    component = fixture.componentInstance;
    component.value = mockTreeData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Inputs', () => {
    it('should have default values', () => {
      expect(component.selectionMode).toBe('single');
      expect(component.loading).toBe(false);
      expect(component.emptyMessage).toBe('No data found');
      expect(component.filter).toBe(false);
      expect(component.propagateSelectionUp).toBe(true);
      expect(component.propagateSelectionDown).toBe(true);
      expect(component.selectAll).toBe(false);
    });

    it('should accept value input', () => {
      const newData: ITreeNode[] = [{ key: '3', label: 'Test Node' }];
      component.value = newData;
      fixture.detectChanges();
      expect(component.value).toEqual(newData);
    });

    it('should accept selectionMode input', () => {
      component.selectionMode = 'checkbox';
      fixture.detectChanges();
      expect(component.selectionMode).toBe('checkbox');
    });
  });

  describe('Node expansion', () => {
    it('should expand a node', () => {
      const node = mockTreeData[0];
      const mockEvent = new Event('click');
      
      component.expandNode(mockEvent, node);
      expect(node.expanded).toBe(true);
    });

    it('should collapse a node', () => {
      const node = mockTreeData[0];
      node.expanded = true;
      const mockEvent = new Event('click');
      
      component.collapseNode(mockEvent, node);
      expect(node.expanded).toBe(false);
    });

    it('should toggle node expansion', () => {
      const node = mockTreeData[0];
      const mockEvent = new Event('click');
      
      component.toggleNode(mockEvent, node);
      expect(node.expanded).toBe(true);
      
      component.toggleNode(mockEvent, node);
      expect(node.expanded).toBe(false);
    });

    it('should emit onNodeExpand event', () => {
      const node = mockTreeData[0];
      const mockEvent = new Event('click');
      spyOn(component.onNodeExpand, 'emit');
      
      component.expandNode(mockEvent, node);
      expect(component.onNodeExpand.emit).toHaveBeenCalledWith({
        originalEvent: mockEvent,
        node,
      });
    });
  });

  describe('Single selection mode', () => {
    beforeEach(() => {
      component.selectionMode = 'single';
    });

    it('should select a node', () => {
      const node = mockTreeData[0];
      const mockEvent = new Event('click');
      
      component.selectSingleNode(mockEvent, node);
      expect(component.selection).toBe(node);
    });

    it('should deselect a selected node', () => {
      const node = mockTreeData[0];
      component.selection = node;
      const mockEvent = new Event('click');
      
      component.selectSingleNode(mockEvent, node);
      expect(component.selection).toBeNull();
    });

    it('should emit selectionChange event', () => {
      const node = mockTreeData[0];
      const mockEvent = new Event('click');
      spyOn(component.selectionChange, 'emit');
      
      component.selectSingleNode(mockEvent, node);
      expect(component.selectionChange.emit).toHaveBeenCalled();
    });
  });

  describe('Multiple selection mode', () => {
    beforeEach(() => {
      component.selectionMode = 'multiple';
      component.selection = [];
    });

    it('should select multiple nodes', () => {
      const node1 = mockTreeData[0];
      const node2 = mockTreeData[1];
      const mockEvent = new Event('click');
      
      component.selectMultipleNode(mockEvent, node1);
      component.selectMultipleNode(mockEvent, node2);
      
      expect(Array.isArray(component.selection)).toBe(true);
      expect((component.selection as ITreeNode[]).length).toBe(2);
    });

    it('should deselect a selected node', () => {
      const node = mockTreeData[0];
      component.selection = [node];
      const mockEvent = new Event('click');
      
      component.selectMultipleNode(mockEvent, node);
      expect((component.selection as ITreeNode[]).length).toBe(0);
    });
  });

  describe('Checkbox selection mode', () => {
    beforeEach(() => {
      component.selectionMode = 'checkbox';
      component.selection = [];
    });

    it('should select node with checkbox', () => {
      const node = mockTreeData[0].children![0];
      const mockEvent = new Event('click');
      
      component.selectCheckboxNode(mockEvent, node);
      expect((component.selection as ITreeNode[]).includes(node)).toBe(true);
    });

    it('should propagate selection down to children', () => {
      component.propagateSelectionDown = true;
      const parentNode = mockTreeData[0];
      const mockEvent = new Event('click');
      
      component.selectCheckboxNode(mockEvent, parentNode);
      
      const selection = component.selection as ITreeNode[];
      expect(selection.includes(parentNode.children![0])).toBe(true);
      expect(selection.includes(parentNode.children![1])).toBe(true);
    });

    it('should propagate selection up to parent', () => {
      component.propagateSelectionUp = true;
      const childNode = mockTreeData[0].children![0];
      const parentNode = mockTreeData[0];
      const mockEvent = new Event('click');
      
      component.selectCheckboxNode(mockEvent, childNode);
      
      const selection = component.selection as ITreeNode[];
      expect(selection.includes(parentNode)).toBe(true);
    });

    it('should detect partial selection', () => {
      const parentNode = mockTreeData[0];
      const child1 = parentNode.children![0];
      component.selection = [child1];
      
      expect(component.isPartiallySelected(parentNode)).toBe(true);
    });
  });

  describe('Filtering', () => {
    beforeEach(() => {
      component.filter = true;
    });

    it('should filter nodes by label', () => {
      component.filterValue = 'Child 1-1';
      component.applyFilter();
      
      expect(component.filteredValue.length).toBeGreaterThan(0);
    });

    it('should show all nodes when filter is empty', () => {
      component.filterValue = '';
      component.applyFilter();
      
      expect(component.filteredValue.length).toBe(mockTreeData.length);
    });

    it('should expand parent nodes when children match filter', () => {
      component.filterValue = 'Child 1-1';
      component.applyFilter();
      
      const filteredParent = component.filteredValue[0];
      expect(filteredParent.expanded).toBe(true);
    });
  });

  describe('Helper methods', () => {
    it('should detect if node has children', () => {
      const parentNode = mockTreeData[0];
      const leafNode = mockTreeData[0].children![0];
      
      expect(component.hasChildren(parentNode)).toBe(true);
      expect(component.hasChildren(leafNode)).toBe(false);
    });

    it('should get toggle icon based on expansion state', () => {
      const node = mockTreeData[0];
      node.expanded = false;
      
      expect(component.getToggleIcon(node)).toBe('pi pi-chevron-right');
      
      node.expanded = true;
      expect(component.getToggleIcon(node)).toBe('pi pi-chevron-down');
    });

    it('should get node icon based on node type', () => {
      const parentNode = mockTreeData[0];
      const leafNode = mockTreeData[0].children![0];
      
      expect(component.getNodeIcon(parentNode)).toContain('pi-folder');
      expect(component.getNodeIcon(leafNode)).toBe('pi pi-file');
    });
  });

  describe('Select All functionality', () => {
    beforeEach(() => {
      component.selectionMode = 'checkbox';
      component.selectAll = true;
    });

    it('should select all nodes', () => {
      component.selectAllChecked = true;
      component.onSelectAllChange();
      
      const allNodesCount = component.flattenNodes(component.filteredValue).length;
      expect((component.selection as ITreeNode[]).length).toBe(allNodesCount);
    });

    it('should deselect all nodes', () => {
      component.selection = component.flattenNodes(component.filteredValue);
      component.selectAllChecked = false;
      component.onSelectAllChange();
      
      expect((component.selection as ITreeNode[]).length).toBe(0);
    });
  });

  describe('Accessibility', () => {
    it('should have a unique component id', () => {
      expect(component.componentId).toContain('i-tree-view-');
    });

    it('should generate safe checkbox ids', () => {
      const node = mockTreeData[0];
      const id = component.getCheckboxId(node);
      expect(id).toMatch(/^i-tree-view-.*-checkbox-/);
    });
  });
});
