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
