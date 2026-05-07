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

The landscape of artificial intelligence is evolving quickly, and Apples introduction of the Foundation Models framework at WWDC25 marks a meaningful shift: generative AI is no longer confined to the cloud; it lives directly on the users device.

This framework gives developers direct access to Apples on-device large language model through a clean, native Swift API. The model is designed for a wide spectrum of tasks - summarization, entity extraction, text understanding, and refinement - while also being capable of creative generation, such as dynamic dialogue or even producing full Swift data structures through *guided generation*. It can also act autonomously, invoking custom code (“tools”) to perform specialized tasks within an app.

## Why On-device AI matters

A fundamental principle of Apple’s approach to Generative AI is its commitment to user privacy. A cornerstone of the Foundation Models framework is that all user data remains strictly on-device, never being transmitted to external servers. This design choice is critical for user trust and ensuring security in an era where data privacy is so important.

This strategic emphasis on privacy, coupled with the framework’s cost-free AI inference for developers, offers a compelling, high-performance solution that inherently respects user data. This approach suggests a long-term vision where AI is deeply integrated into the user’s personal device experience, rather than being a remote, server-dependent service.

Beyond privacy, the on-device nature of these models also delivers substantial performance advantages. The framework is characterized by low latency and high responsiveness, further enhanced by its support for streaming results. Crucially, the models operate entirely offline, eliminating any dependency on internet connectivity for their core AI functionalities. This ensures that intelligent features remain available and performant regardless of network conditions. Moreover, the on-device model is embedded directly into the operating system, which means integrating it into applications adds no additional size to the app bundle.


## The Itinerary Planner Example

