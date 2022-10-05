import { MyError, Severity } from "../../domain/lib/errors";
import { BaseContext } from "./context";
import { AuthorizationRole, resolve } from "./resolver-utils";
/*
  Base class for all resolvers (except union type resolvers).

  The resolve function contains common functionality for all resolvers.
  the resolver function must be implemented by the child class.
*/
abstract class BaseResolver<
  ParentType = any,
  ArgsType = any,
  ReturnType = any
> {
  private allowedRoles: AuthorizationRole[];

  constructor(allowedRoles: AuthorizationRole[]) {
    this.allowedRoles = allowedRoles;
  }

  public resolve = (
    parent: ParentType,
    args: ArgsType,
    context: BaseContext
  ): ReturnType | Promise<ReturnType> => {
    return resolve.call(this, parent, args, context);
  };

  protected abstract resolver(
    parent: ParentType,
    args: ArgsType,
    context: BaseContext
  ): ReturnType | Promise<ReturnType>;

  protected getUserId(context: BaseContext): string {
    if (!context.userId) {
      throw new MyError({
        message: "userId is missing from context when requested",
        clientMessage: "You do not have permission to perform this action", // Show the user the same error as above
        severity: Severity.MEDIUM, // If we expect a userId to be on a context and it's not, that's probably a code bug!
      });
    }

    return context.userId;
  }
}

export { BaseResolver };
