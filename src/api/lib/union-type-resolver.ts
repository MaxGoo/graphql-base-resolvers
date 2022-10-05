export interface UnionTypeResolverArgs {
  parentType: string;
}

/*
    This resolver is used to resolve union types. It does not need to work the same as the BaseResolver since it
    does not return data, just type names, it does not need to check authorization
*/
abstract class UnionTypeResolver<
  ArgsType = any,
  ReturnType = string | null | undefined
> {
  protected parentType: string;
  protected field = "__resolveType";

  constructor(args: UnionTypeResolverArgs) {
    this.parentType = args.parentType;
  }

  public getFieldName(): string {
    return this.field;
  }

  public resolve(type: ArgsType): ReturnType {
    return this.resolver(type);
  }

  protected abstract resolver(type: ArgsType): ReturnType;
}

export { UnionTypeResolver };
