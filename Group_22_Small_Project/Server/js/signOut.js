

export function doSignOut()
{
    document.cookie = "Login Cookie= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}