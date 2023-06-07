import React, {useState} from 'react';
import {useModel} from 'umi';
import {message} from 'antd'
import ls from 'lodash'
import PortTable from '@/pages/sys-manager/port/port-table'

type APIPort = APIManager.Port;
type APISearchPort = APIManager.SearchPortParams;

// TODO: 获取单票集的请求参数
const searchParams: APISearchPort = {
    name: '',
    current: 1,
    pageSize: 20,
};

interface Props {}

const PortSeaIndex: React.FC<Props> = () => {

    const {
        PortList, querySea, deleteSea, operateSea
    } = useModel('manager.port', (res: any) => ({
        PortList: res.PortList,
        querySea: res.querySea,
        deleteSea: res.deleteSea,
        operateSea: res.operateSea,
    }));

    const [loading, setLoading] = useState<boolean>(false);
    const [PortListVO, setPortListVO] = useState<APIPort[]>(PortList || []);

    /**
     * @Description: TODO 获取港口列表
     * @author LLS
     * @date 2023/6/5
     * @param params    参数
     * @returns
     */
    async function handleGetPortList(params: APISearchPort) {
        setLoading(true);
        const result: APIManager.PortResult = await querySea(params);
        setPortListVO(result.data || []);
        setLoading(false);
        return result;
    }

    /**
     * @Description: TODO:  删除、冻结操作
     * @author LLS
     * @date 2023/6/6
     * @param index     当前行序号
     * @param record    当前行数据
     * @param state     操作状态：delete：删除；freeze：冻结
     * @returns
     */
    const handleOperatePort = async (index: number, record: APIPort, state: string) => {
        let result: API.Result;
        // TODO: 删除 / 冻结 参数
        const params: any = {id: record.id};
        const newData = ls.cloneDeep(PortListVO);
        // TODO: 删除
        if (state === 'delete') {
            result = await deleteSea(params);
            // TODO: 过滤删除行
            newData.splice(index, 1);
        } else {
            params.operate = record.enableFlag ? 0 : 1;
            result = await operateSea(params);
            // TODO: 更新删除行
            record.enableFlag = params.operate;
            newData.splice(index, 1, record);
        }
        if (result.success) {
            message.success('Success');
            setPortListVO(newData);
        } else {
            message.error(result.message);
        }
    }


    return (
        <PortTable
            loading={loading}
            PortList={PortListVO}
            searchParams={searchParams}
            handleOperatePort={handleOperatePort}
            handleGetPortList={handleGetPortList}
            handleSetPortVO={(data: APIPort[])=> setPortListVO(data)}
        />
    )
}
export default PortSeaIndex;