import {
  ApolloServerPlugin,
  GraphQLRequestContextWillSendResponse,
  GraphQLRequestListener,
} from "apollo-server-plugin-base";
import { GraphQLFormattedError } from "graphql";
import { BaseContext } from "../../api/lib/context";

export enum Severity {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

export interface GraphQLFormattedMyError
  extends Mutable<GraphQLFormattedError> {
  originalError?: any;
  extensions: {
    exception: Omit<MyError, "stack"> & { stacktrace?: string[] };
  };
}

class MyError extends Error {
  message: string;
  clientMessage: string;
  severity: Severity;
  debugInformation?: Object;

  constructor(args: {
    message: string;
    clientMessage?: string;
    severity: Severity;
    debugInformation?: Object;
  }) {
    super(args.clientMessage ?? args.message);
    this.message = args.message;
    this.clientMessage = args.clientMessage ?? args.message;
    this.debugInformation = args.debugInformation;
    this.severity = args.severity ?? Severity.HIGH;
  }
}

const isGraphQLFormattedMyError = (
  error: GraphQLFormattedError
): error is GraphQLFormattedMyError => {
  return !!(error.extensions?.exception as MyError)?.clientMessage;
};

const handleError = (
  error: Mutable<GraphQLFormattedError>,
  context: BaseContext
): GraphQLFormattedError => {
  if (isGraphQLFormattedMyError(error)) {
    const errorDetails = {
      userId: context.userId ?? "anonymous",
      friendlyMessage: error.extensions.exception.clientMessage,
      ...error.extensions.exception.debugInformation,
    };

    if (error.extensions.exception.severity === Severity.HIGH) {
      console.error(error.message, errorDetails);
      // Triage high priority errors. This should ping an on-call developer or something similar
      triageClient.captureHighPriority(error);
    }

    if (error.extensions.exception.severity === Severity.MEDIUM) {
      console.error(error.message, errorDetails);
      // Triage medium priority errors. These can be recorded somewhere and dealt with during working hours
      triageClient.captureMediumPriority(error);
    }

    if (error.extensions.exception.severity === Severity.LOW) {
      console.warn(error.message, errorDetails);
      // No need to triage on low severity errors
    }

    error.message = error.extensions.exception.clientMessage;

    return error;
  }

  // If the error isn't an instant of MyError then we have to assume the worst
  console.error("Something went wrong!", {
    userId: context.userId ?? "anonymous",
    message: error.message,
  });
  triageClient.captureHighPriority(error);

  error.message = "Something went wrong!";

  return error;
};

function handleErrorsPlugin(): ApolloServerPlugin {
  return {
    requestDidStart: async (): Promise<GraphQLRequestListener<BaseContext>> => {
      return {
        willSendResponse: async ({
          response,
          context,
        }: GraphQLRequestContextWillSendResponse<BaseContext>): Promise<void> => {
          if (response.errors) {
            response.errors = response.errors.map((error) =>
              handleError(error, context)
            );
          }
        },
      };
    },
  };
}

interface CaptureExceptionOptions {
  priority?: Severity;
}

// Such as Sentry
class TriageClient {
  captureHighPriority(
    error: Error | unknown,
    options?: CaptureExceptionOptions
  ): void {
    // Stub client
    return;
  }
  captureMediumPriority(
    error: Error | unknown,
    options?: CaptureExceptionOptions
  ): void {
    // Stub client
    return;
  }
  captureLowPriority(
    error: Error | unknown,
    options?: CaptureExceptionOptions
  ): void {
    // Stub client
    return;
  }
}

const triageClient = new TriageClient();

export { TriageClient, triageClient };

export { MyError, handleErrorsPlugin };
