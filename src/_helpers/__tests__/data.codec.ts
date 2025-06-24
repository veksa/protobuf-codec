import {FieldItem} from '../../types';

export const Double: FieldItem[] = [
    [1, 'x', 'double', 1],
];

export const Float: FieldItem[] = [
    [1, 'x', 'float', 1],
];

export const Int32: FieldItem[] = [
    [1, 'x', 'int32', 1],
];

export const Int64: FieldItem[] = [
    [1, 'x', 'int64', 1],
];

export const UInt32: FieldItem[] = [
    [1, 'x', 'uint32', 1],
];

export const UInt64: FieldItem[] = [
    [1, 'x', 'uint64', 1],
];

export const SInt32: FieldItem[] = [
    [1, 'x', 'sint32', 1],
];

export const SInt64: FieldItem[] = [
    [1, 'x', 'sint64', 1],
];

export const Fixed32: FieldItem[] = [
    [1, 'x', 'fixed32', 1],
];

export const Fixed64: FieldItem[] = [
    [1, 'x', 'fixed64', 1],
];

export const SFixed32: FieldItem[] = [
    [1, 'x', 'sfixed32', 1],
];

export const SFixed64: FieldItem[] = [
    [1, 'x', 'sfixed64', 1],
];

export const Bool: FieldItem[] = [
    [1, 'x', 'bool', 1],
];

export const String: FieldItem[] = [
    [1, 'x', 'string', 1],
];

export const Bytes: FieldItem[] = [
    [1, 'x', 'bytes', 1],
];

export const Repeated: FieldItem[] = [
    [1, 'value', ['repeated-simple', 'int32'], 1],
];

export const RepeatedFunction: FieldItem[] = [
    [1, 'value', ['repeated-simple', Int32], 1],
];

export const RepeatedPacked: FieldItem[] = [
    [1, 'value', ['repeated-packed', 'int32'], 1],
];

export const MapField: FieldItem[] = [
    [1, 'value', ['map', 'string', 'int32'], 1],
];

export const MapFunction: FieldItem[] = [
    [1, 'value', ['map', 'string', Int32], 1],
];

export const FieldItems: FieldItem[] = [
    [1, 'value', Int32, 1],
];

export const ComplexBytes: FieldItem[] = [
    [1, 'payloadType', 'uint32', 1],
    [2, 'payload', 'bytes', 0],
    [3, 'clientMsgId', 'string', 0],
];
