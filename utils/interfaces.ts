import { Href } from 'expo-router';

export interface INavbarTabs {
  label: string;
  path: any;
}

export interface ITabItem {
  key: string;
  value: string;
  path: Href<string | object>;
}

export interface ICustomSwitch {
  isEnabled: boolean;
  toggleSwitch: () => void;
  label: string;
}
