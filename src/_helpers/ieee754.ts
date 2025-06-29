/* eslint-disable */

export const read = (buffer: Uint8Array | number[], offset: number, isLE: boolean, mLen: number, nBytes: number) => {
    let e: number;
    let m: number;
    const eLen = nBytes * 8 - mLen - 1;
    const eMax = (1 << eLen) - 1;
    const eBias = eMax >> 1;
    let nBits = -7;
    let i = isLE
        ? nBytes - 1
        : 0;
    const d = isLE
        ? -1
        : 1;
    let s = buffer[offset + i];

    i += d;

    e = s & ((1 << -nBits) - 1);
    s >>= -nBits;
    nBits += eLen;

    for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
    }

    m = e & ((1 << -nBits) - 1);
    e >>= -nBits;
    nBits += mLen;
    for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
    }

    if (e === 0) {
        e = 1 - eBias;
    } else if (e === eMax) {
        return m
            ? NaN
            : (s
            ? -1
            : 1) * Infinity;
    } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
    }

    return (s
        ? -1
        : 1) * Math.pow(2, e - mLen) * m;
};

export const write = (buffer: number[], value: number, offset: number, isLE: boolean, mLen: number, nBytes: number) => {
    let e: number;
    let m: number;
    let c: number;
    let eLen = nBytes * 8 - mLen - 1;
    const eMax = (1 << eLen) - 1;
    const eBias = eMax >> 1;
    const rt = mLen === 23
        ? Math.pow(2, -24) - Math.pow(2, -77)
        : 0;
    let i = isLE
        ? 0
        : nBytes - 1;
    const d = isLE
        ? 1
        : -1;
    const s = value < 0 || (value === 0 && 1 / value < 0)
        ? 1
        : 0;

    value = Math.abs(value);

    if (isNaN(value) || value === Infinity) {
        m = isNaN(value)
            ? 1
            : 0;
        e = eMax;
    } else {
        e = Math.floor(Math.log(value) / Math.LN2);

        if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
        }
        if (e + eBias >= 1) {
            value += rt / c;
        } else {
            value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
            e++;
            c /= 2;
        }

        if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
        } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
        } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
        }
    }

    for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {
    }

    e = (e << mLen) | m;
    eLen += mLen;

    for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {
    }

    buffer[offset + i - d] |= s * 128;
};
