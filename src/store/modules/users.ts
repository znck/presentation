import { Module } from 'vuex';
import { State as RootState } from '@/store';
import { User, Channel } from '@/peer';

export interface Person extends User {
  status: 'online' | 'offline';
}

export interface State {
  users: Person[];
}

const ADD_USER = 'addUser';

let channel: Channel | null = null;
const MODULE: Module<State, RootState> = {
  state: () => ({ users: [] }),
  getters: {
    onlineUsers: state => state.users.filter(user => user.status === 'online').filter(user => user.role === 'audience'),
  },
  actions: {
    setup({ commit }, _channel: Channel) {
      channel = _channel;

      channel.onPeerJoin(user => commit(ADD_USER, { ...user, status: 'online' }));
      channel.onPeerLeave(user => commit(ADD_USER, { ...user, status: 'offline' }));
    },
  },
  mutations: {
    [ADD_USER](state, user: Person) {
      const index = state.users.findIndex(call => call.email === user.email);

      if (index >= 0) state.users.splice(index, 1, user);
      else state.users.unshift(user);
    },
  },
};

export default MODULE;
