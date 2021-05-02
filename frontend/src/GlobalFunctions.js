export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export const getIsAuthenticated = function (callback) {
     fetch('/api/getauth/', {
        method: 'GET',
        headers: {'content-type': 'application/json'}
    })
        .then(response => response.json())
        .then(data => {
            callback(!(data.user === "AnonymousUser" && data.auth === "None"));
        })
        .catch(error => console.log(error))
}