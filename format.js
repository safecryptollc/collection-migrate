const fs = require('fs');
const path = require('path')

const jsonsInDir = fs.readdirSync('./old').filter(file => path.extname(file) === '.json');
let temp = {};
let res = [];
jsonsInDir.forEach(file => {
    const fileData = fs.readFileSync(path.join('./old', file));
    const json = JSON.parse(fileData.toString());
    if (typeof json === 'object' && json !== null) {
        res = [];
        temp['name'] = json.name;
        temp['image'] = json.image_url;
        temp['desciption'] = '';
        temp['attributes'] = json.traits ? json.traits.map((data) => ({ trait_type: data.trait_type, value: data.value })) : [];
        res.push(temp)
        let data = JSON.stringify(res);
        fs.writeFileSync('./new/' + file, data);

    }
});