<!-- This component sends remote control actions to admin/server. -->

<script>
import { control } from '@/store/helpers';

const audio = new Audio('/assets/media/click.mp3');
export default {
  computed: control.computed,
  methods: {
    ...control.methods,
    buttonNext() {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0.2;
      audio.play();
    },
    buttonPrevious() {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0.1;
      audio.play();
    },
  },
};
</script>

<template>
  <div :class="$.controls">
    <audio hidden ref="audio" src="/assets/media/click.mp3" />
    <div :class="$.previous">
      <button
        :class="$.button"
        type="button"
        @click="previous()"
        aria-label="Previous"
        :disabled="currentSlide <=0"
        @mousedown="buttonPrevious"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zm116-292H256v-70.9c0-10.7-13-16.1-20.5-8.5L121.2 247.5c-4.7 4.7-4.7 12.2 0 16.9l114.3 114.9c7.6 7.6 20.5 2.2 20.5-8.5V300h116c6.6 0 12-5.4 12-12v-64c0-6.6-5.4-12-12-12z"
          />
        </svg>
      </button>
    </div>
    <div :class="$.next">
      <button
        :class="$.button"
        type="button"
        @click="next()"
        aria-label="Next"
        :disabled="currentSlide + 1 >= totalSlides"
        @mousedown="buttonNext"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zM140 300h116v70.9c0 10.7 13 16.1 20.5 8.5l114.3-114.9c4.7-4.7 4.7-12.2 0-16.9l-114.3-115c-7.6-7.6-20.5-2.2-20.5 8.5V212H140c-6.6 0-12 5.4-12 12v64c0 6.6 5.4 12 12 12z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style module="$">
.controls {
  display: flex;
  color: white;
}

.previous {
  flex: 1;
  font-size: 12.5vw;
  align-self: center;
  text-align: right;
}

.next {
  flex: 2;
  font-size: 50vw;
  align-self: center;
  text-align: left;
}

.button {
  background: transparent;
  border-style: none;
  font-size: inherit;
  padding: 0;
  margin: 8px;
  color: inherit;
  touch-action: manipulation;
}

.button:disabled {
  color: #777;
}

.button svg {
  height: 1em;
  width: 1em;
  display: inline-block;
  vertical-align: -10%;
}
</style>
