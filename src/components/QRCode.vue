<script>
import QRCode from 'qrcode';

export default {
  props: {
    content: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: '50vw',
    },
  },
  data: () => ({
    image: null,
  }),
  mounted() {
    this.generate(this.content);
  },
  methods: {
    async generate(content) {
      this.image = await QRCode.toDataURL(content, { errorCorrectionLevel: 'H' });
    },
  },
  watch: {
    content(content) {
      this.generate(content);
    },
  },
};
</script>

<template>
  <img
    v-if="image"
    :src="image"
    :style="{ width: size, height: size }"
    style="display: block"
  />
</template>
