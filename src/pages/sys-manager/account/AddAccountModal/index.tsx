import React, {Fragment, useState} from 'react';
import {
    ProForm,
    ProFormDatePicker,
    ProFormRadio, ProFormText,
} from '@ant-design/pro-components';
import {Button, Modal, Divider, Row, Col, Form} from 'antd';
import {getFormErrorMsg, rowGrid} from "@/utils/units";
import {EditOutlined, PlusOutlined, FileSearchOutlined, CaretDownOutlined} from "@ant-design/icons";
import {message} from "antd/es";
import {useModel} from 'umi';
import type moment from 'moment';

export type LocationState = Record<string, unknown>;

const AccountTypeList = [
    {value: 1, label: 'Normal'},
    {value: 2, label: 'Additional'}
];

const accountCurrArr = [
    {currencyName: 'CNY', rateValue: ''},
    {currencyName: 'USD', rateValue: ''},
    {currencyName: 'THB', rateValue: ''},
    {currencyName: 'EUR', rateValue: ''},
];

interface Props {
    id: string,
    state?: number,
    isCreate?: boolean,
    handleChange: () => void,
}

const AddAccountModal: React.FC<Props> = (props) => {
    const {id, state, isCreate} = props;
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [accountCurrList, setAccountCurrList] = useState<any[]>(accountCurrArr);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [AccountInfoVO, setAccountInfoVO] = useState<any>({});

    const {
        queryAccountPeriodInfo, addAccountPeriod, editAccountPeriod
    } = useModel('manager.account', (res: any) => ({
        queryAccountPeriodInfo: res.queryAccountPeriodInfo,
        addAccountPeriod: res.addAccountPeriod,
        editAccountPeriod: res.editAccountPeriod,
    }));

    /**
     * @Description: TODO: 查询账期详情
     * @author LLS
     * @date 2023/8/14
     * @returns
     */
    const handleGetAccountInfo = async () => {
        setLoading(true);
        const result: any = await queryAccountPeriodInfo({id});
        if (result.success) {
            setAccountInfoVO(result.data);
            setAccountCurrList(result.data?.accountPeriodExrateBOList || accountCurrArr);
        } else {
            message.error(result.message);
        }
        setLoading(false);
        return result;
    }

    /*const onChange = (val: any, filedName: string, e: any) => {
        console.log(val, filedName, e);
        if (filedName === 'finaYearMonth') {
            const type: any = form.getFieldValue('type');
            console.log(type);
            const currentDate = new Date(val);
            // TODO: 月份是从 0 开始计数的
            const currentMonth = currentDate.getMonth() + 1;
            console.log(currentDate, currentMonth);
            if (type === 0) {
                const currentYear = currentDate.getFullYear();
                const lastMonth = currentMonth - 1; // 月份是从 0 开始计数的
                form.setFieldsValue({
                    dateStart: currentYear.toString() + '-' + lastMonth.toString().padStart(2, '0') + '-21',
                    // TODO: 6 月为 30 天；12 月为 31 天
                    dateEnd: val + '-20',
                });
            } else {
                form.setFieldsValue({
                    dateStart: val + '-21',
                    // TODO: 6 月为 30 天；12 月为 31 天
                    dateEnd: val + (currentMonth === 6 ? '-30' : '-31'),
                });
            }
        }
    }*/

    const disabledEndDate = (date: moment.Moment | null) => {
        if (!startDate || !date) {
            return false;
        }
        return date.isBefore(startDate);
    };

    const handleStartDateChange = (date: string | null) => {
        if (date) {
            setStartDate(date);
            const dateEnd = form?.getFieldValue('dateEnd');
            // 如果已选择了End Date并且在Start Date之前，则重置End Date
            if (dateEnd && dateEnd.isBefore(date)) {
                form.setFieldsValue({'dateEnd': null});
            }
        }
    };

    /**
     * @Description: TODO: 修改币种汇率信息
     * @author XXQ
     * @date 2023/8/8
     * @param e
     * @param filedName
     * @param indexCurr
     * @returns
     */
    const handleChangeCurrency = (e: any, filedName: string, indexCurr: number) => {
        const currArr: any[] = accountCurrList.slice(0);
        const target: any = currArr.find((item: any) => item.currencyName === filedName) || {};
        target.rateValue = e?.target?.value;
        currArr.splice(indexCurr, 1, target);
        setAccountCurrList(currArr);
        form.setFieldsValue({accountPeriodExrateBOList: currArr});
        // TODO: 内部人民币统计汇率，在创建账期时，使用当期业务人民币汇率
        if (filedName === 'CNY') {
            form.setFieldsValue({funcCnyRate: e?.target?.value});
        }
    }

    /**
     * @Description: TODO: 弹框关闭
     * @author LLS
     * @date 2023/8/14
     * @returns
     */
    const handleModal = () => {
        // 清空控件数据
        form.resetFields();
        setOpen(false);
    };

    /**
     * @Description: TODO: 保存数据
     * @author LLS
     * @date 2023/7/31
     * @param val
     * @returns
     */
    const onFinish = async (val: any) => {
        setLoading(true);
        let result: API.Result;
        if (id === '0') {
            // TODO: 新增账期
            val.branchId = '0';
            val.statusDeferra = 0;    // TODO: 递延状态
            val.statusPredicted = 0;  // TODO: 预估状态
            result = await addAccountPeriod(val);
        } else {
            // TODO: 编辑账期
            val.id = id;
            result = await editAccountPeriod(val);
        }
        console.log(result);
        if (result?.success) {
            message.success('Success');
            handleModal();
            props.handleChange();
        } else {
            message.error(result?.message);
        }
        setLoading(false);
    }

    /**
     * @Description: TODO: 验证错误信息
     * @author XXQ
     * @date 2023/5/24
     * @param val
     * @returns
     */
    const onFinishFailed = (val: any) => {
        const errInfo = getFormErrorMsg(val);
        message.error(errInfo);
    }

    return (
        <Fragment>
            {
                isCreate ?
                    <Button onClick={() => setOpen(true)} type={'primary'} icon={<PlusOutlined/>}>Add Account Period</Button>
                    :
                    state === 0 ?
                        <EditOutlined color={'#1765AE'} onClick={() => setOpen(true)}/>
                        :
                        <FileSearchOutlined color={'#1765AE'} onClick={() => setOpen(true)}/>
            }
            {
                !open ? null :
                    <Modal
                        className={'ant-add-modal'}
                        style={{ top: 150 }}
                        open={open}
                        onOk={() => handleModal()}
                        onCancel={() => handleModal()}
                        title={'Edit Accounting Period'}
                        width={1000}
                        footer={null}
                    >
                        <Divider />
                        <ProForm
                            disabled={AccountInfoVO?.state}
                            className={'ant-account-form'}
                            form={form}
                            // TODO: 不清空为 null 的数据
                            // omitNil={false}
                            // TODO: 不显示 提交按钮
                            submitter={false}
                            // TODO: 自动 focus 表单第一个输入框
                            autoFocusFirstInput
                            // TODO: 设置默认值
                            initialValues={AccountInfoVO}
                            // TODO: 提交数据
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            request={async () => handleGetAccountInfo()}
                        >
                            <Row gutter={rowGrid}>
                                <Divider orientation="left" orientationMargin={0}><CaretDownOutlined style={{marginRight: 5}}/>Basic Information</Divider>
                            </Row>
                            <Row gutter={rowGrid} className={'ant-pro-row'}>
                                <Col xs={24} sm={22} md={7} lg={6} xl={5} xxl={5}>
                                    <ProFormDatePicker.Month
                                        required
                                        placeholder={''}
                                        name='finaYearMonth'
                                        label='Accounting Period'
                                        rules={[{required: true, message: 'Accounting Period is required'}]}
                                        fieldProps={{
                                            format: 'YYYY-MM'
                                        }}
                                        /*fieldProps={{
                                            onChange: (e, dataString)=> onChange(dataString, 'finaYearMonth', e)
                                        }}*/
                                    />
                                </Col>
                                <Col xs={24} sm={22} md={15} lg={11} xl={10} xxl={11}>
                                    <Row>
                                        <Col>
                                            <ProFormDatePicker
                                                required
                                                placeholder={''}
                                                name='dateStart'
                                                label='Start Date'
                                                rules={[{required: true, message: 'Start Date is required'}]}
                                                fieldProps={{
                                                    onChange: (e, dataString)=> handleStartDateChange(dataString)
                                                }}
                                            />
                                        </Col>
                                        <Col>
                                            <span className={'ant-space-span-solid'}/>
                                        </Col>
                                        <Col>
                                            <ProFormDatePicker
                                                required
                                                placeholder={''}
                                                name='dateEnd'
                                                label='End Date'
                                                rules={[{required: true, message: 'End Date is required'}]}
                                                fieldProps={{
                                                    disabledDate: disabledEndDate,
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={24} sm={22} md={12} lg={6} xl={7} xxl={7}>
                                    <ProFormRadio.Group
                                        required
                                        name={'type'}
                                        label={'Type'}
                                        options={AccountTypeList}
                                        rules={[{required: true, message: 'Type is required'}]}
                                    />
                                </Col>
                            </Row>

                            <Row gutter={rowGrid}>
                                <Divider orientation="left" orientationMargin={0}><CaretDownOutlined style={{marginRight: 5}}/>Exchange Rate (for Business)</Divider>
                            </Row>
                            <Row gutter={rowGrid} className={'ant-pro-row-rate'}>
                                {accountCurrList?.map((item: any, indexCurr: number) =>
                                    <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                        <Row className={'ant-pro-text-rate'}>
                                            <Col>1 {item.currencyName} = </Col>
                                            <Col>
                                                <ProFormText
                                                    width={90}
                                                    required
                                                    placeholder=''
                                                    name={item.currencyName}
                                                    initialValue={item.rateValue}
                                                    rules={[{required: true, message: 'Is required'},{ pattern: /[0-9]+$/, message: 'Only numbers can be entered' }]}
                                                    fieldProps={{
                                                        onChange: (e: any)=> handleChangeCurrency(e, item.currencyName, indexCurr)
                                                    }}
                                                />
                                            </Col>
                                            <Col> HKD</Col>
                                        </Row>
                                    </Col>
                                )}
                                {/* // TODO: 用于保存时，获取数据用 */}
                                <Form.Item hidden={true} name={'accountPeriodExrateBOList'} />
                            </Row>

                            <Row gutter={rowGrid}>
                                <Divider orientation="left" orientationMargin={0}><CaretDownOutlined style={{marginRight: 5}}/>Exchange Rate (for Statistics)</Divider>
                            </Row>
                            <Row gutter={rowGrid} className={'ant-pro-row-rate'}>
                                <Col xs={12} sm={22} md={12} lg={6} xl={6} xxl={6}>
                                    <Row className={'ant-pro-text-rate'}>
                                        <Col>1 CNY = </Col>
                                        <Col>
                                            <ProFormText
                                                disabled={AccountInfoVO?.state !== 3}
                                                width={90}
                                                required
                                                placeholder=''
                                                name='funcCnyRate'
                                                rules={[{required: true, message: 'Is required'},{ pattern: /[0-9]+$/, message: 'Only numbers can be entered' }]}
                                            />
                                        </Col>
                                        <Col> HKD</Col>
                                    </Row>
                                </Col>
                            </Row>

                            <div className={'ant-modal-footer'}>
                                <Button disabled={false} htmlType={"button"} key="back" onClick={() => handleModal()}>
                                    Cancel
                                </Button>
                                <Button
                                    disabled={AccountInfoVO?.state !== 0 && AccountInfoVO?.state !== 3 && id !== '0'}
                                    loading={loading}
                                    htmlType={"submit"}
                                    key="submit"
                                    type="primary"
                                >
                                    Save
                                </Button>
                            </div>
                        </ProForm>
                    </Modal>
            }
        </Fragment>
    )
}
export default AddAccountModal;