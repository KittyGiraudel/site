---
title: 'GitHub As A Workflow'
tags:
  - github
  - workflow
  - process
---

> **Edit (2015/09/09):** I just (re-)discovered [ZenHub](https://www.zenhub.io/) which is a highly advanced Google Chrome extension for Agile project management **inside** GitHub. Basically, ZenHub brings a lot of features inside the GitHub UI by connecting to your GitHub account (like the usual “Sign in with GitHub” button does), such as Scrum boards, burndown charts, as well as a lot of tiny yet handy extra features. We will try it seriously on an upcoming project at Edenspiekermann, but it definitely goes in the way of keeping things inside GitHub, including project management.

This article is the result of a discussion about development workflow with one of our Scrum Masters at Edenspiekermann. Therefore, it assumes you have basic notions of [Agile](https://en.wikipedia.org/wiki/Agile_software_development) and [Scrum](<https://en.wikipedia.org/wiki/Scrum_(software_development)>). If you don't, you still might benefit from reading the article but might be missing some keys to fully appreciate it. It also uses (although does not rely on) the [Gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow/) workflow.

In this short document, I try to describe what I feel would be a great workflow for me, using [GitHub](https://github.com) as a central point rather than having a collection of tools. Obviously, this standpoint is highly developer-centric and might not fit all teams / projects.

Given how long this article is, here is a table of contents so you can quickly jump to the section you want:

1. [Introduction](#introduction)
1. [What problem does it solve](#what-problem-does-it-solve)
1. [What problem does it introduce](#what-problem-does-it-introduce)
1. [Creating the pull-request](#creating-the-pull-request)
1. [Naming the pull-request](#naming-the-pull-request)
1. [Filling the description](#filling-the-description)
1. [Using comments](#using-comments)
1. [Reviewing the pull-request](#reviewing-the-pull-request)
1. [Merging the pull-request](#merging-the-pull-request)
1. [Tip: using labels](#tip-using-labels)
1. [Tip: using assignees](#tip-using-assignees)
1. [Tip: using milestones](#tip-using-milestones)
1. [Tip: using issues](#tip-using-issues)

## Introduction

Below is a short and informal methodology on how to use [GitHub](https://github.com) as a project workflow, heavily relying on [pull-requests](https://help.github.com/articles/using-pull-requests/). While it might sound scary as first, this approach actually has a lot of benefits that we'll investigate further in the next section.

The rough idea is that at the beginning of a [sprint](http://scrummethodology.com/scrum-sprint/), we create a(n empty) pull-request for all [user stories](http://scrummethodology.com/scrum-user-stories/). In the description of the pull-request, we write tasks in (GitHub Flavoured) Markdown using [GitHub support for checkboxes](https://github.com/blog/1375%0A-task-lists-in-gfm-issues-pulls-comments). Then, affected developers commit their work to this branch, progressively checking out the tasks. Once all tasks from a pull-request have been treated, this one can be reviewed then merged.

## What problem does it solve

- The code, code reviews, stories and tasks are all centralized in the same place, making it very easy for a developer to jump from one thing to the other.
- [ScrumDo](https://app.scrumdo.com) and other process tools are not always the best place for discussions and commenting, while GitHub is actually meant for this.
- GitHub has email notifications, which is helpful to know what's going in the project and where a developer might need to get involved.
- GitHub has a lot of handy features, such as labels, Markdown, user pinging and code integration, which makes it a good tool for managing code projects.
- Bonus: [Slack](https://slack.com) has GitHub integration, making the whole process seamless.

## What problem does it introduce

Everybody, from the Scrum Master to the Product Owner, needs a GitHub account. It actually is only a matter of minutes, but it still needs to be done for this workflow to work correctly.

## Creating the pull-request

The idea is that every feature involving some development has its own pull-request opened at the beginning of the sprint. Tasks are handled as a checklist in the description of the pull-request. The good thing with this is that GitHub is clever and shows the progress of the pull-request in the list view directly.

<figure class="figure">
  <img alt="The progress is shown directly in the PR view" src="/assets/images/github-as-a-workflow/01.png" />
  <figcaption>The progress is shown directly in the PR view</figcaption>
</figure>

For all stories involving development, create a branch named after the story and open a pull-request from this branch to the main one. When sticking to [Gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow/) conventions, the main branch is `develop`, and story branches should start with `feature/` (some might start with `fix/` or `refactor/`). Then, we usually put the number of the story first, and a slug for the story goal (e.g. `feature/42-basic-teaser`).

Opening pull-requests can be done directly on GitHub, without having to clone the project locally or even having any Git knowledge whatsoever. But only when there is _something to compare_. It means that it is not possible to open a pull-request between two identical branches. Bummer.

To work around this issue, there are two options: either waiting for the story to be started by someone (with at least a commit) so there is actually something to compare between the feature branch and the main branch. Although that is not ideal as the idea would be to have it from the beginning of the sprint so that all stories have their own PR opened directly. A possible workaround to this issue would be to do an empty commit like so:

```git
# Creating the branch
git checkout -b feature/42-basic-teaser

# Adding an empty commit (with a meaningful name) to make the pull-request possible
git commit --allow-empty -m "Feature 42: Basic teaser component"
```

The point of this commit is to initialize the branch and the feature so that a pull-request can be created on GitHub.

At this point, head onto the home of the GitHub repository and click on the big ol' green button. Then, create a pull-request from the relevant branch to the main one (automatically selected). That's it! For more details about how to name and fill the pull-request, refer to the next sections.

## Naming the pull-request

Name the pull-request after the feature name, and prefix it with `[WIP]` for _Work In Progress_. This will then be changed to `[RFR]` for _Ready For Review_ once the story is done (see [Reviewing the pull-request](#reviewing-the-pull-request)). If it is someone's specific job to merge pull-requests and deploy, you can also change the name for `[RFM]` (for _Ready For Merging_) after the reviewing process so it's clear that the feature can be safely merged.

_Note: depending on your usage of GitHub labels, you can also ditch this part and use `WIP`, `RFR` and `RFM` labels instead. I prefer saving labels for other things and stick the status in the PR name but it's really up to you._

## Filling the description

In the description of the story, create a list of tasks where a task is a checkbox, a short description and importantly enough, one or several persons involved in the making. From the Markdown side, it might look like this:

```git
* [ ] Create the basic React component (@hugogiraudel)
* [ ] Design the icons (@sharonwalsh)
* [ ] Integrate component in current page (@mattberridge)
* [ ] Clarify types of teasers with client (@moritzguth)
```

<figure class="figure">
  <img src="/assets/images/github-as-a-workflow/02.png" alt="The PR description contains the task to be accomplished for the feature" />
  <figcaption>The PR description contains the task to be accomplished for the feature</figcaption>
</figure>

As long as all actors from a project are part of the GitHub organisation behind the project, everybody can edit/delete any comment, so anyone is able to add new tasks to the description if deemed necessary.

_Note: GitHub Flavoured Markdown will automatically convert `[ ]` into an unticked checkbox and `[x]` into a ticked one. It will also remember the state of the checkbox so you can actually rely on it._

<figure class="figure">
  <img src="/assets/images/github-as-a-workflow/03.png" alt="The PR description contains checkboxes that can be checked to show current progress" />
  <figcaption>The PR description contains checkboxes that can be checked to show current progress</figcaption>
</figure>

## Using comments

The comments on the pull-request can be used to discuss the story or specific tasks. We can safely ask questions in there, tagging relevant contributors by prefixing their GitHub username with a `@` sign, include code blocks, quotations, images and pretty much whatever else we want. Also, everything is in Markdown, making it super easy to use.

<figure class="figure">
  <img src="/assets/images/github-as-a-workflow/04.png" alt="Comments are used to discuss some concerns and ask questions" />
  <figcaption>Comments are used to discuss some concerns and ask questions</figcaption>
</figure>

## Reviewing the pull-request

Once all checkboxes from the description have been checked, the name of the pull-request can be updated to `[RFR]` for _Ready For Review_. Ideally, the person checking the last bullet might want to ping someone to get the reviewing process started. Doing so avoid having a pull-request done but unmerged because nobody has reviewed it.

To review a pull-request, we use GitHub inline comments in the _Files changed_ tab. In there, we can comment any line to ask for modification. Adding a line comment notifies the owner of the pull-request so that they know they have some re-working to do, and the comment shows up in the _Conversation_ tab.

<figure class="figure">
  <img src="/assets/images/github-as-a-workflow/05.png" alt="GitHub inline comments are the ideal way for collaborating on code" />
  <figcaption>GitHub inline comments are the ideal way for collaborating on code</figcaption>
</figure>

When updating a line that is the object of an inline comment, the latter disappears because it is not relevant anymore. Then, as comments get fixed, they disappear so the pull-request remains clean.

<figure class="figure">
  <img src="/assets/images/github-as-a-workflow/06.png" alt="When an inline comment has been taken care of, it disappears to avoid cluttering the diff" />
  <figcaption>When an inline comment has been taken care of, it disappears to avoid cluttering the diff</figcaption>
</figure>

## Merging the pull-request

Once the review has been done, the pull-request can be merged into the main branch. If everything is fine, it should be mergeable from GitHub directly but sometimes there are potential conflicts so we need to either rebase the branch to synchronize it with the main branch or merge it manually. Anybody can do it, but the pull-request owner is probably the best person to do it.

_Note: in order to keep a relevant and clean commit history, it would be wise to keep commit messages clear and meaningful. While this is not specific to this methodology, I think it is important enough to stress it._

## Tip: using labels

Labels can be very helpful to add extra pieces of information to a pull-request on GitHub. They come in particularly handy as they show up in the list view, making it visible and obvious for everybody scanning through the open pull-requests.

There is no limit regarding the amount of labels a project can have. They also are associated with colors, building a little yet powerful nomenclaturing system. Labels can be something such as _Design_, _Front-end_, _Back-end_, or even _Waiting for info_, _Waiting for review_ or _To be started_. You name it.

<figure class="figure">
  <img src="/assets/images/github-as-a-workflow/07.png" alt="Labels are used to create a nomenclature" />
  <figcaption>Labels are used to create a nomenclature</figcaption>
</figure>

On a project involving design, front-end, back-end and devops teams, I would recommend having these team names as labels so each team is aware of the stories they have to be working on.

<figure class="figure">
  <img src="/assets/images/github-as-a-workflow/08.png" alt="Labels are applied to stories to be able to filter them as well as givin more information from the PR view directly" />
  <figcaption>Labels are applied to stories to be able to filter them as well as givin more information from the PR view directly</figcaption>
</figure>

## Tip: using assignees

More often than not, a story is mostly for one person. Or when several actors have to get involved in a story, it usually happens one after the other (the designer does the mockup, then the front-end developer does the component, then the back-end developer integrates it in the process, etc.). Because of this, it might be interesting to _assign_ the pull-request to the relevant actor on GitHub, and change this assignment when needed.

<figure class="figure">
  <img src="/assets/images/github-as-a-workflow/09.png" alt="Assignees are a good way of knowing who works on what from the PR view" />
  <figcaption>Assignees are a good way of knowing who works on what from the PR view</figcaption>
</figure>

## Tip: using milestones

Because GitHub is a platform for Git, it is a great tool to conserve a clean history of a project. One way to achieve this goal (if desired), would be to use milestones. To put it simply, on GitHub a milestone is a named bucket of issues/pull-requests, that can optionally have a description and a date.

Applying this to a Scrum project could mean having a milestone per sprint (named after the number of the sprint), with a due date matching the one from the end of the sprint and the goals of the sprint in the description. All pull-requests (stories) would be tagged as part of the milestone.

<figure class="figure">
  <img src="/assets/images/github-as-a-workflow/10.png" alt="In this workflow, a milestone equals a sprint" />
  <figcaption>In this workflow, a milestone equals a sprint</figcaption>
</figure>

While not very helpful for the develop because all open pull-requests are part of the current sprint anyway, it might be interesting to have this as an history, where all pull-requests are gathered in milestones corresponding to sprints.

<figure class="figure">
  <img src="/assets/images/github-as-a-workflow/11.png" alt="From the view, we can know to which sprint a story belongs, in case some of them are late to be resolved" />
  <figcaption>From the view, we can know to which sprint a story belongs, in case some of them are late to be resolved</figcaption>
</figure>

## Tip: using issues

The fact that this workflow is heavily focused on pull-requests does not mean that GitHub issues are irrelevant. _Au contraire_! Issues can still be used for additional conversations, bug reports, and basically any non-feature-specific discussion.

Also depending on the relationship with the client (internal or external), issues might be the good place for them to report problems, bugs and suggestions. Again, everything is centralized on GitHub: the pull-requests remain clean and focused on features; issues are kept for all side-discussions.

---

That is all I have written about it so far. I would love to collect opinions and have feedback about this way of doing. Has anyone ever tried it? How does it perform? How does it scale? What are the flaws? What are the positive effects? Cheers!
