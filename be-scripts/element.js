
import fetch  from 'node-fetch'

export async function reportToElement(message){
    console.log('[Element] reportToElement:', message)
  //  const roomId = '!sNNBSDBeCzREdTnHIg:hoprnet.io'; // Testing API 
    const roomId = '!JNKpCzVKbbifwQlpfG:hoprnet.io'; // Automated
    const url = new URL(process.env.element_home_url).origin;
    try {
        const resp = await fetch(`${url}/_matrix/client/r0/rooms/${roomId}/send/m.room.message`,{
            method: 'POST', 
            headers: {
                'Authorization': `Bearer ${process.env.element_access_token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'body': message,
  //              'body': '[Testing] Hello',
  //              'format': 'org.matrix.custom.html',
                'msgtype': 'm.text'
                }),   
            })
        .then((response) => response.text());
        console.log(resp)
    } catch (e) {
        console.log('Error while reporting to Element.')
    }
}