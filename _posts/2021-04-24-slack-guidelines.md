---
title: Slack guidelines
---

<style>
@media (min-width: 700px) {
  .SlackGuidelines__image { 
    float: right;
    margin-top: 0;
    margin-left: 1em;
    max-width: 325px;
    border: 1px solid rgb(0 0 0 / 0.1);
  }
}
</style>

My coworker [Anita Singh](https://twitter.com/anitas3791) and I have been working on some Slack guidelines for [Gorillas](https://gorillas.io) in order to encourage mindful behaviour and being respectful of everyone’s time in written communication.

A lot of you seemed interested in us publishing them, so here they are. They are not a verbatim copy of our company guidelines since ours are quite Gorillas-specific, and they should be generic enough to be taken in most organizations.

- [Setting up your profile](#setting-up-your-profile)
- [Creating channels](#creating-channels)
  - [Public or private](#public-or-private)
- [Writing at the right place](#writing-at-the-right-place)
- [Notifying people](#notifying-people)
- [Writing content](#writing-content)
- [When not to use Slack](#when-not-to-use-slack)
- [Personally-identifiable information](#personally-identifiable-information)

## Setting up your profile

In many organizations, Slack is the primary communication tool, even supplanting email. And in this day and age of global pandemic and ever-growing remote working culture, Slack is often the only way we have to know the people we work with.

<img src="/assets/images/slack-guidelines/profile.png" alt="Slack Profile of Kitty, showcasing their picture, their role and their pronouns." class="SlackGuidelines__image" />

This is why it is important to fill your Slack profile.

- Name: Your full name, usually matching the company’s email address for convenience (e.g. Kitty Giraudel).
- Display name: Your usual name or full name, used as Slack handle (e.g. Kitty).
- Pronouns: {% footnoteref "pronouns" "The pronouns field is not part of the default info and needs to be added via a Slack administrator. It is a great way to normalize the use of neo-pronouns and help non-binary people feel more included." %}Your pronouns{% endfootnoteref %} (e.g. they/them).
- Profile photo: Anything that’s not the default Slack avatar, really.
- Profession: Your role or team. In an organization with hundreds of thousands of people, it can be difficult to figure out who does what. Adding one’s profession to the profile really helps with perspective.

<div style="clear: both"></div>

## Creating channels

Slack has some [official guidelines for creating channels](https://slack.com/intl/en-de/help/articles/217626408-Create-guidelines-for-channel-names), which outline helpful suggestions around naming conventions and organization structure.

Before creating a channel however, ask yourself whether you need a new channel at all. While channels are cheap, they can also cause _Slack fatigue_ where there are just too many of them, and keeping track of things becomes cumbersome. It can also lead to people constantly redirecting one another to a more appropriate channel, creating friction.

In tech organization, we tend to recommend avoid discipline-specific channels (such as #consumer-facing-ios, #consumer-facing-android, #consumer-facing-web…) and instead have one channel with all the relevant stakeholders. This encourages cross-discipline collaboration and lowers the risk of tribalism and discipline-centric attitude.

Once having created a new channel, set its description for sake of clarity, and open with an explanatory message about the purpose of the channel, and why/when people should use it.

{% info %}Unless there will be ongoing discussions about a unique topic, it might be preferable to use direct messages or group messages.{% endinfo %}

### Public or private

Generally speaking, default to public when creating a channel. Private channels cannot be turned into public channels down the line, which means information within them will remain forever restricted — this should be intended for specific purposes only.

There certainly are cases where private channels should be used, such as discussing confidential topics (legal, leadership…), but most conversations should hopefully be quite open. This encourages transparency and reduces duplicated communication and information loss.

## Writing at the right place

Picking the right channel, especially where there are so many of them, can be tricky. It might be interesting to have a company-available document with some high-level overview of the Slack organization. For instance, every department or long-lasting team may have their own public channel for people to report issues or suggestions.

If there is a channel with stakeholders regarding a topic, it is best to post there so that everyone is in the loop and has access to the information. Reserve direct- or group-messaging when the conversation is short-lived and only pertains you and the person(s) you are messaging.

If you are posting something that will spark a discussion or replying to someone’s message, please start a thread or respond in a thread. This will minimize noise in channels and let people find content more easily.

## Notifying people

As a rule of thumb, refrain from using `@channel`, unless absolutely required (like an urgent announcement for everyone). If getting people’s immediate attention is necessary, prefer using `@here` since it will only notify people currently online, which is often enough.

```
❌ @channel Who can help me with setting up this tool for this afternoon?
✅ @here Who can help me with setting up this tool for this afternoon?
```

Even with `@here`, please be considerate and remember that it will notify everyone on the spot, which might disturb people, especially people with ADHD (Attention Deficit Hyperactivity Disorder).

```
❌ @here I started drafting this document for us to keep track of things.
   Check it out when you have a chance.
✅ Hey team, I started drafting this document for us to keep track of things.
   Check it out when you have a chance.
```

Additionally, when referring to someone in a message, do not mention them unless they need to be aware of your message. (Thank you to [Pedro Duarte for the suggestion](https://twitter.com/peduarte/status/1384808764503740417?s=20)!)

```
❌ I discussed it with @Kitty and we think this is the proper way to go.
✅ I discussed it with Kitty and we think this is the proper way to go.
```

## Writing content

To help people figure out whether a conversation is relevant to them, it can be interesting to start messages (especially when long and requiring acknowledgement or action) with whom it is for, and what kind of urgency it is.

Similarly, the decision making process and important discussions happening over video calls should be summarized on Slack so everyone has access to the information.

## When not to use Slack

Slack is a fantastic tool and the way we work with one another. Yet, it shouldn’t be the tool for everything, especially considering the other services and softwares we use.

Here is a non-exhaustive list of things not to use Slack for:

- Requirement tracking: use the software management tool (e.g. Jira).
- Documentation: use the documentation tool (e.g. Notion or Google Docs).
- Very large text documents: use Google Docs (or similary).
- Announcements that need to be persisted: use emails.
- Complex and/or tabular information: use Google Sheets (or similar).

## Personally-identifiable information

Personally-identifiable information (PII for short) is any sort of information about people (such as customers) which can be used to identify an individual personally (such as a name, an address, a phone number…). Due to GDPR regulation and a general desire to respect people’s privacy, we should refrain from sharing people’s information on Slack. This includes both within messages and in screenshots as well.
