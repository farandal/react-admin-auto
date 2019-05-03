# Change Log

## Version 1.4

### 1.4.2

### DateTime picker

- Using a nicer datetime picker than the one included with `react-admin`. It requires the following line to be included in `index.html` for the icons to display properly: `<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />`

### 1.4.1

### Provide custom UI

- Render custom components thru `action` field. If this field is a function, then a button will be rendered; otherwise, the supplied component

### Validation via Schema

- Use field `validate` and pass a function that returns undefined (no error) or a string to be displayed.
