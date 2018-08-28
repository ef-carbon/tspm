## [2.2.5](https://github.com/ef-carbon/tspm/compare/v2.2.4...v2.2.5) (2018-08-28)


### Bug Fixes

* add filtering for typescript definition files ([75d57af](https://github.com/ef-carbon/tspm/commit/75d57af))
* always filter out definition files ([dd0f4f1](https://github.com/ef-carbon/tspm/commit/dd0f4f1))

## [2.2.4](https://github.com/ef-carbon/tspm/compare/v2.2.3...v2.2.4) (2018-08-01)


### Bug Fixes

* **package:** accept TS ^3 as a peer ([d5ef08c](https://github.com/ef-carbon/tspm/commit/d5ef08c))

## [2.2.3](https://github.com/ef-carbon/tspm/compare/v2.2.2...v2.2.3) (2018-07-16)


### Bug Fixes

* remove `extendable-error` dependency ([6e9c0a1](https://github.com/ef-carbon/tspm/commit/6e9c0a1))

## [2.2.2](https://github.com/ef-carbon/tspm/compare/v2.2.1...v2.2.2) (2018-06-13)


### Bug Fixes

* **package:** update winston to version 3.0.0 ([622a3a8](https://github.com/ef-carbon/tspm/commit/622a3a8))

<a name="2.2.1"></a>
## [2.2.1](https://github.com/ef-carbon/tspm/compare/v2.2.0...v2.2.1) (2018-03-18)


### Bug Fixes

* walk ES AST to map all requires ([95979c7](https://github.com/ef-carbon/tspm/commit/95979c7))

<a name="2.2.0"></a>
# [2.2.0](https://github.com/ef-carbon/tspm/compare/v2.1.0...v2.2.0) (2018-03-18)


### Features

* add support for rewriting `require` calls ([d1ea076](https://github.com/ef-carbon/tspm/commit/d1ea076))

<a name="2.1.0"></a>
# [2.1.0](https://github.com/ef-carbon/tspm/compare/v2.0.2...v2.1.0) (2018-02-13)


### Features

* **es:** add JSX parsing support ([1410802](https://github.com/ef-carbon/tspm/commit/1410802))

<a name="2.0.2"></a>
## [2.0.2](https://github.com/ef-carbon/tspm/compare/v2.0.1...v2.0.2) (2018-02-07)


### Bug Fixes

* **tspm:** warn on unsupported compiler output ([37622d3](https://github.com/ef-carbon/tspm/commit/37622d3))

<a name="2.0.1"></a>
## [2.0.1](https://github.com/ef-carbon/tspm/compare/v2.0.0...v2.0.1) (2018-02-07)


### Bug Fixes

* **declaration:** improve TypeError message ([a7f96fc](https://github.com/ef-carbon/tspm/commit/a7f96fc))
* **ts:** filter exports without a `moduleSpecifier` ([5de60e8](https://github.com/ef-carbon/tspm/commit/5de60e8))

<a name="2.0.0"></a>
# [2.0.0](https://github.com/ef-carbon/tspm/compare/v1.2.0...v2.0.0) (2018-02-07)


### Code Refactoring

* make mapping classes generic ([3e3df9d](https://github.com/ef-carbon/tspm/commit/3e3df9d)), closes [#2](https://github.com/ef-carbon/tspm/issues/2)


### Features

* implement TypeScript declaration mapping ([3392752](https://github.com/ef-carbon/tspm/commit/3392752)), closes [#2](https://github.com/ef-carbon/tspm/issues/2)


### BREAKING CHANGES

* The re-mapping classes have been made generic and there are ES derived variants of
each. This is required so that we can nicely re-map TypeScript declaration files using the same
re-mapping framework. The demo library code in the `README` will still work, however, the modules
have all moved around hence the breaking change :boom: If you do not do any module loading of the
library, then you will require no code changes other than upgrading your dependency

<a name="1.2.0"></a>
# [1.2.0](https://github.com/ef-carbon/tspm/compare/v1.1.0...v1.2.0) (2018-02-06)


### Features

* **export:** expose `File` and `IFileOptions` ([0b8357f](https://github.com/ef-carbon/tspm/commit/0b8357f))

<a name="1.1.0"></a>
# [1.1.0](https://github.com/ef-carbon/tspm/compare/v1.0.0...v1.1.0) (2018-02-06)


### Bug Fixes

* **declaration:** correct class name ([03c9892](https://github.com/ef-carbon/tspm/commit/03c9892))
* **file:** determine correct source file root ([48c0180](https://github.com/ef-carbon/tspm/commit/48c0180))
* **import:** correct class name ([e680cc5](https://github.com/ef-carbon/tspm/commit/e680cc5))


### Features

* **declaration:** export expected `Base` type ([1bc186d](https://github.com/ef-carbon/tspm/commit/1bc186d))
* **declaration:** expose `file` property ([f6654f9](https://github.com/ef-carbon/tspm/commit/f6654f9))
* **main:** write the files ([bb5026c](https://github.com/ef-carbon/tspm/commit/bb5026c))

<a name="1.0.0"></a>
# 1.0.0 (2018-02-06)


### Features

* implement a TypeScript path mapper ([aab64b5](https://github.com/ef-carbon/tspm/commit/aab64b5))
