# 7 Tips for Writing Better Resolvers

## Summary

This project was used as demo code for a talk at GraphQL Summit 2022 in San Diego! While this project does start up and accept GraphQL requests, it's meant for demo purposes of the code patterns and not intended to be a "template" for starting a new project.

The talk itself covered 5 tips: Start with a good architecture, Wrap your resolver, Use inheritance (via a BaseResolverClass), Think about authorization, and automate Logging.

I will link to that talk here once it is posted online!

This project conforms to a general "layered" architecture. You'll find all the GraphQL code in the `src/api` layer. The API layer only communicates with the `src/domain` layer in a very basic way, this keeps all business logic out of your resolvers!

Since 7 tips turned out to be too much to cover in 20 minutes (oops!) I will cover the last two tips with an explanation below and some comments in the code to help guide you!

### 6. Error Handling

Since error handling is high stakes and we want to guarantee that we always handle errors properly, even weird unexpected ones, I use a plugin for this. The plugin ties into the `requestDidStart.willSendResponse` lifecycle event. You can find this plugin in `src/domain/lib/errors.ts`.

The basic goal of our error handling should be:

1. Errors should be consistent. They should always have the same shape and have consistent information.
1. We should never return a weird unexpected code error to the client. Any unexpected errors that do not have a nice error message should default to "Something went wrong".

One of the key aspects of any good error handling system is creating a custom error type that works for you. I created `MyError` as an example. It has a good shape for taking in data in code, so it's easy to work with, and it stores enough data in it for it to be useful in my plugin when I'm determining what to show to the client.

In our code, we should ALWAYS be throwing MyError. That tells our plugin "hey this error is something that I expected" and allows the plugin to show a good error message to the client. If our plugin EVER receives an error that is not MyError, then that means we are handling an unexpected error, and we have NO IDEA what that error message could be. It could be an SQL error, it could be some underlying library error, it could say anything. We certainly don't want our client to display that, so we must just display "Something went wrong"

Error handling is a very complex topic, this is meant to get you on the right path. You'll have to figure out all the specific edge cases for your system!

### 7. Error Triaging

Now that we are handling errors consistently and making sure our client never displays garbage errors, we should probably dig into why we are getting garbage errors in the first place. You can see the error triaging mock library in the `src/domain/lib/errors.ts` where I use the `triageClient.captureHighPriority` method, which is based off of [Sentry](https://sentry.io).

The main strategy I deploy, given the above error handling code we already have, is to triage a the error to a developer when either the error severity is HIGH OR it is an unexpected error. These two options mean either we KNOW that the error is very severe and needs to be looked at, or we have NO IDEA how severe the error is so we need someone to look at it just in case.

Triaging unexpected errors can be noisy and exhausting at first, but if every time you get an unexpected error you go an handle it properly (Fix the issue, or wrap code in a try/catch to de-escalate the severity) then it doesn't take very long for you to end up in a good place.
