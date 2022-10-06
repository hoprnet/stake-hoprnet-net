import fetch  from 'node-fetch';
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' });

//reportToElement('[Network Registry] 1 node out of 5 appears to be offline.')

export async function reportToElement(message){
    console.log('[Element] reportToElement:', message)
    const roomId = process.env.element_channel; // Testing API 
    const url = new URL(process.env.element_home_url).origin;
    const token = process.env.element_access_token;
    const query = `${url}/_matrix/client/r0/rooms/${roomId}/send/m.room.message`;
    
    try {
        const resp = await fetch(query,{
            method: 'POST', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'body': message,
                // 'body': '[Testing] Hello',
                // 'format': 'org.matrix.custom.html',
                'msgtype': 'm.text'
                }),   
            })
        .then((response) => {
            response.text();
        });
        console.log(resp);
    } catch (e) {
        console.log('Error while reporting to Element.')
    }
}