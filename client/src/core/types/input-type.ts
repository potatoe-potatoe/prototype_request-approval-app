export interface DropdownOption<T extends string | number = string> {
  id: T;
  label: string;
}