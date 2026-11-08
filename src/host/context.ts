// Structural types for the slice of the DSH client runtime this plugin uses
// (checked against DSH 0.2.2-rc.1). Kept local, like side-chat's host.ts,
// instead of importing the shell's internal packages.
import type { ComponentType } from 'react';
import type { HostToken } from './tokens.ts';

export type Dispose = () => void;

/** One override value per color scheme; the host rejects bare strings. */
export interface ThemeModes {
  readonly light: string;
  readonly dark: string;
}

export type TokenOverrides = Readonly<Partial<Record<HostToken, ThemeModes>>>;

export interface ThemeService {
  overrideTokens(source: string, tokens: TokenOverrides): Dispose;
}

export interface SlotsService {
  inject(name: string, factory: () => Dispose | void): Dispose;
  register<P extends object>(definition: Readonly<Record<string, unknown>>, component: ComponentType<P>): Dispose;
}

export interface LocaleService {
  register(ns: string, locale: string, dict: Readonly<Record<string, string>>): Dispose;
  bind(ns: string): (key: string) => string;
  getSnapshot(): { readonly active: string; readonly revision: number };
  subscribe(listener: () => void): Dispose;
}

export interface ClientContext {
  readonly locale: LocaleService;
  readonly slots: SlotsService;
  readonly theme?: ThemeService | undefined;
  effect(callback: () => Dispose | void, label?: string): unknown;
}
