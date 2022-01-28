import { VueConstructor, PluginObject } from "vue";

type ScrollView = VueConstructor & PluginObject<void>;

declare const plugin: ScrollView;

export default plugin;
