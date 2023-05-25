import axios from 'axios';
const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
};

fetch('https://reqres.in/api/posts', requestOptions)
        .then(response => response.json())


export const requestCall = async (month, city) => {


    const data = async () => { await fetch(`api/campaign/sunshine?city=${city}&month=${month}`, requestOptions).then(reponse => {
        return reponse.json
})
};
    return await data();

}