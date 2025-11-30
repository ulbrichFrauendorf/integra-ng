export interface MenuItem {
  label: string;
  icon?: string;
  routerLink?: string[];
  items?: MenuItem[];
}

export interface MenuModel {
  label: string;
  items: MenuItem[];
  separator?: boolean;
}
