---
title: 'A11yAdvent Day 8: Alternative Text to Images'
---

Ah, alt text! Alternative text to images has been an age old topic on the web. The goal is to provide a description of the image in case it fails to load or for people who are not able to perceive images and rely on textual content to get their meaning. It is very important for people using screen-readers, as well as search engines.

There are countless resources on the web about authoring good alternative texts to images, my favourite of all is [this ultimate guide by Daniel Göransson](https://axesslab.com/alt-texts/), so I will just give a bit of a recap.

- The alternative text is supposed to describe the image. This is not the appropriate place for credits or attributions. This is not the appropriate place for keywords stuffing (no place is).
- Focus on the main content and don’t go overboard with the details. Make it as concise and to the point as possible.
- Do not mention that it is a photo, a picture or an image. This is already implied by the fact that this is in the `alt` attribute of an image.
- If you can, end with a period so there is a pause after announcing it.

Finally, there are some cases where you can leave out the alternative text entirely, and leave the attribute empty (`alt=""`):

- If the image is decorative or does not help comprehension of the document. For instance, the image used as a masthead.
- When the text would just repeat surrounding text, such as the image of an article tile or an icon within a link containing text.
- When the image is part of a repeated list, such as users’ profile picture in a feed or a chat conversation.

That’s the main gist. Images are a critical part of the web — we have to appreciate that not everyone can perceive them the same way, and that’s why it’s critical to describe them properly.
