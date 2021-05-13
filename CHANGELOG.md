# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
