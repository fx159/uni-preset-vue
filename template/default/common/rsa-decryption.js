/**
 * @Author : GaoHan
 * @Date : 2019/9/26
 * @Version : 1.0
 * @Content : rsa解密方法
 */
import { JSEncrypt } from "./jsencrypt.min";

// rsa-私钥
const PRIVATE_KEY =
  "-----BEGIN RSA PRIVATE KEY-----MIICXAIBAAKBgQCDMguhToMsxupFzfGfvDed5d74X2YWTMwkHvDJWQml+60bJUDmGSlohSzwJ8KgYermZnFjP8VcK3S2LjaYdqfRba67Bzd03wSR3vjcKU4p9Jtmr9x9+APDLUtnQ63KObfLv7IZlShowRAaD2icMXXPV84rP5A3a/Cy4SsFBZh0bQIDAQABAoGAEdOWAvgRGN96a7u9DjBb+keG0Ybc70DGKE5P93vytKwK7HpWZC2dE8eswIEWkAZeDapz08GRhqGc/TgwUO0mhjs57X86ahoUeWGPGXlvk+7tyhPdYfak2s/uOCrynf8cGfRiPGgCvotxdjqRWc2yGE4wn/wdbC5PUkqTBITx0b0CQQDRgqFOWdstc/dYTgHskyd0O+DQ73mfJdupgIEQ+zru3DDYLOap6eJ2JbmNfvxeBeoUtle5EhZXLY6C2xyxuUDTAkEAoE6xMLfYStUCpmQpE8rAxOqE0SvOrI6iH6JN6mcZHh+QMjsJDg25MyQOAAqseUIDjd5L9TBqR+tJHHh31pQtvwJBAIR13bxmzU9IgXqgH1FOnGQ9s18F+VQooF/jcjalUFZSesNCaDfHOrnOEimmvrJHdP7RZlcJW3yUvgR3ugWXhacCQAGkzOxS9kTOKljKbiFl0tQyE2qRqGzciY0JfQMKS5ejezcIo+8g9OUxWXNmqJ4VrzOlM+IvvOc/4mAIXDI3EsECQC1hnEq/N3ANvgeWG0Gq3khO1X0KpmJl9k+IaaUxzygK8tvbPizSfT1Bskk5yh/roWBCJEKG7Y3bdcgVzfUD8PQ=-----END RSA PRIVATE KEY-----";

// 十六进制转字节
function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
}
// 字节转十六进制
function bytesToHex(bytes) {
  for (var hex = [], i = 0; i < bytes.length; i++) {
    hex.push((bytes[i] >>> 4).toString(16));
    hex.push((bytes[i] & 0xf).toString(16));
  }
  return hex.join("");
}
JSEncrypt.prototype.decryptLong = function (string) {
  var k = this.getKey();
  // var maxLength = ((k.n.bitLength()+7)>>3);
  var MAX_DECRYPT_BLOCK = 128;
  try {
    var ct = "";
    var t1;
    var bufTmp;
    var hexTmp;
    var str = bytesToHex(string);
    var buf = hexToBytes(str);
    var inputLen = buf.length;
    // 开始长度
    var offSet = 0;
    // 结束长度
    var endOffSet = MAX_DECRYPT_BLOCK;
    // 分段加密
    while (inputLen - offSet > 0) {
      if (inputLen - offSet > MAX_DECRYPT_BLOCK) {
        bufTmp = buf.slice(offSet, endOffSet);
        hexTmp = bytesToHex(bufTmp);
        t1 = k.decrypt(hexTmp);
        ct += t1;
      } else {
        bufTmp = buf.slice(offSet, inputLen);
        hexTmp = bytesToHex(bufTmp);
        t1 = k.decrypt(hexTmp);
        ct += t1;
      }
      offSet += MAX_DECRYPT_BLOCK;
      endOffSet += MAX_DECRYPT_BLOCK;
    }
    return ct;
  } catch (ex) {
    return false;
  }
};
// @ts-ignore
export default {
  // 分段解密
  rsaDecrypt(data) {
    var bytesResult = hexToBytes(data);
    // 分段解密
    var decrypt = new JSEncrypt();
    // 设置私钥
    decrypt.setPrivateKey(PRIVATE_KEY);
    var uncrypted = decrypt.decryptLong(bytesResult);
    return uncrypted;
  },
};
