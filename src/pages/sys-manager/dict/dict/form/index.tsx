import React, {useRef, useState} from 'react';
import type {RouteChildrenProps} from 'react-router';
import type {ProFormInstance} from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProCard,
    ProForm,
    ProFormText,
} from '@ant-design/pro-components'
import {Button, Col, Form, message, Row, Space} from 'antd'
import {useModel, history} from 'umi'
import {getFormErrorMsg} from '@/utils/units'
import DictDetailDetailIndex from '@/pages/sys-manager/dict/dict-detail'


type APIDictDetail = APIManager.DictDetail;
type APISearchDictDetail = APIManager.SearchDictDetailParams;
const DictForm: React.FC<RouteChildrenProps> = (props) => {
    // @ts-ignore
    const {match: {params}} = props;
    const id = atob(params?.id);
    const [form] = Form.useForm();
    const formRef = useRef<ProFormInstance>();
    //region TODO: 数据层
    const {
        queryDictDetail, DictInfo, addDict,
    } = useModel('manager.dict', (res: any) => ({
        DictInfo: res.DictInfo,
        queryDictDetail: res.queryDictDetail,
        addDict: res.addDict,
    }));

    const [DictDetailListVO, setDictDetailListVO] = useState<APIDictDetail[]>(DictInfo);


    //endregion

    // useEffect(() => {
    // }, [])


    /**
     * @Description: TODO: 获取 CV 详情
     * @author XXQ
     * @date 2023/5/5
     * @returns
     */
    const handleGetDictInfo = async () => {
        const param: APISearchDictDetail = {dictId: Number(id), dictLabel: '', currentPage: 1, pageSize: 10,};
        const result: API.Result = await queryDictDetail(param);
        setDictDetailListVO(result.data);
        return result.data;
    }

    /**
     * @Description: TODO: 保存数据
     * @author XXQ
     * @date 2023/5/24
     * @param val
     * @returns
     */
    const onFinish = async (val: any) => {
        console.log(val);
        const result: API.Result = await addDict(val);
        if (result.success) {
            message.success('success');
        } else {
            message.error(result.message)
        }
    }

    /**
     * @Description: TODO: 验证错误信息
     * @author XXQ
     * @date 2023/5/24
     * @param val
     * @returns
     */
    const onFinishFailed = (val: any) => {
        console.log(val);
        const errInfo = getFormErrorMsg(val);
        message.error(errInfo);
    }

    //region TODO:
    //endregion

    return (
        <PageContainer
            header={{
                breadcrumb: {},
            }}
        >
            <ProForm
                layout={'inline'}
                form={form}
                formRef={formRef}
                // TODO: 不显示提交、重置按键
                submitter={false}
                // TODO: 焦点给到第一个控件
                autoFocusFirstInput
                // TODO: 设置默认值
                initialValues={DictDetailListVO}
                formKey={'cv-center-information'}
                // TODO: 提交数据
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                // TODO: 向后台请求数据
                request={async () => handleGetDictInfo()}
            >
                <ProCard title={'Name & Code'} className={'ant-card'}>
                    {/** // TODO: CV Name、CV Name (For Print)、Short Name、CV Identity */}
                    <Row gutter={24}>
                        <Col span={8}>
                            <ProFormText
                                required
                                name='nameFullEn'
                                placeholder=''
                                tooltip='length: 100'
                                label='Name'
                                rules={[{required: true, message: 'Name'}]}
                            />
                        </Col>
                        <Col span={8}>
                            <ProFormText
                                required
                                placeholder=''
                                label='Name Local'
                                tooltip='length: 100'
                                name='nameFullLocal'
                                rules={[{required: true, message: 'Name Local'}]}
                            />
                        </Col>
                        <Col span={6}>
                            <ProFormText
                                required
                                name='taxNum'
                                placeholder=''
                                label='Tax Num'
                                tooltip='length: 30'
                                rules={[{required: true, message: 'Tax Num'}]}
                            />
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <DictDetailDetailIndex DictDetailList={DictDetailListVO}/>
                        </Col>
                    </Row>
                </ProCard>

                <FooterToolbar extra={<Button onClick={() => history.push({pathname: '/manager/Dict/dict'})}>返回</Button>}>
                    <Space>
                        <Button key={'submit'} type={'primary'} htmlType={'submit'}>Save</Button>
                    </Space>
                </FooterToolbar>
            </ProForm>
        </PageContainer>
    )
}
export default DictForm;