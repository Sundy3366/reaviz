import React, { Component } from 'react';
import { RadialAxisTickLineProps, RadialAxisTickLine } from './RadialAxisTickLine';
import { RadialAxisTickLabelProps, RadialAxisTickLabel } from './RadialAxisTickLabel';
import { CloneElement } from '../../../utils/children';

export interface RadialAxisTickProps {
  scale: any;
  outerRadius: number;
  padding: number;
  data: any;
  index: number;
  line: JSX.Element | null;
  label: JSX.Element | null;
}

export class RadialAxisTick extends Component<RadialAxisTickProps> {
  static defaultProps: Partial<RadialAxisTickProps> = {
    outerRadius: 0,
    padding: 0,
    line: <RadialAxisTickLine />,
    label: <RadialAxisTickLabel />
  };

  render() {
    const { line, label, scale, outerRadius, data, index, padding } = this.props;
    const rotation = (scale(data) * 180) / Math.PI - 90;
    const transform = `rotate(${rotation}) translate(${outerRadius + padding},0)`;

    return (
      <g transform={transform}>
        {line && (
          <CloneElement<RadialAxisTickLineProps>
            element={line}
          />
        )}
        {label && (
          <CloneElement<RadialAxisTickLabelProps>
            element={label}
            index={index}
            scale={scale}
            rotation={rotation}
            lineSize={line.props.size}
            data={data}
          />
        )}
      </g>
    );
  }
}
