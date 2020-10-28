import React from 'react';

import { defaultStyles, TooltipWithBounds } from '@visx/tooltip';

import { formatNumber } from '../../lib/numberFormatter';

export const MapTooltip = ({ tooltipTop, tooltipLeft, tooltipData }) => (
  <div>
    <TooltipWithBounds
      styles={defaultStyles}
      key={Math.random()}
      top={tooltipTop - 12}
      left={tooltipLeft + 12}
    >
      {`${tooltipData.title}: ${formatNumber(tooltipData.value)} trips`}
    </TooltipWithBounds>
  </div>
);
