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
        const question = this.question;
        const answers = this.answers;

        if (question) {
          return answers[question.id];
        }
      },
      set(value) {
        const question = this.question;
        const answers = this.answers;

        if (question && answers[question.id] == undefined) {
          this.answers = {
            ...answers,
            [question.id]: value,
          };

          this.sendResponse(value);
        }
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
        <input name="answer" type="radio" v-model="answer" :value="option" />
        {{ option }}
      </label>
    </div>
  </div>
</template>

<style module="$">
.container h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
.container input[type="radio"] {
  display: inline-block;
  width: unset;
  font-size: 1.5rem;
}
</style>