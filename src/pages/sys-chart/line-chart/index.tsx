import React, { useState, useEffect } from 'react';
import type { RouteChildrenProps } from 'react-router';
import {FooterToolbar, PageContainer, ProCard} from '@ant-design/pro-components'
import {Button} from 'antd'
import { Line } from '@ant-design/plots';

const LineChart: React.FC<RouteChildrenProps> = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        asyncFetch();
    }, []);

    const asyncFetch = () => {
        fetch('https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json')
            .then((response) => response.json())
            .then((json) => {
                console.log('fetch data: ', json);
                setData(json);
            })
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    };
    const config = {
        data,
        padding: 'auto',
        xField: 'Date',
        yField: 'scales',
        label: {},
        xAxis: {
            type: 'timeCat',
            tickCount: 5,
        },
        smooth: true,// smooth：默认 false<折线>；true：曲线
    };
    const data2 = [
        {
            year: '1991',
            value: 3,
        },
        {
            year: '1992',
            value: 4,
        },
        {
            year: '1993',
            value: 3.5,
        },
        {
            year: '1994',
            value: 5,
        },
        {
            year: '1995',
            value: 4.9,
        },
        {
            year: '1996',
            value: 6,
        },
        {
            year: '1997',
            value: 7,
        },
        {
            year: '1998',
            value: 9,
        },
        {
            year: '1999',
            value: 13,
        },
    ];
    const config2 = {
        data: data2,
        xField: 'year',
        yField: 'value',
        label: {},
        point: {
            size: 5,
            shape: 'diamond',
            style: {
                fill: 'white',
                stroke: '#5B8FF9',
                lineWidth: 2,
            },
        },
        tooltip: {
            showMarkers: false,
        },
        state: {
            active: {
                style: {
                    shadowBlur: 4,
                    stroke: '#000',
                    fill: 'red',
                },
            },
        },
        interactions: [
            {
                type: 'marker-active',
            },
        ],
    };

    return (
        <PageContainer
            loading={false}
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard title={'智慧图表'}>
                <Line
                    {...config}
                    onReady={(plot) => {
                        plot.on('plot:click', (evt: any) => {
                            const {x, y} = evt;
                            const {xField} = plot.options;
                            const tooltipData = plot.chart.getTooltipItems({x, y});
                            console.log(tooltipData, xField);
                        });
                    }}
                />
            </ProCard>
            <ProCard title={'智慧图表'}>
                <Line {...config2} />
            </ProCard>

            <FooterToolbar extra={<Button>返回</Button>}>
                {/*<Button key={'submit'} type={'primary'} htmlType={'submit'}>提交</Button>*/}
            </FooterToolbar>
        </PageContainer>
    )
}
export default LineChart;