To illustrate the practical application of the Foundation Models framework, this article will frequently reference Apple’s WWDC sessions, in particular [Code-along: Bring on-device AI to your app using the Foundation Models framework - WWDC25](https://developer.apple.com/videos/play/wwdc2025/259/?source=post_page-----2bebc059db06---------------------------------------), the one about the itinerary planner example. This demonstration application serves as a compelling example of how on-device AI can be leveraged to create dynamic and intelligent user experiences.


## Language Model Session

The `LanguageModelSession` stands as the central component for interacting with Apple's on-device LLM. It’s a stateful object that orchestrates the conversation flow and manages contextual information.

Creating and prompting a Language Model Sessions is as easy as that:

```swift
import FoundationModels

let session = LanguageModelSession()
let response = try await session.respond(to: "Tell me a joke.")
```

Each `LanguageModelSession` maintains a `Transcript`, a record of all prompts and responses exchanged within that specific session. This transcript is essential for debugging purposes and for displaying the conversation history within a user interface, providing continuity to the interaction.

The stateful nature of the session means that the model retains memory of prior interactions, allowing for more coherent and contextually aware responses over time.


## Instructions vs Prompts

To effectively guide the LLM, the Foundation Models framework differentiates between instructions and prompts, each serving a distinct purpose in shaping the model’s behavior.

**Instructions** are custom directives provided during the initialization of a LanguageModelSession. Instructions define the model's overarching purpose, persona, or specific guidelines that apply to the entire duration of that session.


```swift
let session = LanguageModelSession(instructions: Instructions {
    "Your job is to create an itinerary for the user."
    "Each day needs an activity, hotel and restaurant."
})
```

Importantly, instructions are always included as the very first entry in the session’s transcript, setting the foundational context for all subsequent interactions.

In contrast to instructions, **prompts** are the specific user inputs or questions delivered to the model within an active session, typically via methods like `respond(to:)`.

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

## Sessions and Context Windows

The effective management of conversation flow is critical for a smooth user experience, and the `LanguageModelSession` provides mechanisms to handle this through its transcript and context window.

As previously mentioned, the `Transcript` is a complete record of all `respond(to:)` calls, encompassing both prompts and the model's responses. This historical record is vital for maintaining conversational continuity, allowing the model to build upon previous turns in a dialogue. It also serves as a valuable tool for debugging and for displaying the conversation history in the application's user interface.

Each session operates under a context window limit, which dictates the maximum size its transcript can reach. If this limit is exceeded due to a large number of requests or long prompts, the session will throw an `exceededContextWindowSize` error.

This constraint is a direct reflection of the inherent resource limitations of all Large Language Models, particularly when operating on-device.


### Recovery Strategies

Developers must implement robust error handling for the `exceededContextWindowSize` error to ensure a resilient user experience.

Several strategies can be employed for recovery:


1. A straightforward approach involves catching the error and **initializing a brand new session** without any prior history. While simple, this means the model will "forget" the previous conversation context, which might be undesirable for continuous interactions.

```swift
var session = LanguageModelSession()

do {
    let answer = try await session.respond(to: prompt)
    print(answer.content)
} catch LanguageModelSession.GenerationError.exceededContextWindowSize {
    // New session, without any history from the previous session.
    session = LanguageModelSession()
}
```

2. A more refined strategy involves **selectively transferring essential entries** from the old session’s transcript to a new one. This typically includes the initial instructions and the last successful response, thereby preserving some conversational continuity without retaining the entire history.

```swift
var session = LanguageModelSession()

do {
    let answer = try await session.respond(to: prompt)
    print(answer.content)
} catch LanguageModelSession.GenerationError.exceededContextWindowSize {
    // New session, with some history from the previous session.
    session = newSession(previousSession: session)
}

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
    // Note: transcript includes instructions.
    return LanguageModelSession(transcript: condensedTranscript)
}
```

3. For more complex scenarios involving extensive conversation history, the Foundation Models framework itself can be leveraged to **summarize portions of the transcript**. This summary can then be used as new instructions for a fresh session, allowing for a condensed form of memory to persist without exceeding context limits.



## Empowering the Model with Tools

The Foundation Models framework significantly extends the capabilities of the on-device LLM through tools. Tools enable the model to interact with external information and perform actions autonomously, leading to highly personalized experiences within an application.

### Defining and Using Custom Tools

Tools are particularly valuable for integrating private, on-device data, such as information from a user’s Contacts or Calendar, allowing the model to leverage this context without compromising user privacy.

Tools are instantiated and passed into theLanguageModelSession initializer, granting the model the discretion to decide when to invoke them based on the ongoing conversation.

### Tool Definition

To define a custom tool, developers must conform to the Tool protocol. Each tool requires some key components:

- **name**: A short, readable English name (like `findContact` or `findPointsOfInterest`). Abbreviations should be avoided to ensure clarity for the model.
- **description**: A concise, typically one-sentence explanation of the tool's functionality. This description is automatically included in the prompt provided to the model, helping it determine when and how to invoke the tool. It’s important to keep this description brief, as its length can affect latency.
- **Input Arguments**: The arguments a tool expects are defined using a Swift struct that is marked with the `@Generable` macro. When the model decides to call a tool, it autonomously generates these input arguments, and the use of `@Generable` ensures that the tool receives valid, type-safe input, eliminating the need for manual parsing.
- **`call` function**: The core logic of the tool resides within its call function, which is an `async throws` method. This function is invoked by the model when it determines that the tool is necessary to fulfill a request. Within call, developers can interact with external APIs (such as MapKit or the Contacts API) to retrieve or process data. The `LanguageModelSession` will pause its generation process, awaiting the return of the tool's call function before producing further output.

The itinerary planner example effectively demonstrates tool calling by fetching relevant points of interest for a chosen landmark.

```swift
import FoundationModels

final class FindPointsOfInterestTool: Tool {
    let name = "findPointsOfInterest"
    let description = "Finds points of interest for a landmark."

    @Generable
    struct Arguments {
        @Guide(description: "This is the type of destination to look up for.")
        let pointOfInterest: Category

        @Guide(description: "The natural language query of what to search for.")
        let naturalLanguageQuery: String
    }

    func call(arguments: Arguments) async throws -> ToolOutput {
        // This sample app pulls some static data. Real-world apps can get creative.
        await recordLookup(arguments: arguments)
        let results = mapItems(arguments: arguments)
        return ToolOutput(
            "There are these \(arguments.pointOfInterest) in \(landmark.name): \(results.joined(separator: ", "))"
        )
    }
    
    ...
}
```

The ability of tools to enable the LLM to autonomously access external information and perform actions represents a significant advancement. This transforms the on-device LLM from a passive text generator into a dynamic agent capable of interacting with the real world.

By integrating app-specific logic and real-world data such as user contacts, calendar events, or MapKit data, the model can provide highly personalized and contextually relevant responses.


## Handling responses: static vs streaming

The Foundation Models framework offers distinct approaches for receiving responses from the on-device model, each optimized for different user experience and integration requirements. Developers can choose between receiving a complete, static response or a dynamic, streaming response.

When the `respond` method is used, the model processes the entire prompt and generates the complete output before delivering it as a single, final response. This approach is suitable when the complete output is required before proceeding with further application logic or UI updates, and the latency associated with waiting for the full response is acceptable.

The other approach is based on streaming. Unlike traditional token-based delta streaming, which delivers raw text chunks, the framework streams “snapshots” of the partially generated response. These snapshots represent the response as it is being constructed, with properties that are initially optional and incrementally filled in as the model generates more content.

The `streamResponse` method returns an `async sequence` where each element is an instance of a PartiallyGenerated type. This `PartiallyGenerated` type is automatically created by the @Generable macro and mirrors the original `@Generable` struct, but with all its properties marked as optional.

```swift
final class ItineraryPlanner {

    private(set) var itinerary: Itinerary.PartiallyGenerated?
    private var session: LanguageModelSession

    func suggestItinerary(dayCount: Int) async throws {
        
        let stream = session.streamResponse(
            generating: Itinerary.self,
            options: GenerationOptions(sampling: .greedy),
            includeSchemaInPrompt: false
        ) {
            "Generate a \(dayCount)-day itinerary to \(landmark.name)."
            
            "Give it a fun title and description."
            
            "Here is an example, but don't copy it:"
            Itinerary.exampleTripToJapan
        }

        for try await partialResponse in stream {
            itinerary = partialResponse
        }
    }

    ...

}
```

```swift
struct LandmarkTripView: View {
    
    @State private var requestedItinerary: Bool = false
    @State private var planner: ItineraryPlanner?

    ScrollView {
        if !requestedItinerary {
            LandmarkDescriptionView(
                landmark: landmark
            )
        } else if let itinerary = planner?.itinerary {
            ItineraryView(landmark: landmark, itinerary: itinerary).padding()
        } else if let planner {
            ItineraryPlanningView(landmark: landmark, planner: planner)
        }
    }

    ...
}
```

Streaming transforms perceived latency into a more engaging user experience. By displaying partial results as they become available, applications can provide immediate feedback, making the generation process feel more dynamic and interactive.


## Best practices for streaming

The itinerary planner example effectively leverages streaming to display the itinerary as it is being generated, providing a responsive and fluid user experience.

Developers are encouraged to use SwiftUI animations and transitions creatively to visually mask latency and enhance the user experience. This transforms moments of waiting into delight, making the generation process feel more polished and enjoyable.

```swift
struct ItineraryView: View {
    let landmark: Landmark
    let itinerary: Itinerary.PartiallyGenerated

    VStack(alignment: .leading) {
        if let title = itinerary.title {
            Text(title)
                .contentTransition(.opacity)
                .font(.largeTitle)
                .fontWeight(.bold)
            }
    }
    .animation(.easeOut, value: itinerary)
    
    ...
}
```

Careful consideration should be given to view identity in SwiftUI, especially when generating arrays, to ensure smooth and predictable UI updates as new elements stream in.

It’s important to be aware that properties of a `Generable` type are **generated in the order they are declared** in the Swift struct. This order can influence both UI animations and the overall quality of the model's output. For example, placing summary properties last in a struct might lead to better results as the model has processed all preceding information.


## Structured output with guided generation

Guided Generation is a powerful feature within the Foundation Models framework that allows developers to define the precise structure of the model’s output, ensuring type-safe and predictable results.

Traditionally, obtaining structured output from an LLM often involved crafting elaborate text prompts and then relying on fragile parsing mechanisms to extract the desired data. Guided generation fundamentally changes this by enabling the model to automatically create instances of developer-defined data structures, such as Swift structs or enums.

This eliminates the need for manual parsing of the model’s output, which significantly streamlines the integration of AI-generated content into application logic and ensures type-safe results, reducing potential runtime errors.

## Defining Your Data Structures

To leverage guided generation, developers apply the `@Generable` macro to their Swift struct or enum definitions.

The primary requirement for a type to be `Generable` is that all its properties must also be of `Generable` types. Common Swift types like `String` are `Generable` by default, and the protocol seamlessly supports nested `Generable` types, allowing for the definition of complex data hierarchies.

At compile time, the `@Generable` macro generates a schema that the model uses to produce the expected structured output. It also automatically generates an initializer that is invoked when a request is made to a session, handling the parsing of the generated text directly into a type-safe Swift object.

The itinerary planner example heavily relies on `@Generable` for its core data structures, demonstrating how complex, hierarchical information can be reliably generated by the model.

```swift
import Foundation
import FoundationModels

@Generable
struct Itinerary: Equatable {
    @Guide(description: "An exciting name for the trip.")
    let title: String
    @Guide(.anyOf(ModelData.landmarkNames))
    let destinationName: String
    let description: String
    @Guide(description: "An explanation of how the itinerary meets the user's special requests.")
    let rationale: String
    
    @Guide(description: "A list of day-by-day plans.")
    @Guide(.count(3))
    let days: [DayPlan]
}
```


### Constraining output

While @Generable defines the structure, the @Guide macro provides granular control over the values of individual properties within your Generable types. This allows developers to impose specific constraints on the model's output, leading to more precise and predictable results.

The @Guide macro can be used to:
- Provide additional context or a specific prompt to the model about the desired output for that particular property, using the `.description` parameter.
- Restrict a property's value to a predefined array of options, ensuring the model's output falls within acceptable choices, using the `.anyOf` parameter.
- Ensure that an array property contains a specific number of elements, using the `.count` parameter.
- For `String` properties, constrain the output to match a specified regular expression pattern, ensuring format adherence.
- For `Int` types, define minimum, maximum, or a specific range for numerical properties.

Multiple `@Guide` macros can be applied to a single property, allowing for the combination of different constraints to achieve highly specific output requirements.

The `DayPlan` structure from the itinerary planner example illustrates the use of the `@Guide` macro, as well as the previous Itinerary structure.

```swift
@Generable
struct DayPlan: Equatable {
    @Guide(description: "A unique and exciting title for this day plan.")
    let title: String
    let subtitle: String
    let destination: String

    @Guide(.count(3))
    let activities: [Activity]
}
```



## Controlling generation behavior

Developers have the possibility to fine-tune the model’s output characteristics using GenerationOptions, allowing for a precise balance between creativity and determinism in the generated content.

The `GenerationOptions` API provides specific parameters that control how the on-device model generates its responses. These options empower developers to customize the output style, ensuring that the AI's contributions align perfectly with the application's context and user expectations.

Two primary parameters within `GenerationOptions` dictate the nature of the generated output: sampling and temperature.

### Sampling

Sampling defines how the model picks tokens when generating a response.

By default, the model employs random sampling. In this mode, the model generates output one token at a time by creating a probability distribution for each token in its vocabulary. It then selects tokens within a certain probability range, which leads to varied and often creative output for the same prompt. This non-deterministic behavior is ideal for tasks requiring creativity or diverse responses.

Alternatively, developers can set sampling to .greedy. Greedy sampling produces deterministic output, meaning that for an identical prompt and an identical session state, the model will consistently generate the same output.

```swift
// Deterministic output
let response = try await session.respond(
    to: prompt,
    options: GenerationOptions(sampling: .greedy)
)
```

### Temperature

Temperature is a parameter that is adjusted when random sampling is in use. It directly influences the randomness or "creativity" of the generated output.

A **lower temperature** value (like 0.5) results in output that varies only slightly, making the responses more predictable, focused, and often more factual.

```swift
// Low-variance output
let response = try await session.respond(
    to: prompt,
    options: GenerationOptions(temperature: 0.5)
)
```

Conversely, a higher temperature (like 2.0) leads to wildly different and more creative outputs, making it suitable for brainstorming, generating diverse content, or creating dynamic narratives.

```swift
// High-variance output
let response = try await session.respond(
    to: prompt,
    options: GenerationOptions(temperature: 2.0)
)
```


## Error handling and availability

Building robust applications with Foundation Models framework necessitates a clear understanding of its error handling mechanisms, how to check for model availability, and how to manage language support.

### Model Availability

The on-device Foundation Model is an integral component of Apple Intelligence. For the Foundation Models framework to operate, Apple Intelligence must be enabled by the user and supported by its device.

Developers can proactively check the model’s availability status using `SystemLanguageModel.default.isAvailable` and `SystemLanguageModel.default.availability`. This API provides detailed status cases, including `.available`, `.unavailable(.appleIntelligenceNotEnabled)`, `.unavailable(.deviceNotEligible)`, and `.unavailable(.modelNotReady)`.

This granular information allows applications to adapt their behavior and provide precise user guidance.


The model depends on Apple Intelligence being enabled and supported.

```swift
private let model = SystemLanguageModel.default

switch model.availability {
    case .available:
        LandmarkTripView(landmark: landmark)

    case .unavailable(.appleIntelligenceNotEnabled):
        MessageView(
            landmark: self.landmark,
                message: """
                      Trip Planner is unavailable because \
                      Apple Intelligence has not been turned on.
                """
            )

    case .unavailable(.modelNotReady):
        MessageView(
            landmark: self.landmark,
            message: "Trip Planner isn't ready yet. Try again later."
        )

    default:
        ScrollView {
            LandmarkDescriptionView(
                landmark: landmark
            )
        }
        .headerStyle(landmark: landmark)
}
```

### Addressing Unsupported Languages

The `unsupportedLanguageOrLocale` error is thrown when the input language is not supported by the model. To enhance the user experience, an API is available to proactively check if a specific language is supported.

This enables developers to display a disclaimer or guide the user toward a supported language before an error occurs, preventing unexpected interruptions.

```swift
var session = LanguageModelSession()

do {
    let answer = try await session.respond(to: userInput)
    print(answer.content)
} catch LanguageModelSession.GenerationError.unsupportedLanguageOrLocale {
    // Unsupported language in prompt.
}

let supportedLanguages = SystemLanguageModel.default.supportedLanguages
guard supportedLanguages.contains(Locale.current.language) else {
    // Show message
    return
}
```
## Conclusion

Honestly, for us developers, this is a game-changer. We’re talking about bringing powerful, generative AI directly onto our users’ devices. Ultimate privacy, no internet needed, and seriously fast performance.

I’m absolutely going crazy with dozens of ideas, and I’ve already started dreaming up some cool new features for my own apps. But what I’m really excited about is seeing what all of us, the incredible Apple developer community, are going to create with these tools.