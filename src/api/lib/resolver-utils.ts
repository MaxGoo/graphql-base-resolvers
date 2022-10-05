import { MyError, Severity } from "../../domain/lib/errors";
import { BaseContext } from "./context";

enum AuthorizationRole {
  ADMIN = "ADMIN",
  USER = "USER",
  NONE = "NONE",
}

const anyMatch = (
  roles: AuthorizationRole[],
  requiredRoles: AuthorizationRole[]
) => {
  return requiredRoles.some((role) => roles.includes(role));
};

/*
  Unfortunately, reference resolvers and field resolvers have a slightly different function signature for resolving. So we need
  to abstract this function out so it can be used by both BaseResolver and BaseReferenceResolver.
*/
function resolve(
  this: any,
  parent: any,
  args: any,
  context: BaseContext
): any | Promise<any> {
  if (!this.allowedRoles.includes(AuthorizationRole.NONE) && !context.userId) {
    throw new Error("You must be logged in to perform this action");
  }

  if (anyMatch(this.allowedRoles, context.roles ?? [])) {
    console.log(`${this.constructor.name}:`, {
      userId: context.userId,
      roles: context.roles,
      parent,
      args,
    });

    return this.resolver(parent, args, context);
  }

  throw new MyError({
    message:
      "User attempted to perform an action they are not authorized to perform",
    clientMessage: "You do not have permission to perform this action",
    severity: Severity.LOW,
    debugInformation: {
      userRoles: context.roles,
      requiredRoles: this.allowedRoles,
    },
  });
}

export { AuthorizationRole, resolve, anyMatch };
