const fs = require('fs');

const PATH = 'public/nft';
main();

async function main(){
    try {
        let nfts = {};
        const types = fs.readdirSync(PATH);

        for (let t = 0; t < types.length; t++){
            const ranks = fs.readdirSync(PATH+'/'+types[t]);
            nfts[types[t]] = {};
    
            for (let r = 0; r < ranks.length; r++){
                const nft = fs.readFileSync(PATH+'/'+types[t]+'/'+ranks[r], {encoding:'utf8'})
                const nft_parsed = JSON.parse(nft);
                nfts[types[t]][ranks[r]] = nft_parsed;
            }
        }

        fs.writeFileSync( 'nft/nfts.json', JSON.stringify(nfts) )
        console.log("Saved NFT files into JSON.");
        return nfts;
    } catch (error) {
        console.error(
            "Problem while parting NFT files into JSON.", error
        )
    }

}