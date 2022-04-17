import { createServer, Model } from "miragejs"

export function makeServer({ environment = 'test' }) {
    return createServer({
        environment,

        models: {
            customers: Model,
        },

        routes() {
            this.namespace = "api";

            //   this.resource("customer");
            this.passthrough();
            this.passthrough("https://opencep.com/v1/**");


            this.post('/salva', (schema, request) => {
                console.log("Rota create");
                let attrs = JSON.parse(request.requestBody);
                console.log("attrs: ", attrs);
                return schema.customers.create(attrs)
            });

            this.get('/customers');

        },
    })
}