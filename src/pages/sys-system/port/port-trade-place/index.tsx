import React from 'react';
import {useModel} from 'umi';
import PortTable from '@/pages/sys-system/port/port-table'

interface Props {}
const PortTradePlaceIndex: React.FC<Props> = () => {
    const {
        queryTradePlace, addTradePlace, editTradePlace, deleteTradePlace, operateTradePlace,
    } = useModel('system.port', (res: any) => ({
        queryTradePlace: res.queryTradePlace,
        addTradePlace: res.addTradePlace,
        editTradePlace: res.editTradePlace,
        deleteTradePlace: res.deleteTradePlace,
        operateTradePlace: res.operateTradePlace,
    }));


    return (
        <PortTable
            type={'trade_place'}
            addAPI={addTradePlace}
            editAPI={editTradePlace}
            queryAPI={queryTradePlace}
            deleteAPI={deleteTradePlace}
            operateAPI={operateTradePlace}
        />
    )
}
export default PortTradePlaceIndex;