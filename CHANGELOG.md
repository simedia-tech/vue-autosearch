<!--

News Priority:
- Breaking Changes
- Features
- Improvements
- Documentation

-->

## 0.1.29 (????-??-??)
#### Breaking Changes
- Removed throwing an error when an invalid modelValue gets passed (introduced in 0.1.28).

### Improvements
- Dependency updates.
- Code cleanup and stricter linting rules.

## 0.1.28 (2020-12-11)
### Breaking Changes
- Throwing an error if the passed down model is invalid.

## 0.1.27 (2020-12-11)
### Improvements
- Changed `rem` to `em` as it's better stylable this way.

## 0.1.26 (2020-11-10)
### Breaking Changes
- Changed `rem` to `em` as it's better stylable this way.

## 0.1.25 (2020-11-04)
### Breaking Changes
- When component gets disabled and the modelValue is not set, the searchTerm will also be reset

## 0.1.24 (2020-10-27)
### Bug Fixes
- If the border-radius for the input gets overwritten manually, the border-radius in the correct direction doesn't get removed, when the search results become visible

## 0.1.23 (2020-10-25)
### Bug Fixes
- Inlined close icon svg in order to be able to import the css file from anywhere

## 0.1.22 (2020-10-25)
### Bug Fixes
- Changed the background url for the close button so that the css file can also be imported directly inside the script tag

## 0.1.21 (2020-10-24)
### Bug Fixes
- Changed styles from old name (auto-select) to new name (autosearch)

## 0.1.20 (2020-10-24)
### Bug Fixes
- When the property passed to v-model got reset from outside the component, the searchTerm didn't reset properly

## 0.1.19 (2020-10-23)
### Features
- Added the `id` option to pass a custom id to the search input field

## 0.1.18 (2020-10-23)
### Features
- Added the `disabled` option to conditionally enable/disable the search input field

### Documentation
- Added CHANGELOG.md to track all changes by version and date

## 0.1.17 (2020-10-21)
### Breaking Changes
- Changed the exported library name from `vue-autosearch` to `VueAutosearch` to avoid issues when being installed from the CDN (there were still some issues in 0.1.16)

## 0.1.16 (2020-10-21)
### Breaking Changes
- Changed the exported library name from `vue-autosearch` to `VueAutosearch` to avoid issues when being installed from the CDN

## 0.1.15 (2020-10-21)
### Bug Fixes
- Added a default height for the results box on elements, which were loaded at the bottom of the viewport initially

## 0.1.14 (2020-10-21)
### Features
- Added the possibility to initially pass a ref containing an empty array to the component and update it with values at a later moment

## 0.1.13 (2020-10-21)
## Breaking Changes
- Removed the CSS from the default bundle, so it can be imported separately or completely styled independently

### Improvements
- Unfified mixed input styles

### Documentation
- Updated examples
- Added live demos

## 0.1.12 (2020-10-21)
### Improvements
- Reduced published package size

## 0.1.11 (2020-10-21)
### Bug Fixes
- Reduced published package size

## 0.1.10 (2020-10-21)
### Bug Fixes
- Fixed broken npm deploy

## 0.1.9 (2020-10-21)
### Bug Fixes
- Fixed broken npm deploy

## 0.1.8 (2020-10-21)
### Bug Fixes
- Fixed broken npm deploy