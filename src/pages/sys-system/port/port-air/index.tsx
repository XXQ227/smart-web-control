import React from 'react';
import {useModel} from 'umi';
import PortTable from '@/pages/sys-system/port/port-table'


interface Props {}
const PortAirIndex: React.FC<Props> = () => {

    const {
        queryAir, deleteAir, operateAir, addAir, editAir
    } = useModel('system.port', (res: any) => ({
        PortList: res.PortList,
        queryAir: res.queryAir,
        deleteAir: res.deleteAir,
        operateAir: res.operateAir,
        addAir: res.addAir,
        editAir: res.editAir,
    }));

    return (
        <PortTable
            type={'air'}
            addAPI={addAir}
            editAPI={editAir}
            queryAPI={queryAir}
            deleteAPI={deleteAir}
            operateAPI={operateAir}
        />
    )
}
export default PortAirIndex;