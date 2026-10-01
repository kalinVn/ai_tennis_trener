### Button

- `Button` is a reusable shared UI component.
- Used for user actions throughout the application.
- Supports the following variants:
  - `primary`
  - `secondary`
- Supports the following sizes:
  - `small`
  - `medium`
  - `large`
- Supports the following states:
  - `default`
  - `hover`
  - `active`
  - `disabled`
  - `loading`
- Supports the following button types:
  - `button`
  - `submit`
- Displays text content and may optionally include an icon.
- Emits a `click` event to the parent component when activated.
- The parent component handles the event and decides which action should be executed.
- The component must not contain page-specific or business logic.
- The component must not directly access application stores, backend APIs, routing logic, or page-specific functionality.
- Actions such as navigation, opening a modal, saving data, updating a store, or starting a feature are handled by the parent component.

#### Design Reference

Visual design prototypes for the Button component:

`prototype/design/components/buttons/`

Use these prototypes as the source of truth for the visual appearance of the Button, including variants, sizes, states, spacing, colors, typography, borders, and interaction states.

#### Implementation Reference

Vue implementation prototype for the shared Button component:

`prototype/shared-components/buttons/`

This reference defines the expected Vue component structure, props, emitted events, controller logic, and SCSS organization.

### Field

- `Field` defines the shared base behavior used by all field components.
- `Field` is not a standalone visual UI component.
- The shared Field behavior is implemented through the `useFieldController` composable.
- Specialized field components such as `SelectField`, `NumberField`, `DateField`, `TextField`, `TextAreaField`, `PasswordField`, and `CheckboxField` reuse this common behavior.

#### Field Controller

The shared field logic is implemented in:

`useFieldController.js`

`useFieldController` is a Vue composable responsible for common field behavior.

It may provide operations such as:

- `getValue()`
  - Returns the current field value.

- `setValue(value)`
  - Updates the current field value.

- `reset()`
  - Resets the current field value.

- `hasLabel()`
  - Returns whether the field has a label.

Additional common functionality may be added when it is shared by multiple field types.

#### Composition

Specialized field controllers should compose `useFieldController` and add only their field-specific behavior.

Example:

```text
useFieldController
    ↓
common field behavior
    ↓
getValue()
setValue()
reset()
hasLabel()
```

A specialized field controller extends this behavior through composition:

```text
useFieldController
    ↓
useSelectFieldController
    ↓
common field behavior
+
SelectField-specific behavior
```

For example, `useSelectFieldController` may add:

```text
getSelectedOption()
getIndex()
setIndex()
selectOption()
```

while still reusing:

```text
getValue()
setValue()
reset()
hasLabel()
```

#### Responsibilities

`useFieldController` should contain only behavior that is common to multiple field types.

It must not contain logic that belongs exclusively to one specific field type.

Examples:

- Select option handling belongs to `useSelectFieldController`.
- Numeric parsing, `min`, `max`, and `step` behavior belongs to `useNumberFieldController`.
- Date parsing and date-specific operations belong to `useDateFieldController`.
- Password visibility behavior belongs to `usePasswordFieldController`.

#### Important

Do not duplicate shared field behavior inside specialized field controllers.

Specialized controllers should compose `useFieldController` and add only the behavior required by their specific field type.

The purpose of `Field` is to define a consistent shared foundation for all field components.



## SelectField

`SelectField` is a reusable Vue component used for selecting one or more values from a predefined list of options.

The component consists of:

```text
SelectField.vue
useSelectFieldController.js
```

`SelectField.vue` is responsible for rendering the UI of the field.

`useSelectFieldController.js` is a custom composable containing the logic specific to `SelectField`.

The `SelectField` controller composes the shared field logic from:

```text
useFieldController.js
```

Architecture:

```text
useFieldController
        ↓
useSelectFieldController
        ↓
SelectField.vue
```

### Shared Field Behavior

`useSelectFieldController` reuses the common behavior provided by `useFieldController`.

This may include:

```js
getValue()
setValue(value)
reset()
hasLabel()
```

`useFieldController` must contain only functionality shared by multiple field types.

Select-specific behavior must remain inside `useSelectFieldController`.

### SelectField-Specific Behavior

`useSelectFieldController` may provide:

```js
getSelectedOption()
getSelectedOptions()
getIndex()
setIndex(index)
selectOption(value)
```

#### `getSelectedOption()`

Returns the currently selected option.

#### `getSelectedOptions()`

Returns all currently selected options when multiple selection is enabled.

#### `getIndex()`

Returns the index of the currently selected option.

#### `setIndex(index)`

Changes the selected option using its index.

#### `selectOption(value)`

Changes the selected option using its value.

### Properties

The component may support the following properties:

```text
modelValue
options
label
placeholder
disabled
required
multiple
```

#### `modelValue`

Contains the current value of the field.

The component uses the standard Vue `v-model` mechanism.

```vue
<SelectField v-model="country" />
```

#### `options`

Contains the available options.

Example:

```js
[
  {
    label: 'Bulgaria',
    value: 'bg',
  },
  {
    label: 'Germany',
    value: 'de',
  },
]
```

Basic option structure:

```js
{
  label: String,
  value: any,
}
```

#### `label`

Optional label for the field.

The component must work both with and without a label.

```vue
<SelectField
  label="Country"
/>
```

#### `placeholder`

Optional placeholder displayed when no value is selected.

#### `disabled`

Disables user interaction with the field.

#### `required`

Marks the field as required.

#### `multiple`

Allows multiple options to be selected.

When `multiple` is enabled, `modelValue` should normally contain an array of values.

```js
[
  'bg',
  'de',
]
```

### Value Flow

`SelectField` uses the standard Vue `v-model` flow:

```text
Parent
   ↓
modelValue
   ↓
SelectField.vue
   ↓
useSelectFieldController
   ↓
setValue(value)
   ↓
emit('update:modelValue', value)
   ↓
Parent
```

### Responsibilities

`SelectField.vue` is responsible for:

- Rendering the select control.
- Rendering the optional label.
- Rendering the available options.
- Handling UI interaction.
- Connecting the UI with `useSelectFieldController`.

`useSelectFieldController` is responsible for:

- Select-specific behavior.
- Selected option handling.
- Selected index handling.
- Single and multiple selection logic.
- Reusing common field behavior from `useFieldController`.

### Architecture Rules

Shared field logic must not be duplicated inside `useSelectFieldController`.

The architecture should remain:

```text
useFieldController
        +
SelectField-specific behavior
        =
useSelectFieldController
```

Select-specific methods must not be moved into `useFieldController`.