import { AuthorizationRole } from "./resolver-utils";

export type BaseContext = {
  userId?: string;
  roles?: AuthorizationRole[];
};

const contextBuilder = ({ req }: any): BaseContext => {
  /*
    This is just a demo project without any gateway. So I am just using the request headers to get the user id and roles.
    In a real setup you'd want to have a gateway that would validate the token and pass the token data to the downstream 
    services via the request extensions.
  */

  const userId = req.headers.userid;
  const roles = req.headers.roles as AuthorizationRole[];

  const context: BaseContext = {};

  if (typeof userId === "string") {
    context.userId = userId;
  } else {
    context.userId = "anonymous";
  }

  if (typeof roles === "string") {
    context.roles = [roles];
  } else {
    context.roles = roles;
  }

  return context;
};

export { contextBuilder };
