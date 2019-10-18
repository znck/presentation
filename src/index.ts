import Vue from 'vue';
import store from '@/store';
import router from '@/router';
import QRCode from '@/components/QRCode.vue';
import User from '@/components/User.vue';
import FencedCode from '@/components/FencedCode.vue';
import SlidesContainer from '@/store/components/SlidesContainer.vue';
import Question from '@/store/components/Question.vue';

import 'prismjs/themes/prism-solarizedlight.css';
import './style.css';

export async function createApp(Presentation: any) {
  Vue.config.keyCodes.plus = 43;
  Vue.config.keyCodes.minus = 45;
  Vue.config.devtools = true;
  Vue.component('VS', SlidesContainer);
  Vue.component('OutboundLink', {
    functional: true,
    render(h, { data, children }) {
      return h('a', { ...data, attrs: { target: '_blank', ...data.attrs } }, children);
    },
  });
  Vue.component('VueSlides', SlidesContainer);
  Vue.component('Presentation', Presentation);
  Vue.component('QRCode', QRCode);
  Vue.component('Question', Question);
  Vue.component('FencedCode', FencedCode);
  Vue.component('User', User);
  Vue.component('Notes', {
    functional: true,
    render: (h, { data, scopedSlots }) => h('aside', { ...data, staticClass: 'notes' }, scopedSlots.default({})),
  });

  return new Vue({
    store,
    router,
    render: h => h('RouterView'),
  });
}
