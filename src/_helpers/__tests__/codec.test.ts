import * as protobufjs from 'protobufjs';
import path from 'path';
import {
    Bool, Double, Fixed32, Fixed64, Float, Int32, Int64, SFixed32, SFixed64, SInt32, SInt64, String, UInt32, UInt64,
} from './data.codec';
import {FieldItem} from '../../types';
import {Encode} from '../encode';
import {Decode} from '../decode';

describe.each<[string, FieldItem[], object, number[]]>([
    ['Double', Double, {x: 0}, [9, 0, 0, 0, 0, 0, 0, 0, 0]],
    ['Double', Double, {x: 1}, [9, 0, 0, 0, 0, 0, 0, 240, 63]],
    ['Double', Double, {x: -1}, [9, 0, 0, 0, 0, 0, 0, 240, 191]],
    ['Double', Double, {x: 1.4044477616111841e+306}, [9, 255, 255, 255, 255, 255, 255, 127, 127]],
    ['Double', Double, {x: -1.4044477616111841e+306}, [9, 255, 255, 255, 255, 255, 255, 127, 255]],

    ['Float', Float, {x: 0}, [13, 0, 0, 0, 0]],
    ['Float', Float, {x: 1}, [13, 0, 0, 128, 63]],
    ['Float', Float, {x: -1}, [13, 0, 0, 128, 191]],
    ['Float', Float, {x: 3.4028234663852886e+38}, [13, 255, 255, 127, 127]],
    ['Float', Float, {x: -3.4028234663852886e+38}, [13, 255, 255, 127, 255]],

    ['Int32', Int32, {x: 0}, [8, 0]],
    ['Int32', Int32, {x: 1}, [8, 1]],
    ['Int32', Int32, {x: -1}, [8, 255, 255, 255, 255, 255, 255, 255, 255, 255, 1]],
    ['Int32', Int32, {x: 2 ** 31 - 1}, [8, 255, 255, 255, 255, 7]],
    ['Int32', Int32, {x: -1 * (2 ** 31 - 1)}, [8, 129, 128, 128, 128, 248, 255, 255, 255, 255, 1]],

    ['Int64', Int64, {x: 0}, [8, 0]],
    ['Int64', Int64, {x: 1}, [8, 1]],
    ['Int64', Int64, {x: -1}, [8, 255, 255, 255, 255, 255, 255, 255, 255, 255, 1]],
    ['Int64', Int64, {x: (2 ** 53 - 1)}, [8, 255, 255, 255, 255, 255, 255, 255, 15]],
    ['Int64', Int64, {x: -1 * (2 ** 53 - 1)}, [8, 129, 128, 128, 128, 128, 128, 128, 240, 255, 1]],

    ['UInt32', UInt32, {x: 0}, [8, 0]],
    ['UInt32', UInt32, {x: 1}, [8, 1]],
    ['UInt32', UInt32, {x: 2 ** 31 - 1}, [8, 255, 255, 255, 255, 7]],

    ['UInt64', UInt64, {x: 0}, [8, 0]],
    ['UInt64', UInt64, {x: 1}, [8, 1]],
    ['UInt64', UInt64, {x: (2 ** 53 - 1)}, [8, 255, 255, 255, 255, 255, 255, 255, 15]],

    ['SInt32', SInt32, {x: 0}, [8, 0]],
    ['SInt32', SInt32, {x: 1}, [8, 2]],
    ['SInt32', SInt32, {x: -1}, [8, 1]],
    ['SInt32', SInt32, {x: 2 ** 31 - 1}, [8, 254, 255, 255, 255, 15]],
    ['SInt32', SInt32, {x: -1 * (2 ** 31 - 1)}, [8, 253, 255, 255, 255, 15]],

    ['SInt64', SInt64, {x: 0}, [8, 0]],
    ['SInt64', SInt64, {x: 1}, [8, 2]],
    ['SInt64', SInt64, {x: -1}, [8, 1]],
    ['SInt64', SInt64, {x: (2 ** 53 - 1)}, [8, 254, 255, 255, 255, 255, 255, 255, 31]],
    ['SInt64', SInt64, {x: -1 * (2 ** 53 - 1)}, [8, 253, 255, 255, 255, 255, 255, 255, 31]],

    ['Fixed32', Fixed32, {x: 0}, [13, 0, 0, 0, 0]],
    ['Fixed32', Fixed32, {x: 1}, [13, 1, 0, 0, 0]],

    ['Fixed64', Fixed64, {x: 0}, [9, 0, 0, 0, 0, 0, 0, 0, 0]],
    ['Fixed64', Fixed64, {x: 1}, [9, 1, 0, 0, 0, 0, 0, 0, 0]],

    ['SFixed32', SFixed32, {x: 0}, [13, 0, 0, 0, 0]],
    ['SFixed32', SFixed32, {x: 1}, [13, 1, 0, 0, 0]],
    ['SFixed32', SFixed32, {x: -1}, [13, 255, 255, 255, 255]],

    ['SFixed64', SFixed64, {x: 0}, [9, 0, 0, 0, 0, 0, 0, 0, 0]],
    ['SFixed64', SFixed64, {x: 1}, [9, 1, 0, 0, 0, 0, 0, 0, 0]],
    ['SFixed64', SFixed64, {x: -1}, [9, 255, 255, 255, 255, 255, 255, 255, 255]],

    ['Bool', Bool, {x: true}, [8, 1]],
    ['Bool', Bool, {x: false}, [8, 0]],

    ['String', String, {x: ''}, [10, 0]],
    ['String', String, {x: 'x'}, [10, 1, 120]],
])('should codec %p values', (codecName, codec, payload, bytes) => {
    test('much encode protobufjs bytes', () => {
        const root = protobufjs.loadSync(path.resolve(__dirname, 'data.proto'));

        const type = root.lookupType(`test.${codecName}`);
        const message = type.create(payload);
        const buffer = type.encode(message).finish();

        expect([...new Uint8Array(buffer)]).toEqual(bytes);
    });

    test('much decode protobufjs bytes', () => {
        const root = protobufjs.loadSync(path.resolve(__dirname, 'data.proto'));

        const type = root.lookupType(`test.${codecName}`);
        const buffer = type.decode(new Uint8Array(bytes));

        if (codecName !== 'Bool' && codecName !== 'String') {
            expect({
                x: parseFloat((buffer as any).x),
            }).toEqual(payload);
        } else {
            expect(buffer).toEqual(payload);
        }
    });

    test('encode', () => {
        const encoded = Encode(codec, payload);

        expect([...encoded]).toEqual(bytes);
    });

    test('decode', () => {
        const encoded = Decode(codec, new Uint8Array(bytes));

        expect(encoded).toEqual(payload);
    });
});
