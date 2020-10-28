import React from 'react';

import ParentSize from '@visx/responsive/lib/components/ParentSize';

export const withResponsive = Component => {
  return originProps => (
    <ParentSize>
      {({ width, height }) => <Component {...originProps} width={width} height={height} />}
    </ParentSize>
  );
};
