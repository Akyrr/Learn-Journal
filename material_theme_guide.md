Material Theming Guide (Material Design 3 / Material You)

This file teaches an AI (or a human) everything important about Material Theming.

Use this as:





System prompt / custom instructions



Reference knowledge



Training material for your AI



What is Material Theming?

Material Theming is the system in Google’s Material Design 3 (also called Material You) that creates consistent, accessible, and personal visual styles for apps.

It is mainly built around:





A powerful color system with many specific roles



Dynamic color (colors that adapt to the user’s wallpaper or content)



Supporting systems for typography, shape, elevation, and motion

The goal is to make UIs that feel personal, accessible, and cohesive across light/dark themes and different devices.



Core Concepts

1. Color Roles (Most Important Part)

Instead of using random hex colors, Material 3 uses named color roles.
These roles have meaning and guaranteed contrast relationships.

Accent Colors







Role



Purpose



Common Usage





primary



Highest emphasis



FAB, filled buttons, active states





onPrimary



Content on primary



Text/icons on primary buttons





primaryContainer



Less intense primary



Soft filled areas, chips





onPrimaryContainer



Content on primaryContainer



Text/icons on containers





secondary



Medium emphasis



Filter chips, secondary buttons





onSecondary



Content on secondary



-





secondaryContainer



Soft secondary



-





onSecondaryContainer



Content on secondaryContainer



-





tertiary



Contrasting accent



Special accents, badges, inputs





onTertiary



Content on tertiary



-





tertiaryContainer



Soft tertiary



-





onTertiaryContainer



Content on tertiaryContainer



-

Surface & Neutral Colors







Role



Purpose





surface



Main background





onSurface



Main text and icons





onSurfaceVariant



Secondary / lower emphasis text





surfaceContainerLowest



Lowest emphasis container





surfaceContainerLow



Low emphasis container





surfaceContainer



Default container (most common)





surfaceContainerHigh



Higher emphasis container





surfaceContainerHighest



Highest emphasis container





surfaceDim / surfaceBright



Dim or bright versions of surface





outline



Borders and dividers





outlineVariant



Softer borders

Error Colors (Static – do not change with dynamic color)







Role



Purpose





error



Error states





onError



Content on error





errorContainer



Soft error background





onErrorContainer



Content on error container



Rule of thumb: Always prefer using the role name (primary, onSurface, etc.) instead of hard-coded hex values. This makes the UI work correctly with dynamic color and light/dark themes.



2. Dynamic Color

Dynamic color is the signature feature of Material You.

There are two main types:





User-generated color





Takes a color from the user’s wallpaper



Creates a full accessible color scheme automatically



Available on Android 12+



Content-based color





Takes a color from in-app content (album art, book cover, photo, etc.)



Useful for media apps, galleries, readers

Dynamic color automatically generates:





Light and dark themes



Proper contrast



All the color roles listed above

You can still keep some static brand colors while using dynamic color for the rest of the UI.



3. Static (Baseline) Scheme

The baseline scheme is the default static color palette provided by Material.
It is useful when:





You want a consistent brand look



The platform does not support dynamic color (e.g. some web or iOS cases)



You are designing before enabling dynamic color



4. Other Theming Systems

Material Theming also includes:





Typography – A type scale with roles like displayLarge, titleMedium, bodySmall, labelLarge, etc.



Shape – Corner radius tokens (extra small → full)



Elevation – Now mostly handled through surface container colors instead of pure shadow elevation



Motion – Easing and duration tokens



How to Talk About Color Correctly

When describing or generating UI:

Good:





“Use primary for the main button and onPrimary for the text”



“Background should be surface, text should be onSurface”



“Put the secondary actions on secondaryContainer”

Avoid:





“Make the button blue (#2196F3)”



“Use a light gray background”



Random hex codes without roles



Ready-to-Use System Prompt

Copy and paste this into any AI’s system prompt / custom instructions:

You are an expert in Material Design 3 (Material You) theming.

Core knowledge you must always follow:

1. Always prefer Material 3 color roles over hard-coded colors:
   - primary / onPrimary / primaryContainer / onPrimaryContainer
   - secondary / onSecondary / secondaryContainer / onSecondaryContainer
   - tertiary / onTertiary / tertiaryContainer / onTertiaryContainer
   - surface / onSurface / onSurfaceVariant
   - surfaceContainerLowest → surfaceContainerHighest
   - outline / outlineVariant
   - error / onError / errorContainer / onErrorContainer

2. Understand Dynamic Color:
   - Colors can be generated from the user’s wallpaper (user-generated) or from content (content-based).
   - Design using roles so the UI works with any generated scheme.
   - Error colors stay relatively static.

3. Surface hierarchy:
   - Use surface + surfaceContainer* roles instead of arbitrary grays or elevation shadows when possible.
   - surfaceContainer is the default container color.

4. When giving design advice, code examples, or UI descriptions:
   - Always map colors to the correct roles.
   - Mention light and dark theme considerations.
   - Prefer accessible contrast.

5. You understand the Material Theme Builder and the concept of tonal palettes generated from a source color.

When the user asks about UI, theming, colors, or components, default to Material Design 3 best practices unless told otherwise.



Quick Reference – Common Mappings







UI Element



Recommended Role(s)





App background



surface





Card / container



surfaceContainer





Primary button



primary + onPrimary





Secondary button



secondary or secondaryContainer





Text (main)



onSurface





Text (secondary)



onSurfaceVariant





FAB



primaryContainer + onPrimaryContainer or primary





Error message



error / errorContainer





Dividers



outline or outlineVariant





Input fields



Often use surfaceContainerHighest or outline



Official Resources





Color system overview: https://m3.material.io/styles/color



Dynamic color: https://m3.material.io/styles/color/dynamic/overview



Color roles: https://m3.material.io/styles/color/roles



Material Theme Builder: https://m3.material.io/theme-builder



Customization: https://m3.material.io/foundations/customization



File created for teaching AIs and humans about Material Theming.
Feel free to copy the system prompt section into any AI.
