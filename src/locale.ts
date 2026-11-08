import type { LocaleService } from './host/context.ts';

export const LOCALE_NS = 'shellraining.fluent-theme';

export const EN = {
  title: 'Win10 Fluent Theme', enabled: 'Enable theme', fluent: 'Win10 styling', reveal: 'Hover and press lighting',
  preview: 'Wallpaper preview', noImage: 'No image selected', processing: 'Processing…', choose: 'Choose image',
  remove: 'Remove image', reset: 'Restore defaults', fit: 'Image fit', cover: 'Fill', contain: 'Fit', stretch: 'Stretch', tile: 'Tile',
  coverHint: 'Keep the aspect ratio and crop the excess.', containHint: 'Show the entire image; edges may be empty.',
  stretchHint: 'Fill the window; the image may be distorted.', tileHint: 'Repeat the image at its original size.',
  blur: 'Blur', tint: 'Tint', noise: 'Noise', imageHint: 'PNG, JPEG or WebP, up to 20 MiB. Images stay on this device.',
  preferences: 'Preferences', hideDiffHover: 'Hide changed-file hover previews',
  diffHint: 'Only hides hover previews. Click to view diffs as usual. The host may still load comparisons. Independent of theme and lighting settings.',
  saveError: 'Could not save. Please try again.', loading: 'Loading…', details: 'Technical details',
} as const;

export const ZH: Record<keyof typeof EN, string> = {
  title: 'Win10 Fluent 主题', enabled: '启用主题', fluent: 'Win10 风格', reveal: '悬停与按压光效',
  preview: '壁纸预览', noImage: '未选择图片', processing: '正在处理…', choose: '选择图片',
  remove: '移除图片', reset: '恢复默认', fit: '填充方式', cover: '填满', contain: '适应', stretch: '拉伸', tile: '平铺',
  coverHint: '保持比例，裁去多余部分。', containHint: '显示整张图片，边缘可能留空。',
  stretchHint: '铺满窗口，图片可能变形。', tileHint: '按原尺寸重复排列。',
  blur: '模糊', tint: '遮罩', noise: '颗粒', imageHint: '支持 PNG、JPEG、WebP，最大 20 MiB。图片仅保存在本机。',
  preferences: '偏好', hideDiffHover: '隐藏变更文件悬浮预览',
  diffHint: '仅隐藏悬浮预览，不影响点击查看差异，也不阻止宿主加载比较内容。此偏好独立于主题与光效开关。',
  saveError: '未能保存，请重试。', loading: '正在加载…', details: '技术详情',
};

export type CopyKey = keyof typeof EN;
export type Translate = (key: CopyKey) => string;

export function bindCopy(locale: LocaleService): Translate {
  const translate = locale.bind(LOCALE_NS);
  return key => translate(key);
}
