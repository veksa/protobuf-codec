import {Bytes, EndGroup, Fixed32, Fixed64, SHIFT_LEFT_32, StartGroup, Varint} from './constant';
import {read} from './ieee754';
import {readUtf8} from './utf8';

/* eslint-disable */

export class BufRead {
    pos = 0;
    type = 0;
    path = '';

    constructor(public buf: Uint8Array) {
    }
}

export const skip = (b: BufRead, count?: number) => {
    if (count === undefined) {
        while (b.buf[b.pos++] > 127) {
        }
    } else {
        b.pos += count;
    }
};

export const skipType = (b: BufRead, type: number) => {
    if (type === Varint) {
        skip(b);
    } else if (type === Fixed64) {
        skip(b, 8);
    } else if (type === Bytes) {
        skip(b, readUVarInt32(b));
    } else if (type === StartGroup) {
        while (true) {
            if (b.pos >= b.buf.length) {
                break;
            }

            const nextVal = readUVarInt32(b);
            const nextType = nextVal & 7;

            skip(b, nextVal);

            if (nextType === 4) {
                break;
            }
        }
    } else if (type === EndGroup) {
        // skipped in StartGroup
    } else if (type === Fixed32) {
        skip(b, 4);
    } else {
        console.error(`Unimplemented type: ${type}`);
    }
};

export const readUVarInt32 = (b: BufRead) => {
    let value = 0;
    let bb: number;

    for (let i = 0; i < 4; i++) {
        bb = b.buf[b.pos++];
        value = (value | ((bb & 127) << (i * 7))) >>> 0;

        if (bb < 128) {
            return value;
        }
    }

    bb = b.buf[b.pos++];
    value = (value | ((bb & 15) << (4 * 7))) >>> 0;

    if (bb < 128) {
        return value;
    }

    b.pos += 5; // skip 1 number in uint8array representation for sign

    if (b.pos > b.buf.length) {
        throw `Invalid position (${b.pos}) in buf: ${b.buf.join()}`;
    }

    return value;
};

export const readVarint32 = (b: BufRead) => {
    const value = readUVarInt32(b);

    return value | 0;
};

export const UVarInt64 = (b: BufRead) => {
    let low = 0;
    let high = 0;
    let bb: number;

    if (b.buf.length - b.pos <= 4) {
        for (let i = 0; i < 3; ++i) {
            bb = b.buf[b.pos++];
            low = (low | ((bb & 127) << (i * 7))) >>> 0;

            if (bb < 128) {
                return [low, high];
            }
        }

        bb = b.buf[b.pos++];
        low = (low | ((bb & 127) << (3 * 7))) >>> 0;
        return [low, high];
    }

    for (let i = 0; i < 4; i++) {
        bb = b.buf[b.pos++];
        low = (low | ((bb & 127) << (i * 7))) >>> 0;

        if (bb < 128) {
            return [low, high];
        }
    }

    bb = b.buf[b.pos++];
    low = (low | ((bb & 127) << (4 * 7))) >>> 0;
    high = (high | ((bb & 127) >> 4)) >>> 0;

    if (bb < 128) {
        return [low, high];
    }

    for (let i = 0; i < 5; i++) {
        bb = b.buf[b.pos++];
        high = (high | (bb & 127) << i * 7 + 3) >>> 0;

        if (bb < 128) {
            return [low, high];
        }
    }

    throw Error('invalid varint encoding');
};

export const readUVarInt64 = (b: BufRead) => {
    const [low, high] = UVarInt64(b);

    return toNumber([low, high], false);
};

export const readVarInt64 = (b: BufRead) => {
    const [low, high] = UVarInt64(b);

    return toNumber([low, high], true);
};

const toNumber = ([low, high]: number[], s: boolean) => {
    if (s) {
        if (high >>> 31 !== 0) {
            const lo = (~low + 1) >>> 0;
            let hi = ~high >>> 0;
            if (lo === 0) {
                hi = (hi + 1) >>> 0;
            }
            return -(lo + hi * 4294967296);
        }
    }

    return low + high * 4294967296;
};

const readPackedEnd = (b: BufRead) => (b.type === Bytes
    ? readUVarInt32(b) + b.pos
    : b.pos + 1);

const readInt32 = (b: BufRead) =>
    (b.buf[b.pos++] | (b.buf[b.pos++] << 8) | (b.buf[b.pos++] << 16)) + (b.buf[b.pos++] << 24);

const readUInt32 = (b: BufRead) =>
    (b.buf[b.pos++] | (b.buf[b.pos++] << 8) | (b.buf[b.pos++] << 16)) + b.buf[b.pos++] * 0x1000000;

const readFixed32 = readUInt32;

const readSFixed32 = readInt32;

const readFixed64 = (b: BufRead) => readUInt32(b) + readUInt32(b) * SHIFT_LEFT_32;

const readSFixed64 = (b: BufRead) => readUInt32(b) + readInt32(b) * SHIFT_LEFT_32;

const readFloat = (b: BufRead) => {
    const val = read(b.buf, b.pos, true, 23, 4);
    b.pos += 4;
    return val;
};

const readDouble = (b: BufRead) => {
    const val = read(b.buf, b.pos, true, 52, 8);
    b.pos += 8;
    return val;
};

const readSVarInt32 = (b: BufRead) => {
    const value = readUVarInt32(b);

    return value >>> 1 ^ -(value & 1) | 0;
};

const readSVarInt64 = (b: BufRead) => {
    const [low, high] = UVarInt64(b);

    const mask = -(low & 1);

    const lo = ((low >>> 1 | high << 31) ^ mask) >>> 0;
    const hi = (high >>> 1 ^ mask) >>> 0;

    return toNumber([lo, hi], true);
};

const readBoolean = (b: BufRead) => {
    return Boolean(readUVarInt32(b));
};

const readString = (b: BufRead) => {
    const end = readUVarInt32(b) + b.pos;
    const pos = b.pos;
    b.pos = end;
    return readUtf8(b.buf, pos, end);
};

const readBytes = (b: BufRead) => {
    const end = readUVarInt32(b) + b.pos;
    const buffer = b.buf.subarray(b.pos, end);
    b.pos = end;
    return buffer;
};

export const readPacked = (fn: (b: BufRead, isSigned?: boolean) => unknown, b: BufRead) => {
    if (b.type !== Bytes) {
        return [fn(b)];
    }
    const end = readPackedEnd(b);
    const arr = [];
    while (b.pos < end) {
        arr.push(fn(b));
    }
    return arr;
};

export const readMap = {
    // eslint-disable-next-line id-blacklist
    string: readString,
    float: readFloat,
    double: readDouble,
    bool: readBoolean,
    enum: readUVarInt32,
    uint32: readUVarInt32,
    uint64: readUVarInt64,
    int32: readVarint32,
    int64: readVarInt64,
    sint32: readSVarInt32,
    sint64: readSVarInt64,
    fixed32: readFixed32,
    fixed64: readFixed64,
    sfixed32: readSFixed32,
    sfixed64: readSFixed64,
    bytes: readBytes,
};

export type ReadMapKeys = keyof typeof readMap;
