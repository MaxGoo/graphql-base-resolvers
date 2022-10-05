"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingPlugin = void 0;
function loggingPlugin() {
    return {
        requestDidStart: async (requestContext) => {
            console.log(requestContext.operationName ?? "unnamed request", {
                userId: requestContext.context.userId ?? "anonymous",
                query: requestContext.request.query,
            });
        },
    };
}
exports.loggingPlugin = loggingPlugin;
//# sourceMappingURL=logging.js.map