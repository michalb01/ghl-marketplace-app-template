/* The above class is a JavaScript GHL helper class that retrieves user data by sending a request to a server and
decrypting the response using a key. */
export class GHL {
  appId;

  constructor() {}

  async getUserData() {
    const key = await new Promise((resolve) => {
        const handleMessage = ({ data }) => {
            if (data.message === "REQUEST_USER_DATA_RESPONSE") {
                window.removeEventListener("message", handleMessage);
                resolve(data.payload);
            }
        };

        window.addEventListener("message", handleMessage);
        window.parent.postMessage({ message: "REQUEST_USER_DATA" }, "*");
    });

    const res = await fetch('/decrypt-sso', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key })
    });

    if (!res.ok) {
        throw new Error('Failed to decrypt SSO data');
    }

    const data = await res.json();
    return data;
}

