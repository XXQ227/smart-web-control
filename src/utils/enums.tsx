import {CTN_MODE} from "@/utils/enum";
import {LOCAL_LANGUAGE} from "@/utils/units";

/**
 * @Description: 前台定义枚举对象，通过后台返回的结果值，获取对应的枚举值
 * @author XXQ
 * @date 2022/12/16
 * @param key 后台返回的字段值（当后台确定返回结果后再做调整）
 * @returns
 */
export function CTN_MODE_NAME(key: string) {
    const val = LOCAL_LANGUAGE ? 'nameEN' : 'name';
    return CTN_MODE[key][val];
}
