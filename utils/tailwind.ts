import { create } from 'twrnc';
const tw = create(require('@/tailwind.config.ts'));

function tailwind(...styles: Parameters<typeof tw.style>) {
  return tw.style(...styles);
}

tailwind.color = tw.color;

export { tailwind };
