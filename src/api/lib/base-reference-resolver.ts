import { BaseContext } from "./context";
import { AuthorizationRole, resolve } from "./resolver-utils";

/*
  Base class for all resolvers (except union type resolvers).

  The resolve function contains common functionality for all resolvers.
  the resolver function must be implemented by the child class.
*/
abstract class BaseReferenceResolver<ParentType = any, ReturnType = any> {
  private allowedRoles: AuthorizationRole[];

  constructor(allowedRoles: AuthorizationRole[]) {
    this.allowedRoles = allowedRoles;
  }

  public resolve = (
    parent: ParentType,
    context: BaseContext
  ): ReturnType | Promise<ReturnType> => {
    // Note that there is no args in a reference resolver
    return resolve.call(this, parent, undefined, context);
  };

  protected abstract resolver(
    parent: ParentType,
    context: BaseContext
  ): ReturnType | Promise<ReturnType>;
}

export { BaseReferenceResolver };
