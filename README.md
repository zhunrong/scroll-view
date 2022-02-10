# 滚动容器组件

模拟实现水平、垂直滚动条，代替浏览器原生滚动条。

## 特点：

- 统一在各浏览器上滚动条的样式
- 滚动条不占据空间，不会影响内容的布局
- 使用方便，将该组件当作一个高度固定的 DIV 使用即可

## 安装

```js
npm install -S @chenzr/scroll-view
```

## 全局注册

```js
import Vue from "vue";
import ScrollView from "@chenzr/scroll-view";
import "@chenzr/scroll-view/libs/scroll-view.css";
Vue.use(ScrollView);
```

## 局部注册与使用

```vue
<template>
  <div>
    <scroll-view
      :style="{
        height: '400px',
        '--scroll-bar-size': '8px',
      }"
    >
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <li>6</li>
        <li>7</li>
        <li>8</li>
        <li>9</li>
        <li>10</li>
        <li>11</li>
        <li>12</li>
        <li>13</li>
        <li>14</li>
        <li>15</li>
        <li>16</li>
        <li>17</li>
        <li>18</li>
        <li>19</li>
        <li>20</li>
      </ul>
    </scroll-view>
  </div>
</template>
<script>
import ScrollView from "@chenzr/scroll-view";
import "@chenzr/scroll-view/libs/scroll-view.css";
export default {
  components: {
    ScrollView,
  },
};
</script>
```

## 样式配置

可以直接在组件上设置 CSS 变量来控制滚动条的样式。

| CSS 变量                  | 说明                  | 默认值                   |
| ------------------------- | --------------------- | ------------------------ |
| --scroll-bar-color        | 滚动条颜色            | rgba(204, 204, 204, 0.5) |
| --scroll-bar-active-color | 滚动条 hover 状态颜色 | rgba(204, 204, 204, 1)   |
| --scroll-bar-size         | 滚动条尺寸（粗细）    | 8px                      |
| --native-scroll-bar-size  | 原生滚动条尺寸        | 17px                     |

## 属性

| 属性          | 说明           | 类型   | 默认值  |
| ------------- | -------------- | ------ | ------- |
| showScrollBar | 何时显示滚动条 | string | 'hover' |
