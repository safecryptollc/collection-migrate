/* import moralis */
const Moralis = require("moralis/node");

const serverUrl = "https://tvcxnqdb2wdj.usemoralis.com:2053/server";
const appId = "L36JGtQzJ3Z92O5gopR4K4a9CcrSG9Mt1q50z0OZ";
const masterKey = "qsuXmxLaMtMyhGv13zsNmENWymoNrwf9NnM9CPR4";




let chain = "0xa86a"
const collections = [
    // '0xcbd7a879bfb54dfc69ad9a7f1415d9efdee90ddb',
    // '0x391924cE7bD483dDC1687a456C4eB9d30d8b80D2',
    // '0xFb15c964b29a63b965B8C7a6142c139A639BD1B3'
    '0x1E41197983e56836c575eEA81df4D864C234AA9A'
]

const options = {
    address: '',
    chain: chain,
    cursor: null,
    limit: 100
};


let collectionTokenIDz = [];

const loadCollectionMetaData = async (address) => {
    const NFTMetadata = Moralis.Object.extend("nftmetadata");
    const query = new Moralis.Query(NFTMetadata);
    query.equalTo("token_address", address);
    const results = await query.find();
    // Do something with the returned Moralis.Object values
    for (let i = 0; i < results.length; i++) {
        collectionTokenIDz.push(results[i].get('token_id'))
    }


}

const init = async () => {
    await Moralis.start({ serverUrl, appId, masterKey });

    await loadCollectionMetaData();
    for (var i = 0; i < collections.length; i++) {
        let collection = collections[i];
        await loadCollectionMetaData(collection);
        loadNftz({
            ...options,
            address: collection
        });
        console.log(collection + ' - Successfully added');
    }

}

const loadNftz = async (options) => {
    const NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    for (var i = 0; i < NFTs.result.length; i++) {
        let nft = NFTs.result[i];
        if (!collectionTokenIDz.includes(nft.token_id)) {
            insertIntoMoralis(nft);
        } else {
            let nft = NFTs.result[i];
            console.log(nft.token_id + " Skipped ");
        }

    }
    if (NFTs.cursor != '') {
        loadNftz({
            ...options,
            cursor: NFTs.cursor
        })
    }

}

const insertIntoMoralis = async (data) => {
    const NFTMetadata = Moralis.Object.extend("nftmetadata");
    const MarketItemC = Moralis.Object.extend("MarketItemC");

    let price = '0';
    let owner = '';
    let listed = false;


    const query = new Moralis.Query(MarketItemC);
    query.equalTo("nftContract", data.token_address);
    query.equalTo("tokenId", data.token_id);

    const result = await query.find();


    for (let i = 0; i < result.length; i++) {
        let details = result[i];
        price = details.get('price');
        owner = details.get('owner');
        listed = details.get('canceled') ? false : true;
    }


    const nft = new NFTMetadata();

    nft.set("token_address", data.token_address.toLowerCase());
    nft.set("token_id", data.token_id);
    nft.set("amount", data.amount || 0);
    nft.set("contract_type", data.contract_type);
    nft.set("name", data.token_id);
    nft.set("symbol", data.token_id);
    nft.set("token_uri", data.token_uri);
    nft.set("metadata", data.metadata);
    nft.set("price", price);
    nft.set("owner", owner);
    nft.set("listed", listed);

    nft.save().then(
        (nf) => {
            // Execute any logic that should take place after the object is saved.
            console.log("New object created with objectId: " + nft.id);
        },
        (error) => {
            // Execute any logic that should take place if the save fails.
            // error is a Moralis.Error with an error code and message.
            console.log("Failed to create new object, with error code: " + error.message);
        }
    );
}




init();
