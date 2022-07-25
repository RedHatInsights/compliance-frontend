import {
  Chart,
  ChartBar,
  ChartContainer,
  ChartStack,
  ChartTooltip,
} from '@patternfly/react-charts';
import propTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';

const tooltipXOffset = (total, width, count) => -((width * count) / total / 2);

const MultiSegmentBar = ({
  data,
  height = '20px',
  tooltipOrientation = 'top',
  tooltipYOffset = -15,
}) => {
  const [chartWidth, setChartWidth] = useState(167);
  const [chartHeight, setChartHeight] = useState(24);
  const container = useRef(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      setChartWidth(event[0].contentBoxSize[0].inlineSize);
      setChartHeight(event[0].contentBoxSize[0].blockSize);
    });

    if (container !== null) {
      resizeObserver.observe(container.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  });

  const dataValuesSum = data.reduce(
    (previous, current) => previous + current.value,
    0
  );

  return (
    <div ref={container} style={{ height, padding: 0 }}>
      <Chart
        showAxis={false}
        width={chartWidth}
        height={chartHeight}
        padding={0}
        containerComponent={<ChartContainer portalZIndex={110} />}
      >
        <ChartStack horizontal colorScale={data.map((point) => point.color)}>
          {data.map((point) => (
            <ChartBar
              key={point.title}
              data={[
                {
                  name: point.title,
                  x: '',
                  y: point.value,
                  label: point.label,
                },
              ]}
              barWidth={parseFloat(height) - 4}
              labelComponent={
                <ChartTooltip
                  orientation={tooltipOrientation}
                  dy={tooltipYOffset}
                  dx={tooltipXOffset(dataValuesSum, chartWidth, point.value)}
                />
              }
            />
          ))}
        </ChartStack>
      </Chart>
    </div>
  );
};

MultiSegmentBar.propTypes = {
  data: propTypes.array,
  height: propTypes.oneOfType([propTypes.number, propTypes.string]),
  tooltipOrientation: propTypes.oneOf(['top', 'bottom', 'right', 'left']),
  tooltipYOffset: propTypes.number,
};

export default MultiSegmentBar;
