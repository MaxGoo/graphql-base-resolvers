"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_1 = require("apollo-server");
const typeDefs = (0, apollo_server_1.gql) `
  type Item {
    name: String
    quantity: Int
  }

  type Cart {
    id: String
    items: [Item]
  }

  type User {
    id: String
    name: String
    carts: [Cart]
  }

  type Query {
    me: User
  }

  input ItemInput {
    name: String
    quantity: Int
  }

  input CartInput {
    items: [ItemInput]
  }

  type Mutation {
    addItemToCart(input: CartInput): Cart
  }
`;
exports.typeDefs = typeDefs;
//# sourceMappingURL=schema.js.map