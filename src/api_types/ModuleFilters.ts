// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { AIIntegrationFilters } from "./AIIntegrationFilters";
import type { ChatFilters } from "./ChatFilters";

export type ModuleFilters =
  | { AIIntegration: AIIntegrationFilters }
  | { Chat: ChatFilters };