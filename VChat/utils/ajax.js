export const postRequest_v2 = (url, data, callback) => {
    let formData = new FormData();

    for (let p in data){
        if(data.hasOwnProperty(p))
            formData.append(p, data[p]);
    }

    let opts = {
        method: "POST",
        body: formData,
        credentials: "include"
    };
    // console.log(opts);

    fetch(url,opts)
        .then((response) => {
            // console.log(response)
            return response.json()
        })
        .then((data) => {
            console.log(url,data);
            callback(data);
        })
        .catch((error) => {
           console.log(url,error);
        });
};

export const postRequest = (url, json, callback) => {

    let opts = {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include"
    };
    // alert(url);
    fetch(url,opts)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            callback(data);
        })
        .catch((error) => {
            console.log(error);
            // alert(error);
        });
};

export const postRequest_v3 = async (url, json) => {
    let opts = {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include"
    };

    const response = await fetch(url, opts);
    return await response.json();
}
