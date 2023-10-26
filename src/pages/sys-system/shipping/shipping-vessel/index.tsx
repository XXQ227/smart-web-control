import React from 'react';
import {useModel} from 'umi';
import ShippingTable from '@/pages/sys-system/shipping/shipping-table'


interface Props {}
const ShippingVesselIndex: React.FC<Props> = () => {

    const {
        queryVessel, deleteVessel, operateVessel, addVessel, editVessel
    } = useModel('system.shipping', (res: any) => ({
        queryVessel: res.queryVessel,
        deleteVessel: res.deleteVessel,
        operateVessel: res.operateVessel,
        addVessel: res.addVessel,
        editVessel: res.editVessel,
    }));

    return (
        <ShippingTable
            type={'Vessel'}
            addAPI={addVessel}
            editAPI={editVessel}
            queryAPI={queryVessel}
            deleteAPI={deleteVessel}
            operateAPI={operateVessel}
        />
    )
}
export default ShippingVesselIndex;