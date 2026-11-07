import React, { useEffect, useMemo, useState } from 'react';
import mjml from 'mjml-browser';
import { getPageIdx, IPage, JsonToMjml } from 'easy-email-core';
import { cloneDeep, isEqual } from 'lodash';
import { useEditorContext } from '@/hooks/useEditorContext';
import { HtmlStringToReactNodes } from '@/utils/HtmlStringToReactNodes';
import { createPortal } from 'react-dom';
import { useEditorProps } from '@/hooks/useEditorProps';
import { getEditorRoot, getShadowRoot } from '@/utils';
import { DATA_RENDER_COUNT, FIXED_CONTAINER_ID } from '@/constants';
import {
  useDarkMode,
  LIGHT_TEXT_COLOR,
  DARK_TEXT_COLOR,
} from '@/components/Provider/DarkModeProvider';

let count = 0;
export function MjmlDomRender() {
  const { pageData: content, setInitialized } = useEditorContext();
  const [pageData, setPageData] = useState<IPage | null>(null);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const { dashed, mergeTags, enabledMergeTagsBadge } = useEditorProps();
  const [isTextFocus, setIsTextFocus] = useState(false);
  const { isDarkMode } = useDarkMode();
  const [html, setHtml] = useState('');
  const [renderError, setRenderError] = useState('');

  useEffect(() => {
    setInitialized(!renderError && Boolean(ref?.querySelector('body')));
  }, [html, ref, renderError, setInitialized]);

  useEffect(() => {
    return () => setInitialized(false);
  }, [setInitialized]);

  const isTextFocusing =
    document.activeElement === getEditorRoot() &&
    getShadowRoot().activeElement?.getAttribute('contenteditable') === 'true';

  useEffect(() => {
    if (!isTextFocus && !isEqual(content, pageData)) {
      setPageData(cloneDeep(content));
    }
  }, [content, pageData, isTextFocus]);

  useEffect(() => {
    setIsTextFocus(isTextFocusing);
  }, [isTextFocusing]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (getEditorRoot()?.contains(e.target as Node)) {
        return;
      }
      const fixedContainer = document.getElementById(FIXED_CONTAINER_ID);
      if (fixedContainer?.contains(e.target as Node)) {
        return;
      }
      setIsTextFocus(false);
    };

    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    const root = getShadowRoot();
    if (!root) return;
    const onClick = (e: Event) => {
      const isFocusing =
        getShadowRoot().activeElement?.getAttribute('contenteditable') === 'true';
      if (isFocusing) {
        setIsTextFocus(true);
      }
    };

    root.addEventListener('click', onClick);
    return () => {
      root.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!pageData) {
      setHtml('');
      setRenderError('');
      return () => {
        cancelled = true;
      };
    }
    setRenderError('');

    const renderPageData =
      isDarkMode && pageData.data.value['text-color'] === LIGHT_TEXT_COLOR
        ? {
            ...pageData,
            data: {
              ...pageData.data,
              value: {
                ...pageData.data.value,
                'text-color': DARK_TEXT_COLOR,
              },
            },
          }
        : pageData;

    const render = async () => {
      try {
          const { html: renderHtml } = await mjml(
            JsonToMjml({
              data: renderPageData,
              idx: getPageIdx(),
              context: renderPageData,
              mode: 'testing',
              dataSource: cloneDeep(mergeTags),
            }),
          );
          if (!cancelled) {
            setHtml(renderHtml);
            setRenderError('');
          }
      } catch (error) {
          if (!cancelled) {
            setHtml('');
            setRenderError(error instanceof Error ? error.message : String(error));
          }
      }
    };

    void render();
    return () => {
      cancelled = true;
    };
  }, [isDarkMode, mergeTags, pageData]);

  return useMemo(() => {
    return (
      <div
        {...{
          [DATA_RENDER_COUNT]: count++,
        }}
        data-dashed={dashed}
        ref={setRef}
        style={{
          outline: 'none',
          position: 'relative',
        }}
        role='tabpanel'
        tabIndex={0}
      >
        <>
          {renderError ? (
            <div role='alert'>{renderError}</div>
          ) : ref && html ? (
            createPortal(
              HtmlStringToReactNodes(html, {
                enabledMergeTagsBadge: Boolean(enabledMergeTagsBadge),
              }),
              ref,
            )
          ) : null}
        </>
      </div>
    );
  }, [dashed, ref, html, renderError, enabledMergeTagsBadge]);
}
