import React, { useEffect, useMemo, useState } from 'react';
import { MjmlDomRender } from '../EditEmailPreview/components/MjmlDomRender';
import { useDropBlock } from '@/hooks/useDropBlock';
import { useHotKeys } from '@/hooks/useHotKeys';
import { SyncScrollShadowDom } from '@/components/UI/SyncScrollShadowDom';
import { ShadowStyle } from './components/ShadowStyle';
import { DATA_ATTRIBUTE_DROP_CONTAINER, SYNC_SCROLL_ELEMENT_CLASS_NAME } from '@/constants';
import { classnames } from '@/utils/classnames';
import { ActiveTabKeys } from '@/components/Provider/BlocksProvider';
import { useActiveTab } from '@/hooks/useActiveTab';

export function EditEmailPreview() {
  useHotKeys();
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const { setRef } = useDropBlock();
  const { activeTab } = useActiveTab();

  useEffect(() => {
    setRef(containerRef);
  }, [containerRef, setRef]);

  return useMemo(
    () => (
      <SyncScrollShadowDom
        isActive={activeTab === ActiveTabKeys.EDIT}
        id='VisualEditorEditMode'
        {...{
          [DATA_ATTRIBUTE_DROP_CONTAINER]: 'true',
        }}
        style={{
          height: '100%',
          zIndex: 10,
          position: 'relative',
          outline: 'none',
        }}
      >
        <div
          id='easy-email-plugins'
          style={{
            position: 'relative',
          }}
        />
        <div
          className={classnames('shadow-container', SYNC_SCROLL_ELEMENT_CLASS_NAME)}
          style={{
            height: '100%',
            overflowY: 'auto',
            zIndex: 10,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 40,
            paddingBottom: 40,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
          }}
          ref={setContainerRef}

        >
          <MjmlDomRender />
        </div>
        <ShadowStyle />
      </SyncScrollShadowDom>
    ),
    [activeTab]
  );
}
