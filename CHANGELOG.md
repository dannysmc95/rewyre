# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v2.4.3](https://github.com/dannysmc95/rewyre/compare/v2.4.2...v2.4.3) - 2021-06-11

### Commits

- Fixed lint errors with latest changes. [`7c28453`](https://github.com/dannysmc95/rewyre/commit/7c284539d521c6c131acdc53f6ebe508964b8993)
- Bumped version to 2.4.3 as I missed the lint errors. [`766a7ba`](https://github.com/dannysmc95/rewyre/commit/766a7ba70868a1795832011ea0b096b5a419a7eb)

## [v2.4.2](https://github.com/dannysmc95/rewyre/compare/v2.4.1...v2.4.2) - 2021-06-11

### Fixed

- Removed the database option from the state, as this needs to be re-looked at, instead changed the state type to 'file' or 'in-memory', fixes #8 [`#8`](https://github.com/dannysmc95/rewyre/issues/8)
- Added change that checks the build environment (whether using .ts or .js files) if .ts then process.env.BUILD_ENV is defined as dev or prod for .js, fixes #11 [`#11`](https://github.com/dannysmc95/rewyre/issues/11)

### Commits

- Added fix to the plugin options, to prevent them from being overwritten by the plugin's own defined settings so that users can override them. [`898cca2`](https://github.com/dannysmc95/rewyre/commit/898cca2a2c61d49fa6f3317f751081a91f21bc6d)
- Updated changelog. [`84f6f1d`](https://github.com/dannysmc95/rewyre/commit/84f6f1db0c66255a22e7d14485d914b531122bf1)
- Added discord link so people can join and discuss. [`e85a957`](https://github.com/dannysmc95/rewyre/commit/e85a9570f65d6fa69c9c3407521bc303366637d3)
- Update readme.md [`3b7c08c`](https://github.com/dannysmc95/rewyre/commit/3b7c08c5505c32309d8cd4c1f8cebe30c9ad37de)
- Updated readme [`4b55a85`](https://github.com/dannysmc95/rewyre/commit/4b55a85d7e0c595c327437518539b43133a4e5ca)
- Bumped patch version. [`2933f08`](https://github.com/dannysmc95/rewyre/commit/2933f084e76219688c941044ec50b6b00da8d5ae)

## [v2.4.1](https://github.com/dannysmc95/rewyre/compare/v2.4.0...v2.4.1) - 2021-06-07

### Commits

- Updated all dependencies and upgraded express-ws to the latest version to remove security issue. [`93c5675`](https://github.com/dannysmc95/rewyre/commit/93c5675ab331ef41c0b38a43c3d1aad600707693)
- Updated changelog. [`77db24b`](https://github.com/dannysmc95/rewyre/commit/77db24ba20c5d4b2f4a7bc34a76f1cb80aef57d5)
- Added new method to the framework called getLogger to allow hooks to access logging. [`9c48f18`](https://github.com/dannysmc95/rewyre/commit/9c48f18793d0d656e9f059ae3a22740e4d600b8c)
- Added small advisory relating to the database driver issue. [`ba86b3d`](https://github.com/dannysmc95/rewyre/commit/ba86b3dcc158475b6ccc145975543655cf2e1705)
- Bumped package version. [`15a0be6`](https://github.com/dannysmc95/rewyre/commit/15a0be6f7e01f7bec6aa3d8eb1858ed982a2ac82)

## [v2.4.0](https://github.com/dannysmc95/rewyre/compare/v2.3.0...v2.4.0) - 2021-06-07

### Commits

- Added new registry module for internal state management, alongside exporting it from the framework. [`ec461aa`](https://github.com/dannysmc95/rewyre/commit/ec461aa2bf4971b8ee2192c10c4557fdd21dca2c)
- Updated changelog. [`ca545d7`](https://github.com/dannysmc95/rewyre/commit/ca545d72ba3223d776200746e038b47f425c4782)
- Added new framework getRegistry method for accessing the registry, alongside setting it as a built-in injectable. [`a269ed7`](https://github.com/dannysmc95/rewyre/commit/a269ed72dd87ccfb0c4af4ae86365b78e986c34b)
- Updated the hooks manager to support multiple parameters, instead of an object. [`2e7f3e2`](https://github.com/dannysmc95/rewyre/commit/2e7f3e2b132a42072b0f3836f590cc06346fdcf8)
- Bumped package minor version. [`817274a`](https://github.com/dannysmc95/rewyre/commit/817274ad3ee234bc8297b96279034fe812076404)
- Added the framework as a built-in inject, as this allows plugins to use the server controls and access lower level parts of the framework. [`819f801`](https://github.com/dannysmc95/rewyre/commit/819f801e9f786a32f3b5738c8f6693d751c65b08)

## [v2.3.0](https://github.com/dannysmc95/rewyre/compare/v2.2.0...v2.3.0) - 2021-06-06

### Fixed

- Added some updates to the readme, fixes #4 for plugin support. [`#4`](https://github.com/dannysmc95/rewyre/issues/4)

### Commits

- Bumped the package versions tp the latest. [`7ac21b6`](https://github.com/dannysmc95/rewyre/commit/7ac21b67030b91046c1ddc7fb7bcbfe69f78d8e0)
- Added plugin support using a structured export from another package, see docs for more information. [`c82fb2b`](https://github.com/dannysmc95/rewyre/commit/c82fb2b9fc3873516e18cdc3351c46bd0d75261d)
- Added various fixes to the block comments for functions including a returns method. [`d451b27`](https://github.com/dannysmc95/rewyre/commit/d451b272c7d275d6a639a033830a2f30a675d39c)
- Bumped dependency versions for typescript, mongodb and @types/express. [`9c40049`](https://github.com/dannysmc95/rewyre/commit/9c400491777710bbf88db5586da6906b81641213)
- Updated dependencies and added plans for plugin development. [`c56fe59`](https://github.com/dannysmc95/rewyre/commit/c56fe5902ebe5cdbc5a7d9668754da1e8708f57d)
- Updated test application to use the updated plugin stuff. [`c43e09d`](https://github.com/dannysmc95/rewyre/commit/c43e09dc6df62f3425aae3264ff9568a75c8bbf8)
- Added updates to the hook system alongside updates to the docs. [`29ead67`](https://github.com/dannysmc95/rewyre/commit/29ead67929e9c2f0df81361d0c8b7d41f02effeb)
- Updated changelog [`2fcaf78`](https://github.com/dannysmc95/rewyre/commit/2fcaf7842c3de73657e68cbd908a55a84787a547)
- Added framework hooks for additional functionality - added in other commit. [`659d9c0`](https://github.com/dannysmc95/rewyre/commit/659d9c09968f0d90997778dfb40cdd9243d62b9a)
- Update feature_request.md [`481b861`](https://github.com/dannysmc95/rewyre/commit/481b861d05f5a726eb7769a5de73f77bf83c5a4c)
- Update readme.md [`302ec98`](https://github.com/dannysmc95/rewyre/commit/302ec988c09ebb401a3cf0f6b38e87314b9005ac)
- Bumped package version [`de337bf`](https://github.com/dannysmc95/rewyre/commit/de337bf27be67ec5de730d999cb4688721fb8a38)
- Docs updates [`caee7aa`](https://github.com/dannysmc95/rewyre/commit/caee7aab2ac00ba8bc093b62913f7569997374bc)
- Added return type to generic log method in logger [`1d9f52c`](https://github.com/dannysmc95/rewyre/commit/1d9f52cb1f60cd902423999febe903e76ea48d1e)
- Added return type to generic log method in logger [`873cdab`](https://github.com/dannysmc95/rewyre/commit/873cdab110e82455e42177e486a44b234b3c4e37)

## [v2.2.0](https://github.com/dannysmc95/rewyre/compare/v2.1.3...v2.2.0) - 2021-05-26

### Commits

- Added new logger system into the framework, allowing for custom loggers and logging level controls alongside extending the framework to output verbose information. [`0043f1c`](https://github.com/dannysmc95/rewyre/commit/0043f1c4d2ba2490d8884887d671e80c4ca157fa)
- Fixed linting errors, alongside adding additional methods to the WSHelper class to cater for session, subscription and packet management. [`439f86b`](https://github.com/dannysmc95/rewyre/commit/439f86be7ff6d73f2e25140cdbfbb64c3038c097)
- Added new logo and updated readme.md [`41e0f9c`](https://github.com/dannysmc95/rewyre/commit/41e0f9c4bde90c04f3c39bdea255e067d70d6a76)
- Added new logo and updated readme.md [`460c9c8`](https://github.com/dannysmc95/rewyre/commit/460c9c817b636846d5cffe235e67b2f8d48f9811)
- Updated changelog [`032b09a`](https://github.com/dannysmc95/rewyre/commit/032b09aa34fa3a65c2ce97e7ba51266a43746d12)
- Bumped package to version 2.2.0 with the new Logger and WSHelper changes. [`98e80cd`](https://github.com/dannysmc95/rewyre/commit/98e80cd2f9d7a685488bc6fc3f28ca225421d8f5)
- Added export for the WSHelper [`4a73d8f`](https://github.com/dannysmc95/rewyre/commit/4a73d8f88c632c36c5a624e940ae563d27493aef)
- Added new logo and updated readme.md [`7994e70`](https://github.com/dannysmc95/rewyre/commit/7994e705a250e2956af77bbb3b577a259e818998)
- Added new logo and updated readme.md [`4dfabf5`](https://github.com/dannysmc95/rewyre/commit/4dfabf585419a03f7d2cc63283f46ab8b4ef1366)

## [v2.1.3](https://github.com/dannysmc95/rewyre/compare/v2.1.2...v2.1.3) - 2021-05-25

### Commits

- Updated changelog [`9f7dcf0`](https://github.com/dannysmc95/rewyre/commit/9f7dcf000f77e9ecddbf0b95c33c097c4a12712d)
- Added new version to fix broken package upload [`3284920`](https://github.com/dannysmc95/rewyre/commit/32849204aafff60426cd02ba2016d5da0279858a)

## [v2.1.2](https://github.com/dannysmc95/rewyre/compare/v2.1.1...v2.1.2) - 2021-05-25

### Commits

- Removed the deprecated body-parser library in favour of express's built in json/body-parser support. [`c911204`](https://github.com/dannysmc95/rewyre/commit/c911204d08d41ecc7cf246f897f231ede830d13c)
- Renewed the eslint file moving to the .eslintrc.js file and fixing all changes based on the new config. [`d4de7de`](https://github.com/dannysmc95/rewyre/commit/d4de7debd15206f2a3931a24d13258543a6aded3)
- Added deprecated marker to ModelRecordID in favour of the re-exported ObjectID. [`c46eacc`](https://github.com/dannysmc95/rewyre/commit/c46eacc8397d09d8a488755ba7c0549c80fe2848)
- Added additional eslint changes. [`8aafa16`](https://github.com/dannysmc95/rewyre/commit/8aafa16cb347a260fc6f7acda4aa84294f9d9964)
- Added the new WSHelper built-in helper, this helper is injected to all services, providers, controllers and guards and allows you to send messages as and when to websocket connections [`4cb297c`](https://github.com/dannysmc95/rewyre/commit/4cb297c5211cb110fd029e286be34a3a5008d532)
- Updated changelog [`0bf1e17`](https://github.com/dannysmc95/rewyre/commit/0bf1e17e78cd263da6cd823cd40aa6c00d537545)
- Bumped the package version. [`a5adb05`](https://github.com/dannysmc95/rewyre/commit/a5adb059b415bc1b6ccefbc211b5c8d7c90876da)
- Added additional exclusions from tsconfig. [`4186ce4`](https://github.com/dannysmc95/rewyre/commit/4186ce4cdf07b3257e62786cc03b6e213b31bfd9)

## [v2.1.1](https://github.com/dannysmc95/rewyre/compare/v2.1.0...v2.1.1) - 2021-05-18

### Commits

- Rewritten changelog [`b8fc33f`](https://github.com/dannysmc95/rewyre/commit/b8fc33fe5be4639f4b33b0fc4be34bd49c7fa9e5)
- Bumped version [`fc6c861`](https://github.com/dannysmc95/rewyre/commit/fc6c8612db76041cf393e9e57e26edf088532fb9)
- Added fix to prevent providers from being reinitialised when they are injected to. [`8d16c6a`](https://github.com/dannysmc95/rewyre/commit/8d16c6a1a6175920c5b292031d845a0af98ef279)

## [v2.1.0](https://github.com/dannysmc95/rewyre/compare/v2.0.2...v2.1.0) - 2021-05-17

### Commits

- Updated test application to show the new injections for providers [`1cc0574`](https://github.com/dannysmc95/rewyre/commit/1cc05749a63a687fdd9e41129a58e2f7515e3ba3)
- Updated changelog [`b4c21ce`](https://github.com/dannysmc95/rewyre/commit/b4c21ceb4d0e92472eb7924958ad81b27585e1b8)
- Added support for providers to be able to define injections [`347fb0e`](https://github.com/dannysmc95/rewyre/commit/347fb0e798d3e31f7dd83639251ceb857cc3bc6c)
- Disabled the default spam when you use the default authentication guard [`21475f9`](https://github.com/dannysmc95/rewyre/commit/21475f9f43d44c5b1f8277693fef3a1891bc2fe2)
- Bumped minor version due to the change type [`9515a63`](https://github.com/dannysmc95/rewyre/commit/9515a63ccfe98671005602c58411e91d29e2078f)

## [v2.0.2](https://github.com/dannysmc95/rewyre/compare/v2.0.1...v2.0.2) - 2021-05-13

### Commits

- Changed from using peer to using main [`2e64051`](https://github.com/dannysmc95/rewyre/commit/2e640518751557fe2d62f246ddfe98519a90b998)
- Bumped version number [`a891f13`](https://github.com/dannysmc95/rewyre/commit/a891f134f5064f8c5bae7c3af5a5bafbf28f323d)

## [v2.0.1](https://github.com/dannysmc95/rewyre/compare/v2.0.0...v2.0.1) - 2021-05-13

### Commits

- Updated changelog [`d6e464d`](https://github.com/dannysmc95/rewyre/commit/d6e464d83e36208742a913d8289ad5cb252726ab)
- Fixed error with using the database dynamic import and fixed error with getInstance returning the driver instead of the driver's instance [`f1ec26d`](https://github.com/dannysmc95/rewyre/commit/f1ec26d8dc8aa98d1a70d24481b5c40424f209a0)

## [v2.0.0](https://github.com/dannysmc95/rewyre/compare/v1.2.6...v2.0.0) - 2021-05-13

### Commits

- Added support fot driver functionality for database management for both MySQL and MongoDB. [`cd12891`](https://github.com/dannysmc95/rewyre/commit/cd12891be9c1f395746b0f90d2b0b9ffd857e292)
- Updated documentation, moved stuff around, and added doc blocks for new code [`5428940`](https://github.com/dannysmc95/rewyre/commit/5428940fa9ef164bae4d123d1c2d14d3d47365e2)
- Fixing various code and adding support to add your own database drivers [`34d58f8`](https://github.com/dannysmc95/rewyre/commit/34d58f87269de208f5097d33cf472cb07d03cc26)
- Fixed some bugs around custom drivers and making sure they are called correctly, including some test cases around it [`2cf3f7f`](https://github.com/dannysmc95/rewyre/commit/2cf3f7f59ffbb2c49b5a6a7a6b7e08f969fcd838)
- Updated folder structure alongside updating the licensing information. [`0c29dae`](https://github.com/dannysmc95/rewyre/commit/0c29dae08333923667253b40e39ce57115a4fbde)
- Updated changelog [`a7630da`](https://github.com/dannysmc95/rewyre/commit/a7630da3539f83bcaa8999ab4bd6a5a11ea22568)

## [v1.2.6](https://github.com/dannysmc95/rewyre/compare/v1.0.0...v1.2.6) - 2021-05-11

### Commits

- Removed nodemailer [`4f65c77`](https://github.com/dannysmc95/rewyre/commit/4f65c775ceef31bb9793b98ba7fbd4530baa68a6)
- Started working on the build in ORM, previous versions were not tagged, only minor bug fixes [`2cf57f9`](https://github.com/dannysmc95/rewyre/commit/2cf57f9a70cdeb916b4ca72bcd7b85338e3f6784)
- Removed documentation from inside the project, and moved to the github wiki instead. [`90ba284`](https://github.com/dannysmc95/rewyre/commit/90ba2846dcaa1b87cb67e3088b5c01c9d2fad356)
- Made various changes to the structure of the project, including returning 500 errors, when something fails, alongside implementing authentication guards, based on the ones in the Symfony framework. [`0e8ab57`](https://github.com/dannysmc95/rewyre/commit/0e8ab576b90935b5353c0cbded7436fbf5e852a0)
- Set the abstract classes to the abstract, as they were standard classes, created two available providers, one for crypto (encrypt, decrypt, hashPassword and validatePassword) and the auth provider which needs to be expanded on to support the @Authenticated decorator. [`49d01e3`](https://github.com/dannysmc95/rewyre/commit/49d01e387c5a70933cddbad53c961e9013374172)
- Added a basic email provider that uses nodemailer [`1e66cb7`](https://github.com/dannysmc95/rewyre/commit/1e66cb7d019387b457c69731da0580780c8fcebb)
- Bumped package versions for @types/node @typescript-eslint/parser and @typescript-eslint/eslint-plugin to the latest versions.: [`3ffe5f5`](https://github.com/dannysmc95/rewyre/commit/3ffe5f5be0c6a35f0faf619211b77f2c86306c38)
- Updated packages and bumped to release version 1. [`b2b7f59`](https://github.com/dannysmc95/rewyre/commit/b2b7f59123ec75e68d0c58dc9935c70a75b057ee)
- Create CODE_OF_CONDUCT.md [`9bacff9`](https://github.com/dannysmc95/rewyre/commit/9bacff94966305df030ebb435155ee7f2f46edda)
- Updated nodemailer to be an optional dependency, to use it you must install it yourself. Also updated eslint and @types/node. [`e04ca74`](https://github.com/dannysmc95/rewyre/commit/e04ca748f9e0e5da0fba2190480706eec5261f59)
- Added various fixes to docs [`1200aa5`](https://github.com/dannysmc95/rewyre/commit/1200aa52571c8bf0a9929c12cfd88a5fff4d0012)
- Added amends to the abstract model to support more complex queries. [`8a86ef3`](https://github.com/dannysmc95/rewyre/commit/8a86ef327ab0ac89b5387fa6dea2eb02e5c6848c)
- Update issue templates [`351b6d9`](https://github.com/dannysmc95/rewyre/commit/351b6d9ea12d40a4954c40cb71e9f6a9883467dd)
- Added fixes to the useStatic and useMiddleware functions of the framework which were not correctly linked up, missed step in development. [`46d86de`](https://github.com/dannysmc95/rewyre/commit/46d86dedfa47b2e09467215152b65f6c8f07609e)
- Set the new definition [`f00d0be`](https://github.com/dannysmc95/rewyre/commit/f00d0be35f338fce05d1842a8575a40f6fa91c4d)
- Updated changelog [`c80d893`](https://github.com/dannysmc95/rewyre/commit/c80d8935a074235517609549887e7bb8ee1e851c)
- Added fix to remove all undefined values in model field validation [`823d5da`](https://github.com/dannysmc95/rewyre/commit/823d5da34ab456453fda3add5ee0a8100d44696e)
- Swapped the parameters for useStatic, so that the url_path can be optional and therefore allow a user to not be forced to define a url_path allowing them to set static folders with no prefix path. [`21fc5d9`](https://github.com/dannysmc95/rewyre/commit/21fc5d9c25cfef1869fd0fa3b9d5d2c1c4fbfa9f)
- Updated changelog [`524cfe1`](https://github.com/dannysmc95/rewyre/commit/524cfe15fc9eb43f29d4b96f703e9dd4234a3be5)
- Added options controls to find methods [`db08f99`](https://github.com/dannysmc95/rewyre/commit/db08f9947a0fab2f14193344e94b1b5b3367d67e)
- Set nodemailer back to a dep and bumped the version to 1.2 [`51170d4`](https://github.com/dannysmc95/rewyre/commit/51170d4a3a18bf20cee46d4f96dd76427bbc44b7)
- Updated changelog [`b363571`](https://github.com/dannysmc95/rewyre/commit/b36357164d3c00abcfb637ffba6b141ffc1d1504)
- Create CONTRIBUTING.md [`4f56d13`](https://github.com/dannysmc95/rewyre/commit/4f56d13a0440818bd3fe09c1b86ab2f398472a5a)
- Added new getHttpServer method to pull the underlying express instance [`40f8d49`](https://github.com/dannysmc95/rewyre/commit/40f8d49f7eaf779a74d390f437bf6a1781facc9f)
- Various changes to the dashboard, admin header, and server manager [`c11b65d`](https://github.com/dannysmc95/rewyre/commit/c11b65d5dd911dd662dbf1733fb93ef78814c61b)
- Updated documentation link [`1bb7fdb`](https://github.com/dannysmc95/rewyre/commit/1bb7fdb322a737cc8835d31b105774acc4b764e6)
- Bumped version [`7fc58e5`](https://github.com/dannysmc95/rewyre/commit/7fc58e5f0eb525ec428c866125a74e7fed3c8df8)
- Added various fixes to docs [`8e89bcf`](https://github.com/dannysmc95/rewyre/commit/8e89bcf5595e51e825090b4d1000ed0cc3b1e9cf)
- Removed an unused import [`4ad301b`](https://github.com/dannysmc95/rewyre/commit/4ad301b502fed86072ad052bca3039cfb4f2760b)
- Removed unused import [`9bee671`](https://github.com/dannysmc95/rewyre/commit/9bee671ea4b151f24e029bb855ec1948c11e96af)

## [v1.0.0](https://github.com/dannysmc95/rewyre/compare/v0.3.2...v1.0.0) - 2020-09-30

### Commits

- Started working on the version 1 release. [`c5eff66`](https://github.com/dannysmc95/rewyre/commit/c5eff667aa22a397d5bb1aa5b971b5779f5a4f66)
- Finished documentation and updated the state module to be injected, instead of being used in the contructor. [`e32b4e4`](https://github.com/dannysmc95/rewyre/commit/e32b4e425d5cfd2e0c9c385ba009fbc71141d0e1)
- Completed the basic HTTP creation, alongside database setup, model instantiation, controller instantiation and injection for models. [`fe87d0c`](https://github.com/dannysmc95/rewyre/commit/fe87d0cb4525be5644770b17678e848478569037)
- Working on the demo and fine tuning the HTTP server [`1e8dc52`](https://github.com/dannysmc95/rewyre/commit/1e8dc529af654322be3945ca8c39b647daf09826)
- Finished implementing the scheduler and the service demo, alongisde creating a new provider in the demo, alongside adding WebSocket support [`b97f133`](https://github.com/dannysmc95/rewyre/commit/b97f1331cd8afe4a73f2913ea82bfaf3667f6566)
- Various fixes and changes [`3c562ce`](https://github.com/dannysmc95/rewyre/commit/3c562ce431ba0e8e6f65a6517bffc50f00a281e3)
- Working on the documentation [`01def49`](https://github.com/dannysmc95/rewyre/commit/01def4949106e41c3ab63475f5d4e0871d9c2b9c)
- Bumped packages to the latest version, and removed the @types/moment-timezone stub definition [`d19c4e4`](https://github.com/dannysmc95/rewyre/commit/d19c4e46098f420385d354ecbac0496b9a9885a2)
- Updated the test with the provider example and also updated all comment blocks on every method and class to make sure they all make sense. [`0a31895`](https://github.com/dannysmc95/rewyre/commit/0a318953af8659ff47cc6c3a69446406bb742ee1)
- Added various changes and started working on the controller HTTP routing. [`7147d8f`](https://github.com/dannysmc95/rewyre/commit/7147d8f902c4da73b20ad137d60629ac86e4949e)
- Added initial re-develop phase, rebuilding the framework ground up to be more in-keeping with TypeScript, due to the previous version not playing very well with WebSockets and the HTTP Server in the way I wanted, plus this gives up more freedom, alongside, a whole new design ready for plugin support and threading support. [`e3a9e54`](https://github.com/dannysmc95/rewyre/commit/e3a9e54b0bd3f68455839fa19e2223e929fd767e)
- Cleaned up any code and updated and created comments for rest of the new code to help with TS type hinting [`ab0329e`](https://github.com/dannysmc95/rewyre/commit/ab0329ee36a27b45c34d3b83fb1662441732da89)
- Setup the scheduler [`638a003`](https://github.com/dannysmc95/rewyre/commit/638a003faf2360180388cfbbc874c40c28357de9)
- Added license [`ab73fcd`](https://github.com/dannysmc95/rewyre/commit/ab73fcda702ca20e27b09a4465f6150e33506c97)
- Added additional comments to the constructor methods, as well as started working on the threader module. [`6d223bf`](https://github.com/dannysmc95/rewyre/commit/6d223bf507feb13319e4a9990d7d38698601ae1c)
- Started implementing the provider, and removed the model-field interface. [`5e574a6`](https://github.com/dannysmc95/rewyre/commit/5e574a67b3bcfe0ea99ecc519b424a5ee0999f9e)
- Started working on the state module. [`53ca9ef`](https://github.com/dannysmc95/rewyre/commit/53ca9ef4a73ada143bccb9d281b3f8c06126ffd0)
- Started writing up the documentation [`bfe4d0e`](https://github.com/dannysmc95/rewyre/commit/bfe4d0e1694b870e4db0d0ae29a0c9e13cafd459)
- Amended the package.json to define more information [`b0444ac`](https://github.com/dannysmc95/rewyre/commit/b0444ac5f0b34dcab57157b86d1bb04a9a6edea8)
- Updated changelog [`59d5935`](https://github.com/dannysmc95/rewyre/commit/59d59351583edfddb4f06d678f625017218a1d01)

## [v0.3.2](https://github.com/dannysmc95/rewyre/compare/v0.3.1...v0.3.2) - 2020-09-17

### Commits

- Started working on the debugger, and added comment blocks to all functions, classes, and methods to describe what they are and how they work. [`ecaa02e`](https://github.com/dannysmc95/rewyre/commit/ecaa02e0758dd1fac6d0f8c5fb735c75c48bc9f4)
- Updated changelog [`cd2e05b`](https://github.com/dannysmc95/rewyre/commit/cd2e05ba258767edca822fbf9e0ee009c17a6fe1)
- Bumped version to 0.3.2 [`064e3b6`](https://github.com/dannysmc95/rewyre/commit/064e3b61cb395fa98f6ec6bf81fc4207c455617c)

## [v0.3.1](https://github.com/dannysmc95/rewyre/compare/v0.3.0...v0.3.1) - 2020-09-17

### Commits

- Added latest changelog update [`b16eb46`](https://github.com/dannysmc95/rewyre/commit/b16eb462d307114cdd6f2f6067e322c6283b14de)
- Added patch to fix broken typings [`dceedd2`](https://github.com/dannysmc95/rewyre/commit/dceedd21ef2567ac6af9c8491d819c51bad83700)

## [v0.3.0](https://github.com/dannysmc95/rewyre/compare/v0.2.10...v0.3.0) - 2020-09-17

### Commits

- Started adding websocket support. [`01fff24`](https://github.com/dannysmc95/rewyre/commit/01fff2499d0765df3374de56de8610ba649a9bb6)
- Meta updates [`3be0f22`](https://github.com/dannysmc95/rewyre/commit/3be0f22dedbdfd8b0cadcb13fede78619f6f3f6e)
- Added secondary WS setup [`ccbbe83`](https://github.com/dannysmc95/rewyre/commit/ccbbe835ca137bb910f7c275f8360b9c94b6a42c)
- Nearly completed the WebSocket integration, added various changes, need to finish the actual WebSocket routing which is still seeing an error. [`44cf5cb`](https://github.com/dannysmc95/rewyre/commit/44cf5cb77de256d600a4233e2b27f4d92f727615)
- Bumped packages to latest versions [`50c6470`](https://github.com/dannysmc95/rewyre/commit/50c647020fc6b2743231e57af32e2e2ba8d9f406)
- Meta updates [`a4f81c8`](https://github.com/dannysmc95/rewyre/commit/a4f81c86b18cbbfc49730732a41e2cde55ad1a18)
- Added the additional exports for the new helpers, interfaces, modules and enums. [`f5ae94e`](https://github.com/dannysmc95/rewyre/commit/f5ae94e969a35cd5533c8c0812234f9714be55d1)
- Added final fixes. [`48be52a`](https://github.com/dannysmc95/rewyre/commit/48be52a10a0a7572731653522f534fc70d0a5272)
- Meta updates [`a098b97`](https://github.com/dannysmc95/rewyre/commit/a098b97aaf032314c91ced253d682414d35f7d8e)
- Meta updates [`dd0e942`](https://github.com/dannysmc95/rewyre/commit/dd0e94215bee831adb0650a812544a8551286122)
- Meta updates [`73157a2`](https://github.com/dannysmc95/rewyre/commit/73157a22e50c8cbc0c6076f748447cb785187c19)
- Meta updates [`2254cc6`](https://github.com/dannysmc95/rewyre/commit/2254cc6b166671d2bb9345d2e457b7cd727ee4c3)
- Meta updates [`ddcd929`](https://github.com/dannysmc95/rewyre/commit/ddcd9296223260a451a903721333bd9a40ded091)

## [v0.2.10](https://github.com/dannysmc95/rewyre/compare/v0.2.9...v0.2.10) - 2020-09-16

### Commits

- Added latest [`1fefda2`](https://github.com/dannysmc95/rewyre/commit/1fefda25c581c46b059544ec38874eb2aa788a05)
- Referenced new repo for rewyre and updated package information. [`45f6d5d`](https://github.com/dannysmc95/rewyre/commit/45f6d5daa2109ae4d433e938f85a0b231dec285c)
- Noted the new rewyre-vue boilerplate. [`80eb264`](https://github.com/dannysmc95/rewyre/commit/80eb264c4062c3febe5c6034e163fc4c3e372c49)

## v0.2.9 - 2020-09-16

### Merged

- Bump node-fetch from 2.6.0 to 2.6.1 [`#1`](https://github.com/dannysmc95/rewyre/pull/1)

### Commits

- Initial (after move) [`aff5445`](https://github.com/dannysmc95/rewyre/commit/aff5445c463b89f98edd65ce1392f4b24843ac57)
- Added previous commits [`4d0147f`](https://github.com/dannysmc95/rewyre/commit/4d0147fce845307e9a9eb5e8c7060e5fe902d96d)
- Bumped version to 0.2.9 [`432d3cc`](https://github.com/dannysmc95/rewyre/commit/432d3ccb16703487e06697bce5248b388db8c011)
