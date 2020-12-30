---
title: Accessibility feedback from Twitter
keywords:
  - accessibility
  - a11y
  - disability
---

## Accessibility feedback

[Safia Abdalla started a thread](https://twitter.com/captainsafia/status/871056480799162368) about problems encountered on the web by people with (any kind) of disability.

It’s super insightful but there are hundreds of response so I thought I’d write a TL;DR organised in categories (TL;DR which is still long…).

- [Vision disability](#vision-disability)
- [Mobility & physical impairments](#mobility-physical-impairments)
- [Cognitive & learning disabilities](#cognitive-learning-disabilities)
- [Hearing impairments](#hearing-impairments)

_Note: let me take this as an opportunity to link to this [introduction to web accessibility](https://gist.github.com/HugoGiraudel/5150c87d807f629ab006e2f6d2d9e86c) I wrote._

## Vision disability

{% assign small_font_sizes = "About small font sizes: [Tweet by @brandonsavage](https://twitter.com/brandonsavage/status/871067906414608387), [tweet by @Rejistania](https://twitter.com/Rejistania/status/871103754409582592)" | markdown %} {% assign migraines = "About migraines: [Tweet by @kolyshkin](https://twitter.com/kolyshkin/status/871118386754801664), [tweet by @DiamonDie](https://twitter.com/DiamonDie/status/871064350097854464), [tweet by @morganestes](https://twitter.com/morganestes/status/871070319129145348), [tweet by @elazar](https://twitter.com/elazar/status/871070831970885634)" | markdown %}

- Someone explains their {% footnoteref "small_font_sizes" small_font_sizes %}frustration about small font sizes {% endfootnoteref %}that cannot be safely increased because it breaks the layout. A few persons —{% footnoteref "migraines" migraines %}some with, some without <abbr title="Myalgic Encephalopathy">ME</abbr> / <abbr title="Chronic Fatigue Syndrome">CFS</abbr>{% endfootnoteref %}— agree or express a similar statement.

{% assign color_contrast = "About lack of contrast: [Tweet by @AndrewDixonSo](https://twitter.com/AndrewDixonSo/status/871062142799142913), [tweet by @may_gun](https://twitter.com/may_gun/status/871175194328539136), [tweet by @gamescharlie79](https://twitter.com/gamescharlie79/status/871069372655087617)" | markdown %}

- Some people extend the previous statement to include {% footnoteref "color_contrast" color_contrast %}poor color contrasts{% endfootnoteref %}, such as light grey on white background for instance or text on top of image.

- A colorblind person says [color-coded interfaces are very hard to use](https://twitter.com/AndrewDixonSo/status/871279577758392321) (toggles, heatmaps, etc.). This statement is shared by several other people having the [same kind of visually impairment](https://twitter.com/may_gun/status/871204180345729024).

- A person says that they would really [need to be able to turn an article into plain text](https://twitter.com/kalcobalt/status/871190773038841857), so they can export it to their Kindle where they can read in optimal circumstances. Unfortunately, that’s usually not that easy. Another person says they copy and paste content in another program which has better reading abilities.

- A visually-impaired person has a lot of [troubles with non-accessible CAPTCHAs](https://twitter.com/AndrewDixonSo/status/871083590456492032). This limits which services they can use.

- A person suffering from chronic migraines says they [turn down the brightness of their screen](https://twitter.com/xpyrrh/status/871085248250957824) and/or wear sunglasses to browse the web. For a person with similar symptoms, sites and apps offering a night mode are fantastic. [Another person mentions migraines](https://twitter.com/ai_valentin/status/871128305235361793) and how they are often completely underestimated in webdesign.

- A person describing themselves as “visually challenged” says simply [understanding the layout is sometimes difficult](https://twitter.com/AndrewDixonSo/status/871081499608588288).

- A person apparently using a screen-reader says [long navigation menus that get read out are annoying](https://twitter.com/AndrewDixonSo/status/871187732109840384); websites should implement a “skip-to-content” link. They also say alt text for images and captions for videos should not directly repeat the text from the page.

- Someone says the [lack of focus outline is a big problem](https://twitter.com/NutonDev/status/871096476423925761) for them when navigating with the keyboard, especially on links. They should not be removed (without replacement) because they “look ugly”.

## Mobility & physical impairments

- Someone warns against the [abuse of hovering effects and mouseover only interactions](https://twitter.com/zkline/status/871063757715193856), such as [opening a navigation menu](https://twitter.com/lizl_genealogy/status/871093933710876673).

- A person with Parkinson disease explains how [mouse interactions are extremely hard to perform accurately](https://twitter.com/KodierKroete/status/871175620146982912).

{% assign hand_tremor = "About hand tremors: [tweet by @SpoonsAndPOTS](https://twitter.com/SpoonsAndPOTS/status/871185534814531585), [tweet by @KristenAnneSF](https://twitter.com/KristenAnneSF/status/871230651357331460) and [tweet by @jenilg](https://twitter.com/jenilg/status/871187106936360960)." | markdown %}

- People with hand tremor say {% footnoteref "hand_tremor" hand_tremor %}precise gestures such as double-clicking or tap-and-hold are difficult{% endfootnoteref %} to perform.

- Someone having a cerebral palsy shares the same problem and literally [cannot use a mouse](https://twitter.com/garyrozanc/status/871061173545963522) because of that; they use touch screens instead.

- Someone says [click/tap targets that are either too small to aim precisely](https://twitter.com/csixty4/status/871116171566862337), or —interestingly enough— bigger than they need to be (such as headline + excerpt instead of just headline) are sometimes hard to use.

- A person explains their fingers sort of stop working after a little while of using the computer / touch screen at which point they [have to rely on voice-to-text](https://twitter.com/WhitCoko/status/871108709652496385).

- A person with deep pain in their elbow says the [lack of keyboard support across the web is dramatic](https://twitter.com/marcysutton/status/871221541526228993). Statement (unfortunately) shared by other people.

## Cognitive & learning disabilities

{% assign adhd_animations = "About ADHD and animations: [Tweet by @elementnumber46](https://twitter.com/elementnumber46/status/871064762481872897), [tweet by @mojinations](https://twitter.com/mojinations/status/871173727601307648) and [tweet by @morganestes](https://twitter.com/morganestes/status/871070319129145348)." | markdown %}

- Someone with <abbr title="Attention Deficit Hyperactivity Disorder">ADHD</abbr> says [they can’t focus as soon as there is a “subtle” animation always running](https://twitter.com/tigt_/status/871061419600510978). {% footnoteref "adhd_animations" adhd_animations %}A lot of people suffering from ADHD to a certain level share the same opinion about animations{% endfootnoteref %}.

- Along the same lines, someone [wishes they could disable GIFs](https://twitter.com/DaxAeterna/status/871205860285988865).

{% assign adhd_wall_of_text = "About large blocks of text: [Tweet by @DotProto](https://twitter.com/DotProto/status/871231522455433216), [tweet by @Polenth](https://twitter.com/Polenth/status/871080703370424321), [tweet by @Mustafa_x](https://twitter.com/Mustafa_x/status/871138503408615428), [tweet by @MeBeShe4815](https://twitter.com/MeBeShe4815/status/871082326578548736), [tweet by @keannka](https://twitter.com/keannka/status/871093540100689921) and [tweet by @elementnumber46](https://twitter.com/elementnumber46/status/871064762481872897)." | markdown %}

- Another person with ADHD says {% footnoteref "adhd_wall_of_text" adhd_wall_of_text %}big walls of text can be difficult to get through{% endfootnoteref %}. To work around this problem, they use text-to-speech. This is a common problem for a lot of people suffering from a large variety of impairments and disorders.

- Similarly, another person says Wikipedia is hard to browse as pages often consist of long paragraphs where they get lost very quickly. This person also resorts to text-to-speech.

- Another dyslexic person says that [automatically moving scroll position really hurts readability](https://twitter.com/nothe/status/871271420545744896). Anything that also removes the current text selection can be a problem.

- Someone with sleep disorder says [they have to run f.lux](https://twitter.com/tigt_/status/871061632155340800) (popular light & color adjustment software) as soon as 5PM, which makes them notice a lot of contrast issues (especially on links).

- A person with autism says they [struggle processing audio input when they feel overloaded](https://twitter.com/UntoNuggan/status/871063283951960064), making them rely on captions.

- The same person explains how [some design choices can cause migranes](https://twitter.com/UntoNuggan/status/871057829519667200) or dizziness, which is unfortunate but not as bad as [possible seizures triggered by heavily animated websites](https://twitter.com/UntoNuggan/status/871058016585613312).

- Another person with cognitive disorder explain how [autoplaying videos](https://twitter.com/CatherineKlatt/status/871090518377324544) and [moving ads](https://twitter.com/ProfBanks/status/871132148278972417) can cause overload quite quickly.

- A person suffering from ADHD and autism joins in about [automatically playing videos](https://twitter.com/elementnumber46/status/871065807165558786). Let it be said that this is also very annoying to anyone (although not damaging).

- A person with Asperger syndrom says [certain types of humor are “hard to process”](https://twitter.com/pherring/status/871087733661462528).

- Some people —some with ADHD or <abbr title="Post Traumatic Stress Disorder">PTSD</abbr>, some without— share their experience about [zoning out and following links](https://twitter.com/sliminality/status/871240090181390336) like Alice and the rabbit hole.

- A person suffering from epilepsy says how [the lack of content warnings is a problem](https://twitter.com/angeltrainee/status/871267069068681216).

## Hearing impairments

{% assign no_captions = "About lack of captions: [Tweet by @UntoNuggan](https://twitter.com/UntoNuggan/status/871063079861268481), [tweet by @carolmcarpenter](https://twitter.com/carolmcarpenter/status/871067344038219776), [tweet by @tohereknowswhe](https://twitter.com/tohereknowswhe/status/871061025642229761), [tweet by @radcrochetqueer](https://twitter.com/radcrochetqueer/status/871104664544137216), [tweet by @jjackson](https://twitter.com/jjackson/status/871209439856009216), [tweet by @k_hack](https://twitter.com/k_hack/status/871189568187322368), [tweet by @Lesbiologist](https://twitter.com/Lesbiologist/status/871108939126939648), [tweet by @domcorriveau](https://twitter.com/domcorriveau/status/871259653170020352), [tweet by @captainsafia](https://twitter.com/captainsafia/status/871061635485577217), [tweet by @ai_valentin](https://twitter.com/ai_valentin/status/871128518717046785)" | markdown %}

- A <abbr title="Hard of Hearing">HoH</abbr> person points out that {% footnoteref "no_captions" no_captions %}not enough videos/audios are captioned{% endfootnoteref %}, which is a shame because they are useful to more people than just HoH/deafs.

- Someone says they feel like we sometimes [abuse the video media on the web](https://twitter.com/Polenth/status/871080703370424321) and [not everything has to be a video](https://twitter.com/Lesbiologist/status/871109089740210176). Simple text often is just fine. It seems shared by a few people.
