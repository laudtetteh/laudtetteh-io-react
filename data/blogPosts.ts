import type { PostData } from '@/types/blog';

export const STATIC_BLOG_POSTS: PostData[] = [
  {
    title: 'What Breaks When You Build With AI Agents for Six Months',
    slug: 'what-breaks-with-ai-agents',
    summary:
      "I built a production app almost entirely with AI coding agents. The code was fine. The process fell apart in ways I didn't expect, and fixing it turned into a second project.",
    content: {
      html: `
<p>I started building LaudBot in March 2026. It is an invite-only AI agent that answers questions about my background: a recruiter gets a link, asks what they want, and it answers from approved sources only.</p>
<p>The plan was to build it almost entirely with AI coding agents. That part worked. What did not work was everything around it, and the failures were not the ones I had been warned about.</p>
<h2>The failures I expected did not show up</h2>
<p>I expected hallucinated APIs and confidently wrong code. Those happened occasionally, and they were easy: code that does not exist does not compile, and code that is wrong fails a test. The feedback loop is tight and the damage is contained to the session.</p>
<p>The expensive failures were slower and quieter.</p>
<p><strong>Decisions evaporated.</strong> Early on I settled how auth would work: two roles, strictly separated, visitor and admin. Weeks later a session proposed a third role because it made a feature simpler. It was not wrong given what it could see. It just could not see the decision. I re-litigated that one more than once before I understood the shape of the problem.</p>
<p><strong>Conventions drifted.</strong> Not dramatically: a slightly different error-handling pattern here, a different file layout there. Each one defensible in isolation. After enough sessions the codebase read like several different people had written it, because in a meaningful sense several different people had.</p>
<p><strong>Nothing left a trail.</strong> At some point I found a workaround in the payment path with no comment, no useful commit message, and no memory of why it was there. I had to reconstruct my own reasoning from the code. The commit was mine. The reasoning was gone.</p>
<p>The common thread: agents are stateless and session-local, and I was treating them like colleagues who remembered yesterday.</p>
<h2>Prompting harder does not fix it</h2>
<p>My first instinct was better instructions. Longer preamble, more context, explicit reminders about conventions. It helped a little and then stopped helping.</p>
<p>The reason is structural. A prompt is a request. Nothing enforces it, nothing checks it afterward, and the agent is not being negligent when it drifts. It genuinely does not have the information. Asking more nicely does not create a memory it does not have.</p>
<p>What I actually needed was for the environment to carry the state, so that being right was the default rather than something re-derived every session.</p>
<h2>So I built the thing underneath</h2>
<p>That became The Rig. Started 8 April 2026, two and a half weeks after LaudBot began, because by then I could see the shape of what was missing. It is MIT-licensed and past 450 commits.</p>
<p><strong>Structured memory that survives the session.</strong> Not a transcript dump: a small set of files with defined jobs. Decisions with their reasoning. A progress log. An errors file so the same wrong turn is not taken twice. A context snapshot written before the session ends, so the next one starts oriented instead of cold.</p>
<p><strong>Hooks that enforce rather than request.</strong> Ten of them across the session lifecycle, plus an adapter so the same contracts work under Codex as well as Claude Code. They fire on session start, before and after tool calls, before compaction, and on stop. A commit without secret scanning does not happen. A write to a protected path does not happen. The difference between "please do not" and "you cannot" turns out to be most of the value.</p>
<p><strong>A task lifecycle.</strong> Work has to exist as a task file before it becomes code, and the task file carries the goal, the approach, and afterward what actually happened versus what was planned. That last field is the one I would keep if I could only keep one.</p>
<p><strong>Commit discipline in the hook layer, not the guidelines.</strong> Conventional commits, enforced. Secret scanning, enforced. History rewrites on published branches, blocked.</p>
<p>There is a bats suite in CI, because a framework that enforces discipline while having none itself is a joke with a long setup.</p>
<h2>What I would tell you if you are about to do this</h2>
<p><strong>Write down decisions the moment you make them, not at the end.</strong> By the end you are reconstructing, and reconstructed reasoning drifts toward whatever you now believe. This is the single highest-value habit and it costs almost nothing.</p>
<p><strong>Fix the class, not the instance.</strong> When an agent violates a convention, the fix is not correcting that file. It is asking why the convention was not visible at the moment of writing. I lost weeks to instance-fixing before this landed.</p>
<p><strong>Enforce mechanically wherever you can.</strong> Anything checkable by a script should be checked by a script. Guidelines are a request; hooks are a guarantee.</p>
<p><strong>Keep something you built by hand.</strong> I still maintain a CRM I wrote in 2019, before any of this existed. It is the reference point that tells me whether a thing is hard or whether I have just forgotten how to do it myself.</p>
<h2>The part that surprised me</h2>
<p>The Rig is now under the projects I work on most often. I did not set out to build a tool. I set out to build a chatbot, hit a wall, and discovered the wall was more interesting than the thing I had been building, because the wall was general and the chatbot was not.</p>
<p>That is not a story about AI being bad at coding. The code was mostly fine. It is a story about a working process that was implicit in my head and needed to become explicit in the repository, which is a problem software teams have been solving for decades. The agents just made it impossible to keep ignoring.</p>`.trim(),
    },
    status: 'published',
    categories: ['Tech & Projects'],
    date: '2026-09-06T05:30:00.000-07:00',
    date_created: '2026-09-06T05:30:00.000-07:00',
    date_published: '2026-09-06T05:30:00.000-07:00',
    date_updated: '2026-09-06T05:30:00.000-07:00',
    featuredImage: '/images/writing/ai-agents-workflow.png',
    featured: false,
    weight: 0,
  },
  {
    title: 'Your Checkout Flow Is a Cultural Assumption',
    slug: 'checkout-is-a-cultural-assumption',
    summary:
      "Building an e-commerce platform for Ghana taught me that the standard cart-and-card checkout is not a neutral default. It is a bet about how people pay, and it does not travel.",
    content: {
      html: `
<p>Every e-commerce tutorial ends the same way. Cart, checkout form, card field, confirmation page. It is so standard it stops looking like a decision.</p>
<p>It is a decision. It encodes assumptions about who has a card, who trusts a form with it, and what "buying something online" feels like. Those assumptions hold in some markets and quietly fail in others.</p>
<p>I have spent a year on a production e-commerce platform serving Ghana. The interesting problems were almost never technical.</p>
<h2>The first assumption: that people want a form</h2>
<p>The standard flow asks a stranger to type card details into a page they have never seen before and trust that something arrives. That works where card payment online is unremarkable and disputes are easy.</p>
<p>Where I was building, the natural way to buy from a small merchant is to message them. You ask if they have it, they say yes, you agree a price, you pay, it arrives. The transaction is a conversation, and the conversation is the trust mechanism.</p>
<p>So checkout is a WhatsApp deep link. You build a cart on the site, and checkout hands off to a <code>wa.me</code> link with the order pre-composed: items, quantities, total, into a real conversation with a real person who replies.</p>
<p>The conventional cart still exists underneath, because some people do want the form. But it is the fallback, not the default. That inversion is the whole design.</p>
<p>I will admit this felt like a step backwards when I built it. It is not a clever technical solution. It is a less automated flow than the one I would have written by reflex. It is also the one that matches how the market actually transacts, and being right beats being elegant.</p>
<h2>The second assumption: that payment means card</h2>
<p>Mobile Money is the primary rail. Not an alternative payment method tucked behind a "more options" link: the primary one, with card as the secondary path.</p>
<p>This is not unusual or exotic; it is how a very large number of people move money. It reads as unusual only if your mental model of payments was formed somewhere card-first. The architectural consequence is that "payment provider" cannot be a single integration you bolt on at the end. It is a dimension the order model has to carry from the start.</p>
<h2>The third assumption: that delivery is a solved problem</h2>
<p>Address, courier, tracking number. That chain assumes addresses are precise, couriers are integrated, and tracking numbers exist.</p>
<p>Delivery is dispatch riders. Order tracking is built around that: rider assignment and status transitions that correspond to what actually happens, not to a carrier API that is not there. Cash on delivery is a first-class option, because for a first-time customer the willingness to pay on arrival is the trust mechanism.</p>
<h2>What it is built on</h2>
<p>Next.js 14 on the front, FastAPI with async MongoDB behind it, in a monorepo with a mobile workspace alongside. S3 with pre-signed URLs so the API never serves binaries. Docker Compose locally, GitHub Actions to deploy. Linting, tests and secret scanning enforced on every commit. 600+ commits over a year, and a Cypress suite covering the browse-to-checkout journey.</p>
<p>None of that is the interesting part, and I want to be careful not to pretend otherwise. The stack is ordinary on purpose. The design decisions that mattered were about the market, and they would have been the same on any stack.</p>
<h2>I have made this mistake before, in the other direction</h2>
<p>In 2019 I built a church management system, by hand, before AI coding assistance existed. It needed to send SMS notifications. The obvious choice was the international provider everyone reaches for. I used a Ghanaian gateway instead, because that is what actually delivered reliably to the phones in question.</p>
<p>Same instinct, six years apart, and I did not notice it was the same instinct until I was writing this. Build for how the market actually transacts, not how the reference architecture says it should.</p>
<h2>The transferable part</h2>
<p>If you only work in one market, you can go a whole career without noticing which of your defaults are technical and which are cultural. They look identical from the inside.</p>
<p>The test I use now: for each step in a flow, ask <em>why is it this way</em>, and if the honest answer is "because that is how it is done," that step is a cultural assumption wearing a technical costume. Sometimes the assumption holds. Often enough it does not, and the version that fits is simpler than the one you would have built.</p>`.trim(),
    },
    status: 'published',
    categories: ['Tech & Projects'],
    date: '2026-09-06T05:20:00.000-07:00',
    date_created: '2026-09-06T05:20:00.000-07:00',
    date_published: '2026-09-06T05:20:00.000-07:00',
    date_updated: '2026-09-06T05:20:00.000-07:00',
    featuredImage: '/images/writing/checkout-cultural-assumption.png',
    featured: false,
    weight: 0,
  },
  {
    title: "Containerizing Someone Else's Application",
    slug: 'containerizing-someone-elses-app',
    summary:
      "Modernizing a Laravel and Vue app I did not write. The technical work was routine. Working inside decisions I disagreed with, without rewriting them, was the actual skill.",
    content: {
      html: `
<p>Seattle Collisions is a data explorer for collision records: a Laravel API, a Vue frontend, MySQL underneath. <strong>I did not write it.</strong> I made it deployable.</p>
<p>That distinction matters more than it sounds like it should, and it is the reason I find this kind of work worth talking about. Greenfield projects let you make every decision. Inherited ones make you live inside decisions you would have made differently, and the discipline that requires is a different skill from the one interviews usually test.</p>
<h2>What "it works on my machine" actually meant</h2>
<p>The application ran. It ran in one place, on one laptop, with a database whose state was the product of a year of undocumented manual steps.</p>
<p>That is not a criticism of whoever built it. It is the normal end state of a project that was solving a problem rather than building infrastructure. The cost only becomes visible when someone new tries to run it, or when the laptop dies.</p>
<p>The specific symptom: no reliable way to get from a fresh checkout to a working local environment. Which means no way to onboard anyone, and no way to deploy with confidence, because you could not reproduce the thing you were deploying.</p>
<h2>What I actually did</h2>
<p><strong>Docker Compose across three services</strong>: Laravel API, Vue frontend, MySQL, on an internal bridge network, with environment configuration extracted from the assumptions it had been living in.</p>
<p><strong>GitHub Actions to build the images</strong>, so the artifact that gets deployed is the artifact that got tested, rather than a directory someone rsynced.</p>
<p><strong>A DigitalOcean droplet with nginx on the host</strong> for TLS termination and reverse proxying, Certbot for Let's Encrypt with automatic renewal via a systemd timer. Backend and database sit on the same droplet on Docker's internal network: near-zero database latency, versus a managed database service that would have cost more for a project of this size and added a network hop for no benefit.</p>
<p><strong>Documentation for the local workflow</strong>, so the next contributor runs one command.</p>
<p>That last one is the deliverable. Everything else is in service of it.</p>
<h2>The part I want to talk about</h2>
<p>Halfway through, I had opinions. Structural ones. There were patterns I would have chosen differently, a data layer I would have organised another way, frontend state I would have restructured.</p>
<p>I did not touch any of it.</p>
<p>Not because I was being deferential, but because <strong>the job was reproducibility, and every refactor I made would have been a change I could not attribute a failure to.</strong> If the containerized version behaves differently from the original, I need that to be because of containerization, not because I improved something along the way.</p>
<p>Scope discipline is easy to say and hard to hold when you are inside a codebase every day. The temptation is not laziness, it is the opposite: you can see the improvement, it would take twenty minutes, and it is right there. The times I have caused the most trouble in my career have been the times I was confident I was helping.</p>
<h2>Boring, and worth it</h2>
<p>There is a category of engineering work that produces nothing a user can see: making existing software reproducible, deployable and possible for someone else to pick up. It does not demo. It is what the difference looks like between software that survives its author's interest and software that does not.</p>
<p>The application does the same thing it did before. It just does it anywhere now, for anyone, without a laptop being involved.</p>`.trim(),
    },
    status: 'published',
    categories: ['Tech & Projects'],
    date: '2026-09-06T05:10:00.000-07:00',
    date_created: '2026-09-06T05:10:00.000-07:00',
    date_published: '2026-09-06T05:10:00.000-07:00',
    date_updated: '2026-09-06T05:10:00.000-07:00',
    featuredImage: '/images/writing/containerizing-inherited-app.png',
    featured: false,
    weight: 0,
  },
];

export function getStaticBlogPostBySlug(slug: string): PostData | null {
  return STATIC_BLOG_POSTS.find(post => post.slug === slug) ?? null;
}
