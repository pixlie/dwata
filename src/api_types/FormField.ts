// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ContentSpec } from "./ContentSpec";
import type { ContentType } from "./ContentType";

export interface FormField {
  name: string;
  label: string;
  description: string | null;
  field: [ContentType, Array<ContentSpec>];
  isRequired: boolean | null;
  isEditable: boolean | null;
}