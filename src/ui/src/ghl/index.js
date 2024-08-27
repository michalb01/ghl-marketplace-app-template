export class GHL {
  constructor(appId = null) {
    this.appId = appId;
  }

  async getUserData() {
    const key = await new Promise((resolve, reject) => {
      const handleMessage = ({ data }) => {
        if (data.message === "REQUEST_USER_DATA_RESPONSE") {
          window.removeEventListener("message", handleMessage);
          resolve(data.payload);
        }
      };

      window.addEventListener("message", handleMessage);
      window.parent.postMessage({ message: "REQUEST_USER_DATA" }, "*");

      // Reject the promise if no response is received within a timeout (e.g., 5 seconds)
      setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        reject(new Error("No response received for user data request"));
      }, 5000);
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
}