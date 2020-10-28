import React from 'react';

import { LegendItem, LegendLabel, LegendQuantile } from '@visx/legend';

import { formatNumber } from '../../lib/numberFormatter';
import { DetailedLegendContainer } from '../DetailedLegendContainer';

const legendGlyphSize = 15;

export const MapLegend = ({ colorScale, width }) => (
  <DetailedLegendContainer width={width} title='Total trips'>
    <LegendQuantile scale={colorScale}>
      {labels => {
        return labels.map(label => (
          <LegendItem key={`legend-${label.text}`}>
            <svg width={legendGlyphSize} height={legendGlyphSize} style={{ margin: '2px 0' }}>
              <circle
                fill={label.value}
                r={legendGlyphSize / 2}
                cx={legendGlyphSize / 2}
                cy={legendGlyphSize / 2}
              />
            </svg>
            <LegendLabel align='left' margin='0 4px'>
              {`${formatNumber(label.extent[0])}-${formatNumber(label.extent[1])}`}
            </LegendLabel>
          </LegendItem>
        ));
      }}
    </LegendQuantile>
  </DetailedLegendContainer>
);
