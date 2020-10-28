import React, { useCallback } from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import { AlbersUsa } from '@visx/geo';
import { useTooltip } from '@visx/tooltip';
import { Zoom } from '@visx/zoom';

import { withResponsive } from '../withResponsive';
import { useColor } from './effects';
import { MapLegend } from './MapLegend';
import { MapTooltip } from './MapTooltip';
import usaStates from './usa.json';

export const backgroundColor = '#252b7e';
const LEGEND_WIDTH = 200;
const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: 'relative',
      display: 'flex',
      background: backgroundColor,
      borderRadius: 14,
    },
  })
);

function GeoCustom({ data, width, height }) {
  const styles = useStyles();
  const { showTooltip, hideTooltip, tooltipData, tooltipTop = 0, tooltipLeft = 0 } = useTooltip();
  const color = useColor(data);
  const handleTooltip = useCallback(
    ({ center, tooltipValue }) => {
      showTooltip({
        tooltipData: tooltipValue,
        tooltipLeft: center[0],
        tooltipTop: center[1],
      });
    },
    [showTooltip]
  );

  const preventScroll = useCallback(enable => {
    /* On mobile devices it works incorrectly to move the map if top scroll enabled */
    const body = document.getElementsByTagName('body')[0];
    if (enable) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = 'auto';
    }
  }, []);

  const centerX = (width - LEGEND_WIDTH) / 2;
  const centerY = height / 2;
  const initialScale = Math.min(width - LEGEND_WIDTH, height);
  return width - LEGEND_WIDTH < 10 || !data ? null : (
    <Zoom
      width={width}
      height={height}
      scaleXMin={100}
      scaleXMax={1200}
      scaleYMin={100}
      scaleYMax={1200}
      transformMatrix={{
        scaleX: initialScale,
        scaleY: initialScale,
        translateX: centerX,
        translateY: centerY,
        skewX: 0,
        skewY: 0,
      }}
    >
      {zoom => (
        <div className={styles.container}>
          <svg width={width} height={height}>
            <rect x={0} y={0} width={width} height={height} fill={backgroundColor} rx={14} />
            <AlbersUsa
              scale={zoom.transformMatrix.scaleX}
              translate={[zoom.transformMatrix.translateX, zoom.transformMatrix.translateY]}
              data={usaStates.features}
            >
              {customProjection => {
                return (
                  <g
                    onTouchStart={e => {
                      preventScroll(true);
                      zoom.dragStart(e);
                    }}
                    onTouchMove={zoom.dragMove}
                    onTouchEnd={e => {
                      preventScroll(false);
                      zoom.dragEnd(e);
                    }}
                    onMouseDown={zoom.dragStart}
                    onMouseMove={zoom.dragMove}
                    onMouseUp={zoom.dragEnd}
                    onMouseLeave={() => {
                      if (zoom.isDragging) zoom.dragEnd();
                    }}
                  >
                    {customProjection.features.map(({ feature, path: featurePath, centroid }) => {
                      const value = data[feature.properties.name];
                      const tooltipValue = { value, title: feature.properties.name };
                      return (
                        <path
                          key={`map-feature-${feature.properties.name}`}
                          d={featurePath || ''}
                          fill={color(value)}
                          stroke={backgroundColor}
                          strokeWidth={0.5}
                          onTouchStart={() => handleTooltip({ center: centroid, tooltipValue })}
                          onTouchMove={() => handleTooltip({ center: centroid, tooltipValue })}
                          onMouseEnter={() => handleTooltip({ center: centroid, tooltipValue })}
                          onMouseLeave={() => hideTooltip()}
                        />
                      );
                    })}
                  </g>
                );
              }}
            </AlbersUsa>
          </svg>
          {tooltipData && (
            <div>
              <MapTooltip
                tooltipData={tooltipData}
                tooltipTop={tooltipTop}
                tooltipLeft={tooltipLeft}
              />
            </div>
          )}
          <MapLegend width={LEGEND_WIDTH} colorScale={color} />
        </div>
      )}
    </Zoom>
  );
}

export const UsaMap = withResponsive(GeoCustom);
