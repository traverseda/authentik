---
title: Prompt stage
---

This stage is used to show the user arbitrary prompts.

## Prompt

The prompt can be any of the following types:

| Type              | Description                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------ |
| Text              | Arbitrary text. No client-side validation is done.                                         |
| Text (Read only)  | Same as above, but cannot be edited.                                                       |
| Username          | Same as text, except the username is validated to be unique.                               |
| Email             | Text input, ensures the value is an email address (validation is only done client-side).   |
| Password          | Same as text, shown as a password field client-side, and custom validation (see below).    |
| Number            | Numerical textbox.                                                                         |
| Checkbox          | Simple checkbox.                                                                           |
| Date              | Same as text, except the client renders a date-picker                                      |
| Date-time         | Same as text, except the client renders a date-time-picker                                 |
| File              | Allow users to upload a file, which will be available as base64-encoded data in the flow . |
| Separator         | Passive element to group surrounding elements                                              |
| Hidden            | Hidden input field. Allows for the pre-setting of default values.                          |
| Static            | Display arbitrary value as is                                                              |
| authentik: Locale | Display a list of all locales authentik supports.                                          |

Some types have special behaviors:

-   _Username_: Input is validated against other usernames to ensure a unique value is provided.
-   _Password_: All prompts with the type password within the same stage are compared and must be equal. If they are not equal, an error is shown
-   _Hidden_ and _Static_: Their placeholder values are defaults and are not user-changeable.

A prompt has the following attributes:

### `field_key`

The field name used for the prompt. This key is also used to later retrieve the data in expression policies:

```python
request.context.get('prompt_data').get('<field_key>')
```

### `label`

The label used to describe the field. Depending on the selected template, this may not be shown.

### `required`

A flag which decides whether or not this field is required.

### `placeholder`

A field placeholder, shown within the input field. This field is also used by the `hidden` type as the actual value.

By default, the placeholder is interpreted as-is. If you enable _Interpret placeholder as expression_, the placeholder
will be evaluated as a python expression. This happens in the same environment as [_Property mappings_](../../../property-mappings/expression).

You can access both the HTTP request and the user as with a mapping. Additionally, you can access `prompt_context`, which is a dictionary of the current state of the prompt stage's data.

### `order`

The numerical index of the prompt. This applies to all stages which this prompt is a part of.

# Validation

Further validation of prompts can be done using policies.

To validate that two password fields are identical, create the following expression policy:

```python
if request.context.get('prompt_data').get('password') == request.context.get('prompt_data').get('password_repeat'):
    return True

ak_message("Passwords don't match.")
return False
```

This policy expects you to have two password fields with `field_key` set to `password` and `password_repeat`.

Afterwards, bind this policy to the prompt stage you want to validate.

Before 2021.12, any policy was required to pass for the result to be considered valid. This has been changed, and now all policies are required to be valid.
