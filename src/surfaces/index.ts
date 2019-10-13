const surfaces = {
  admin: () => import("./admin.vue"),
  slideshow: () => import("./slideshow.vue"),
  speaker: () => import("./speaker.vue"),
  overview: () => import("./overview.vue"),
  preview: () => import("./preview.vue"),
  broken: () => import("./broken.vue"),
};

export type SurfaceName = keyof typeof surfaces;

export function getAvailableSurfaces(): string[] {
  return Object.keys(surfaces);
}

export function hasSurface(name: string): name is SurfaceName {
  return name in surfaces;
}

export function getSurface(name: SurfaceName) {
  if (hasSurface(name)) {
    return surfaces[name];
  }
}
