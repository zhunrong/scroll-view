import component from './scroll-view';
import { PluginObject } from "vue";

type ScrollView = typeof component & PluginObject<void>;

const plugin = component as ScrollView;

plugin.install = function (Vue) {
  Vue.component("scroll-view", component);
};

// plugin.version = process.env.VUE_APP_VERSION!;

export default plugin;