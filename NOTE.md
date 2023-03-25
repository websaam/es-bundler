# Note

The specified part of the `pbkdf2.js` in the cosmos sdk being changed in the node_module

```
async function getNodeCrypto() {
    // try {
    //     const nodeCrypto = await Promise.resolve().then(() => __importStar(require("crypto")));
    //     // We get `Object{default: Object{}}` as a fallback when using
    //     // `crypto: false` in Webpack 5, which we interprete as unavailable.
    //     if (typeof nodeCrypto === "object" && Object.keys(nodeCrypto).length <= 1) {
    //         return undefined;
    //     }
    //     return nodeCrypto;
    // }
    // catch {
    //     return undefined;
    // }
    try{
        globalThis.crypto = require('crypto').webcrypto;
    }catch(e){
        
    }
}
```