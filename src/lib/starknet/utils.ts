import base64js from "base64-js";
import BN from "bn.js";

type Big3 = { D0: string; D1: string; D2: string };
type Uint256 = { low: string; high: string };

export function byteArrayToString(data: string): any {
  try {
    // Ensure the input is a string and parse it into an array of numbers
    const byteArray = Array.isArray(data)
      ? data
      : data?.split(",").map((num) => parseInt(num, 10));

    // Convert byte array to string
    const jsonString = String.fromCharCode(...byteArray);
    return jsonString === ""?{}: JSON.parse(jsonString);
  } catch (error) {
    console.error("Error converting byte array to string:", error);
    return null;
  }
}

export function stringToByteArray(str: string): string {
  let utf8: number[] = [];
  for (let i = 0; i < str.length; i++) {
    let charcode = str.charCodeAt(i);
    if (charcode < 0x80) {
      utf8.push(charcode);
    } else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(
        0xe0 | (charcode >> 12),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f),
      );
    } else {
      i++;
      charcode =
        0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      utf8.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f),
      );
    }
  }
  return utf8.join(",");
}

// Function to convert ASCII to Hex
export function asciiToHex(str: string): string {
  const arr1: string[] = ["0x"];
  for (let n = 0, l = str.length; n < l; n++) {
    const hex = str.charCodeAt(n).toString(16);
    arr1.push(hex);
  }
  return arr1.join("");
}

export const feltToString = (felt: any) =>
  felt
    // To hex
    .toString(16)
    // Split into 2 chars
    .match(/.{2}/g)
    // Get char from code
    .map((c: any) => String.fromCharCode(parseInt(c, 16)))
    // Join to a string
    .join("");

// Function to convert value to BN instance
export function toBN(val: string | BN | undefined): BN | string {
  if (BN.isBN(val)) {
    return val;
  }
  if (val === undefined || val === "") {
    return "";
  }
  if (val.startsWith("0x") && isHex(removeHexPrefix(val))) {
    return new BN(removeHexPrefix(val), 16);
  } else if (isDecimal(val)) {
    return new BN(val, 10);
  } else {
    const ascHex = asciiToHex(val);
    return new BN(removeHexPrefix(ascHex), 16);
  }
}

// Function to convert value to Hex string
export function toHex(val: string | undefined): string {
  if (val === undefined || val === "") {
    return "";
  }
  if (val.startsWith("0x") && isHex(removeHexPrefix(val))) {
    return val;
  } else if (isDecimal(val)) {
    const nbn = new BN(val, 10);
    return addHexPrefix(nbn.toString(16));
  } else {
    return asciiToHex(val);
  }
}

// Function to convert value to Uint256
export function to256(inVal: string | BN | undefined): Uint256 {
  if (inVal === undefined || inVal === "") {
    return { low: "", high: "" };
  }
  const mask = new BN(2).pow(new BN(128)).sub(new BN(1));
  const bigIn = toBN(inVal) as BN;

  return { low: bigIn.and(mask).toString(), high: bigIn.shrn(128).toString() };
}

// Function to convert value to Big3 object
export function toBig3(val: string | BN | undefined): Big3 {
  if (val === undefined || val === "") {
    return { D0: "", D1: "", D2: "" };
  }
  const mask = new BN(2).pow(new BN(86)).sub(new BN(1));
  let bigIn = toBN(val) as BN;

  const d0 = bigIn.and(mask);
  bigIn = bigIn.shrn(86);

  const d1 = bigIn.and(mask);
  bigIn = bigIn.shrn(86);

  return { D0: d0.toString(), D1: d1.toString(), D2: bigIn.toString() };
}

// Function to parse Big3 object into BN
export function parseBig3(slice: Big3): BN {
  let result = new BN(slice.D2);
  result = result.shln(86).add(new BN(slice.D1));
  result = result.shln(86).add(new BN(slice.D0));
  return result;
}

// Function to convert Hex to UTF-8 string
export function hexToUtf8(hex: string): string {
  return decodeURIComponent("%" + hex.match(/.{1,2}/g)?.join("%") || "");
}

// Function to convert byte array to Hex string
export function bytesToHexString(byteArray: Uint8Array): string {
  return Array.prototype.map
    .call(byteArray, (byte: number) => {
      return ("0" + (byte & 0xff).toString(16)).slice(-2);
    })
    .join("");
}

// Function to convert Hex to byte array
export function hexToBytes(hex: string): number[] {
  const bytes: number[] = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
}

// Function to remove Hex prefix
export function removeHexPrefix(hex: string): string {
  let hexTrim = hex.replace(/^0x/, "");
  if (hexTrim.length % 2 === 1) {
    hexTrim = "0" + hexTrim;
  }
  return hexTrim;
}

// Function to add Hex prefix
export function addHexPrefix(hex: string): string {
  return `0x${removeHexPrefix(hex)}`;
}

// Function to format account with leading zeros removed
export function fmtActiveAccount(hex: string): string {
  return hex.replace(/^0x/, "").replace(/^0/, "");
}

// Function to encode value in base64
export function bufferEncode(value: Uint8Array): string {
  return base64js
    .fromByteArray(value)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// Function to convert base64 string to byte array
export function base64ToArray(b64: string): Uint8Array {
  return base64js.toByteArray(b64);
}

// Function to check if value is Hex
export function isHex(val: string): boolean {
  return /^[0-9a-fA-F]+$/.test(val);
}

// Function to check if value is Decimal
export function isDecimal(val: string): boolean {
  return /^[0-9]+$/.test(val);
}

// Function to check if value is Base64
export function isBase64(val: string): boolean {
  return /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(
    val,
  );
}
