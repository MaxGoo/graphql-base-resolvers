import { ApolloServer } from "apollo-server";
import { contextBuilder } from "./api/lib/context";
import { resolvers } from "./api/resolvers";
import { typeDefs } from "./api/schema";
import { handleErrorsPlugin } from "./domain/lib/errors";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [handleErrorsPlugin],
  context: contextBuilder,
  csrfPrevention: true,
  cache: "bounded",
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
