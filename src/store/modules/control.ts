import { Module } from 'vuex';
import { State as RootState } from '@/store';

interface State {
  currentSlide: number;
  totalSlides: number;
}

const MODULE: Module<State, RootState> = {
  state: () => ({
    currentSlide: 0,
    totalSlides: -1,
  }),
  actions: {
    next({ dispatch, state }) {
      const nextIndex = Math.min(state.currentSlide + 1, state.totalSlides - 1);

      if (nextIndex !== state.currentSlide)  dispatch('setCurrentSlide', nextIndex);
    },
    previous({ dispatch, state }) {
      const prevIndex = Math.max(state.currentSlide - 1, 0);

      if (prevIndex !== state.currentSlide) dispatch('setCurrentSlide', prevIndex);
    },
    setCurrentSlide({ commit, state }, currentSlideIndex: number) {
      commit('setCurrentSlide', Math.min(Math.max(0, currentSlideIndex), state.totalSlides - 1));
    },
    setTotalSlides({ commit }, totalSlides: number) {
      commit('setTotalSlides', totalSlides);
    },
  },
  mutations: {
    setCurrentSlide(state, payload: number) {
      state.currentSlide = payload;
    },
    setTotalSlides(state, payload: number) {
      state.totalSlides = payload;
    },
  },
};

export default MODULE;
