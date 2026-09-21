export const environment = {
  production: true,
  OpenIdConnect: {
    Authority: "http://host.docker.internal:9000",

    apiUrl: 'http://skymedibook.runasp.net/api/v1/',

    localBaseURL: "https://localhost:44313/api/v1/",
    ClientId: "ClassifiedAds.Angular",
  },
  ResourceServer: {
    Endpoint: "http://host.docker.internal:9002/api/",
    NotificationEndpoint: "http://host.docker.internal:9002/hubs/notification",

    GoogleClientID: "1079667598840-j2p9duji9qkann88e9j55r6dai3mifa8.apps.googleusercontent.com",
  },
  CurrentUrl: "http://localhost:4200/",
};
