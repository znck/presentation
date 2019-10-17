<script>
import { is, create } from '@/peer';
import { root } from '@/store/helpers';

export default {
  /**
   * @returns {{ question: null | import('@/peer').Question, answers: Record<number, unknown> }}
   */
  data() {
    return {
      question: null,
      answers: {},
    };
  },
  computed: {
    ...root.computed,
    answer: {
      get() {
        return this.answers[this.question ? this.question.id : -1];
      },
      set(value) {
        this.answers = {
          ...this.answers,
          [this.question.id]: value,
        };
      },
    },
  },
  methods: {
    ...root.methods,
    async sendResponse(response) {
      const channel = await this.channel();

      if (this.question) {
        channel.sendMessage(this.serverId, create.questionResponse(this.question.id, response));
      }
    },
  },
  watch: {
    answer(value) {
      this.sendResponse(value);
    },
  },
  async created() {
    const channel = await this.channel();

    this.$on(
      'hook:beforeDestroy',
      channel.onMessage((user, message) => {
        if (user.id === this.serverId) {
          if (is.question(message)) {
            this.question = message.payload;
          } else if (is.questionClose(message)) {
            this.question = null;
          }
        }
      })
    );
  },
};
</script>

<template>
  <div v-if="question" :class="$.container">
    <h3>{{ question.text }}</h3>
    <div v-if="question.type === 'vote'">
      <label v-for="option in question.options" :key="option">
        <input type="radio" :value="option" v-model="answer" :disabled="answer != undefined" />
        {{ option }}
      </label>
    </div>
    <div v-else-if="question.type === 'live'">
      <button>Ask a question?</button>
    </div>
  </div>
</template>

<style module="$">
.container h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
.container input[type='radio'] {
  display: inline-block;
  width: unset;
  font-size: 1.5rem;
}
</style>