import { BaseReferenceResolver } from "./base-reference-resolver";
import { BaseResolver } from "./base-resolver";
import { BaseContext } from "./context";

type ResolverFn = (parent: any, args: any, context: BaseContext) => any;

type ReferenceFn = (args: any, context: BaseContext) => any;

export interface FieldOutput {
  [field: string]: ResolverFn | ReferenceFn;
}

export interface ResolverMapOutput {
  [parent: string]: FieldOutput;
}

export interface ResolverMapInput {
  [parent: string]: {
    [field: string]: BaseResolver | BaseReferenceResolver;
  };
}

/*
    Since we typed our resolvers as BaseResolver, we need to convert them to a resolver function that can be used by Apollo.
*/
const resolverMap = (resolverInput: ResolverMapInput): ResolverMapOutput => {
  let output: ResolverMapOutput = {};

  Object.keys(resolverInput).forEach((resolverParentName) => {
    let parentOutput: FieldOutput = {};

    const resolverParent = resolverInput[resolverParentName];

    Object.keys(resolverParent).forEach((resolverField) => {
      const value = resolverParent[resolverField];

      parentOutput[resolverField] = value.resolve;
    });

    output[resolverParentName] = parentOutput;
  });

  console.log(output);
  return output;
};

export { resolverMap };
