import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { MjmlDomRender } from '../../../../easy-email-editor/src/components/EmailEditor/components/EditEmailPreview/components/MjmlDomRender';

const mockMjml = jest.fn();
const mockSetInitialized = jest.fn();
const mockPageData = { data: { value: { 'text-color': '#000000' } } };
const mockEditorProps = { dashed: false, mergeTags: {} };
let mockHost: HTMLDivElement;
let mockShadowRoot: ShadowRoot;
let root: ReturnType<typeof createRoot>;

jest.mock('../../../../easy-email-editor/node_modules/react', () =>
  jest.requireActual('react'),
);
jest.mock('../../../../easy-email-editor/node_modules/react-dom', () =>
  jest.requireActual('react-dom'),
);
jest.mock('../../../../easy-email-editor/node_modules/mjml-browser', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockMjml(...args),
}));
jest.mock('easy-email-core', () => ({
  getPageIdx: () => 'content',
  JsonToMjml: () => '<mjml />',
}));
jest.mock('@/hooks/useEditorContext', () => ({
  useEditorContext: () => ({
    pageData: mockPageData,
    setInitialized: mockSetInitialized,
  }),
}), { virtual: true });
jest.mock('@/hooks/useEditorProps', () => ({
  useEditorProps: () => mockEditorProps,
}), { virtual: true });
jest.mock('@/utils', () => ({
  getEditorRoot: () => mockHost,
  getShadowRoot: () => mockShadowRoot,
}), { virtual: true });
jest.mock('@/constants', () => ({
  DATA_RENDER_COUNT: 'data-render-count',
  FIXED_CONTAINER_ID: 'fixed-container',
}), { virtual: true });
jest.mock('@/components/Provider/DarkModeProvider', () => ({
  useDarkMode: () => ({ isDarkMode: false }),
  LIGHT_TEXT_COLOR: '#000000',
  DARK_TEXT_COLOR: '#ffffff',
}), { virtual: true });
jest.mock('@/utils/HtmlStringToReactNodes', () => ({
  HtmlStringToReactNodes: (html: string) => {
    const React = jest.requireActual('react');
    return React.createElement('div', {
      ref: (node: HTMLDivElement | null) => {
        if (node && !node.querySelector('body')) {
          const body = globalThis.document.createElement('body');
          body.textContent = html;
          node.appendChild(body);
        }
      },
    });
  },
}), { virtual: true });

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  mockMjml.mockReset();
  mockHost = document.createElement('div');
  document.body.appendChild(mockHost);
  mockShadowRoot = mockHost.attachShadow({ mode: 'open' });
  root = createRoot(mockShadowRoot);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  mockHost.remove();
});

it('initializes plugins only after asynchronous MJML markup is committed', async () => {
  let resolveMjml!: (value: { html: string }) => void;
  mockMjml.mockImplementation(() => new Promise(resolve => {
    resolveMjml = resolve;
  }));

  act(() => {
    root.render(React.createElement(MjmlDomRender));
  });
  expect(mockSetInitialized).not.toHaveBeenCalledWith(true);
  expect(mockShadowRoot.querySelector('body')).toBeNull();

  await act(async () => {
    resolveMjml({ html: 'Compiled email' });
  });
  expect(mockShadowRoot.querySelector('body')?.textContent).toBe('Compiled email');
  expect(mockSetInitialized).toHaveBeenLastCalledWith(true);

  act(() => {
    root.unmount();
  });
  expect(mockSetInitialized).toHaveBeenLastCalledWith(false);
});

it('keeps plugins uninitialized and displays asynchronous compilation errors', async () => {
  mockMjml.mockRejectedValue(new Error('MJML compilation failed'));

  await act(async () => {
    root.render(React.createElement(MjmlDomRender));
  });
  expect(mockSetInitialized).not.toHaveBeenCalledWith(true);
  expect(mockShadowRoot.querySelector('[role="alert"]')?.textContent)
    .toBe('MJML compilation failed');
});
