// IEE754 Half Precision Floating Point (Float16)
// https://en.wikipedia.org/wiki/Half-precision_floating-point_format
function to_fp16(low, high) {
    // bias is calculated as the folowing: 2^n-1 - 1
    // exponent -> 5bits -> 2^5-1 - 1 = 15
    const bias = 15;
    const bits = (high << 8) | low;
    const sign = (bits >>> 15) & 0x1;
    const exponent = (bits >>> 10) & 0x1f;
    const fraction = bits & 0x3ff;
    const sign_multiplier = sign === 0 ? 1 : -1;

    // exponent: 00000 -> significant == 0 ? zero, -0 : subnormal number
    // exponent: 00001 -> normalized number
    // exponent: 11111 -> significant == 0 ? +-infinity : NaN

    if (exponent === 0) {
        if (fraction === 0) {
            // -0 or 0
            return sign_multiplier * 0;
        } else {
            // subnormal number
            // https://en.wikipedia.org/wiki/Subnormal_number
            // why 1024? fraction -> 10 bits  2^10 ->
            return sign_multiplier * Math.pow(2, -14) * (fraction / 1024);
        }
    }

    if (exponent === 0x1f) {
        if (fraction === 0) {
            return sign_multiplier * Infinity;
        } else {
            return NaN;
        }
    }

    const mantissa = 1 + fraction / 1024;

    // Normalized value
    return sign_multiplier * mantissa * Math.pow(2, exponent - bias);
}

// Values taken from:
// https://en.wikipedia.org/wiki/Half-precision_floating-point_format#Half_precision_examples
console.log("--- Float16 Begin ---");
console.log(to_fp16(0x00, 0x00)); // 0
console.log(to_fp16(0x01, 0x00)); // ~ 0.000000059604645
console.log(to_fp16(0xff, 0x03)); // ~ 0.000060975552
console.log(to_fp16(0x00, 0x04)); // ~ 0.00006103515625
console.log(to_fp16(0x55, 0x35)); // ~ 0.33325195
console.log(to_fp16(0xff, 0x3b)); // ~ 0.99951172
console.log(to_fp16(0x00, 0x3c)); // 1.0
console.log(to_fp16(0x01, 0x3c)); // ~ 1.00097656
console.log(to_fp16(0xff, 0x67)); // 2047
console.log(to_fp16(0xff, 0x7b)); // 65504
console.log(to_fp16(0x48, 0x42)); // 3.140625
console.log(to_fp16(0x00, 0x7c)); //  + Infinity
console.log(to_fp16(0x00, 0x80)); // -0
console.log(to_fp16(0x00, 0xc0)); // -2
console.log(to_fp16(0x00, 0xfc)); // - Infinity
console.log("--- Float16 End ---");
