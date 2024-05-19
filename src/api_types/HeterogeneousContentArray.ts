// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { Content } from "./Content";
import type { ContentSpec } from "./ContentSpec";
import type { ContentType } from "./ContentType";

export interface HeterogeneousContentArray {
  contents: Array<[ContentType, Array<ContentSpec>, Array<Content>]>;
}