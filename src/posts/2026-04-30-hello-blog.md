---
title: "Hello, Blog — Building with Swift and SwiftUI"
date: 2026-04-30
description: "Kicking off the blog with a look at what I plan to write about — Swift, SwiftUI, Apple platform development, and the craft of building thoughtful iOS apps."
tags:
  - swift
  - swiftui
  - meta
---

After years of publishing on [Medium](https://alessiorubicini.medium.com/), I've decided to add a proper blog to this site. It felt right to have a space that's fully mine — no algorithm, no paywall, just writing.

## What this blog is about

My focus is Apple platform development: Swift, SwiftUI, the frameworks that ship with every new iOS and macOS release, and the product thinking that goes into building apps that feel human.

I'll write about things I'm learning, patterns I find useful, and mistakes worth documenting. Occasionally I'll share notes on design and the philosophy behind building things that matter.

## A taste of what's coming

Here's a Swift snippet to kick things off — a clean way to debounce an async task using `Task`:

```swift
import Foundation

actor Debouncer {
    private var task: Task<Void, Never>?
    private let duration: Duration

    init(duration: Duration) {
        self.duration = duration
    }

    func schedule(_ operation: @escaping @Sendable () async -> Void) {
        task?.cancel()
        task = Task {
            try? await Task.sleep(for: duration)
            guard !Task.isCancelled else { return }
            await operation()
        }
    }
}

// Usage
let debouncer = Debouncer(duration: .milliseconds(300))

// Inside a view model
func onSearchQueryChanged(_ query: String) {
    Task {
        await debouncer.schedule {
            await self.performSearch(query)
        }
    }
}
```

Swift's structured concurrency makes this pattern much cleaner than the old `DispatchWorkItem` approach. The `actor` ensures safe access to the stored task, and `Task.sleep(for:)` uses the modern `Duration` type introduced in Swift 5.7.

## A note on Shiki

The code block above is highlighted at build time using [Shiki](https://shiki.matsu.io/), which means zero client-side JavaScript for syntax highlighting. The theme automatically adapts to your system's light or dark mode preference.

More posts coming soon.
