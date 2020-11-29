---
title: Dear PayPal
keywords:
  - paypal
  - user experience
  - thoughts
---

I have been a long time user of your online services. I trust you with my money. I like how easy and convenient it is to send and receive cash through your service. I also like that you polished your interface over time. It got better.

But these brighter colors and shiny buttons are just a mask for the pile of inconsistencies and poor user experience lying underneath. The bad practices and anti-patterns you use in your service makes me sad and wonder how you can handle that much money and still be that wrong with your users.

Here are just a few things that are terrible, from the top of my head.

## P4$$w0rd5

Online security is a tough topic, I think we can all agree on this. And password security is a serious business. Especially when you hold people’s money, credit card information and more broadly speaking so much sensitive data.

Then how comes you are so _terrible_ (and I strongly believe this is an understatement) at protecting all this?

We have been advocating for years now that the strength of a password is a function of length and unpredictability, not character set complexity. Still, you stick to these [silly password requirements](https://twitter.com/HugoGiraudel/status/690477975804968960) such as 8 to 20 characters including at least one number or symbol (like !@#$%^) but no space ([amongst others](http://passrequirements.com/passwordrequirements/paypal)).

Let me try to clear this up a bit. For starters, there is absolutely no good reason to enforce a character limit on a password. Not one. Length is the primary criteria of a strong password. A 8-characters long password containing only latin characters is a matter of hours to a few days to brute force on a decent machine. A 12-characters long could take years and a 20+-characters long would take decades. Still, that is not a valid reason to limit the number of characters in a password to 20.

You surely know the saying: “hard to guess, easy to remember.” It turns out, we humans are very good at remembering sentences. Because they make sense. By preventing a password from being longer than 20 characters and most importantly from containing any space, you basically prevent people from using sentences. And when you prevent people from using _passphrases_, you make them choose something small and simple enough to be remembered, which is a dull and ridiculously easy-to-crack password.

<figure class="figure">
  <img src="/assets/images/dear-paypal/xkcd.png" alt="Hard to guess, easy to remember" />
  <figcaption>From <a href="https://xkcd.com/936/">xkcd #936</a></figcaption>
</figure>

On top of that, you also make the process of choosing / changing a password so hard and painful. Finding a password is quite annoying in itself. How do you think people feel when they have to find 2, 3 or 4 passwords in a row because none of them fit your stupid “strength” criterias?

You are absolutely not helping your users by doing this. Do you want to make your users’ password secure? Ask for 12+ characters without any character restriction. Then on your side, make sure it’s not a repeated string, number sequence or a common word that’s in all brute-forcing dictionaries.

That’s it. Regarding password entropy, this is all where it’s at. You make sure your users pick hard-to-crack passwords without standing in the way of their brain. Users are happy to be able to use whatever sentence or long word they want. Win-win.

## Two-steps authentication

Password is not the only thing that matters when it comes to users’ data security. There is also Two Factor Authentication (2FA). Broadly speaking, 2-factor authentication is a way to protect an account by asking for a regular password plus a code received by SMS, mail, or authentication application.

Thanks to the insightful [twofactorauth.org](https://twofactorauth.org/), we can see that PayPal does support it —which is great— but only in 6 countries (USA, Canada, UK, Germany, Austria and Australia). 6 countries out of roughly 200. It’s 3%. Meanwhile, your [country picker page](https://www.paypal.com/en/webapps/mpp/country-worldwide) displays proudly “We are available in 203 markets and 26 currencies.”

For a company that pernickety about security and data privacy, I find your lack of concern about providing 2-factor authentication across the board very worrying. I’d love nothing more than being able to fully secure my money with 2-steps authentication. Especially given how poor you force my password to be.

## Signing-in madness

Yesterday night, I wanted to check the status of my PayPal account. After 10 minutes trying to remember my password in vain because of the aforementioned restrictions, I asked for a new one. And when I finally signed in, I got faced with a page asking to verify my account. Before anything else, let me tell you that I believe it is a good idea. I attempted to sign into my account 5 times without success, then changed my password. Making sure that _I_ am the one messing with my own account is a good idea. I don’t have any problem with that.

The problem I had is that you wanted to send me a security code by text to my phone. Unfortunately, the registered phone number is my old French number which is not mine anymore. I’ll give you some credit and concede that I should have changed my number before. Fair enough. However you did not provide another way to verify my identity even though you have security questions and answers, as well as my email address. So at this point of the night, I was literally stuck and unable to access my account even though I already signed in successfully.

Now I guess the funny part is how I managed to solve this. I signed in with my phone, and deleted the phone number from my account. Then went back on my computer, signed out, signed in again and could finally access my dashboard. Now, how is it a good user experience? I am asking you.

## A word about phone numbers

Last but not least, I would like to tell you about phone numbers. For starters, phone numbers are not actual numbers. I know the name is misleading, but you cannot reasonably think that a phone number is made exclusively of numbers. There are also spaces, plus signs, parentheses, and a lot of things. So `[0-9]*` is not a correct pattern for this.

<figure class="figure">
  <img src="/assets/images/dear-paypal/phone-html.png" alt="Incorrect pattern attribute for a phone number" />
  <figcaption>Incorrect <code>pattern</code> for a phone number</figcaption>
</figure>

Another problem of storing phone numbers as actual numbers is that leading zeros are getting removed. This is an issue. _0102030405_ is a valid phone number. _102030405_ is not. The leading zero matters. Again, a phone number is not an actual number. _01 02 03 04 05_ is a phone number. _102030405_ is not.

Now the real reason why I never changed my registered phone number to my new one is because you did not let me. Yes, it starts with 01 and not 06. Because this is a German line. Why do you even care about what kind of number this is as long as you can text me? What’s happening right now is that I literally cannot map a number to my PayPal account because you want a French mobile phone number, and the only one I got is German. How is this okay?

My dear PayPal, I love your services but your site and the way you handle my data, my privacy and my experience as a user is just terrible. I wish you’d do better.

Oh, and little bonus for the end. When I have to open the Developer Tools to remove a container of yours in order to click a button, you know you have done it wrong.

![Overlapping container on top of button](https://pbs.twimg.com/media/CZ5IiJXWQAA2bSq.png)

Sincerely yours.
