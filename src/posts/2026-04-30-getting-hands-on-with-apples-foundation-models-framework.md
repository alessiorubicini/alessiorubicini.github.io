---
title: "Getting Hands-on with Apple’s Foundation Models Framework"
date: 2026-04-30
description: "An in-depth exploration of Apple’s Foundation Models framework, covering on-device AI, LanguageModelSession, tools, streaming, and guided generation for building intelligent Swift apps."
tags:
  - swift
  - apple
  - ai
  - foundation-models
---

The landscape of artificial intelligence is evolving quickly, and Apple’s introduction of the Foundation Models framework at WWDC25 marks a meaningful shift: generative AI is no longer confined to the cloud; it lives directly on the user’s device.

This framework gives developers direct access to Apple’s on-device large language model through a clean, native Swift API. The model is designed for a wide spectrum of tasks—summarization, entity extraction, text understanding, and refinement—while also being capable of creative generation, such as dynamic dialogue or even producing full Swift data structures through *guided generation*. It can also act autonomously, invoking custom code (“tools”) to perform specialized tasks within an app.

## Why on-device AI matters

Apple’s approach is anchored in privacy. With Foundation Models, user data never leaves the device—there’s no round trip to external servers. This isn’t just a technical detail; it’s a design principle that fundamentally reshapes trust in AI-powered features.

There’s also a practical upside. On-device inference is fast, responsive, and works offline. Streaming responses further reduce perceived latency, while the integration at the OS level means zero impact on app bundle size.

Taken together, this suggests a long-term direction: AI as an intrinsic part of the personal device experience, not a remote dependency.

## The itinerary planner example

A recurring reference point is Apple’s WWDC session featuring an itinerary planner. It’s a compact but rich example of what the framework enables.

The app generates travel plans, selects points of interest via tool calling, and streams results progressively—so users can see the itinerary take shape in real time. It’s a useful mental model for understanding how the different pieces of the framework fit together.

## LanguageModelSession

At the center of everything is `LanguageModelSession`, a stateful object that manages interaction with the model.

```swift
import FoundationModels

let session = LanguageModelSession()
let response = try await session.respond(to: "Tell me a joke.")
````

Each session maintains a `Transcript`, which records all prompts and responses. This enables conversational continuity, debugging, and UI representation of chat history.

Because the session is stateful, the model retains context across interactions, producing more coherent and relevant responses over time.

## Instructions vs prompts

The framework separates *instructions* from *prompts*, and the distinction is subtle but important.

Instructions define the model’s overarching role and are set at initialization:

```swift
let session = LanguageModelSession(instructions: Instructions {
    "Your job is to create an itinerary for the user."
    "Each day needs an activity, hotel and restaurant."
})
```

They persist for the entire session and appear as the first entry in the transcript.

Prompts, on the other hand, are individual user inputs:

```swift
func respond(userInput: String) async throws -> String {
    let session = LanguageModelSession(instructions: """
        You are a friendly barista in a world full of pixels.
        Respond to the player’s question.
    """)

    let response = try await session.respond(to: userInput)
    return response.content
}
```

## Sessions and context windows

Every session operates within a context window limit. As the transcript grows, it may eventually exceed this limit, triggering an `exceededContextWindowSize` error.

This is a fundamental constraint of language models—especially on-device ones—and requires explicit handling.

### Recovery strategies

A simple approach is to reset the session:

```swift
session = LanguageModelSession()
```

More refined strategies involve preserving key parts of the transcript:

```swift
private func newSession(previousSession: LanguageModelSession) -> LanguageModelSession {
    let allEntries = previousSession.transcript.entries
    var condensedEntries = [Transcript.Entry]()

    if let firstEntry = allEntries.first {
        condensedEntries.append(firstEntry)
        if allEntries.count > 1, let lastEntry = allEntries.last {
            condensedEntries.append(lastEntry)
        }
    }

    let condensedTranscript = Transcript(entries: condensedEntries)
    return LanguageModelSession(transcript: condensedTranscript)
}
```

For more complex scenarios, you can even summarize past interactions and feed that summary into a new session as instructions.

## Empowering the model with tools

Tools extend the model beyond text generation. They allow it to interact with real data and perform actions—securely and locally.

A tool conforms to the `Tool` protocol and defines:

* A name and description
* Input arguments via `@Generable`
* A `call` function with the actual logic

```swift
final class FindPointsOfInterestTool: Tool {
    let name = "findPointsOfInterest"
    let description = "Finds points of interest for a landmark."

    @Generable
    struct Arguments {
        @Guide(description: "Type of destination.")
        let pointOfInterest: Category

        @Guide(description: "Search query.")
        let naturalLanguageQuery: String
    }

    func call(arguments: Arguments) async throws -> ToolOutput {
        let results = mapItems(arguments: arguments)
        return ToolOutput(
            "Found: \(results.joined(separator: ", "))"
        )
    }
}
```

The model decides *when* to invoke the tool. During execution, generation pauses, the tool runs, and the result is fed back into the model.

This turns the model into an agent rather than a passive generator.

## Handling responses: static vs streaming

You can retrieve responses in two ways.

### Static

```swift
let response = try await session.respond(to: prompt)
```

The full result arrives at once.

### Streaming

```swift
let stream = session.streamResponse(
    generating: Itinerary.self
) {
    "Generate a 3-day itinerary."
}

for try await partial in stream {
    itinerary = partial
}
```

Streaming delivers *snapshots* of a partially generated structure, not raw tokens. This enables responsive UIs where content appears progressively.

## Best practices for streaming

Streaming is as much a UI problem as an API one. Smooth animations and thoughtful layout changes can turn latency into something that feels intentional.

```swift
Text(title)
    .contentTransition(.opacity)
    .animation(.easeOut, value: itinerary)
```

Also, property order in `@Generable` types matters; fields are generated sequentially, which affects both output quality and UI behavior.

## Structured output with guided generation

Guided generation allows the model to produce structured Swift types directly—no parsing required.

```swift
@Generable
struct Itinerary {
    let title: String
    let description: String

    @Guide(.count(3))
    let days: [DayPlan]
}
```

The `@Generable` macro generates a schema used by the model and handles decoding automatically.

### Constraining output

The `@Guide` macro refines behavior:

* `.description` adds context
* `.anyOf` restricts values
* `.count` enforces array size
* regex and numeric constraints ensure valid formats

This combination yields predictable, type-safe results.

## Controlling generation behavior

`GenerationOptions` lets you tune how the model behaves.

### Sampling

```swift
GenerationOptions(sampling: .greedy)
```

* `.greedy`: deterministic
* default: probabilistic, more creative

### Temperature

```swift
GenerationOptions(temperature: 0.5)
```

* Low → focused, stable output
* High → diverse, creative output

## Error handling and availability

The model depends on Apple Intelligence being enabled and supported.

```swift
switch SystemLanguageModel.default.availability {
case .available:
    // Use model
case .unavailable(.appleIntelligenceNotEnabled):
    // Show message
default:
    break
}
```

You can also check supported languages to avoid runtime errors:

```swift
let supported = SystemLanguageModel.default.supportedLanguages
```

Handling `unsupportedLanguageOrLocale` gracefully improves UX significantly.

## Conclusion

This framework changes the equation. Generative AI becomes local, private, and deeply integrated into the platform.

The implications are hard to overstate: no network dependency, negligible latency, and full control over how intelligence is embedded into an app.

The most interesting part, though, isn’t the technology itself—it’s what developers will build with it. The shift from remote AI services to on-device intelligence opens a very different design space; one that feels much closer to the user, and far more personal.
