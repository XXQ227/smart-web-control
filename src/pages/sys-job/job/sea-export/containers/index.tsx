import React, {useState} from 'react';
import "../../style.less";
import ls from 'lodash'
import PreBooking from '@/pages/sys-job/job/sea-export/containers/pre-booking'
import CTNLoading from '@/pages/sys-job/job/sea-export/containers/ctn-loading'

interface Props {
    type?: string;
    CTNPlanList?: APIModel.ContainerList[];
    CTNActualList?: APIModel.CTNActualList[];
    form: any;
    FormItem: any;
}

const initialContainerList: APIModel.ContainerList[] = [
    {
        id: 'ID1',
        ctnModelId: 1,
        ctnModelName: "20GP",
        qty: 2,
        IsSOC: false,
        IsFCL: false,
        Remark: "ANL YF62423",
    },
    {
        id: 'ID2',
        ctnModelId: 2,
        ctnModelName: "40GP",
        qty: 1,
        IsSOC: true,
        IsFCL: true,
        Remark: "CSCLYF85868",
    },
    {
        id: 'ID3',
        ctnModelId: 5,
        ctnModelName: "40HQ",
        qty: 1,
        IsSOC: true,
        IsFCL: false,
        Remark: "KMTCYF85912",
    },
];

const Containers: React.FC<Props> = (props) => {
    const {
        type, form,
        CTNPlanList,
        CTNActualList
    } = props;

    const cargoInfo: any = {qty: 168, grossWeight: 1254.8, measurement: 3245.6};

    const [containerList, setContainerList] = useState<APIModel.ContainerList[]>(CTNPlanList || initialContainerList);
    const [cTNActualList, setCTNActualList] = useState<APIModel.CTNActualList[]>(CTNActualList || []);

    function handleRowChange(index: number, rowID: any, filedName: string, val: any, option?: any) {
        const newData: any[] = ls.cloneDeep(containerList);
        const target = newData.find((item: any)=> item.id === rowID);
        target[filedName] = val?.target ? val.target.value : val;

        newData.splice(index, 1, target);
        setContainerList(newData);
    }

    /**
     * @Description: TODO: 实装箱信息修改
     * @author XXQ
     * @date 2023/8/1
     * @param index
     * @param rowID
     * @param filedName
     * @param val
     * @param option
     * @returns
     */
    function handleCTNEdit(index: number, rowID: any, filedName: string, val: any, option?: any) {
        const newData: any[] = ls.cloneDeep(cTNActualList);
        const target = newData.find((item: any)=> item.id === rowID);
        target[filedName] = val?.target ? val.target.value : val;

        newData.splice(index, 1, target);
        setCTNActualList(newData);
    }

    const handleDelete = () => {
        if (type !== 'import') {
            // const newData =
            //     containerList.filter(item => !selectedRowIDs.includes(item.id));
            // setContainerList(newData);
        } else {
            // const newData =
            //     cTNActualList.filter(item => !selectedRowIDs.includes(item.id));
            // setCTNActualList(newData);
        }
    };
    //endregion

    return (
        <div className={'seaExportContainers'}>
            <PreBooking
                handleRowChange={handleRowChange}
            />
            <CTNLoading
                form={form}
                cargoInfo={cargoInfo}
                containerList={containerList}
                handleCTNEdit={handleCTNEdit}
                handleDelete={handleDelete}
            />
        </div>
    )
}
export default Containers;