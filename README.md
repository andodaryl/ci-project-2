# Personal Library by InfoTech

## Disclaimer
The stories, people, brands and products in this software development project are fictitious and any resemblance to real life occurrence is by pure coincidence. The developer of this project, as part of an academic portfolio, referred to and used various open source materials available online to create an interactive brochure website, all of which are credited at the end.

## Project Overview
InfoTech is a sole proprietorship which offers consumer software solutions.

The business seeks to create an easy way for knowledge enthusiasts to maintain a personal library of offline and online material for progress tracking and analysis of knowledge attainment behaviour.

Application features are implemented across Alpha, Beta and Commercial phases to allow for user-feedback-directed development and market viability testing.

The initial product offering is a simple web-application for reading list maintenance.

## Stakeholder Expectations

### Business Case
Build brand awareness and user-base by giving free access to the Alpha version before introducing a freemium pricing model in Beta.

### Dev Case
Alpha version is available for public access with a user feedback system in place to facilitate a user-centric development journey.

### Target Audience
Initial target market is as follows: 
* Avid and casual consumers of literature (video, audio, and text).
* At least basic knowledge of using internet websites.
* Niche target of people that search for educational videos.
* Niche target of people that search for educational and recreational books, articles and podcasts.
* Minimalist aesthetic.

### User Experience

Product use-case outlined in terms of user needs.

As a user of this web application I want to be able to:

1. Navigate and interact with the application easily on various devices for ease of regular use.
2. Feel that the application is secure to prevent risk of data loss or privacy infringement.
3. Know the people and story behind the application for extra sense of legitimacy.
4. Be able to contact the providers of this application for feedback or queries.
5. Display list of books to keep track of reading list.
6. See details of books for further information.
7. Add, edit or delete books for reading list maintenance.

## Project Management

