
const ipUrl = 'https://ipapi.co/json/';

const getIPRegion = async()=>{
     let data = await fetch(ipUrl);
     let res = await data.json();
     return {country:res.country,region:res.region,city:res.city}

}


export {getIPRegion}
