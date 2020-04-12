
var decode = require("jwt-decode");

export class AuthenticationService {
  constructor() {
    this.domain = "http://rjpruitt22.pythonanywhere.com"; // API server domain
    this.fetch = this.fetch.bind(this); // React binding stuff
    this.login = this.login.bind(this);
    this.loggedIn = this.loggedIn.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.getToken = this.getToken.bind(this);
    this.logout = this.logout.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  login(username, password) {
    // Get a token from api server using the fetch api
    return this.fetch(`${this.domain}/api-token-auth/`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password
      })
    }).then(res => {
      this.setToken(res.token); // Setting the token in localStorage
      return Promise.resolve(res);
    });
  }

  signUp(username, email, password) {
    console.log("Signup was called");
    // Get a token from api server using the fetch api
    return this.fetch(`${this.domain}/users/`, {
      method: "POST",
      body: JSON.stringify({
        username,
        email,
        password
      })
    });
  }

  postCapsule(formData) {
    return fetch(`${this.domain}/snapcapsule/`, {
      method: "POST",
      body: formData
    });
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken(); // GEtting token from localstorage
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        // Checking if token is expired. N
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  setToken(idToken) {
    localStorage.setItem("id_token", idToken);
  }

  getToken() {
    return localStorage.getItem("id_token");
  }

  logout() {
    console.log("Logout called");
    localStorage.removeItem("id_token");
  }

  getProfile() {
    // Using jwt-decode npm package to decode the token
    const token = this.getToken();
    if (token === null) {
      return null;
    }
    return decode(this.getToken());
  }

  fetch(url, options) {
    console.log("Fetch being called", url);
    // performs api calls sending the required authentication headers
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };

    if (this.loggedIn()) {
      headers["Authorization"] = "Bearer " + this.getToken();
    }

    return fetch(url, {
      headers,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response.json());
  }

  _checkStatus(response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      // Success status lies between 200 to 300
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
}

export default new AuthenticationService();
