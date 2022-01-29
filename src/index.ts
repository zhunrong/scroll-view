import _ScrollView from "./ScrollView.vue";
import { PluginObject } from "vue";

type ScrollView = typeof _ScrollView & PluginObject<void>;

const plugin = _ScrollView as ScrollView;

plugin.install = function (Vue) {
  Vue.component("scroll-view", _ScrollView);
};

plugin.version = process.env.VUE_APP_VERSION;

export default plugin;
