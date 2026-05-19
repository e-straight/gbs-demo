# From Idea To Prototype

A short HTML slide deck for the talk **"Using Scaffolding to go from Idea to Prototype: Maximizing Model Output and Minimizing AI Slop."**

**Live deck:** https://e-straight.github.io/gbs-demo/

## What's inside

- Plain HTML / CSS / JS — no framework, no build step.
- Styled with the GitHub **Primer** design language (Mona Sans, Primer color tokens).
- 15 slides covering the **3 S's of LLM Scaffolding**: Structured, Secure, Scalable — plus a live-demo slide.

## Run locally

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` directly in a browser.

## Navigation

| Key | Action |
| --- | --- |
| `→` / `Space` / `PageDown` | next slide |
| `←` / `Backspace` / `PageUp` | previous slide |
| `Home` / `End` | first / last |
| `1`–`9` | jump to slide |
| `f` | toggle fullscreen |

Slide state is reflected in the URL (`#/3`), so you can deep-link any slide.

## Deploy

Pushes to `main` are published automatically by GitHub Pages from the repo root.

