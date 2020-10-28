import { useMemo } from 'react';

import { scaleQuantile } from '@visx/scale';

const defaultColors = ['#65fe8d', '#2E7F18', '#33531e', '#544b0f', '#a75838', '#863e3d', '#cb071b'];

export const useColor = data => {
  return useMemo(() => {
    if (!data) return null;

    const values = Object.values(data);
    return scaleQuantile({
      domain: [0, Math.max(...values)],
      range: defaultColors,
    });
  }, [data]);
};
