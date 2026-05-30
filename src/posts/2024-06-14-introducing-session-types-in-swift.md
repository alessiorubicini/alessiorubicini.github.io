---
title: "Introducing Session Types in Swift"
date: 2024-06-14
description: "Exploring how session types can bring formal verification and type safety to concurrent Swift protocols."
tags:
  - swift
  - concurrency
  - session types
  - open-source
---

Swift async code can get messy fast. If you've struggled with callback hell or tangled async/await logic, this article should help. I built a library for session types that might actually make your concurrent code easier to reason about.

We'll look at how session types can structure your async Swift code better. The main benefit is stronger type safety, you catch bugs before runtime instead of chasing them down later.

## What are Session Types?

Concurrent programs, where multiple processes run in parallel on a single machine or across a distributed system, rely heavily on communication for coordination. These interactions follow specific protocols that define the allowed sequences of message exchanges. Managing these protocols correctly and securely is crucial for distributed systems and network communication, and it can be challenging.

Session types, born from the field of process typing and rooted in π-calculus, provide a formal way to specify and verify these communication protocols. They act as a type system specifically for communication channels, ensuring messages are exchanged in the correct order and format. Think of them as "types for protocols."

Session types define the structure, flow, and behavior of communication between processes. They specify:

- **Message Types**: What kind of data can be sent and received?
- **Message Order**: In what sequence must messages be exchanged?
- **Session Termination**: When can a communication session be closed?

By describing a communication protocol as a type, session types enable verification during usual type checking performed by the compiler. This upfront check helps prevent errors like type mismatching, deadlocks, livelocks or starvation, leading to more robust and reliable distributed systems.

## Never Heard of It...

If you've never heard of session types, that's normal. This is a concept born and explored in recent decades, and reserved for a limited set of languages ​​with particular functionality. Suffice it to say that there are very few programming languages ​​that natively support session types, such as MOOL (Mini Object-Oriented Language) or ATS (Authenticated Typed Script). And existing library implementations are usually targeted at languages ​​like Haskell and OCaml.

## A Brief Example

Let's take two people: Tim and Craig (no pun intended). Tim wants to know if a certain integer is even. Craig is the person who can calculate whether a number is even or not. We model the communication session between the two as follows.

Tim will use an endpoint where in sequence he can send an integer, receive a boolean and terminate the communication; the type of this endpoint will be `!int.?bool.end`.

Craig will use an endpoint where he can sequentially receive an integer, send a boolean and end communication; so the type of this endpoint will be something like `?int.!bool.end`.

Here we use a minimal syntax where:

- `!T.S` means Send a value of type T and proceed with the protocol described by S;
- `?T.S` means Receive a value of type T and proceeds with the protocol described by S;
- `end` means end of communication.

Thus we described the session endpoints that Tim and Craig use to communicate as datatypes.

## Duality

From this example it's already possible to understand one of the fundamental properties of session types, duality. Duality establishes a correspondence between the actions performed within a session, ensuring that each party adheres to the same communication protocol from a complementary perspective. Formally, duality dictates that for every send action in one party's protocol, there is a corresponding receive action in the other party's protocol.

This mutual dependence, which obviously applies not only to the sending and receiving primitives but also to all the others, guarantees that communication proceeds in a synchronized and well-defined way, and that the protocol is followed correctly.

## Linearity

Another fundamental concept in the context of session types is linearity, which is crucial to guarantee the correct management of resources and communication endpoints. Linearity ensures that linear resource usage is enforced, i.e. that each communication endpoint is consumed (used) exactly once during a session.

If this principle were to fail, resources could be used multiple times or not used at all, causing potential errors such as deadlocks.

## A Library for Binary Session Types in Swift

As a crazy Swift lover, I couldn't help but center my bachelor's degree thesis on it. The goal was to test Swift's type system (literally abuse it) and attempt to implement session types into the language.

In the last two months, with the help of my supervisor, prof. Luca Padovani, author of various papers on the topic as well as developer of a session types library for OCaml, I have developed a library called [Swift Sessions](https://github.com/alessiorubicini/SwiftSessions) that successfully implements session types for asynchronous communications between two processes.

Without delving into implementation details (for now), Swift Session provides the primitives, endpoints and channels needed to implement such structured communication sessions. Let's see an example of how to use it:

```swift
await Session.create { e in
    // One side of the communication channel
    await Session.send(42, on: e) { e in
        await Session.recv(from: e) { isEven, e in
            Session.close(e)
        }
    }
} _: { c in
    // Another side of the communication channel
    await Session.recv(from: e) { num, e in
        await Session.send(num % 2 == 0, on: e) { e in
            Session.close(e)
        }
    }
}
```

In this example, we initialize a communication session between two processes: one sends a number (42 😏) and expects to receive a boolean, then closes the communication. The other process receives the integer, and sends true or false if the number is even or not, and then closes the communication too.

Where is the advantage of session types? If in the first process we send 42 as a string instead of an integer, the second one will be in a protocol violation as it is treating what it received as an integer when it is actually a string:

```swift
await Session.create { e in
    // One side of the communication channel
    await Session.send("42", on: e) { e in
        await Session.recv(from: e) { isEven, e in
            Session.close(e)
        }
    }
} _: { c in
    // Another side of the communication channel
    await Session.recv(from: e) { num, e in
        await Session.send(num % 2 == 0, on: e) { e in  // ERROR!
            Session.close(e)
        }
    }
}
```

Thus we'll get a compile-time error saying:

```
Cannot convert value of type 'String' to expected argument type 'Int'
```

The processes dictate the protocol, forcing each other to respect it by exploiting the language type checking.


![I don't trust anyone](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnA0cHB3cHdyeWZ4aDhraG80Y2I5YzBkazRyMjVsZXNrN2Uxc3FwbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l46Cgwa9YZNNrEQla/giphy.gif)

## Some details for the nerdier ones

For those of you who are more nerdy and want to know the implementation details of this library, here they are.

The underlying communication channel between processes is implemented via the AsyncChannel of [Apple's Swift Async Algorithms](https://github.com/apple/swift-async-algorithms) library. It allows us to create an asynchronous channel as a means of transferring data between threads in a secure and asynchronous way, thus allowing us to send and receive values ​​between concurrent activities without blocking the threads.

Processes do not interface directly with the asynchronous channel but uses a series of Endpoint objects specifically designed to guarantee compliance with the protocol and linear use of resources. An endpoint is an object of the type `Endpoint<A, B>`, i.e. a session endpoint with which it's possible to send objects of type A and receive objects of type B. An endpoint never allows both operations.

Linearity is dynamically checked at run-time through specific checks within the endpoints that verify whether each endpoint has been used once and only once.

The library provides two different programming styles: one involves direct passing of continuation endpoints, the other uses closures (as in the example above). Each one has its own pros and cons. The main pro of closures is complete type inference ✨.

Sessions can be initialized via a client/server structure so that a process can be reused multiple times with the same serve protocol.

## Dear Swift 6.0

Some of you may be thinking: "Why are you checking linearity dynamically? Just use noncopyable types!".

You're right, and that's what we tried to do. Unfortunately, in the current version of Swift (5.10), non-copyable types still have many limitations, including a lack of support for tuples and generic types, which we make extensive use of in the library.

But recently Apple held WWDC24, the annual conference for developers, and presented Swift 6.0, which includes various new features including [improvements to non-copyable types](https://developer.apple.com/wwdc24/10170). So we eagerly await its arrival!