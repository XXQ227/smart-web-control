import React from 'react';
import {useModel} from 'umi';
import PortTable from '@/pages/sys-system/port/port-table'

interface Props {}
const PortLandIndex: React.FC<Props> = () => {

    const {
        queryLand, addLand, editLand, deleteLand, operateLand,
    } = useModel('system.port', (res: any) => ({
        queryLand: res.queryLand,
        addLand: res.addLand,
        editLand: res.editLand,
        deleteLand: res.deleteLand,
        operateLand: res.operateLand,
    }));

    return (
        <PortTable
            type={'land'}
            addAPI={addLand}
            editAPI={editLand}
            queryAPI={queryLand}
            deleteAPI={deleteLand}
            operateAPI={operateLand}
        />
    )
}
export default PortLandIndex;