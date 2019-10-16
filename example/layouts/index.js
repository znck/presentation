import './base.css'

export const layouts = {
  Slide: () => import('./Slide.vue'),
  PhotoSlide: () => import('./PhotoSlide.vue'),
  TwoColumn: () => import('./TwoColumn.vue'),
}
