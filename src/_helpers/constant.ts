import {FieldMap, FieldItem, FieldSimple} from '../types';

/* eslint-disable */

export const Varint = 0; // varint: int32, int64, uint32, uint64, sint32, sint64, bool, enum
export const Fixed64 = 1; // 64-bit: double, fixed64, sfixed64
export const Bytes = 2; // length-delimited: string, bytes, embedded messages, packed repeated fields
export const StartGroup = 3; // groups (deprecated)
export const EndGroup = 4; // groups (deprecated)
export const Fixed32 = 5; // 32-bit: float, fixed32, sfixed32

export const SHIFT_LEFT_32 = (1 << 16) * (1 << 16);
export const SHIFT_RIGHT_32 = 1 / SHIFT_LEFT_32;

export function MapStruct(item: FieldMap): FieldItem[] {
    return [
        [1, 'key', item[1], 1],
        [2, 'value', item[2], 1],
    ];
}

export function WrapperStruct(value: FieldSimple): FieldItem[] {
    return [
        [1, 'value', value, 1],
    ];
}
