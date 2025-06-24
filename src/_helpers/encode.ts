import {FieldType, IObject, FieldItem} from '../types';
import {BufWrite, writeMap, WriteMapKeys, writeMapRaw, WriteMapRawKeys, writePacked, writeTag, writeVarint} from './write';
import {isObject} from '../_typeguards/isObject';
import {isText} from '../_typeguards/isText';
import {isPresent} from '../_typeguards/isPresent';
import {isString} from '../_typeguards/isString';
import {MapStruct, WrapperStruct, Bytes} from './constant';
import {isArray} from '../_typeguards/isArray';

/* eslint-disable */

export const Encode = <T extends IObject>(fields: FieldItem[], obj: T, buf?: BufWrite): Uint8Array => {
    if (buf === undefined) {
        buf = new BufWrite();
    }

    if (isObject(obj)) {
        for (const [tag, fieldName, type, _, oneof, anyof] of fields) {
            const one = isText(oneof)
                ? obj[oneof]
                : undefined;

            const any = isText(anyof)
                ? obj[anyof]
                : undefined;

            let value: IObject;

            if (isObject(one) && fieldName === one.oneof) {
                value = one.value as IObject;
            } else if (isObject(any) && fieldName === any.anyof) {
                value = any.value as IObject;
            } else {
                value = obj[fieldName];
            }

            if (isPresent(value)) {
                EncodeWrite(buf, tag, type, value);
            }
        }
    }

    return buf.get();
};

const EncodeWrite = <T extends IObject>(buf: BufWrite, tag: number, type: FieldType, value: T): void => {
    if (isString(type) && writeMap[type as WriteMapKeys]) {
        writeMap[type as WriteMapKeys](buf, tag, value as never);
    } else if (isArray(type)) {
        if (type[0] === 'repeated-simple' && isArray(value)) {
            for (const v of value) {
                EncodeWrite(buf, tag, type[1], v);
            }
        } else if (type[0] === 'repeated-packed' && isArray(value)) {
            writePacked(writeMapRaw[type[1] as WriteMapRawKeys], buf, tag, value as any);
        } else if (type[0] === 'map' && isObject(value)) {
            for (const key in value) {
                EncodeWrite(buf, tag, MapStruct(type), {key, value: value[key]});
            }
        } else if (type[0] === 'wrapper') {
            EncodeWrite(buf, tag, WrapperStruct(type[1]), {value: value});
        } else {
            const encBuf = Encode(type as FieldItem[], value);
            writeTag(buf, tag, Bytes);
            writeVarint(buf, encBuf.length);
            buf.concat(encBuf);
        }
    }
};
