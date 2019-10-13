import Vue from 'vue';
import store from '@/store';
import router from '@/router';
import SlidesContainer from '@/store/components/SlidesContainer.vue';

export async function createApp(Presentation: any) {
  Vue.config.keyCodes.plus = 43;
  Vue.config.keyCodes.minus = 45;
  Vue.config.devtools = true;
  Vue.component('VS', SlidesContainer);
  Vue.component('VueSlides', SlidesContainer);
  Vue.component('Presentation', Presentation);
  Vue.component('Notes', {
    functional: true,
    render: (h, { data, scopedSlots }) => h('aside', data, scopedSlots.default({})),
  });

  return new Vue({
    store,
    router,
    render: h => h('RouterView'),
  });
}
