import React, {useEffect, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import {FooterToolbar, PageContainer, ProCard} from '@ant-design/pro-components'
import {Button, Row, Col, Form} from 'antd'
import {getUserID} from '@/utils/auths'
import {history, useModel} from 'umi'
import {useIntl} from '@@/plugin-locale/localeExports'
import {getTitleInfo, colGrid, rowGrid} from '@/utils/units'
import SearchInput from '@/components/SearchInput'

const FormItem = Form.Item;
// TODO: 用来判断是否是第一次加载数据
let isLoadingData = false;

// interface Props {
//     RouteChildrenProps: RouteChildrenProps,
//     title: string,
// }

const BasicInfo: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    // const {RouteChildrenProps: {match: {params}}} = props;
    const {match: {params}} = props;
    const {
        CJobInfo: {NBasicInfo, NBasicInfo: {Principal}}, getCJobInfoByID
    } = useModel('job', (res: any) => ({
        CJobInfo: res.CJobInfo,
        getCJobInfoByID: res.getCJobInfoByID,
    }));
    const [jobID, setJobID] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // TODO: 当【没有 ID && isLoadingData == false】时调用接口获取数据
        if (!jobID && !isLoadingData && params?.id !== ':id') {
            isLoadingData = true;
            getCJobInfoByID({CJobID: Number(atob(params?.id)), BizType4ID: Number(atob(params?.bizType4id)), UserID: getUserID()})
                // @ts-ignore
                .then((res: API.NJobDetailDto) => {
                    // TODO: 设置 ID 且初始化数据
                    setJobID(res?.ID);
                    setLoading(false);
                    isLoadingData = false;
                })
        }
    }, [getCJobInfoByID, jobID, params?.bizType4id, params?.id])

    /**
     * @Description: TODO: change 事件
     * @author XXQ
     * @date 2023/4/17
     * @param filedName
     * @param val
     * @param option
     * @returns
     */
    const handleChange =(filedName: string, val: any, option?: any)=> {
        console.log(filedName, val, option);
    }

    // 初始化（或用于 message 提醒）
    const intl = useIntl();

    // TODO: 获取列名<Title>
    const formLabel = (code: string, defaultMessage: string) => getTitleInfo(code, intl, defaultMessage);

    return (
        <PageContainer
            loading={loading}
            header={{
                // title: props?.title,
                breadcrumb: {},
            }}
        >
            <ProCard title={'委托信息'} bordered={true}>
                <Row gutter={rowGrid}>
                    <Col {...colGrid}>
                        <FormItem label={formLabel('code', '业务编号')}>
                            {NBasicInfo?.Code}
                        </FormItem>
                    </Col>
                    <Col {...colGrid}>
                        <FormItem label={formLabel('sales', '销售')}>
                            {Principal?.SalesManName}
                        </FormItem>
                    </Col>
                    <Col {...colGrid}>
                        <FormItem label={formLabel('sales', '销售')}>
                            {Principal?.SalesManName}
                        </FormItem>
                    </Col>
                    <Col {...colGrid}>
                        <FormItem label={formLabel('sales', '销售')}>
                            {Principal?.SalesManName}
                        </FormItem>
                    </Col>
                    <Col {...colGrid}>
                        <FormItem label={formLabel('sales', '销售')}>
                            {Principal?.SalesManName}
                        </FormItem>
                    </Col>
                    <Col {...colGrid}>
                        <FormItem label={formLabel('sales', '销售')}>
                            {Principal?.SalesManName}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={rowGrid}>
                    <Col {...colGrid}>
                        <FormItem
                            label={'客户'}
                            initialValue={{value: Principal.PrincipalXID, label: Principal.PrincipalXName}}
                        >
                            <SearchInput
                                qty={5}
                                id={'Customer'}
                                value={{value: Principal.PrincipalXID, label: Principal.PrincipalXName}}
                                url={'/api/MCommon/GetCTNameByStrOrType'}
                                query={{
                                    IsJobCustomer: true, BusinessLineID: null,
                                    UserID: getUserID(), CTType: 1, SystemID: 4,
                                }}
                                handleChangeData={(val: any, option: any)=> handleChange('CustomerID', val, option)}
                            />
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
export default BasicInfo;