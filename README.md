# pr-title-with-issue-number-action

Rename PR title with PR number.

It adds current PR number 
- `title` -> `[#1] title`
- `[] title` -> `[#1] title`
- `[#] title` -> `[#1] title`

Or adds `[ ]` around the given issue number.
- `#123 title` -> `[#123] title`
- `[123] title` -> `[#123] title`

It does nothing when the title is like

- `[#123] title`
