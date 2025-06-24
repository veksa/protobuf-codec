import {ITransportCodec, IMessage} from '@veksa/transport';
import {Encode} from './_helpers/encode';
import {FieldItem} from './types';
import {Decode} from './_helpers/decode';

interface IRootPayload {
    payloadType: number;
    payload?: Uint8Array;
    clientMsgId?: string;
}

const rootMessage: FieldItem[] = [
    [1, 'payloadType', 'uint32', 1],
    [2, 'payload', 'bytes', 0],
    [3, 'clientMsgId', 'string', 0],
];

export const createProtobufCodec = (apiMap: Record<number, FieldItem[]>): ITransportCodec => {
    const encode = (message: IMessage): ArrayBuffer | string | undefined => {
        const encoder = apiMap[message.payloadType];

        if (!encoder) {
            return undefined;
        }

        return Encode(rootMessage, {
            payloadType: message.payloadType,
            payload: Encode(encoder, message.payload),
            clientMsgId: message.clientMsgId,
        });
    };

    const decode = (buffer: ArrayBuffer | string): IMessage | undefined => {
        const arrayBuffer = new Uint8Array(buffer as ArrayBuffer);

        const root = Decode<IRootPayload>(rootMessage, arrayBuffer);

        const decoder = apiMap[root.payloadType];

        if (!decoder) {
            return {
                payloadType: root.payloadType,
                payload: undefined as unknown as object,
                clientMsgId: root.clientMsgId ?? '',
            }
        }

        return {
            payloadType: root.payloadType,
            payload: Decode(decoder, root.payload as Uint8Array),
            clientMsgId: root.clientMsgId ?? '',
        };
    };

    return {
        encode,
        decode,
    };
};
