import {FieldType, IObject, FieldItem} from '../types';
import {BufRead, readMap, ReadMapKeys, readPacked, readUVarInt32, skipType} from './read';
import {isPresent} from '../_typeguards/isPresent';
import {isString} from '../_typeguards/isString';
import {getDefault} from './default';
import {isArray} from '../_typeguards/isArray';
import {isObject} from '../_typeguards/isObject';
import {MapStruct, WrapperStruct} from './constant';

/* eslint-disable */

export const Decode = <T extends IObject>(
    fields: FieldItem[], buffer: BufRead | Uint8Array, result = {} as T, path = '', end?: number,
): T => {
    let buf: BufRead;

    if (buffer instanceof BufRead) {
        buf = buffer;
    } else {
        buf = new BufRead(buffer);
    }

    const map: Record<string, FieldItem> = {};

    for (const field of fields) {
        map[field[0]] = field;
    }

    end = end || buf.buf.length;

    buf.path = path;

    while (buf.pos < end) {
        const val = readUVarInt32(buf);
        const tag = val >> 3;
        const startPos = buf.pos;

        buf.type = val & 7;

        if (map[tag]) {
            const [id, nameField, item, , oneof, anyof] = map[tag];

            const prevPath = path
                ? `${path}.`
                : '';
            const nextPath = `${prevPath}${nameField}[${id}]`;

            DecodeRead(item, buf, nameField, result, nextPath);

            if (oneof) {
                if (result[nameField]) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    result[oneof as keyof T] = {oneof: nameField, value: result[nameField]} as T[keyof T];
                }
                delete result[nameField];
            }

            if (anyof) {
                if (result[nameField]) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    result[anyof as keyof T] = {anyof: nameField, value: result[nameField]} as T[keyof T];
                }
                delete result[nameField];
            }
        }

        if (buf.pos === startPos) {
            skipType(buf, buf.type);
        }
    }

    return DecodeDefault(fields, result);
};

const DecodeRead = (item: FieldType, buf: BufRead, fieldName: string, result: IObject, path: string) => {
    if (isString(item)) {
        if (readMap[item as ReadMapKeys]) {
            result[fieldName] = getDefault(item, readMap[item as ReadMapKeys](buf));
        }
    } else if (isArray(item)) {
        if (item[0] === 'repeated-simple') {
            const mm = result[fieldName];
            const m = isArray(mm)
                ? mm
                : [];
            result[fieldName] = m;
            const o = {} as IObject;
            DecodeRead(item[1], buf, 'out', o, path);
            m.push(o.out);
        } else if (item[0] === 'repeated-packed') {
            result[fieldName] = readPacked(readMap[item[1] as ReadMapKeys], buf);
        } else if (item[0] === 'map') {
            const mm = result[fieldName] as unknown as object;
            const m: any = isObject(mm)
                ? mm
                : {};
            result[fieldName] = m;
            const o = Decode(MapStruct(item), buf, {} as IObject, path, readUVarInt32(buf) + buf.pos);
            m[o.key] = o.value;
        } else if (item[0] === 'wrapper') {
            const o = Decode(WrapperStruct(item[1]), buf, {} as IObject, path, readUVarInt32(buf) + buf.pos);
            result[fieldName] = o.value;
        } else {
            result[fieldName] = Decode(item, buf, {}, path, readUVarInt32(buf) + buf.pos);
        }
    }
};

const DecodeDefault = <T extends IObject>(fields: FieldItem[], result = {} as IObject): T => {
    for (const field of fields) {
        const [, nameField, fieldType, required, oneof, anyof] = field;

        if (required !== 1 || isPresent(result[nameField])) {
            continue;
        }

        if (oneof) {
            if (!result[oneof]) {
                result[oneof] = {
                    oneof: nameField,
                    value: GetDefault(fieldType),
                };
            }
        }

        if (anyof) {
            if (!result[anyof]) {
                result[anyof] = {
                    anyof: nameField,
                    value: GetDefault(fieldType),
                };
            }
        }

        if (!oneof && !anyof) {
            const val = GetDefault(fieldType);
            if (isPresent(val)) {
                result[nameField] = val;
            }
        }
    }

    return result as T;
};

const GetDefault = (item: FieldType) => {
    if (isString(item)) {
        return getDefault(item);
    }

    if (isArray(item)) {
        if (item[0] === 'repeated-simple' || item[0] === 'repeated-packed') {
            return [];
        }

        if (item[0] === 'map') {
            return {};
        }

        if (item[0] === 'wrapper') {
            return getDefault(item[1]);
        }
    }

    return undefined;
};
