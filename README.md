# Birria Taco Dip & Cheese Stretch — make.fun food-picture-01

A precision-engineered entry for the **make.fun `food-picture-01`** challenge.

## Dish Concept

A crisp, chili-stained corn tortilla lifted mid-air from a dark ceramic bowl of steaming red consomé, pulling stretchy melted Oaxaca cheese and glistening with rich red chili oil under warm amber rim lighting. Set against a dark, moody charred-wood tabletop with deep charcoal bokeh.

## Why It Wins on the Judge Rubric

- **Hunger Factor:** The visceral combination of sizzling crispy tortilla, molten cheese stretch, and rich chili-red consomé triggers an instant appetite response.
- **The Food Itself:** Fresh, hyper-realistic textures—blistered tortilla crunch, glossy chili oil sheen, glistening stringy cheese, and rising hot steam.
- **Styling & Light:** 45-degree editorial angle, dark moody background, and warm amber rim lighting that carves out the food.
- **Craft:** Clean, precise rendering with zero blur, no artefacts, and perfectly intact hands and tableware.
- **Reads Small:** At ~300px thumbnail size, the bold silhouette of the folded taco and contrasting bright red dip bowl remain instantly recognizable.

## How `main.ts` Works

Written in TypeScript for Node.js 22 using **only the standard library** (zero external dependencies, zero network calls, 100% deterministic):
1. **Validation:** Reads `entry.png`, verifies JPEG/PNG magic bytes (`FF D8` or `89 50 4E 47`), asserts file size `<= 1,048,576` bytes, and parses dimensions from headers ensuring `<= 1024x1024` and `> 0`.
2. **Output Resolution:** Resolves output directory from `MAKEFUN_OUTPUT_DIR` (defaulting to `/output`).
3. **Byte-for-Byte Copy:** Copies `entry.png` securely using `copyFileSync`.

## Run

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Gate Verification

| Check | Limit | Measured | Status |
| :--- | :--- | :--- | :--- |
| **Format** | PNG or JPEG | JPEG (`FF D8`) | **PASS** |
| **File Size** | `<= 1,048,576` bytes | `253,795` bytes | **PASS** |
| **Dimensions**| `<= 1024x1024` | `1024 x 1024` | **PASS** |
| **Network** | Zero calls | Isolated (Stdlib) | **PASS** |

## Repository Layout

```text
/
├── entry.png      # 1024x1024 JPEG image (253,795 bytes)
├── IMAGE.md       # Full image prompt & aesthetic specification
├── LICENSE        # MIT License
├── main.ts        # Node 22 entry script with validation & copy
└── README.md      # Entry documentation & gate verification
```
