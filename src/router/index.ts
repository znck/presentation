import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export function createRouter() {
  return new VueRouter({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'slideshow',
        component: () => import('./pages/slideshow.vue') as any,
        props: route => ({ id: route.query.id, secret: route.query.secret }),
      },
      {
        path: '/admin',
        name: 'admin',
        component: () => import('./pages/admin/admin.vue'),
      },
      {
        path: '/remote',
        name: 'remote',
        component: () => import('./pages/remote/remote.vue'),
        props: route => ({ serverId: route.query.id, secret: route.query.secret }),
      },
      {
        path: '/audience',
        name: 'audience',
        component: () => import('./pages/audience.vue'),
        props: route => ({ id: route.query.id }),
      },
    ],
  });
}

export default createRouter();
