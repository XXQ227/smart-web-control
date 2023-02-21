import React, {useEffect, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import {FooterToolbar, PageContainer, ProCard} from '@ant-design/pro-components'
import {Button, Row, Col, Form} from 'antd'
import {getUserID} from '@/utils/auths'
import {history, useModel} from 'umi'
import {useIntl} from '@@/plugin-locale/localeExports'
import {getTitleInfo, colGrid, rowGrid} from '@/utils/units'

const FormItem = Form.Item;
// TODO: 用来判断是否是第一次加载数据
let isLoadingData = false;
const Ticket: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}} = props;
    const job = useModel('job');
    const {CJobInfo: {NBasicInfo, NBasicInfo: {Principal}}} = job;
    const [jobID, setJobID] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // TODO: 当【没有 ID && isLoadingData == false】时调用接口获取数据
        if (!jobID && !isLoadingData) {
            isLoadingData = true;
            job.getCJobInfoByID({CJobID: Number(atob(params?.id)), UserID: getUserID()})
                // @ts-ignore
                .then((res: API.GetCJobByIDResponse) => {
                    // TODO: 设置 ID 且初始化数据
                    setJobID(res?.Content?.NJobDetailDto?.ID);
                    setLoading(false);
                    isLoadingData = false;
                })
        }
    }, [job, jobID, params?.id])


    // 初始化（或用于 message 提醒）
    const intl = useIntl();

    // TODO: 获取列名<Title>
    const title = (code: string, defaultMessage: string) => getTitleInfo(code, intl, defaultMessage);

    console.log(NBasicInfo, Principal);

    return (
        <PageContainer
            loading={loading}
            header={{
                breadcrumb: {},
            }}
        >
            <ProCard title={'委托信息'} bordered={true}>
                <Row gutter={rowGrid}>
                    <Col {...colGrid}>
                        <FormItem label={title('code', '业务编号')}>
                            {NBasicInfo?.Code}
                        </FormItem>
                    </Col>
                    <Col {...colGrid}>
                        <FormItem label={title('sales', '销售')}>
                            {Principal?.SalesManName}
                        </FormItem>
                    </Col>
                    <Col {...colGrid}>
                        <FormItem label={title('sales', '销售')}>
                            {Principal?.SalesManName}
                        </FormItem>
                    </Col>
                    <Col {...colGrid}>
                        <FormItem label={title('sales', '销售')}>
                            {Principal?.SalesManName}
                        </FormItem>
                    </Col>
                    <Col {...colGrid}>
                        <FormItem label={title('sales', '销售')}>
                            {Principal?.SalesManName}
                        </FormItem>
                    </Col>
                    <Col {...colGrid}>
                        <FormItem label={title('sales', '销售')}>
                            {Principal?.SalesManName}
                        </FormItem>
                    </Col>
                </Row>
            </ProCard>
            <FooterToolbar extra={<Button onClick={()=> history.goBack()}>返回</Button>}>
                <Button key={'submit'} type={'primary'} htmlType={'submit'}>提交</Button>
            </FooterToolbar>
        </PageContainer>
    )
}
export default Ticket;