Managed using Prince2 methodology via this [Trello Board](https://trello.com/b/O4Q5J5Zy/personal-library).

## Design

### Wireframes

[Figma](https://www.figma.com/) was chosen for the wireframing environment as it offers powerful features for free.  

The [Bootsrap 5 UI Kit](https://www.figma.com/community/file/979333438575836958) by ThemeSelection was used to create the wireframes within Figma.

Screenshots for desktop/large tablet wireframes available ~[here](#)~.  
Screenshots for mobile/small tablet wireframes available ~[here](#)~.

### Device Dimensions

[The Bootstrap 5 Framework](https://getbootstrap.com/docs/5.0/layout/containers/) uses predetermined device dimensions:
* Extra small <576px
* Small ≥576px
* Medium ≥768px
* Large ≥992px
* X-Large ≥1200px
* XX-Large ≥1400px

This allows for a responsive and personalised website experience.

### Color Pallette

For simplicity and consistency, three main colors were chosen using boostrap default colors:
* Primary: #212529 >>> 'bootstrap dark'
* Secondary: #f8f9fa >>> 'boostrap light'
* Tertiary: #dc3545 >>> 'boostrap danger'

[Paletton](https://paletton.com/) creates variations of the main colors for stylistic purposes.

### Typography

[The Bootstrap 5 Framework](https://getbootstrap.com/docs/5.0/content/reboot/#native-font-stack) uses a predetermined set of native fonts which allows for maximum compatibility while maintaining aesthetic coherence:

```
$font-family-sans-serif:
  // Cross-platform generic font family (default user interface font)
  system-ui,
  // Safari for macOS and iOS (San Francisco)
  -apple-system,
  // Windows
  "Segoe UI",
  // Android
  Roboto,
  // Basic web fallback
  "Helvetica Neue", Arial,
  // Linux
  "Noto Sans",
  "Liberation Sans",
  // Sans serif fallback
  sans-serif,
  // Emoji fonts
  "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !default;
```

### Logo

## Development Log

These are recorded in the Trello Board above, however reiterated here for convenience.

### Features

#### Implemented

#### Backlog

### Bugs

#### Fixed

#### Backlog

### Testing

#### Validator Testing

#### User Experience Testing

#### Manual Testing

## Deployment

With the help of this [tutorial](https://dev.to/yuribenjamin/how-to-deploy-react-app-in-github-pages-2a1f), the website was deployed to GitHub pages using the following steps:
1. After logging in, navigate to the target Github repo.
2. Select the “Settings” tab.
3. Select the “Pages” button on the menu to the left.
4. Select the "Main" branch as the source.
5. Select the "Save" button.
6. The website will be deployed automatically and a link to the live website will be displayed.

The live page is available [here](https://andodaryl.github.io/personal-library/).

## Forking Github Repos

According to [official Github documentation](https://docs.github.com/en/get-started/quickstart/fork-a-repo), this repo can be forked using the following steps:
1. After logging in, navigate to the target Github repo.
2. Select the "Fork" button located in top-right area of the page.
3. Select target location for the forked repo.

## Cloning Forked Repo via HTTPS

Additionally, you can download a local copy of the forked repo using the following steps:
1. After logging in to Github, navigate to the desired forked repo.
2. Select the "Code" button.
3. Copy the URL link below "Clone with HTTPS".
4. In a terminal with "GIT" installed, navigate to your target directory.
5. Using the `git clone` command, paste in the URL and press enter:
```
$ git clone https://github.com/YOUR-USERNAME/YOUR-REPO 
\> Cloning into `YOUR-REPO`...
\> remote: Counting objects: 10, done.
\> remote: Compressing objects: 100% (8/8), done.
\> remove: Total 10 (delta 1), reused 10 (delta 1)
\> Unpacking objects: 100% (10/10), done.
```

## Credits

Maintaining competence requires continuous learning from and reflection upon the work of others. It is important to give credit and acknowledgement not only to recognise time and effort expended but also to illustrate the rationale behind the methods applied and direct observers to the origins thereof.

This project used the following resources for inspiration and instruction:

Tutorials

* ...

Competitor Research

* Observing competitors helps determine the market positioning of this retail website.
* ...

Development Tools / Sources

_See technologies section for development environment and content generators / sources._

### Technologies

Development Environment
* [GitPod](https://www.gitpod.io/)
* [Figma](https://www.figma.com/)
* [Adobe Photoshop](https://www.adobe.com/ie/products/photoshop.html)

Testing
* [Lighthouse](https://developers.google.com/web/tools/lighthouse)
* [Chrome Devtools](https://developer.chrome.com/docs/devtools/)
* [W3C Validator](https://validator.w3.org/nu/)
* [CSS Validator](https://jigsaw.w3.org/css-validator/)
* [Code Institute - Form Dump](https://formdump.codeinstitute.net/)
* [Favicon Checker](https://realfavicongenerator.net/favicon_checker)
* [Accessibility Checker](https://wave.webaim.org/)

Content Generators / Sources
* [Privacy Policy Generator](https://www.privacypolicygenerator.info/)
* [Palette Generator](https://paletton.com/)
* [Real Favicon Generator](https://realfavicongenerator.net/)
* [Code Institute Gitpod Template](https://github.com/Code-Institute-Org/gitpod-full-template)
* [Code Formatter](https://webformatter.com/)

Frameworks / Libraries
* [Boostrap V](https://getbootstrap.com/)
* [Boostrap V Icons](https://blog.getbootstrap.com/2021/01/07/bootstrap-icons-1-3-0/)
* [Bootsrap 5 UI Kit](https://www.figma.com/community/file/979333438575836958)

Languages
* [HTML5](https://www.w3schools.com/html/default.asp)
* [CSS](https://www.w3schools.com/css/default.asp)
* [Javascript](https://www.w3schools.com/js/default.asp)

### Further Acknowledgements
The vibrant [Slack](https://slack.com/) community, cohort, tutors and my mentor Akshat Garg at [Code Institute](https://codeinstitute.net/).

[Code Institute](https://codeinstitute.net/), [FreeCodeCamp](https://www.freecodecamp.org/), [TheOdinProject](https://www.theodinproject.com/), and [W3Schools](https://www.w3schools.com/) for providing me with fundamental skills for software development.

[Prince2](https://www.axelos.com/certifications/propath/prince2-project-management) for the project management methodology.