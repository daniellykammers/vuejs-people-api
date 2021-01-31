<template>
  <div id="page">
    <div v-if="!isSignedIn" id="login" class="container-fluid">
      <div class="card col-lg-8 col-md-8 col-sm-10 mx-auto">
        <div class="card-body text-center">
          <h3 class="card-title">Faça Login com Google</h3>
          <h5 class="card-subtitle">
            Para ter acesso aos seus contatos conectados
          </h5>

          <button @click="signIn" class="btn btn-primary m-4" type="submit">
            Fazer Login
          </button>
        </div>
      </div>
    </div>

    <div v-if="isSignedIn" id="contacts">
      <nav class="navbar navbar-dark">
        <div class="container-fluid">
          <a class="navbar-brand m-1 h1">
             Meus Contatos </a>
          <button
            v-if="isSignedIn"
            type="button"
            class="btn btn-outline-light"
            @click="signOut"
          >
            Fazer Logout
          </button>
        </div>
      </nav>

      <div
        class="card mx-auto m-4"
        style="width: 80%"
        v-for="(contact, key) in contacts"
        v-bind:key="key"
      >
        <div class="card-header">
          Domínio: {{ key }}
        </div>
        <ul
          class="list-group list-group-flush"
          v-for="(contact, index) in contacts[key]"
          v-bind:key="index"
        >
          <li class="list-group-item">{{ contact }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  props: {
    msg: String,
  },
  data: () => ({
    appTitle: null,
    isSignedIn: false,
    contacts: {},
  }),
  methods: {
    signIn() {
      this.gapi.auth2.getAuthInstance().signIn();
    },

    signOut() {
      this.gapi.auth2.getAuthInstance().signOut();
    },

    updateSigninStatus(isSignedIn) {
      this.isSignedIn = isSignedIn;

      if (isSignedIn) {
        this.gapi.client.people.people.connections
          .list({
            resourceName: "people/me",
            pageSize: 100,
            personFields: "names,emailAddresses",
          })
          .then(
            (response) => {
              this.contacts = {};

              for (const conn of response.result.connections) {
                if (!conn.emailAddresses) {
                  continue;
                }

                for (const emailAddress of conn.emailAddresses) {
                  const email = emailAddress.value;

                  const domain = email.split("@")[1];

                  if (!this.contacts[domain]) {
                    this.contacts[domain] = [];
                  }

                  this.contacts[domain].push(email);
                }
              }
            },
            (e) => {
              alert(e.result.error.message);
              console.error(e.result.error);
            }
          );
      } else {
        this.contacts = null;
      }
    },

    initClient() {
      this.gapi.client
        .init({
          apiKey: "AIzaSyBmVByRZ1Ljs2fvwKzOOTPc0fkxF45ZSAA",
          clientId:
            "628309483151-qulsjsrrhmn8vl8rc2d23tep8lcauune.apps.googleusercontent.com",
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/people/v1/rest",
          ],
          scope: "https://www.googleapis.com/auth/contacts.readonly",
        })
        .then(
          () => {
            this.gapi.auth2
              .getAuthInstance()
              .isSignedIn.listen(this.updateSigninStatus);
            this.updateSigninStatus(
              this.gapi.auth2.getAuthInstance().isSignedIn.get()
            );
          },
          function (e) {
            console.error(`Error: ${e.error} Details: ${e.details}`);
          }
        );
    },

    loadGApi() {
      const plugin = document.createElement("script");
      plugin.setAttribute("src", "https://apis.google.com/js/api.js");
      plugin.async = true;
      plugin.defer = true;
      plugin.onload = () => {
        this.gapi = window.gapi;
        this.gapi.load("client:auth2", this.initClient);
      };
      document.head.appendChild(plugin);
    },
  },
  created() {
    this.loadGApi();
  },
};
</script>

<style lang="css">
#page {
  font: 300 18px "Roboto", sans-serif;
  width: 100vw;
  height: 100vh;

  background: #f3f3f3;
}

.card {
  color: #000000;
  background: #fff;

  border: 0 solid #fff;
}

.card-header {
  background: #74c5da;
  color: #fff;
}

.navbar {
  background: #6239bd !important;
}
</style>