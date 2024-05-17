// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { Code } from "./Code";
import type { FormField } from "./FormField";
import type { Image } from "./Image";
import type { Link } from "./Link";

export type Content =
  | { Text: string }
  | { Image: Image }
  | { Link: Link }
  | { Code: Code }
  | { FilePath: string }
  | { FormField: FormField };
