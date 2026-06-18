---
title: "Apple, Google, and the Most Misunderstood AI Partnership of 2026"
date: 2026-06-14
description: "Clarifying the details of the Apple-Google partnership at WWDC 2026, Apple Foundation Models, and the architecture of the new Siri."
tags:
  - apple
  - ai
  - technology
---

Since WWDC 2026, the timeline has been flooded with confident takes: "the new Siri is literally just Gemini," "Apple gave up on AI," or "Apple sold the company to Google." As usual, the reality is more nuanced, technically interesting, and considerably less dramatic.

Let's break it down.

## How We Got Here

On January 12, 2026, Apple and Google announced a multi-year partnership. The press release was vague enough that everyone filled in the blanks themselves, which is how we ended up with thousands of posts declaring that the iPhone is now a Google product.

What Apple [actually announced at WWDC](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models) was the third generation of Apple Foundation Models (AFM 3), a family of five models that power the new Siri, Image Playground, advanced photo editing, and most of the intelligence features coming to Apple platforms later this year. Google's involvement is real, but it's highly specific, and it's definitely not what most people think.

## What Google Actually Did

Google's role was primarily in **training**, not in running the final product. Apple used Gemini technology and Google's TPU infrastructure to distill and refine their own models. It's like using a more capable model to teach a smaller, more efficient one, a standard technique in machine learning called *knowledge distillation*. The resulting code and the model weights are Apple's. Google confirmed it receives no user data during this process, and [Craig Federighi stated explicitly](https://appleinsider.com/articles/26/06/08/apples-new-foundation-models-dont-contain-a-drop-of-gemini-as-we-said-they-wouldnt) after the keynote:

> *"We use none of the models that Google deploys to their customers, nor do we use the infrastructure and means by which they deploy models to their customers."*

So, in short: Gemini was the teacher, AFM 3 is the student, and your iPhone is running the student.

There is one exception it's worth being precise about. AFM 3 Cloud Pro, the most capable server-side model used for demanding agentic tasks and complex reasoning, [runs on NVIDIA GPUs hosted inside Google Cloud](https://9to5mac.com/2026/06/11/apples-new-foundation-models-explained-on-device-ai-cloud-ai-and-everything-in-between/). Apple extended its Private Cloud Compute (PCC) architecture to third-party infrastructure for the first time to make this work. The privacy guarantees Apple claims still apply, and Apple says these protections hold even on Google's hardware. Whether you fully trust that claim is a separate conversation, but the architecture is built around it.

## What Apple Actually Built

Here's where it gets genuinely interesting, and where the timeline completely drops the ball.

The five models in the AFM 3 family are:

- **AFM 3 Core**: The next-gen 3-billion-parameter dense on-device model for everyday tasks.
- **AFM 3 Core Advanced**: A 20-billion-parameter on-device model. This is the real story here.
- **AFM 3 Cloud**: The server-side workhorse, optimized for speed and efficiency, running on Apple Silicon via Private Cloud Compute.
- **ADM 3 Cloud (Image)**: Apple's diffusion model for image generation, editing, and Genmoji, also running on Apple Silicon servers.
- **AFM 3 Cloud Pro**: The heavyweight model for agentic tool use and complex reasoning, hosted on Google Cloud using NVIDIA GPUs.

The real engineering highlight is AFM 3 Core Advanced, and it's a legitimately novel piece of work.

### Apple's Own Technique: Instruction-Following Pruning

Running a 20-billion-parameter model on a phone is a massive challenge. Traditional dense models require keeping all 20 billion parameters active in memory at all times, which simply isn't feasible on consumer hardware.

Apple's solution isn't standard Mixture of Experts (MoE), where a router decides which expert sub-networks to activate per token. Instead, they developed a technique called **Instruction-Following Pruning**, first published in an Apple Research paper. The core idea is that [only 1 to 4 billion parameters are activated at any given time](https://www.macstories.net/linked/the-third-generation-of-apples-foundation-models-and-afm-core-advanced/), depending on the specific request. The rest stay dormant, completely unloaded from active memory.

The practical result is a 20B-class model running directly on an iPhone, fully on-device, with no cloud dependency. Apple calls it *"the first production-scale dynamic-sparse LLM that ships to consumers,"* and that description holds up. AFM 3 Core Advanced also serves as Apple's first natively multimodal on-device model, handling text, images, and voice natively. This enables higher-accuracy dictation and expressive voice synthesis without a round trip to a server.

Performance gains over the 2025 generation are significant. In Apple's blind human preference evaluations (compared side-by-side against the previous generation, not competitors), AFM 3 Core improved from a 23.3% to a 45.6% preference rate on general text tasks. AFM 3 Cloud jumped from 8.7% to 64.7%. Dictation accuracy preference went from 17.6% to 44.7%.

It's worth noting that Apple doesn't benchmark these against GPT, Claude, or Gemini directly. Every comparison is internal, so we should view these numbers as evidence of solid generational progress rather than a global competitive ranking.

### Private Cloud Compute, Extended

Apple's Private Cloud Compute (PCC) architecture launched in 2024 with a strict security model: Apple Silicon servers, attested code-audited builds, and cryptographic guarantees that user data is unreachable even by Apple. For AFM 3 Cloud Pro, [Apple extended PCC to third-party infrastructure for the first time](https://9to5mac.com/2026/06/11/apples-new-foundation-models-explained-on-device-ai-cloud-ai-and-everything-in-between/), so that the same strict data-handling principles apply on NVIDIA GPUs running inside Google's data centers.

This means Apple is betting its privacy story can survive running on hardware it doesn't own. That's either a sign of deep confidence in the PCC design or a pragmatic compromise because the Cloud Pro model was too demanding to run on Apple's own servers in time to ship. [Reporting suggests both are true](https://ofox.ai/blog/apple-foundation-models-3-wwdc-2026-developer-read/).

### Platform Strategy

Beyond the models themselves, Apple made significant developer-facing moves at WWDC that got less attention than the Google headlines.

The Foundation Models framework now supports **multimodal image input**, letting developers send images alongside text prompts to on-device models. It also ships with a **Python SDK**, making Apple's on-device AI accessible outside of Swift for the first time. Apple even open-sourced implementations for running third-party models locally via MLX, and [the framework now runs on Linux](https://techresearchonline.com/news/apple-foundation-models-wwdc-2026-ai-framework-update/).

Most significantly, Apple introduced a new `LanguageModel` protocol, a shared abstraction layer that lets developers write session logic once and swap between Apple's on-device model, Google Gemini, and Anthropic Claude with a single line change. This is a highly strategic move, because it positions Apple as the core privacy and on-device layer, while remaining model-agnostic at the developer API level.

## Why the Confusion Happened

Apple and Google were deliberately vague in January. Saying something is *"built in collaboration with Google using Gemini technology"* is technically accurate but tells you almost nothing about the actual architecture. The media filled the gap with the simplest story possible, like *"Apple is using Gemini"*, because it's a clean narrative that fits easily into a headline.

It also didn't help that [Apple's keynote mentioned NVIDIA prominently and Google only in passing](https://ofox.ai/blog/apple-foundation-models-3-wwdc-2026-developer-read/). The full picture, including the Google Cloud hosting for Cloud Pro, only emerged in the research blog post and executive interviews afterward. Apple's preferred brand story is simple: Apple models, NVIDIA hardware, Apple privacy. The reality is that Google is deeper in the supply chain than Apple's marketing suggests, but far less visible in the actual models you interact with than the headlines imply.

## The Takeaway

**So, the new Siri is not Gemini.** The on-device models, which handle the vast majority of everyday interactions, are fully Apple-designed, trained with Gemini's help but containing none of Gemini's code or weights. The most capable cloud model does run on Google's infrastructure, which is a real dependency Apple is careful not to advertise.

What Apple brought to this collaboration is genuinely interesting: a novel sparse architecture that puts a 20-billion-parameter model on an iPhone, a privacy infrastructure it's now extending to third-party hardware, and a developer platform that is quietly becoming one of the most thoughtful on-device AI frameworks in the industry.

The Google partnership is a pragmatic shortcut on the training side. The hardware integration, developer APIs, and privacy architecture are still Apple's game to win or lose.

*Sources: [Apple Machine Learning Research](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models) · [AppleInsider](https://appleinsider.com/articles/26/06/08/apples-new-foundation-models-dont-contain-a-drop-of-gemini-as-we-said-they-wouldnt) · [9to5Mac](https://9to5mac.com/2026/06/11/apples-new-foundation-models-explained-on-device-ai-cloud-ai-and-everything-in-between/) · [MacStories](https://www.macstories.net/linked/the-third-generation-of-apples-foundation-models-and-afm-core-advanced/) · [ofox.ai developer breakdown](https://ofox.ai/blog/apple-foundation-models-3-wwdc-2026-developer-read/)*