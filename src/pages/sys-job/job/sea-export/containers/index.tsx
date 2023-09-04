import React from 'react';
import "../../style.less";
import PreBooking from '@/pages/sys-job/job/sea-export/containers/pre-booking'
import CTNLoading from '@/pages/sys-job/job/sea-export/containers/ctn-loading'

interface Props {
    type?: string;
    form: any;
    FormItem: any;
    serviceInfo: any;
}


const Containers: React.FC<Props> = (props) => {
    const {type, form, serviceInfo} = props;

    return (
        <div className={'seaExportContainers'}>
            <PreBooking
                type={type} form={form} serviceId={serviceInfo.id}
                preBookingList={serviceInfo.preBookingContainersEntityList || []}
            />
            <CTNLoading
                type={type} form={form} serviceId={serviceInfo.id}
                containerList={serviceInfo.containersLoadingDetailEntityList || []}
            />
        </div>
    )
}
export default Containers;