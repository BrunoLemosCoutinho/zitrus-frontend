import { createServer, Model } from "miragejs"

export function makeServer({ environment = 'test' }) {
    return createServer({
        environment,

        models: {
            customers: Model,
        },

        routes() {
            this.namespace = "api";

            this.resource("customers");
            this.passthrough();
            this.passthrough("https://opencep.com/v1/**");


            this.post('/customers', (schema, request) => {
                let attrs = JSON.parse(request.requestBody);
                return schema.customers.create(attrs)
            });

            this.get('/customers', (schema) => {
                return schema.customers.all();
            });

            this.get("/customers/:customerId", (schema, request) => {
                const customerId = request.params.customerId;
                return schema.customers.find(customerId);
            });

            this.patch("/customers/:customerId", (schema, request) => {
                let newAttrs = JSON.parse(request.requestBody)
                let customerId = request.params.customerId
                let customers = schema.customers.find(customerId)
                return customers.update(newAttrs)
            })
        },
    })
}