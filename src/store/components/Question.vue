<script>
import { surface, root, control, questions } from '@/store/helpers';

export default {
  props: {
    type: {
      type: String,
      default: 'vote',
    },
    text: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  inject: ['slideIndex'],
  data() {
    return { id: this.slideIndex };
  },
  computed: {
    ...surface.computed,
    ...control.computed,
    ...questions.computed,
    results() {
      const slideId = this.currentSlide;
      const isRating = this.type === 'rating';
      const question = this.questions.find(question => question.id === slideId);

      if (isRating) {
        const result = {
          rating: 0,
          count: 0,
        };

        if (question && question.answers.length) {
          result.rating = question.answers.reduce((acc, answer) => acc + answer.response, 0) / question.answers.length;
          result.count = question.answers.length;
        }

        return result;
      } else {
        const results = {};

        this.options.forEach(option => {
          results[option] = 0;
        });

        if (question) {
          question.answers.forEach(answer => {
            results[answer.response]++;
          });
        }

        return results;
      }
    },
  },
  methods: {
    ...root.methods,
    ...questions.methods,
  },
  watch: {
    currentSlide: {
      immediate: true,
      async handler(currentSlide) {
        console.log({
          currentSlide,
          slide: this.slideIndex,
        });
        if (this.slideIndex === currentSlide) {
          const channel = await this.channel();
          const questionId = this.slideIndex;
          if (channel && channel.me.role === 'admin') {
            this.postQuestion({
              id: questionId,
              type: this.type,
              text: this.text,
              options: this.options,
            });

            this.$on('hook:beforeDestroy', () => {
              this.closeQuestion(questionId);
            });
          }
        }
      },
    },
  },
};
</script>

<template>
  <div>
    <h3>{{ text }}</h3>
    <div v-if="type === 'vote'">
      <div v-for="(value, option) in results" :key="option">
        <h4>{{ value }} {{ option }}</h4>
      </div>
    </div>
    <div v-else-if="type === 'rating'">
      <h4>{{ results.rating }} ({{ results.count }} {{ results.count === 1 ? 'vote' : 'votes' }})</h4>
    </div>
  </div>
</template>
