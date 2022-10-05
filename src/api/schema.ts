import { gql } from "apollo-server";

const typeDefs = gql`
  type Item {
    name: String!
    quantity: Int!
  }

  type Cart {
    id: String!
    items: [Item!]!
  }

  type User {
    id: String!
    name: String!
    carts: [Cart!]!
  }

  input ItemInput {
    id: String!
    quantity: Int!
  }

  input CartInput {
    """
    Optional because we could be adding an item to a new cart
    """
    cartId: String
    item: ItemInput!
  }

  type AddItemToCartResponse {
    cart: Cart
  }

  type Mutation {
    addItemToCart(input: CartInput): AddItemToCartResponse
  }

  type Query {
    me: User
  }
`;

export { typeDefs };
