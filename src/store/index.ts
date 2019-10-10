import Vue from "vue";
import Vuex, { Store } from "vuex";
import createDebugger from "debug";
import streams from "./modules/streams";
import users from "./modules/users";
import control from "./modules/control";
import surface from "./modules/surface";
import connections from "./modules/connections";
import { Channel } from "@/peer";

Vue.use(Vuex);

const debug = createDebugger("vs:store");
const modules = { streams, users, control, surface, connections };
let _channel: Channel | null = null;

export interface State {
  serverId: string | null;

  role: string;
}

export function createStore() {
  Object.values(modules).forEach(storeModule => {
    storeModule.namespaced = true;
  });

  const store = new Store<State>({
    state: () => ({
      role: "slideshow",
      serverId: null,
    }),
    actions: {
      setup({ dispatch }, channel) {
        Object.entries(modules).forEach(([name, _module]) => {
          if (_module.actions && "setup" in _module.actions) {
            dispatch(`${name}/setup`, channel);
          }
        });
        _channel = channel;
      },
      channel() {
        return _channel;
      },
    },
    modules,
  });

  return store;
}

export default createStore();
