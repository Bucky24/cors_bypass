const mainAPIUrl = "<<BASE>>/api";

const oldFetch = fetch;

fetch = (url, options) => {
    if (!options) {
        options = { method: 'GET' };
    }

    return oldFetch(mainAPIUrl + "?url=" + encodeURIComponent(url), options);
}