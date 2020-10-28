import React, { useCallback, useMemo } from 'react';

import { Typography } from '@material-ui/core';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { localPoint } from '@visx/event';
import { GridColumns, GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleLinear, scaleTime } from '@visx/scale';
import { LinePath } from '@visx/shape';
import Bar from '@visx/shape/lib/shapes/Bar';
import Line from '@visx/shape/lib/shapes/Line';
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { bisector, extent } from 'd3-array';

import { withResponsive } from '../withResponsive';

export const background = '#f3f3f3';

// accessors
const getDate = d => new Date(d.date);
const bisectDate = bisector(d => new Date(d.date)).left;

const trimTime = value => {
  return value.split('T')[0];
};

const useMetrics = ({ values, width, height, margin }) => {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [0, (Math.max(...values.map(x => x.value)) || 0) + innerHeight / 3],
        nice: true,
      }),
    [margin.top, innerHeight, values]
  );

  const timeScale = useMemo(
    () =>
      scaleTime({
        range: [margin.left, innerWidth + margin.left],
        domain: extent(values, getDate),
      }),
    [innerWidth, margin.left, values]
  );

  return { timeScale, yScale, innerWidth, innerHeight };
};

const defaultMargin = { top: 40, right: 30, bottom: 50, left: 50 };

function LineChartBase({ values, width, height, margin = defaultMargin, label }) {
  const { showTooltip, hideTooltip, tooltipData, tooltipTop = 0, tooltipLeft = 0 } = useTooltip();

  const { timeScale, yScale, innerWidth, innerHeight } = useMetrics({
    width,
    margin,
    values,
    height,
  });

  const handleTooltip = useCallback(
    event => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = timeScale.invert(x);
      const index = bisectDate(values, x0, 1);
      const d0 = values[index - 1];
      const d1 = values[index];
      let d = d0;
      /* find nearest point and show tooltip with data */
      if (d1 && getDate(d1)) {
        d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
      }
      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: yScale(d.value),
      });
    },
    [showTooltip, yScale, timeScale, values]
  );

  if (width < 10) return null;

  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
        <Group left={margin.left} top={margin.top}>
          <GridRows
            top={-margin.top}
            scale={yScale}
            width={innerWidth}
            height={innerHeight}
            stroke='#e0e0e0'
          />
          <GridColumns scale={timeScale} width={innerWidth} height={innerHeight} stroke='#e0e0e0' />
          <line x1={innerWidth} x2={innerWidth} y1={0} y2={innerHeight} stroke='#e0e0e0' />
          <AxisBottom
            left={-margin.left}
            top={innerHeight}
            scale={timeScale}
            numTicks={innerHeight > 520 ? 10 : 5}
          />
          <AxisLeft top={-margin.top} scale={yScale} />
          <text x='-90' y='25' transform='rotate(-90)' fontSize={20}>
            {label}
          </text>
        </Group>
        <LinePath
          data={values}
          x={d => timeScale(getDate(d).valueOf()) ?? 0}
          y={d => yScale(d.value) ?? 0}
          stroke='#222'
          strokeWidth={1.5}
          strokeOpacity={0.8}
        />
        <Bar
          x={margin.left}
          y={margin.top}
          width={innerWidth}
          height={innerHeight}
          fill='transparent'
          rx={14}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />
        {tooltipData && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: margin.top }}
              to={{ x: tooltipLeft, y: innerHeight + margin.top }}
              stroke='black'
              strokeWidth={2}
              pointerEvents='none'
              strokeDasharray='5,2'
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop + 1}
              r={4}
              fill='black'
              fillOpacity={0.1}
              stroke='black'
              strokeOpacity={0.1}
              strokeWidth={2}
              pointerEvents='none'
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={4}
              fill='black'
              stroke='white'
              strokeWidth={2}
              pointerEvents='none'
            />
          </g>
        )}
      </svg>
      {tooltipData && (
        <div>
          <TooltipWithBounds
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
            style={defaultStyles}
          >
            <section>
              <Typography>Date: {trimTime(tooltipData.date)}</Typography>
              <Typography>Trips: {tooltipData.value}</Typography>
            </section>
          </TooltipWithBounds>
        </div>
      )}
    </div>
  );
}

export const ResponsiveLineChart = withResponsive(LineChartBase);
