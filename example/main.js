import Presentation from "./presentation.slides";
import { createApp } from "../src";

createApp(Presentation).then(app => app.$mount("#app"));
