// NODE_PATH='/app/node_modules' node jdent.js
const jdenticon = require('jdenticon')
const fs = require('fs')

let size = 2400
let hash = 'Spanish Photo Flash'

jdenticon.configure({
    hues: [127],
    lightness: {
        color: [0.40, 0.80],
        grayscale: [0.30, 0.90]
    },
    saturation: {
        color: 0.92,
        grayscale: 0.20
    },
    backColor: "#1E90FFf0"
});

let png = jdenticon.toPng(hash, size);

fs.writeFileSync('icon.png', png);
