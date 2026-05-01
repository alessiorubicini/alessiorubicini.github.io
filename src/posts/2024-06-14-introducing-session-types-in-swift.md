---
title: "Introducing Session Types in Swift"
date: 2024-06-14
description: "Exploring how session types can bring formal verification and type safety to concurrent Swift protocols, and introducing my custom implementation library."
tags:
  - swift
  - concurrency
  - distributed-systems
  - open-source
---

Let’s face it: concurrent Swift code can either be a smooth symphony of functionality or a tangled mess of callbacks and closures. If you’ve ever gotten lost in a labyrinth of `async/await` complexity, then this article is for you.

Buckle up, because we’re about to take a joyride into the world of **Session Types** with my very own library! We’ll explore how they can tame the wild async beast and bring much-needed structure to your concurrent code, all while avoiding any metaphors involving disturbing amounts of pasta 🍝.

### What are Session Types?

Concurrent programs, where multiple processes run in parallel across a single machine or a distributed system, rely heavily on communication for coordination. These interactions follow specific protocols that define the allowed sequences of message exchanges. Managing these protocols correctly is crucial, but notoriously challenging.

**Session Types**, born from the field of process typing and rooted in π-calculus, provide a formal way to specify and verify these communication protocols. They act as a type system specifically for communication channels, ensuring messages are exchanged in the correct order and format. Think of them as **“types for protocols.”**

Session types specify:
1. **Message Types**: What kind of data can be sent and received?
2. **Message Order**: In what sequence must messages be exchanged?
3. **Session Termination**: When can a communication session be safely closed?

By describing a protocol as a type, we enable verification during the usual type checking performed by the compiler. This prevents errors like type mismatching, deadlocks, and starvation.

#### Core Concepts

*   **Duality**: Duality ensures that for every *send* action in one party’s protocol, there is a corresponding *receive* action in the other. If Tim uses `!int.?bool.end` (Send Int, Receive Bool, End), Craig must use `?int.!bool.end`. This synchronization guarantees the protocol is followed correctly from both perspectives.
*   **Linearity**: Linearity ensures that each communication endpoint is consumed exactly once. If this principle fails, resources could be used multiple times or not at all, leading to potential deadlocks or resource leaks.

### Swift Sessions: A Library for Binary Session Types

As a Swift lover, I centered my bachelor’s degree thesis on this concept. The goal was to test Swift’s type system (literally abuse it) and attempt to implement session types natively.

With the help of my supervisor, **prof. Luca Padovani**, I developed a library that successfully implements session types for asynchronous communications between two processes.

#### Example Usage

Let's see how a simple "Even Checker" protocol looks using the library:

```swift
await Session.create { e in
    // Client Side
    await Session.send(42, on: e) { e in
        await Session.recv(from: e) { isEven, e in
            Session.close(e)
            print("Is 42 even? \(isEven)")
        }
    }
} _: { e in
    // Server Side
    await Session.recv(from: e) { num, e in
        await Session.send(num % 2 == 0, on: e) { e in
            Session.close(e)
        }
    }
}
```

#### The Advantage of Type Safety

What happens if we violate the protocol? If we try to send a `String` where the protocol expects an `Int`:

```swift
await Session.send("42", on: e) { e in // Protocol violation!
    // ...
}
```

The compiler will immediately step in with a familiar error:
`Cannot convert value of type 'String' to expected argument type 'Int'`

The processes dictate the protocol, forcing each other to respect it by exploiting the language's own type-checking mechanisms.

### Implementation Details for the Nerdy ones 🤓

*   **Communication Layer**: Built on top of Apple’s **Swift Async Algorithms** library, specifically `AsyncChannel`. This allows for secure, non-blocking data transfer between concurrent activities.
*   **Endpoints**: The library uses `Endpoint<A, B>` objects. An endpoint can either send type `A` or receive type `B`, but never both at once, ensuring protocol compliance.
*   **Linearity Checking**: In the current implementation, linearity is checked dynamically at runtime. Endpoints verify they are used exactly once.
*   **Programming Styles**: The library supports both direct continuation passing and closure-based syntax. The closure-based approach (shown above) offers the benefit of **complete type inference ✨**.

### The Future: Swift 6.0 and Non-copyable Types

You might be wondering: *"Why check linearity at runtime? Just use non-copyable types!"*

That was exactly our goal. However, in Swift 5.10, non-copyable types had limitations regarding generic types and tuples—both of which are central to this library's architecture. 

With the arrival of **Swift 6.0**, many of these limitations are being lifted. I am eagerly looking forward to refactoring the library to use native `~Copyable` constraints for compile-time linearity verification!

> [!TIP]
> You can find the full research and the library implementation on my GitHub. Feel free to explore the code and see how far we pushed the Swift type system!