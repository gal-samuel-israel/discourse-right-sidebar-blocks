# Right Sidebar Blocks

Adds a configurable right sidebar to topic list routes.

## Core settings

- `blocks`: choose which blocks to render and their order.
- `show_in_routes`: limit sidebar rendering to specific routes. When empty, the sidebar is shown on all topic list routes.

## Included blocks

- `popular-tags`
- `top-contributors`
- `recent-replies`
- `category-topics`
- `custom-html`
- `subcategory-list`
- `gamification`

You can also use other Ember components as blocks by name (for example, core `signup-cta`), as long as they do not require unsupported parameters.

## Available block parameters

| name | description | default | available for |
| --- | --- | --- | --- |
| `count` | Limit number of results | varies | `popular-tags`, `category-topics`, `recent-replies`, `top-contributors`, `gamification` |
| `excerptLimit` | Limit reply excerpt length | `150` | `recent-replies` |
| `id` | Category ID | none | `category-topics` |
| `displayInCategories` | Comma-separated parent category IDs (when omitted, shown for all parent categories with subcategories) | none | `subcategory-list` |
| `content` | HTML content to render in the block | none | `custom-html` |

## Popular Tags visibility and debug

The `popular-tags` block supports component-specific visibility/debug controls in theme settings:

- `enable_debug_for_popular_tags_component`
- `enable_popular_tags_only_for_selected_users`
- `popular_tags_visible_user_ids`

When `enable_popular_tags_only_for_selected_users` is enabled, the block is shown only to user IDs listed in `popular_tags_visible_user_ids`.
