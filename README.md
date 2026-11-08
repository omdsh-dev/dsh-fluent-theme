# Win10 Fluent Theme

English · [简体中文](README.zh-CN.md)

A Windows 10-inspired theme for DeepSeek Harness (DSH), with local wallpapers, acrylic materials, Reveal lighting, press feedback, and sidebar motion. It uses the host's `--dsw-*` design variables and follows its color scheme and accessibility preferences. These effects approximate native Windows behavior in a web UI.

## Install

```sh
dsh plugin --profile web add @shellraining/dsh-fluent-theme
```

Requires DSH `>=0.2.2-rc.1 <0.3.0`. The plugin depends on host structures introduced in 0.2.2, including HoverCard portal wrappers, phased context menus, and narrow-screen drawers. The declared range is an installation constraint, not proof that every release in it has been verified.

For Electron, use the application's plugin manager or its bundled Desktop CLI. A standalone CLI's `web` profile does not configure the desktop application.

## Settings and preferences

Open **Settings → Win10 Fluent Theme** to select a PNG, JPEG, or WebP wallpaper, adjust fit, blur, tint and noise, and toggle Win10 styling or hover/press lighting. Images are limited to 20 MiB, checked for dimensions before decoding, resized to at most 3840 pixels on the longest edge, and re-encoded before local storage. Wallpapers and settings stay in IndexedDB for the current browser origin; same-origin windows synchronize changes.

Under **Preferences**, turn off **Hide changed-file hover previews** to restore the host's diff HoverCards. The default remains on to preserve earlier behavior. This preference is independent of the theme and lighting toggles. It only hides previews and does not prevent the host from loading comparisons. **Restore defaults** resets it too; disabling the plugin removes the hiding rule.

Settings, hints, navigation labels and status messages follow the DSH language setting, with English and Chinese translations. Browser and storage diagnostics remain available under **Technical details** in their original form.

## Appearance and motion

Win10 styling covers buttons, tags, official plugin update panels, session/workspace HoverCards, and text quote controls. Context menus retain the host's own exit animation. Wallpaper mode puts an acrylic backing behind the composer and its bottom information bar; unsupported blur falls back to a nearly opaque surface.

Reveal lighting follows pointer proximity and presses without changing text selection or focus. Press feedback adds a size- and position-dependent tilt or shrink, with conservative fallback for clipped controls, scrolling containers, drag handles and popup triggers. Keyboard activation uses centered feedback. These are web approximations, not an exact reproduction of every native WinUI template.

Reduced motion disables decorative movement. High contrast and reduced transparency disable wallpaper materials or lighting where appropriate. The host's normal interaction feedback remains available.

For sidebar transitions, the plugin replays the host's declared timing and holds conversation text at its final width to reduce repeated wrapping in long conversations. Resize, manual dragging and instant/fullscreen transitions do not use this animation. This behavior and popup exit effects depend on host DOM and animation conventions.

The timing and geometry reference Microsoft's [Acrylic guidance](https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic), [Reveal implementation](https://github.com/microsoft/microsoft-ui-xaml/blob/17bf1fc470bae72749998f2350cf19c9534da3f7/dev/Lights/RevealHoverLight.cpp), [theme animations](https://github.com/microsoft/microsoft-ui-xaml/blob/4a5d99f46230f25599a190b12d34ccb7daaeaaa8/dxaml/xcp/dxaml/lib/ThemeAnimations.cpp#L239-L391), and [pointer interpolation](https://github.com/microsoft/microsoft-ui-xaml/blob/4a5d99f46230f25599a190b12d34ccb7daaeaaa8/dxaml/xcp/core/animation/PointerAnimationUsingKeyFrames.cpp#L202-L306). Detailed behavior and approximation limits are also documented in the Chinese README.

## Compatibility with other plugins

Mermaid and inline-code-copy are optional, independently installed plugins. They can inherit host design tokens without importing this plugin's source. Two existing body markers support optional theme adaptations:

- `data-acrylic-wallpaper`: wallpaper material is active.
- `data-acrylic-fluent`: Win10 styling is active.

Their presence follows the effective feature state, including accessibility restrictions. Do not assume that the theme is installed. Keep ordinary styles usable without either marker.

The theme uses semantic host attributes when available, but also resolves some CSS-module IDs, class formats and rule signatures at runtime. These are not stable public theme APIs. Recheck popups, sidebars, settings, quotes, composer backing, long conversations and disposal after upgrading DSH. Type checking does not establish runtime compatibility.

## Migration from the former package

The former name was `@shellraining/dsh-acrylic-wallpaper`. Back up the profile, remove that package, then install the current name; never enable both implementations together. Keep the same browser origin and site data. The Cordis ID `acrylic-wallpaper`, storage identity and existing DOM markers are unchanged, so existing wallpapers and settings remain available.

Moving the GitHub repository does not change the npm package name or require reinstalling an unchanged published version.

## Development

Use Node 24.9+ and pnpm 12.6.0. Runtime engine ranges remain declared separately in the package manifest. This repository includes its own sources, build helper, compiler configuration and lockfile; it does not need the former monorepo, an adjacent checkout, or a submodule.

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
pnpm pack
```

Strict TypeScript checks both source and build tools. Vite generates root-level `index.js` and `client.js`; React and host primitives stay external. The build also rejects unknown design tokens and hard-coded host hash selectors. Dependency versions live directly in the package manifest.

`pnpm dev` watches source and rebuilds without type checking. It does not install or activate the plugin. For a local preview, explicitly link the profile to this repository, confirm that DSH loads these bundles, and refresh the existing DSH page. Client hot replacement also depends on the host development watcher. Do not use a separate Vite page as a substitute for host integration, commit machine-specific paths, or change another contributor's profile.

## Before publishing

- Check English and Chinese navigation and settings in a real DSH page, in light and dark mode.
- Exercise image upload/removal, refresh, same-origin window synchronization, invalid input and storage failures.
- Check the diff-preview preference, persistence, restore defaults and plugin disable behavior.
- Check menus, HoverCards, dialogs, Reveal, press feedback, sidebar motion, selection, reduced motion and high contrast.
- Check this plugin alone and together with Mermaid and inline-code-copy. The other plugins must still work without the theme.
- Run type checking, build and pack. Inspect the archive for both entry points, patch, icon, locale metadata, both READMEs and LICENSE. Review source and generated changes together.

CI checks pull requests and main pushes without publishing. The `release.yml` workflow publishes only on manual dispatch from main, with an explicit version confirmation. It uses npm OIDC to publish the packed archive with provenance, without a stored npm token.

Keep the current npm name, ModuleLoader ID, Cordis ID and IndexedDB name during migration. Versions remain unchanged in this preparation. Before release, the maintainer must authorize a new version, rebuild and commit it; npm cannot overwrite an existing version. Confirm the destination repository links, register the repository maintainer with the organization, and rebind the npm trusted publisher to the final repository and `release.yml`. The npm package owner can run:

```sh
npm trust github @shellraining/dsh-fluent-theme --repo omdsh-dev/dsh-fluent-theme --file release.yml --allow-publish
```

Complete publishing within npm's current binding validity window. Once the new publisher works, explicitly retire the former repository's permission. Splitting a repository does not disable the old monorepo's release workflow: stop updating this package's version there. Roll back by installing a previous published npm version without deleting browser data.

This split preparation does not include remote transfer, an online CI run, npm publication, or actual-page acceptance.

## License

MIT, copyright shellRaining. This is an independent community plugin, not an official DeepSeek or Microsoft product.
