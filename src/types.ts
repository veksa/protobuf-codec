export interface IObject {
    [key: string]: any;
}

export type FieldSimple = 'string' | 'int32' | 'int64' | 'uint32' | 'uint64' | 'sint32' | 'sint64' | 'fixed32' | 'fixed64' | 'sfixed32' | 'sfixed64' | 'float' | 'double' | 'enum' | 'bool' | 'bytes';
export type FieldMap = ['map', FieldSimple, FieldType];
export type FieldRepeatedSimple = ['repeated-simple', FieldType];
export type FieldRepeatedPacked = ['repeated-packed', FieldType];
export type FieldWrapper = ['wrapper', FieldSimple];

export type FieldType = FieldSimple | FieldMap | FieldRepeatedSimple | FieldRepeatedPacked | FieldWrapper | FieldItem[];

// 0 - tag, 1 - name, 2 - type, 3 - required, 4 - oneof, 5 - anyof
export type FieldItem = [number, string, FieldType, 0 | 1, string?, string?];
