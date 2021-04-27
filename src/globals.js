import axios from 'axios';

export const sp_id = '4ac408fbeab9451d8abf4120d8e60205';
export const sp_secret = 'bf374508d6114a988e64aba4c6edfbf1';

export let newElement = function(parent, type='div', className=null, id=null, inner = '') {
    let toAdd = document.createElement(type);
    parent.appendChild(toAdd);
    toAdd.className = className != null && typeof className == 'string' ? className : '';
    toAdd.id = id != null && typeof id == 'string' ? id : '';
    toAdd.innerHTML = inner;
    return toAdd;
}

export let newElementBefore = function(parent, toPrecede, type='div', className=null, id=null, inner = '') {
    let toAdd = document.createElement(type);
    parent.insertBefore(toAdd, toPrecede);
    toAdd.className = className != null && typeof className == 'string' ? className : '';
    toAdd.id = id != null && typeof id == 'string' ? id : '';
    toAdd.innerHTML = inner;
    return toAdd;
}

export async function getGeolocation()
{
    const result = await axios({
        method : 'get',
        url : `https://freegeoip.app/json/`,
    });
    return result.data;
}

export async function getCountryCodes() 
{
    const result = await axios({
        method : 'get',
        url : `https://flagcdn.com/en/codes.json`,
    });
    return result.data;
}