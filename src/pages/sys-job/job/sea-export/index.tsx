import React, {useState} from 'react';
import type {RouteChildrenProps} from 'react-router'
import Basic from "./basic";
import Pickup from "./pickup";
import Ports from "./port";
import Containers from "./containers";
import BillOfLoading from "./bill-of-loading";
import Remark from "./remark";
import '../style.less'
import {FooterToolbar, ProForm} from '@ant-design/pro-components'
import {Button, Form, message, Spin} from 'antd'
import {LeftOutlined, SaveOutlined} from '@ant-design/icons'
import {history} from '@@/core/history'
import {getFormErrorMsg} from '@/utils/units'
import {useParams} from 'umi'
import {useModel} from '@@/plugin-model/useModel'

const FormItem = Form.Item;

const SeaExport: React.FC<RouteChildrenProps> = (props) => {
    const params: any = useParams();
    const id = atob(params.id);

    const  {} = props;

    const {
        querySeaExportInfo
    } = useModel('job.job', (res: any) => ({
        querySeaExportInfo: res.querySeaExportInfo,
    }));

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [SeaExportInfo, setSeaExportInfo] = useState<any>({});


    /**
     * @Description: TODO: 获取海运出口信息
     * @author XXQ
     * @date 2023/7/26
     * @param paramsVal     查询参数
     * @returns
     */
    async function handleQuerySeaExportInfo(paramsVal: any) {
        // alert('loading Job Info !!!');
        // setLoading(true);
        // TODO: 获取用户数据
        let result: API.Result;
        if (paramsVal.id !== '0') {
            result = await querySeaExportInfo(paramsVal);
        } else {
            result = {success: true, data: {}};
        }

        // setLoading(false);
        setSeaExportInfo(result || {});
        return result.data;
    }

    const handleFinish = async (values: Record<string, any>) => {
        try {
            console.log(values)
            // await fakeSubmitForm(values);
            message.success('提交成功');
        } catch {
            // console.log
        }
    };

    const baseForm = {form, FormItem};

    return (
        <Spin spinning={loading}>
            <ProForm
                form={form}
                omitNil={false}
                layout="vertical"
                name={'formJobInfo'}
                className={'basicInfoProForm'}
                submitter={{
                    // 完全自定义整个区域
                    render: () => {
                        return (
                            <FooterToolbar
                                style={{height: 55}}
                                extra={<Button icon={<LeftOutlined/>} onClick={() => history.goBack()}>Back</Button>}>
                                <Button icon={<SaveOutlined/>} key={'submit'} type={'primary'}
                                        htmlType={'submit'}>Save</Button>
                            </FooterToolbar>
                        );
                    },
                }}
                onFinish={handleFinish}
                onFinishFailed={async (values: any) => {
                    if (values.errorFields?.length > 0) {
                        /** TODO: 错误信息 */
                        message.error(getFormErrorMsg(values));
                        setLoading(false);
                    }
                }}
                initialValues={SeaExportInfo}
                // @ts-ignore
                request={async () => handleQuerySeaExportInfo({id})}
            >
                <Basic {...baseForm} title={'Basic'}/>

                {/* 提货信息 */}
                <Pickup title={'Pickup'}/>

                {/* 港口信息 */}
                <Ports {...baseForm} title={'Port'}/>

                <Containers {...baseForm}/>

                {/* 收发通信息 */}
                <BillOfLoading title={'Bill Of Loading'}/>

                <Remark title={'Remark'} />
            </ProForm>
        </Spin>
    )
}
export default SeaExport;