If you have some awesome ideas that you would love to get into the framework, then you're welcome to fork and create pull requests to the project, where each PR will be reviewed. There are some various points that should be ticked off before you make any kind of PR, so please make sure to read the below.

* Make sure that you have ran and fixed any output from `npm run lint`.
* Make sure that your changes are backwards compatible in the best way, changes that are not can be discussed.
* Make sure you have tested and compiled the application locally.
* Make sure the code is up to standard, and there are no hacky workarounds.
* All code should be well commented and explained in the code, if it's a large chunk of code, make sure to comment sections.
* All comments wrapping methods/functions/etc should have the standard `@param` and `@returns` definitions for each parameter explaining what they require and return.
* When using `@returns` please use the class name it will export (if exporting a class) instead of just `class`.
* All new modules, decorators, enums, interfaces, anything should be added inside of the `index.ts` file and exported (this framework exports everything).
* Any new modules and functionality should be included in the `/docs` folder whether that be in an existing or new file, **or** it should go in the wiki.

Just make sure your code is clean and readable essentially!
