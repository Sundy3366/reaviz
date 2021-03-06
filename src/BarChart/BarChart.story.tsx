import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { object, boolean, color, number } from '@storybook/addon-knobs';
import { BarChart } from './BarChart';
import { MarimekkoChart } from './MarimekkoChart';
import { StackedBarChart } from './StackedBarChart';
import { StackedNormalizedBarChart } from './StackedNormalizedBarChart';
import {
  categoryData,
  largeCategoryData,
  multiCategory,
  randomNumber,
  medDateData,
  numberData
} from '../common/demo';
import chroma from 'chroma-js';
import { timeWeek, timeMonth } from 'd3-time';
import { range } from 'd3-array';
import {
  BarSeries,
  Bar,
  StackedBarSeries,
  StackedNormalizedBarSeries,
  MarimekkoBarSeries
} from './BarSeries';
import { GridlineSeries, Gridline } from '../common/Gridline';
import { LinearXAxis, LinearXAxisTickSeries } from '../common/Axis/LinearAxis';

storiesOf('Charts/Bar/Single Series', module)
  .add('Simple', () => {
    const gradient = boolean('Gradient', true);
    const rounded = boolean('Rounded', true)
    const padding = number('Padding', 0.1);
    const height = number('Height', 250);
    const width = number('Width', 350);
    const fill = color('Color', '#418AD7');
    const data = object('Data', categoryData);

    return (
      <BarChart
        width={height}
        height={width}
        data={data}
        series={
          <BarSeries
            colorScheme={[fill]}
            padding={padding}
            bar={
              <Bar
                rounded={rounded}
                gradient={gradient}
              />
            }
          />
        }
      />
    );
  }, { options: { showAddonPanel: true } })
  .add('Large Dataset', () => (
    <BarChart
      width={350}
      height={350}
      data={largeCategoryData}
      series={
        <BarSeries
          colorScheme={chroma
            .scale(['ACB7C9', '418AD7'])
            .colors(largeCategoryData.length)}
        />
      }
    />
  ))
  .add('Custom Colors', () => (
    <BarChart
      width={350}
      height={250}
      data={categoryData}
      series={
        <BarSeries
          colorScheme={(_data, index) => (index % 2 ? '#418AD7' : '#ACB7C9')}
        />
      }
    />
  ))
  .add('Custom Bar Width', () => (
    <BarChart
      width={350}
      height={250}
      series={<BarSeries bar={<Bar width={5} />} />}
      data={categoryData}
    />
  ))
  .add('Live Updating', () => <LiveDataDemo />)
  .add('Autosize', () => (
    <div style={{ width: '50vw', height: '50vh', border: 'solid 1px red' }}>
      <BarChart data={categoryData} />
    </div>
  ))
  .add('Performance', () =>
    range(15).map(i => (
      <div
        key={i}
        style={{
          width: '250px',
          height: '250px',
          border: 'solid 1px green',
          margin: '25px',
          display: 'inline-block'
        }}
      >
        <BarChart data={categoryData} />
      </div>
    ))
  )
  .add('No Animation', () => (
    <BarChart
      width={350}
      height={250}
      data={categoryData}
      series={<BarSeries animated={false} />}
    />
  ));

storiesOf('Charts/Bar/Histogram', module)
  .add('Dates', () => (
    <BarChart
      width={350}
      height={250}
      xAxis={
        <LinearXAxis
          type="time"
          roundDomains={true}
          tickSeries={<LinearXAxisTickSeries interval={timeWeek} />}
        />
      }
      data={medDateData}
    />
  ))
  .add('Numbers', () => (
    <BarChart
      width={350}
      height={250}
      xAxis={<LinearXAxis type="value" />}
      data={numberData}
    />
  ))
  .add('Custom Bin Thresholds', () => (
    <BarChart
      width={350}
      height={250}
      data={medDateData}
      xAxis={
        <LinearXAxis
          type="time"
          roundDomains={true}
          tickSeries={<LinearXAxisTickSeries interval={timeMonth} />}
        />
      }
      series={<BarSeries binThreshold={timeWeek} />}
    />
  ));

storiesOf('Charts/Bar/Multi Series', module)
  .add('Simple', () => (
    <BarChart
      width={350}
      height={350}
      data={multiCategory}
      series={
        <BarSeries
          colorScheme={chroma
            .scale(['ACB7C9', '418AD7'])
            .colors(multiCategory.length)}
          padding={0.8}
        />
      }
    />
  ))
  .add('Stacked', () => (
    <StackedBarChart
      width={350}
      height={350}
      data={multiCategory}
      series={
        <StackedBarSeries
          colorScheme={chroma
            .scale(['ACB7C9', '418AD7'])
            .colors(multiCategory.length)}
        />
      }
    />
  ))
  .add('Stacked Normalized', () => (
    <StackedNormalizedBarChart
      width={350}
      height={350}
      data={multiCategory}
      series={
        <StackedNormalizedBarSeries
          colorScheme={chroma
            .scale(['ACB7C9', '418AD7'])
            .colors(multiCategory.length)}
        />
      }
    />
  ))
  .add('Marimekko', () => (
    <MarimekkoChart
      width={350}
      height={350}
      data={multiCategory}
      series={
        <MarimekkoBarSeries
          colorScheme={chroma
            .scale(['ACB7C9', '418AD7'])
            .colors(multiCategory.length)}
        />
      }
    />
  ));

storiesOf('Charts/Bar/Gridlines', module)
  .add('All Axes', () => (
    <BarChart
      width={350}
      height={250}
      data={categoryData}
      gridlines={<GridlineSeries line={<Gridline direction="all" />} />}
    />
  ))
  .add('X-Axis', () => (
    <BarChart
      width={350}
      height={250}
      data={categoryData}
      gridlines={<GridlineSeries line={<Gridline direction="x" />} />}
    />
  ))
  .add('Y-Axis', () => (
    <BarChart
      width={350}
      height={250}
      data={categoryData}
      gridlines={<GridlineSeries line={<Gridline direction="y" />} />}
    />
  ));

class LiveDataDemo extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      data: [...largeCategoryData]
    };
  }

  updateData = () => {
    const data = this.state.data;
    const updateCount = randomNumber(1, 4);
    const newData = [...data];

    let idx = 0;
    while (idx <= updateCount) {
      const updateIndex = randomNumber(0, data.length - 1);
      newData[updateIndex].data = randomNumber(10, 100);
      idx++;
    }

    this.setState({ data: newData });
  };

  sortData = () => {
    const data = this.state.data;
    this.setState({
      data: data.reverse()
    });
  };

  render() {
    const data = this.state.data;
    return (
      <Fragment>
        <BarChart
          width={350}
          height={350}
          data={data}
          series={
            <BarSeries
              colorScheme={chroma
                .scale(['ACB7C9', '418AD7'])
                .colors(data.length)}
            />
          }
        />
        <br />
        <button onClick={this.updateData}>Update</button>
        <button onClick={this.sortData}>Sort</button>
      </Fragment>
    );
  }
}
