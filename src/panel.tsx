import { useCallback, useId, useRef, useSyncExternalStore, type ComponentType } from 'react';
import { SegmentedControl } from '@deepseek-ai/dsh-client-ui-primitives';
import type { LocaleService } from './host/context.ts';
import type { CopyKey, Translate } from './locale.ts';
import type { Controller } from './controller.ts';
import { LIMITS, type Amount, type Fit, type Switch } from './settings.ts';

// Settings section UI. Reads the controller snapshot; never touches the material.
export const PANEL_CSS = `
[data-acrylic-settings] { padding: 24px; max-width: 640px; margin: auto; color: var(--dsw-alias-label-primary); font: inherit; }
[data-acrylic-settings] h2 { margin: 0 0 12px; font-size: 18px; }
[data-acrylic-settings] p { color: var(--dsw-alias-label-secondary); line-height: 1.6; }
[data-acrylic-settings] .acrylic-row { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin: 20px 0; }
[data-acrylic-settings] .acrylic-row label { min-width: 100px; }
[data-acrylic-settings] input[type=range] { flex: 1; min-width: 120px; accent-color: var(--dsw-alias-brand-primary); }
[data-acrylic-settings] output { min-width: 48px; font-variant-numeric: tabular-nums; }
[data-acrylic-settings] button:not([role=tab]) { border: 1px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-md, 2px); padding: 7px 12px; color: inherit; background: var(--dsw-alias-bg-layer-2); font: inherit; cursor: pointer; }
[data-acrylic-settings] button:not([role=tab]):hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
[data-acrylic-settings] button:not([role=tab]):active:not(:disabled) { background: var(--dsw-alias-interactive-bg-active); }
[data-acrylic-settings] button:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
[data-acrylic-settings] button:disabled { opacity: .5; cursor: default; }
[data-acrylic-settings] .acrylic-preview { width: 100%; max-height: 180px; object-fit: cover; border-radius: var(--dsw-radius-lg, 0px); }
[data-acrylic-settings] [role=alert] { color: var(--dsw-alias-state-error-primary); }
[data-acrylic-settings] .acrylic-filename { overflow-wrap: anywhere; }
`;

const FITS = ['cover', 'contain', 'stretch', 'tile'] as const satisfies readonly Fit[];
const FIT_HINTS: Record<Fit, CopyKey> = { cover: 'coverHint', contain: 'containHint', stretch: 'stretchHint', tile: 'tileHint' };

export function createSettingsPanel(controller: Controller, locale: LocaleService, t: Translate): ComponentType {
  return function AcrylicSettings() {
    const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
    const subscribeLocale = useCallback((listener: () => void) => locale.subscribe(listener), []);
    const localeRevision = useCallback(() => locale.getSnapshot().revision, []);
    useSyncExternalStore(subscribeLocale, localeRevision);
    const input = useRef<HTMLInputElement>(null);
    const id = useId();
    const locked = state.loading || state.busy;
    function toggle(key: Switch, title: string, disabled = locked) {
      return (
        <div className="acrylic-row">
          <label><input
            type="checkbox" checked={state.settings[key]} disabled={disabled}
            onChange={event => void controller.commit({ [key]: event.target.checked })}
          />{` ${title}`}</label>
        </div>
      );
    }
    function slider(key: Amount, title: string, unit: string) {
      return (
        <div className="acrylic-row" key={key}>
          <label htmlFor={`${id}-${key}`}>{title}</label>
          <input
            id={`${id}-${key}`} type="range" min={0} max={LIMITS[key]} step={1}
            value={state.settings[key]} disabled={locked}
            onChange={event => controller.preview({ [key]: Number(event.target.value) })}
            onPointerUp={() => void controller.commitPreview(key)}
            onKeyUp={() => void controller.commitPreview(key)}
            onBlur={() => void controller.commitPreview(key)}
          />
          <output htmlFor={`${id}-${key}`}>{`${state.settings[key]}${unit}`}</output>
        </div>
      );
    }
    return (
      <section data-acrylic-settings="">
        <h2>{t('title')}</h2>
        {toggle('enabled', t('enabled'))}
        {toggle('fluent', t('fluent'))}
        {toggle('reveal', t('reveal'), locked || !state.settings.fluent)}
        {state.url ? <img className="acrylic-preview" src={state.url} alt={t('preview')} /> : null}
        <p className="acrylic-filename">{state.name || t('noImage')}</p>
        <input
          ref={input} type="file" accept="image/png,image/jpeg,image/webp" hidden
          onChange={event => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (file) void controller.upload(file);
          }}
        />
        <div className="acrylic-row">
          <button type="button" disabled={locked} onClick={() => input.current?.click()}>{state.busy ? t('processing') : t('choose')}</button>
          <button type="button" disabled={locked || !state.url} onClick={() => void controller.remove()}>{t('remove')}</button>
          <button type="button" disabled={locked} onClick={() => void controller.reset()}>{t('reset')}</button>
        </div>
        <div className="acrylic-row">
          <span>{t('fit')}</span>
          <SegmentedControl
            id={`${id}-fit`} label={t('fit')} value={state.settings.fit}
            disabled={locked}
            onChange={fit => void controller.commit({ fit })}
            options={FITS.map(value => ({ value, label: t(value) }))}
          />
        </div>
        {FITS.map(fit => (
          <p key={fit} id={`${id}-fit-${fit}-panel`} role="tabpanel" aria-labelledby={`${id}-fit-${fit}`} hidden={state.settings.fit !== fit}>{t(FIT_HINTS[fit])}</p>
        ))}
        {slider('blur', t('blur'), 'px')}
        {slider('tint', t('tint'), '%')}
        {slider('noise', t('noise'), '%')}
        <p>{t('imageHint')}</p>
        <h2>{t('preferences')}</h2>
        {toggle('hideDiffHover', t('hideDiffHover'))}
        <p>{t('diffHint')}</p>
        {state.error ? <div role="alert"><p>{t('saveError')}</p><details><summary>{t('details')}</summary><p>{state.error}</p></details></div> : null}
        {state.loading ? <p role="status">{t('loading')}</p> : null}
      </section>
    );
  };
}
