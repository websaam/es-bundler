// ----- This is for Cosmos SDK -----
import {
  assertIsDeliverTxSuccess,
  SigningStargateClient,
  StdFee,
  calculateFee,
  GasPrice,
  coins,
} from "@cosmjs/stargate";

import {
  encodeSecp256k1Signature,
  rawSecp256k1PubkeyToRawAddress,
} from "@cosmjs/amino";
import { Secp256k1, sha256, ExtendedSecp256k1Signature } from "@cosmjs/crypto";
import { toBech32, fromHex } from "@cosmjs/encoding";

import { makeSignBytes } from "@cosmjs/proto-signing";

// @cosmjs/amino
const amino = {
  encodeSecp256k1Signature,
  rawSecp256k1PubkeyToRawAddress,
};

// @cosmjs/crypto
const crypto = {
  Secp256k1,
  sha256,
  ExtendedSecp256k1Signature,
  toBech32,
  fromHex,
};

// @cosmjs/proto-signing
const protoSigning = {
  makeSignBytes,
};

// @cosmjs/stargate
const stargate = {
  assertIsDeliverTxSuccess,
  SigningStargateClient,
  StdFee,
  calculateFee,
  GasPrice,
  coins
}

export {
  amino,
  crypto,
  protoSigning,
  stargate
};
