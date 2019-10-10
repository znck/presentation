import { Module } from "vuex";
import { State as RootState } from "@/store";
import { SurfaceName, hasSurface } from "@/surfaces";

interface State {
  surface: string;
}

export const SET_SURFACE = "setSurface";

const MODULE: Module<State, RootState> = {
  state: () => ({
    surface: "slideshow",
  }),
  getters: {},
  actions: {
    setSurface({ commit }, surface: SurfaceName) {
      commit(SET_SURFACE, hasSurface(surface) ? surface : 'broken')
    },
  },
  mutations: {
    [SET_SURFACE](state, payload: SurfaceName) {
      state.surface = payload;
    },
  },
};

export default MODULE;
