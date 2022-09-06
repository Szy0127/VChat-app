export const postRequest_formData = (url, data, callback) => {
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

    fetch(url,opts)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            callback(data);
        })
        .catch((error) => {
            console.log(error);
            // history.push('/login');
            // history.go(0);
        });
};

export const postRequest_json = (url, json, callback) => {

    let opts = {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include"
    };

    fetch(url,opts)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            callback(data);
        })
        .catch((error) => {
            console.log(error);
            // history.push('/login');
            // history.go(0);
        });
};

export const postRequest_json_async = async (url, json) => {
    let opts = {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include"
    };

    const response = await fetch(url, opts);
    try {
        return await response.json();
    }catch (e){
        console.log(e);
        // history.push('/login');
        // history.go(0);
    }
}

export const postRequest_formData_async = async (url, data) => {
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

    const response = await fetch(url, opts);
    try {
        return await response.json();
    }catch (e){
        console.log(e);
        // history.push('/login');
        // history.go(0);
    }
}
