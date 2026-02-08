// IEE754 Single Precision FLoats (32 Bit Float)
// https://en.wikipedia.org/wiki/Single-precision_floating-point_format
function to_fp32(b0, b1, b2, b3) {
    // 2^8-1 - 1
    const bias = 127;

    const bits = (b3 << 24) | (b2 << 16) | (b1 << 8) | b0;

    const sign = (bits >>> 31) & 0x1;
    const exponent = (bits >>> 23) & 0xff;
    const fraction = bits & 0x7fffff;
    const sign_multiplier = sign === 0 ? 1 : -1;

    if (exponent === 0) {
        if (fraction === 0) {
            // -0 or 0
            return sign_multiplier * 0;
        } else {
            // subnormal number
            return (
                sign_multiplier *
                Math.pow(2, -126) *
                (fraction / Math.pow(2, 23))
            );
        }
    }

    if (exponent === 0xff) {
        if (fraction === 0) {
            return sign_multiplier * Infinity;
        } else {
            return NaN;
        }
    }

    const mantissa = 1 + fraction / Math.pow(2, 23);

    // Normalized value
    return sign_multiplier * mantissa * Math.pow(2, exponent - bias);
}

// Values taken from:
// https://en.wikipedia.org/wiki/Single-precision_floating-point_format#Precision_limitations_on_integer_values
console.log("--- Float32 Begin ---");
console.log(to_fp32(0x01, 0x00, 0x00, 0x00)); // ~ 1.4012984643 × 10−45
console.log(to_fp32(0xff, 0xff, 0x7f, 0x00)); // ~ 1.1754942107 × 10−38
console.log(to_fp32(0x00, 0x00, 0x80, 0x00)); // ~ 1.1754943508 × 10−38
console.log(to_fp32(0xff, 0xff, 0x7f, 0x7f)); // ~ 3.4028234664 × 1038
console.log(to_fp32(0xff, 0xff, 0x7f, 0x3f)); // ~ 0.999999940395355225
console.log(to_fp32(0x00, 0x00, 0x80, 0x3f)); // 1
console.log(to_fp32(0x01, 0x00, 0x80, 0x3f)); // ≈ 1.00000011920928955
console.log(to_fp32(0x00, 0x00, 0x00, 0xc0)); // -2
console.log(to_fp32(0x00, 0x00, 0x00, 0x00)); // 0
console.log(to_fp32(0x00, 0x00, 0x00, 0x80)); // -0
console.log(to_fp32(0x00, 0x00, 0x80, 0x7f)); // + Infinity
console.log(to_fp32(0x00, 0x00, 0x80, 0xff)); // - Infinity
console.log(to_fp32(0xab, 0xaa, 0xaa, 0x3e)); // ≈ 0.333333343267440796 ≈ 1/3
console.log(to_fp32(0xdb, 0x0f, 0x49, 0x40)); // ≈ 3.14159274101257324 ≈ π (pi)
console.log(to_fp32(0x01, 0x00, 0xc0, 0xff)); // qNaN (on x86 and ARM processors)
console.log(to_fp32(0x01, 0x00, 0x80, 0xff)); // sNaN (on x86 and ARM processors)
console.log("--- Float32 End ---");
