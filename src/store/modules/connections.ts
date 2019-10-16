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
          if (message.payload.resource === 'remote') {
            dispatch('addRemote', user.id);
            if (lastRemoteId === user.id || message.payload.secret === channel!.secret)
              dispatch('setActiveRemote', user.id);
          } else if (message.payload.resource === 'slideshow') {
            dispatch('addSlideshow', user.id);
            if (lastSlideshowId === user.id || message.payload.secret === channel!.secret)
              dispatch('setActiveSlideshow', user.id);
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

    async setActiveRemote({ commit, dispatch, state }, id: string | null) {
      await commit('setActiveRemote', id);
      if (channel && id) {
        if (state.remoteId && id !== state.remoteId) await channel.sendMessage(state.remoteId, create.disconnect('remote'))
        await channel.sendMessage(id, create.approve('remote'));
        await dispatch('sync', id)
      }
    },
    async setActiveSlideshow({ commit, dispatch, state }, id: string | null) {
      await commit('setActiveSlideshow', id);
      if (channel && id) {
        if (state.slideshowId && id !== state.slideshowId) await channel.sendMessage(state.slideshowId, create.disconnect('remote'))
        await channel.sendMessage(id, create.approve('slideshow'));
        await dispatch('sync', id)
      }
    },
    sync({ rootState }, id: string) {
      if (channel) {
        const { control } = rootState as any
        channel.sendMessage(id, create.vuexAction({ type: 'sync', payload: { control } }))
      }
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
    setActiveSlideshow(state, id: string) {
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
