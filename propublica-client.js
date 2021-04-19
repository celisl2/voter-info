const fetch = require("isomorphic-unfetch");

class PropublicaClient {
    constructor(config) {
        this.key = config.key
        this.path = config.path
    }

    request(endpoint = "", options = {}) {
        let url = this.path + endpoint;
        let headers = {

        };
    }

    getBillsByState(state) {

    }
}