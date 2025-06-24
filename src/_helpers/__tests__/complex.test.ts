import * as protobufjs from 'protobufjs';
import path from 'path';
import {ComplexBytes, FieldItems, MapField, MapFunction, Repeated, RepeatedFunction, RepeatedPacked} from './data.codec';
import {Encode} from '../encode';
import {Decode} from '../decode';

describe('complex', () => {
    describe('function', () => {
        const payload = {
            value: {
                x: 1,
            },
        };

        const bytes = [10, 2, 8, 1];

        test('much encode protobufjs bytes', () => {
            const root = protobufjs.loadSync(path.resolve(__dirname, 'data.proto'));

            const type = root.lookupType('test.Function');
            const message = type.create(payload);
            const buffer = type.encode(message).finish();

            expect([...new Uint8Array(buffer)]).toEqual(bytes);
        });

        test('much decode protobufjs bytes', () => {
            const root = protobufjs.loadSync(path.resolve(__dirname, 'data.proto'));

            const type = root.lookupType('test.Function');
            const buffer = type.decode(new Uint8Array(bytes));

            expect(buffer).toEqual(payload);
        });

        test('encode', () => {
            const encoded = Encode(FieldItems, payload);

            expect([...encoded]).toEqual(bytes);
        });

        test('decode', () => {
            const encoded = Decode(FieldItems, new Uint8Array(bytes));

            expect(encoded).toEqual(payload);
        });
    });

    describe('repeated simple', () => {
        const payload = {
            value: [1, 1],
        };

        const bytes = [8, 1, 8, 1];

        test('much encode protobufjs bytes', () => {
            const root = protobufjs.loadSync(path.resolve(__dirname, 'data.proto'));

            const type = root.lookupType('test.Repeated');
            const message = type.create(payload);
            const buffer = type.encode(message).finish();

            expect([...new Uint8Array(buffer)]).toEqual(bytes);
        });

        test('much decode protobufjs bytes', () => {
            const root = protobufjs.loadSync(path.resolve(__dirname, 'data.proto'));

            const type = root.lookupType('test.Repeated');
            const buffer = type.decode(new Uint8Array(bytes));

            expect(buffer).toEqual(payload);
        });

        test('encode', () => {
            const encoded = Encode(Repeated, payload);

            expect([...encoded]).toEqual(bytes);
        });

        test('decode', () => {
            const encoded = Decode(Repeated, new Uint8Array(bytes));

            expect(encoded).toEqual(payload);
        });
    });

    describe('repeated function', () => {
        const payload = {
            value: [
                {
                    x: 1,
                },
                {
                    x: 1,
                },
            ],
        };

        const bytes = [10, 2, 8, 1, 10, 2, 8, 1];

        test('much encode protobufjs bytes', () => {
            const root = protobufjs.loadSync(path.resolve(__dirname, 'data.proto'));

            const type = root.lookupType('test.RepeatedFunction');
            const message = type.create(payload);
            const buffer = type.encode(message).finish();

            expect([...new Uint8Array(buffer)]).toEqual(bytes);
        });

        test('much decode protobufjs bytes', () => {
            const root = protobufjs.loadSync(path.resolve(__dirname, 'data.proto'));

            const type = root.lookupType('test.RepeatedFunction');
            const buffer = type.decode(new Uint8Array(bytes));

            expect(buffer).toEqual(payload);
        });

        test('encode', () => {
            const encoded = Encode(RepeatedFunction, payload);

            expect([...encoded]).toEqual(bytes);
        });

        test('decode', () => {
            const encoded = Decode(RepeatedFunction, new Uint8Array(bytes));

            expect(encoded).toEqual(payload);
        });
    });

    describe('repeated packed', () => {
        const payload = {
            value: [1, 1],
        };

        const bytes = [10, 2, 1, 1];

        test('much encode protobufjs bytes', () => {
            const root = protobufjs.loadSync(path.resolve(__dirname, 'data.proto'));

            const type = root.lookupType('test.RepeatedPacked');
            const message = type.create(payload);
            const buffer = type.encode(message).finish();

            expect([...new Uint8Array(buffer)]).toEqual(bytes);
        });

        test('much decode protobufjs bytes', () => {
            const root = protobufjs.loadSync(path.resolve(__dirname, 'data.proto'));

            const type = root.lookupType('test.RepeatedPacked');
            const buffer = type.decode(new Uint8Array(bytes));

            expect(buffer).toEqual(payload);
        });

        test('encode', () => {
            const encoded = Encode(RepeatedPacked, payload);

            expect([...encoded]).toEqual(bytes);
        });

        test('decode', () => {
            const encoded = Decode(RepeatedPacked, new Uint8Array(bytes));

            expect(encoded).toEqual(payload);
        });
    });

    describe('map', () => {
        const payload = {
            value: {
                test: 1,
            },
        };

        const bytes = [10, 8, 10, 4, 116, 101, 115, 116, 16, 1];

        test('much encode protobufjs bytes', () => {
            const root = protobufjs.loadSync(path.resolve(__dirname, 'data.proto'));

            const type = root.lookupType('test.MapField');
            const message = type.create(payload);
            const buffer = type.encode(message).finish();

            expect([...new Uint8Array(buffer)]).toEqual(bytes);
        });

        test('much decode protobufjs bytes', () => {
            const root = protobufjs.loadSync(path.resolve(__dirname, 'data.proto'));

            const type = root.lookupType('test.MapField');
            const buffer = type.decode(new Uint8Array(bytes));

            expect(buffer).toEqual(payload);
        });

        test('encode', () => {
            const encoded = Encode(MapField, payload);

            expect([...encoded]).toEqual(bytes);
        });

        test('decode', () => {
            const encoded = Decode(MapField, new Uint8Array(bytes));

            expect(encoded).toEqual(payload);
        });
    });

    describe('map function', () => {
        const payload = {
            value: {
                test: {
                    x: 1,
                },
            },
        };

        const bytes = [10, 10, 10, 4, 116, 101, 115, 116, 18, 2, 8, 1];

        test('much encode protobufjs bytes', () => {
            const root = protobufjs.loadSync(path.resolve(__dirname, 'data.proto'));

            const type = root.lookupType('test.MapFunction');
            const message = type.create(payload);
            const buffer = type.encode(message).finish();

            expect([...new Uint8Array(buffer)]).toEqual(bytes);
        });

        test('much decode protobufjs bytes', () => {
            const root = protobufjs.loadSync(path.resolve(__dirname, 'data.proto'));

            const type = root.lookupType('test.MapFunction');
            const buffer = type.decode(new Uint8Array(bytes));

            expect(buffer).toEqual(payload);
        });

        test('encode', () => {
            const encoded = Encode(MapFunction, payload);

            expect([...encoded]).toEqual(bytes);
        });

        test('decode', () => {
            const encoded = Decode(MapFunction, new Uint8Array(bytes));

            expect(encoded).toEqual(payload);
        });
    });

    describe('bytes', () => {
        const payload = {
            payloadType: 1,
            payload: new Uint8Array([1, 1]),
            clientMsgId: '1',
        };

        const bytes = [8, 1, 18, 2, 1, 1, 26, 1, 49];

        test('much encode protobufjs bytes', () => {
            const root = protobufjs.loadSync(path.resolve(__dirname, 'data.proto'));

            const type = root.lookupType('test.ComplexBytes');
            const message = type.create(payload);
            const buffer = type.encode(message).finish();

            expect([...new Uint8Array(buffer)]).toEqual(bytes);
        });

        test('much decode protobufjs bytes', () => {
            const root = protobufjs.loadSync(path.resolve(__dirname, 'data.proto'));

            const type = root.lookupType('test.ComplexBytes');
            const buffer = type.decode(new Uint8Array(bytes));

            expect(buffer).toEqual(payload);
        });

        test('encode', () => {
            const encoded = Encode(ComplexBytes, payload);

            expect([...encoded]).toEqual(bytes);
        });

        test('decode', () => {
            const encoded = Decode(ComplexBytes, new Uint8Array(bytes));

            expect(encoded).toEqual(payload);
        });
    });

    // describe('protobufjs', () => {
    //     const payload = {
    //         payloadType: 4,
    //         payload: {
    //             'symbolId': 92,
    //             'deletedQuotes': [
    //                 1319857623,
    //                 1319857622,
    //                 1319858616,
    //             ],
    //             'newQuotes': [
    //                 {
    //                     'ask': 2249000,
    //                     'id': 1319861843,
    //                     'size': 150000,
    //                 },
    //                 {
    //                     'ask': 2248000,
    //                     'id': 1319861844,
    //                     'size': 40000,
    //                 },
    //                 {
    //                     'bid': 2247000,
    //                     'id': 1319861842,
    //                     'size': 40000,
    //                 },
    //                 {
    //                     'bid': 2246000,
    //                     'id': 1319861841,
    //                     'size': 150000,
    //                 },
    //             ],
    //         },
    //     };
    //
    //     const bytes = [8, 4, 18, 87, 16, 92, 26, 15, 8, 211, 252, 173, 245, 4, 24, 240, 147, 9, 40, 168, 162, 137, 1, 26, 15, 8, 212, 252, 173, 245, 4, 24, 192, 184, 2, 40, 192, 154, 137, 1, 26, 15, 8, 210, 252, 173, 245, 4, 24, 192, 184, 2, 32, 216, 146, 137, 1, 26, 15, 8, 209, 252, 173, 245, 4, 24, 240, 147, 9, 32, 240, 138, 137, 1, 34, 15, 215, 219, 173, 245, 4, 214, 219, 173, 245, 4, 184, 227, 173, 245, 4];
    //
    //     test('much decode protobufjs bytes', () => {
    //         const root = protobufjs.loadSync([
    //             'src/protobuf/cServer/CommonMessages.proto',
    //             'src/protobuf/cServer/CommonModelMessages.proto',
    //             'src/protobuf/cServer/CSMessages.proto',
    //             'src/protobuf/cServer/CSModelMessages.proto',
    //         ]);
    //
    //         const type1 = root.lookupType('ProtoMessage');
    //         const buffer1 = type1.decode(new Uint8Array(bytes));
    //
    //         const type2 = root.lookupType('ProtoDepthEvent');
    //         const buffer2 = type2.decode((buffer1 as any).payload);
    //
    //         expect({
    //             ...buffer1,
    //             payload: buffer2,
    //         }).toEqual(payload);
    //     });
    // });
});
