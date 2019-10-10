import { Module } from 'vuex';
import { State as RootState } from '@/store';
import { Channel, is, create } from '@/peer';

interface State {
  remoteId: string | null;
  slideshowId: string | null;
  remotes: string[];
  slideshows: string[];
}

let channel: Channel | null = null;
const MODULE: Module<State, RootState> = {
  state: () => ({
    remoteId: null,
    remotes: [],
    slideshowId: null,
    slideshows: [],
  }),
  getters: {},
  actions: {
    setup({ dispatch, state }, _channel: Channel) {
      if (_channel.me.role !== 'admin') return;

      channel = _channel;

      let lastRemoteId = state.remoteId;
      let lastSlideshowId = state.slideshowId;
      channel.onMessage((user, message) => {
        if (is.request(message)) {
          if (message.payload === 'remote') {
            dispatch('addRemote', user.id);
            if (lastRemoteId === user.id) dispatch('setActiveRemote', user.id);
          } else if (message.payload === 'slideshow') {
            dispatch('addSlideshow', user.id);
            if (lastSlideshowId === user.id) dispatch('setActiveSlideshow', user.id);
          }
        }
      });

      channel.onPeerLeave(user => {
        dispatch('removeRemote', user.id);
        dispatch('removeSlideshow', user.id);

        lastRemoteId = state.remoteId;
        lastSlideshowId = state.slideshowId;

        if (lastRemoteId === user.id) {
          dispatch('setActiveRemote', null);
        }
        if (lastSlideshowId === user.id) {
          dispatch('setActiveSlideshow', null);
        }
      });
    },

    async setActiveRemote({ commit }, id: string | null) {
      await commit('setActiveRemote', id);
      if (channel && id) channel.sendMessage(id, create.approve('remote'));
    },
    async setSlideshowRemote({ commit }, id: string | null) {
      await commit('setSlideshowRemote', id);
      if (channel && id) channel.sendMessage(id, create.approve('slideshow'));
    },
    addRemote({ commit, state }, id: string) {
      if (!state.remotes.includes(id)) {
        commit('addRemote', id);
      }
    },
    removeRemote({ commit, state }, id: string) {
      if (state.remotes.includes(id)) {
        commit('removeRemote', id);
      }
    },
    addSlideshow({ commit, state }, id: string) {
      if (!state.slideshows.includes(id)) {
        commit('addSlideshow', id);
      }
    },
    removeSlideshow({ commit, state }, id: string) {
      if (state.slideshows.includes(id)) {
        commit('removeSlideshow', id);
      }
    },
  },
  mutations: {
    setActiveRemote(state, id: string) {
      state.remoteId = id;
    },
    setSlideshowRemote(state, id: string) {
      state.slideshowId = id;
    },
    addRemote(state, id: string) {
      state.remotes.push(id);
    },
    removeRemote(state, id: string) {
      state.remotes.splice(state.remotes.indexOf(id), 1);
    },
    addSlideshow(state, id: string) {
      state.slideshows.push(id);
    },
    removeSlideshow(state, id: string) {
      state.slideshows.splice(state.slideshows.indexOf(id), 1);
    },
  },
};

export default MODULE;
