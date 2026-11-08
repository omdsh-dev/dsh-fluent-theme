import type { ClientContext } from './host/context.ts';
import { PLUGIN_ID } from './settings.ts';
import { createStyleSheet } from './style.ts';
import { createController } from './controller.ts';
import { createAppearance } from './appearance.ts';
import { createSettingsPanel, PANEL_CSS } from './panel.tsx';

import { bindCopy, EN, LOCALE_NS, ZH } from './locale.ts';

// Client entry: wire the controller to the appearance and the settings slot.
export const inject = ['slots', 'theme', 'locale'];
export function apply(ctx: ClientContext) {
  ctx.effect(() => {
    const disposeEn = ctx.locale.register(LOCALE_NS, 'en', EN);
    const disposeZh = ctx.locale.register(LOCALE_NS, 'zh', ZH);
    return () => { disposeZh(); disposeEn(); };
  }, 'fluent theme translations');
  const t = bindCopy(ctx.locale);
  const controller = createController(window);
  const appearance = createAppearance(document, window, ctx.theme);
  const render = () => appearance.update(controller.getSnapshot());
  const unsubscribe = controller.subscribe(render);
  render();
  ctx.effect(() => () => {
    unsubscribe();
    appearance.dispose();
    controller.dispose();
  }, 'acrylic wallpaper lifecycle');
  ctx.effect(() => {
    const sheet = createStyleSheet(document, `${PLUGIN_ID}-settings`, PANEL_CSS);
    sheet.toggle(true);
    return sheet.dispose;
  });
  ctx.effect(() => {
    // Hide the HoverCard's whole portal (a display:contents span around the
    // card and its pointer bridge), avoiding an empty floating border/shadow.
    // This is visual only: the host may still load the comparison on hover.
    const sheet = createStyleSheet(document, `${PLUGIN_ID}-hide-diff-hover`, `
      body > span:has(> div > [data-changes-hover-preview]) {
        display: none !important;
      }
    `);
    const update = () => sheet.toggle(controller.getSnapshot().settings.hideDiffHover);
    const unsubscribe = controller.subscribe(update);
    update();
    return () => {
      unsubscribe();
      sheet.dispose();
    };
  });
  const Panel = createSettingsPanel(controller, ctx.locale, t);
  ctx.effect(() => {
    const register = () => ctx.slots.inject('settings.section', () => ctx.slots.register({
      name: 'settings.section', id: 'acrylic-wallpaper', order: 32, label: t('title'),
    }, Panel));
    let dispose = register();
    const unsubscribe = ctx.locale.subscribe(() => { dispose(); dispose = register(); });
    return () => { unsubscribe(); dispose(); };
  }, 'fluent theme settings');
}
