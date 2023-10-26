import React from 'react';
import {useModel} from 'umi';
import PortTable from '@/pages/sys-system/port/port-table'


interface Props {}
const PortSeaIndex: React.FC<Props> = () => {

    const {
        querySea, deleteSea, operateSea, addSea, editSea
    } = useModel('system.port', (res: any) => ({
        querySea: res.querySea,
        deleteSea: res.deleteSea,
        operateSea: res.operateSea,
        addSea: res.addSea,
        editSea: res.editSea,
    }));


    return (
        <PortTable
            type={'sea'}
            addAPI={addSea}
            editAPI={editSea}
            queryAPI={querySea}
            deleteAPI={deleteSea}
            operateAPI={operateSea}
        />
    )
}
export default PortSeaIndex;