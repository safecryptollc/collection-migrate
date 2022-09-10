const fs = require('fs');
const path = require('path')

/* import moralis */
const Moralis = require("moralis/node");

/* Moralis init code */
const serverUrl = "https://tvcxnqdb2wdj.usemoralis.com:2053/server";
const appId = "L36JGtQzJ3Z92O5gopR4K4a9CcrSG9Mt1q50z0OZ";
const masterKey = "qsuXmxLaMtMyhGv13zsNmENWymoNrwf9NnM9CPR4";

const initMoralis = async () => {
    await Moralis.start({ serverUrl, appId, masterKey });

}
initMoralis();
const jsonsInDir = fs.readdirSync('./images').filter(file => path.extname(file) === '.png');


jsonsInDir.forEach(async (file) => {
    const fileData = fs.readFileSync(path.join('./images', file));

    const data = fileData;

    const fileBuffer = new Moralis.File(file, data);

    let res = await fileBuffer.saveIPFS();

    console.log(res);
    // const json = JSON.parse(fileData.toString());
    // if (typeof json === 'object' && json !== null) {
    //     res = [ ];
    //     temp['name'] = json.name;
    //     temp['image'] = json.image_url;
    //     temp['desciption'] = '';
    //     temp['attributes'] = json.traits ? json.traits.map((data) => ({ trait_type: data.trait_type, value: data.value })) : [];
    //     res.push(temp)
    //     let data = JSON.stringify(res);
    //     fs.writeFileSync('./new/' + file, data);

    // }
});