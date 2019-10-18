import { Module } from 'vuex';
import { State as RootState } from '@/store';
import { Channel, is, create, User, Question as BaseQuestion } from '@/peer';

export interface Question extends BaseQuestion {
  answers: Answer[];
}

export interface Answer {
  user: User;
  response: unknown;
}

interface State {
  questions: Question[];
}

let channel: Channel | null = null;
const MODULE: Module<State, RootState> = {
  state: () => ({
    questions: [],
  }),
  getters: {},
  actions: {
    setup({ dispatch }, _channel: Channel) {
      if (_channel.me.role !== 'admin') return;
      channel = _channel;

      channel.onMessage((user, message) => {
        if (is.questionResponse(message)) {
          dispatch('_addResponse', { ...message.payload, user });
        }
      });
    },

    _addResponse({ commit }, payload) {
      commit('ADD_RESPONSE', payload);
    },

    async postQuestion({ commit, state }, payload: BaseQuestion) {
      const question = state.questions.find(question => payload.id === question.id);

      if (question) {
        await commit('ADD_QUESTION', { ...question, ...payload, answers: question.answers });
      } else {
        await commit('ADD_QUESTION', { ...payload, answers: [] });
      }

      if (channel) await channel.broadcast(create.question(payload));
    },

    async closeQuestion() {
      if (channel) await channel.broadcast(create.questionClose());
    },
  },

  mutations: {
    ADD_QUESTION(state, question: Question) {
      const index = state.questions.findIndex(item => item.id === question.id);

      if (index < 0) state.questions.splice(index, 1, question);
      else state.questions.push(question);
    },
    ADD_RESPONSE(state, { id, ...answer }: Answer & { id: number }) {
      const question = state.questions.find(question => question.id === id);

      if (question) {
        const userId = answer.user.email;
        if (question.answers.findIndex(answer => answer.user.email === userId) < 0) {
          question.answers.push(answer);
        }
      } else {
        state.questions.push({
          id: id,
          answers: [answer],
          options: [],
          text: '',
        });
      }
    },
  },
};

export default MODULE;
