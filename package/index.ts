import component from './scroll-view';
import { PluginObject } from 'vue';

type ScrollView = typeof component & PluginObject<void>;

const plugin = component as ScrollView;

plugin.install = function (Vue) {
  Vue.component('ScrollView', component);
};

plugin.version = process.env.VERSION;

export default plugin;
