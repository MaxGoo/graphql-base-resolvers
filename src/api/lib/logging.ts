import {
  ApolloServerPlugin,
  GraphQLRequestContext,
} from "apollo-server-plugin-base";
import { BaseContext } from "../../api/lib/context";

function loggingPlugin(): ApolloServerPlugin {
  return {
    requestDidStart: async (
      requestContext: GraphQLRequestContext<BaseContext>
    ): Promise<void> => {
      console.log(requestContext.request.operationName ?? "UnnamedRequest", {
        userId: requestContext.context.userId ?? "anonymous",
        query: requestContext.request.query,
      });
    },
  };
}

export { loggingPlugin };
