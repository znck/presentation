import { Module } from "vuex";
import { State as RootState } from "@/store";
import { User, Channel } from "@/peer";

export interface Call {
  user: User;
  status: "incoming" | "connected" | "disconnected" | "missed" | "connecting";
}

export interface State {
  calls: Call[];
}

const ADD_CALL = "addCall";
const SET_CALL = "setCall";

const streams: Record<string, MediaStream> = {};
let channel: Channel | null = null;
const MODULE: Module<State, RootState> = {
  state: () => ({ calls: [] }),
  getters: {
    incomingCalls: state => state.calls.filter(call => call.status === "incoming"),
    activeCalls: state => state.calls.filter(call => call.status === "connected"),
  },
  actions: {
    setup({ commit }, _channel: Channel) {
      channel = _channel;

      channel.onIncomingCall(user => commit(ADD_CALL, { user, status: "incoming" }));
      channel.onMissedCall(user => commit(SET_CALL, { user, status: "missed" }));
      channel.onCallEnd(user => {
        commit(SET_CALL, { user, status: "disconnected" });
        delete streams[user.id];
      });
    },
    async call({ commit }, payload: { user: User; stream: MediaStream }) {
      if (!channel) throw new Error("Setup streams module before calling.");

      commit("addCall", { user: payload.user, status: "connecting" });
      const stream = await channel.startCall(payload.user.id, payload.stream);
      commit("setCall", { user: payload.user, status: "connected" });
      streams[payload.user.id] = stream;

      return stream;
    },
    async acceptCall({ commit }, payload: { user: User; stream?: MediaStream }) {
      if (!channel) throw new Error("Setup streams module before calling.");

      const stream = await channel.answerCall(payload.user.id, payload.stream);
      commit("setCall", { user: payload.user, status: "connected" });
      streams[payload.user.id] = stream;

      return stream;
    },
    getCallStream({}, id: string) {
      return streams[id];
    },
  },
  mutations: {
    [ADD_CALL](state, payload: Call) {
      const index = state.calls.findIndex(call => call.user.id === payload.user.id);

      if (index >= 0) state.calls.splice(index, 1);

      state.calls.unshift(payload);
    },
    [SET_CALL](state, payload: Call) {
      const call = state.calls.find(call => call.user.id === payload.user.id);

      if (call) call.status = payload.status;
      else state.calls.unshift(payload);
    },
  },
};

export default MODULE;
