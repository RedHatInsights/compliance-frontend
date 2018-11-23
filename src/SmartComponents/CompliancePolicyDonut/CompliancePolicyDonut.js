import React from 'react';
import propTypes from 'prop-types';
import {
    ChartDonut,
    ChartLabel,
    ChartTheme,
    ChartLegend
} from '@patternfly/react-charts';

class CompliancePolicyDonut extends React.Component {
    constructor(props) {
        super();
        this.state = {
            policy: props.policy,
            height: props.height,
            width: props.width,
            showLegend: props.showLegend,
            legendHorizontal: props.legendHorizontal,
            compliantHostCount: props.policy.attributes.compliant_host_count,
            totalHostCount: props.policy.attributes.total_host_count
        };
    }

    getChart(theme) {
        return (
            <ChartDonut
                data={[
                    { x: 'Compliant', y: this.state.compliantHostCount },
                    { x: 'Non-compliant', y: this.state.totalHostCount - this.state.compliantHostCount }
                ]}
                labels={this.getTooltipLabel}
                theme={theme}
                height={200}
                width={200}
            />
        );
    };

    getTooltipLabel(datum) {
        return `${datum.x}: ${datum.y}`;
    };

    getLegend(theme, horizontal) {
        return (
            <ChartLegend
                data={[
                    { name: this.state.compliantHostCount + ' Systems Compliant' },
                    { name: this.state.totalHostCount - this.state.compliantHostCount + ' Systems Noncompliant' }
                ]}
                orientation={horizontal ? 'horizontal' : 'vertical'}
                theme={theme}
                y={horizontal ? 0 : 55}
                height={horizontal ? 35 : 200}
                width={200}
            />
        );
    };

    render() {
        const compliancePercentage = 100 * this.state.compliantHostCount / this.state.totalHostCount;
        const label = (
            <svg
                className="chart-label"
                style={{ position: 'absolute', height: this.state.height, width: this.state.width }}
            >
                <ChartLabel
                    style={{ fontSize: 20 }}
                    text={compliancePercentage + '%'}
                    textAnchor="middle"
                    verticalAnchor="middle"
                    dx={this.state.width / 2}
                    dy={(this.state.height / 2) - 10}
                />
                <ChartLabel
                    style={{ fill: '#bbb', fontSize: 15 }}
                    text="Compliant"
                    textAnchor="middle"
                    verticalAnchor="middle"
                    dx={this.state.width / 2}
                    dy={10 + this.state.height / 2}
                />
            </svg>
        );
        return (
            <div className="chart-inline">
                <div className="chart-container" style={{ maxHeight: this.state.height, maxWidth: this.state.width }}>
                    {label}
                    {this.getChart(ChartTheme.light.green)}
                    {(this.state.showLegend) ? this.getLegend(ChartTheme.light.green, this.state.legendHorizontal) : ''}
                </div>
            </div>
        );
    };
}

CompliancePolicyDonut.propTypes = {
    policy: propTypes.object.isRequired,
    width: propTypes.number.isRequired,
    height: propTypes.number.isRequired,
    showLegend: propTypes.bool,
    legendHorizontal: propTypes.bool
};

export default CompliancePolicyDonut;
