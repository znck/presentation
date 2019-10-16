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
    setup({ commit }, _channel: Channel) {
      if (_channel.me.role !== 'admin') return;
      channel = _channel;

      channel.onMessage((user, message) => {
        if (is.questionResponse(message)) {
          commit('ADD_RESPONSE', { ...message.payload, user });
        }
      });
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
        const userId = answer.user.id;
        if (!question.answers.find(answer => answer.user.id === userId)) {
          question.answers.push(answer);
        }
      }
    },
  },
};

export default MODULE;
