const tokenRequest = {
  scopes: [
    "mail.readwrite",
    "https://graph.microsoft.com/mail.send",
    "https://graph.microsoft.com/offline_access"
  ]
};

const hostname = "http://localhost:5000";

const backendServerAdress = "http://localhost:8050";

const msalConfig = {
  auth: {
    clientId: "3806fafa-c90a-486a-8fa6-567e56453243",
    redirectUri: hostname + "/homepage/index.html"
  }
};

var loginRequest = {
  scopes: ["Mail.ReadWrite", "mail.send", "offline_access"] // optional Array<string>
};

const TOKEN_ID = "token_id";
const msalInstance = new Msal.UserAgentApplication(msalConfig);

msalInstance.handleRedirectCallback((error, response) => {
  console.log("redirect callback done");
});

async function redirectToDashboard() {
  console.log("redirect to dashboard");
  // var response = await requestTokenSilent();
  var response;
  if (!response || !response.status == 200) {
    response = await requestTokenPopup();
  }

  if (response.accessToken) {
    console.log(response);
    createFolderTest(response.accessToken);
    // location.href = hostname;
  } else {
    console.log("Unable to acquire token");
  }
}

function redirectLogin() {
  console.log("redirect called");
  if (!msalInstance.getAccount()) {
    return msalInstance
      .loginRedirect(loginRequest)
      .then(response => {
        console.log(response);
        return response;
      })
      .catch(err => {
        console.log("Authentication error: ", err);
      });
  }

  if (msalInstance.getAccount()) {
    redirectToDashboard();
  }
}

async function requestTokenSilent() {
  console.log("requestTokenSilent");
  if (msalInstance.getAccount()) {
    return msalInstance
      .acquireTokenSilent(tokenRequest)
      .then(response => {
        localStorage.setItem(TOKEN_ID, response.accessToken);
        console.log("response reached: ", response);
        resolve(response);
      })
      .catch(err => {
        if (err.name === "InteractionRequiredAuthError") {
          alert("Authentication failed try again");
        }
      });
  }
}

async function requestTokenPopup() {
  console.log("requestTokenPopup");
  if (msalInstance.getAccount()) {
    return msalInstance
      .acquireTokenPopup(tokenRequest)
      .then(response => {
        localStorage.setItem(TOKEN_ID, response.accessToken);
        return response;
      })
      .catch(err => {
        console.log(err);
        if (err.name === "InteractionRequiredAuthError") {
          alert("Authentication failed try again");
        }
      });
  }
}

function createFolderTest(accessToken) {
  var options = {
    method: "POST",
    headers: {
      Authorization: accessToken,
      "Content-Type": "application/json"
    },
    mode: "cors",
    body: JSON.stringify({
      displayName: "@COOLMONDAY"
    })
  };

  var graphEndpoint =
    "https://outlook.office.com/api/v2.0/me/MailFolders/Inbox/childfolders";

  fetch(graphEndpoint, options)
    .then(resp => {
      console.log(resp);
    })
    .catch(err => {
      console.log(err);
    });
}
