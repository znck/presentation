<script>
export default {
  props: {
    loc: {
      type: Number,
      required: true,
    },
    highlights: {
      type: Array,
    },
    lang: {
      type: String,
      default: 'text',
    },
  },
  computed: {
    isHighlighted() {
      const lines = {};

      if (this.highlights) {
        this.highlights.forEach(([start, end]) => {
          if (end) {
            for (let i = start; i <= end; ++i) {
              lines[i] = true;
            }
          } else {
            lines[start] = true;
          }
        });
      }

      return lineNumber => lineNumber in lines;
    },
  },
};
</script>

<template>
  <div :class="`language-${lang || 'text'} line-numbers-mode`">
    <div class="highlight-lines" v-if="highlights && highlights.length">
      <div v-for="line in loc - 1" :key="line" :class="{ highlighted: isHighlighted(line) }">&nbsp;</div>
    </div>
    <slot />
    <div class="line-numbers-wrapper" v-once>
      <div class="line-number" v-for="line in loc - 1" :key="line">{{ line }}</div>
    </div>
  </div>
</template>

<style>
div[class*='language-'] {
  --code-background: #fff;
  --code-border: #d8d8db;
  --code-line-number: rgb(49, 49, 49);
  position: relative;
  background-color: var(--code-background);
  border-radius: 0.5vw;
  padding-right: 3vw;
  border: 0.1vw solid var(--code-border);
}

div[class*='language-'] .highlight-lines {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding-top: 1.3vw;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  line-height: 1.47;
}

div[class*='language-'] .highlight-lines > div {
  --highlight-overlay: rgba(114, 114, 114, 0.6);
  background-color: var(--highlight-overlay);
}

div[class*='language-'] .highlight-lines .highlighted {
  --highlight-overlay: unset;
}

div[class*='language-'] pre,
div[class*='language-'] pre[class*='language-'] {
  background: transparent;
  position: relative;
  z-index: 1;
  padding: 0;
  margin: 1.3vw 0;
  line-height: 1.4;
}

div[class*='language-']:before {
  position: absolute;
  z-index: 3;
  top: -0.2vw;
  right: 0.2vw;
  font-size: 1.25vw;
  color: rgb(29, 29, 29);
}

div[class*='language-']:not(.line-numbers-mode) .line-numbers-wrapper {
  display: none;
}

div[class*='language-'].line-numbers-mode .highlight-lines .highlighted {
  position: relative;
}

div[class*='language-'].line-numbers-mode .highlight-lines > div:before {
  content: ' ';
  position: absolute;
  z-index: 3;
  left: 0;
  height: 1.47em;
  display: block;
  width: 3.5vw;
  background-color: var(--highlight-overlay);
}

div[class*='language-'].line-numbers-mode pre {
  padding-left: 4.4vw;
  vertical-align: middle;
}

div[class*='language-'].line-numbers-mode .line-numbers-wrapper {
  position: absolute;
  top: 0;
  width: 3.5vw;
  text-align: center;
  color: var(--code-line-number);
  padding: 1vw 0;
  font-size: inherit;
  line-height: 1.4;
}

div[class*='language-'].line-numbers-mode .line-numbers-wrapper .line-number,
div[class*='language-'].line-numbers-mode .line-numbers-wrapper br {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

div[class*='language-'].line-numbers-mode .line-numbers-wrapper .line-number {
  position: relative;
  z-index: 4;
  font-size: 0.75em;
  line-height: 1.87;
  padding-top: 0.1em;
}

div[class*='language-'].line-numbers-mode:after {
  content: '';
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 3.5vw;
  height: 100%;
  border-radius: 6px 0 0 6px;
  /* border-right: 0.1vw solid var(--code-border); */
  background-color: var(--code-background);
}

div[class~='language-js']:before {
  content: 'js';
}

div[class~='language-ts']:before {
  content: 'ts';
}

div[class~='language-html']:before {
  content: 'html';
}

div[class~='language-md']:before {
  content: 'md';
}

div[class~='language-vue']:before {
  content: 'vue';
}

div[class~='language-css']:before {
  content: 'css';
}

div[class~='language-sass']:before {
  content: 'sass';
}

div[class~='language-scss']:before {
  content: 'scss';
}

div[class~='language-less']:before {
  content: 'less';
}

div[class~='language-stylus']:before {
  content: 'stylus';
}

div[class~='language-go']:before {
  content: 'go';
}

div[class~='language-java']:before {
  content: 'java';
}

div[class~='language-c']:before {
  content: 'c';
}

div[class~='language-sh']:before {
  content: 'sh';
}

div[class~='language-yaml']:before {
  content: 'yaml';
}

div[class~='language-py']:before {
  content: 'py';
}

div[class~='language-docker']:before {
  content: 'docker';
}

div[class~='language-dockerfile']:before {
  content: 'dockerfile';
}

div[class~='language-makefile']:before {
  content: 'makefile';
}

div[class~='language-javascript']:before {
  content: 'js';
}

div[class~='language-typescript']:before {
  content: 'ts';
}

div[class~='language-markup']:before {
  content: 'html';
}

div[class~='language-markdown']:before {
  content: 'md';
}

div[class~='language-json']:before {
  content: 'json';
}

div[class~='language-ruby']:before {
  content: 'rb';
}

div[class~='language-python']:before {
  content: 'py';
}

div[class~='language-bash']:before {
  content: 'sh';
}

div[class~='language-php']:before {
  content: 'php';
}
</style>
