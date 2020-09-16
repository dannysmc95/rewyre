# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.2.4](https://github.com/rewyre-team/core/compare/v0.2.3...v0.2.4) - 2020-07-26

### Commits

- Added abstract controller method to setAuthToken (cookie). [`94b25db`](https://github.com/rewyre-team/core/commit/94b25db1f50f6d0bd5f5b7a8a5933377ef429d71)
- Updated changelog [`d38457a`](https://github.com/rewyre-team/core/commit/d38457a8cb0babe1c67714e7e1ee1e9b1b472dab)

## [v0.2.3](https://github.com/rewyre-team/core/compare/v0.2.2...v0.2.3) - 2020-07-26

### Commits

- Added the raw property to IContext to access the raw express data. [`a8da8da`](https://github.com/rewyre-team/core/commit/a8da8da797e0ccd1b1b28770a944b48606fff9f0)
- Added changelog update [`07a1beb`](https://github.com/rewyre-team/core/commit/07a1beb982e37e76b5e2dee5fcf4f721f609eb53)
- Added the raw property to IContext to access the raw express data. [`8de90c7`](https://github.com/rewyre-team/core/commit/8de90c7a392912eebea4f7fcae89c9647d61c84a)

## [v0.2.2](https://github.com/rewyre-team/core/compare/v0.2.0...v0.2.2) - 2020-07-25

### Commits

- Added a try catch around the express methods to protect in case of errors, to generically return a 500, and output the error into the console. [`5c7eb0a`](https://github.com/rewyre-team/core/commit/5c7eb0af444a8d8ad87b10c77863bd190af333af)
- Added quick fix as the context interface was missing property definitions [`0037788`](https://github.com/rewyre-team/core/commit/003778891b95d3b7654b374748401b593da53710)
- Bumped version, and added new authenticated decorator alongside new properties for the IContext decorator for session and auth_token. [`0165415`](https://github.com/rewyre-team/core/commit/0165415676a1e77f8d6136136f8c4887c8bcb3a5)

## [v0.2.0](https://github.com/rewyre-team/core/compare/0.1.0...v0.2.0) - 2020-07-24

### Commits

- Permissions implementation starting point, implemented the new decorator and built server wrappers around [`bba78a6`](https://github.com/rewyre-team/core/commit/bba78a60a613046310cf25a8da53891993da7ecc)
- Added tweaks to the server and the authenticated decorator. [`0f8c8f4`](https://github.com/rewyre-team/core/commit/0f8c8f4cd35de1e4bc453e2079a7429c78b1a623)
- Added updated changelog [`82906c5`](https://github.com/rewyre-team/core/commit/82906c59770741c47a0357d75b46f35d62d9066b)

## 0.1.0 - 2020-07-20

### Commits

- Initial version including everything from the aether-framework@0.2.7 package. [`67fda8f`](https://github.com/rewyre-team/core/commit/67fda8f6860c014bc646ce420389ebbb0603fde0)
- Updated the changelog functionality and started some rebranding to rewyre. [`2fb8109`](https://github.com/rewyre-team/core/commit/2fb81095dabde103aa68a64efc7b938acac0df02)
- Set the package to public in the publish config. [`8f83014`](https://github.com/rewyre-team/core/commit/8f8301449c8941fdb5ec07437a071a9e40ed8f41)
