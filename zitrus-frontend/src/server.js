import { createServer, Model } from "miragejs"

export function makeServer({ environment = 'test' }) {
  return createServer({
    environment,

    models: {
      customer: Model,
    },

    routes() {
      this.namespace = "api";

      this.resource("customer");

    },
  })
}