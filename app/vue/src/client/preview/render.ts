import dedent from 'ts-dedent';
import { createApp, Component, ComponentOptionsWithoutProps, defineComponent, h, PropType } from 'vue';
import { RenderMainArgs } from './types';

export const COMPONENT = 'STORYBOOK_COMPONENT';
export const VALUES = 'STORYBOOK_VALUES';

const app = defineComponent({
  // data() {
  //   return {
  //     [COMPONENT]: undefined,
  //     [VALUES]: {},
  //   };
  // },
  props: {
    [COMPONENT]: {
      type: Object as PropType<Component>,
      value: () => {},
    },
    [VALUES]: {
      type: Object,
      value: () => {},
    },
  },
  render(props: any) {
    console.log(props[COMPONENT]);
    const children = props[COMPONENT] ? [h(props[COMPONENT])] : undefined;
    return h('div', { id: 'app' }, children);
  },
});

const root = createApp(app, {});

export default function render({
  storyFn,
  selectedKind,
  selectedStory,
  showMain,
  showError,
  showException,
  forceRender,
}: RenderMainArgs) {
  root.config.errorHandler = showException;

  const element = storyFn();

  if (!element) {
    showError({
      title: `Expecting a Vue component from the story: "${selectedStory}" of "${selectedKind}".`,
      description: dedent`
        Did you forget to return the Vue component from the story?
        Use "() => ({ template: '<my-comp></my-comp>' })" or "() => ({ components: MyComp, template: '<my-comp></my-comp>' })" when defining the story.
      `,
    });
    return;
  }

  showMain();

  // at component creation || refresh by HMR
  // if (!app[COMPONENT] || !forceRender) {
  //   app[COMPONENT] = element;
  // }

  if (!root._component.props[COMPONENT] || !forceRender) {
    // app.props[COMPONENT] = element as any;
    root._props[COMPONENT] = element as any;
  }

  // @ts-ignore https://github.com/storybookjs/storybook/pull/7578#discussion_r307986139
  root._component.props[VALUES] = element[VALUES];

  root.mount("#root");
}
