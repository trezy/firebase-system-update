<div align="center">
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
  <h1><code>Firebase System Update</code></h1>

  <p>Firebase System Update automates the deployment of Firebase services from Vercel projects.</p>

  <hr />
</div>

[![BSD-3-Clause License][license-badge]][license]
[![Code of Conduct][code-of-conduct-badge]][code-of-conduct]
[![PRs Welcome][prs-badge]][prs]

[![Code Coverage][coveralls-badge]][coveralls]
[![Maintainability][codeclimate-badge]][codeclimate]
[![Dependencies][daviddm-badge]][daviddm]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

---

## What is Firebase System Update?

Firebase System Update is a [Vercel](https://vercel.com) platform integration for automating deploy of a project's Firebase services. After setting up Firebase System Update for a Vercel project, every successful future deploy will result in the following:

- [x] Firestore Security Rules will be released
- [ ] Firestore Indexes will be updated (wip: [#3](https://github.com/trezy/firebase-system-update/issues/3))
- [ ] Firebase Storage Security Rules will be released (wip: [#1](https://github.com/trezy/firebase-system-update/issues/1))
- [ ] Realtime Database Security Rules will be released (wip: [#2](https://github.com/trezy/firebase-system-update/issues/2))

---

## Setting up Firebase System Update

To get started with Firebase System Update, you'll need to add the integration to your project in Vercel. You can do install the integration at https://vercel.com/integrations/firebase-system-update.

First, the Vercel installer will walk you through the process of choosing what scope to install the integration to (personal account vs team account), then selecting what projects you want to set it up for.

From there, the Firebase System Update installer will walk you through setting up each project you've chosen. Once you finish set up, you're done! If you need to change your settings later, you can do so at https://firebase-system-update.vercel.app/configure

---

## Contributing

If you want to contribute, make sure to check out our [contributing guide][contributing]!





[code-of-conduct]: CODE_OF_CONDUCT.md
[code-of-conduct-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[codeclimate]: https://codeclimate.com/github/trezy/firebase-system-update
[codeclimate-badge]: https://img.shields.io/codeclimate/maintainability/trezy/firebase-system-update.svg?style=flat-square
[contributing]: CONTRIBUTING.md
[coveralls]: https://coveralls.io/github/trezy/firebase-system-update
[coveralls-badge]: https://img.shields.io/coveralls/trezy/firebase-system-update.svg?style=flat-square
[daviddm]: https://david-dm.org/trezy/firebase-system-update
[daviddm-badge]: https://img.shields.io/david/trezy/firebase-system-update.svg?style=flat-squarestyle=flat-square
[github-watch]: https://github.com/trezy/firebase-system-update/watchers
[github-watch-badge]: https://img.shields.io/github/watchers/trezy/firebase-system-update.svg?style=social
[github-star]: https://github.com/trezy/firebase-system-update/stargazers
[github-star-badge]: https://img.shields.io/github/stars/trezy/firebase-system-update.svg?style=social
[license]: LICENSE
[license-badge]: https://img.shields.io/github/license/trezy/firebase-system-update.svg?style=flat-square
[prs]: CONTRIBUTING.md
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20firebase-system-update%20by%20%40TrezyCodes%20https%3A%2F%2Fgithub.com%2Ftrezy%2Ffirebase-system-update%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/trezy/firebase-system-update.svg?style=social

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://trezy.com"><img src="https://avatars.githubusercontent.com/u/442980?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Trezy</b></sub></a><br /><a href="https://github.com/trezy/firebase-system-update/commits?author=trezy" title="Code">💻</a> <a href="#content-trezy" title="Content">🖋</a> <a href="https://github.com/trezy/firebase-system-update/commits?author=trezy" title="Documentation">📖</a> <a href="#design-trezy" title="Design">🎨</a> <a href="#ideas-trezy" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-trezy" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-trezy" title="Maintenance">🚧</a> <a href="#projectManagement-trezy" title="Project Management">📆</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!