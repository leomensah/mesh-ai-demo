import type { AnswerFormat } from '../types';

/*
  Sample answers for the prototype. Answers are markdown with citation markers like [3],
  which is the shape the real answer service streams back:
    # Title           report title
    *Prepared by …*   report byline
    ## Heading        report section
    - item            bullet
  Citation numbers refer to the topic's `sources`, in order.
*/

export interface AnswerContext {
  /** An earlier query in the session was about the malaria vaccine trial. */
  malaria: boolean;
}

export interface Topic {
  key: string;
  question: string;
  formatAutomatic: AnswerFormat;
  formatReason: string;
  sources: string[];
  /** How a follow-up on this topic is rewritten as a standalone query. */
  rewrite?: (ctx: AnswerContext) => string;
  answers: Record<Exclude<AnswerFormat, 'resources'>, (ctx: AnswerContext) => string>;
}

const malaria: Topic = {
  key: 'malaria',
  question:
    'I want to design a community engagement plan for a malaria vaccine study on the coast of Kenya. The study will recruit healthy volunteers over 18 years from the community. Outline some engagement activities which could be implemented alongside the trial.',
  formatAutomatic: 'summary',
  formatReason: 'you asked for activities to run',
  sources: ['bohemia', 'kilifi', 'gpp', 'cab', 'animated', 'theatre', 'misinfo', 'media'],
  answers: {
    summary: () =>
      'Start before recruitment with formative research and early meetings with local leaders and health authorities, then set up a community advisory group to review recruitment and consent plans [1][2][4]. Explain the trial with simple visual materials, participatory theatre and school activities, and brief local journalists so coverage is accurate [5][6][8]. While the trial runs, agree how the team will hear and answer rumours, and follow good participatory practice through recruitment, follow-up and the sharing of results [1][7][3].',
    paragraph: () =>
      [
        'Engagement for a trial that recruits healthy adult volunteers works best when it starts well before recruitment. The BOHEMIA team in Kwale began with formative research to understand local views, and engaged stakeholders and schools early [1]. In Kilifi, the KEMRI-Wellcome programme describes how it set up community engagement, including advisory structures, at a busy research centre, and WHO guidance explains how to establish and work with community advisory boards for clinical studies [2][4]. Good participatory practice guidelines recommend involving communities throughout a trial, not only at recruitment [3].',
        'To explain the study, teams in Kenya have used illustrated slides covering vaccine development, trial stages, ethical review and randomisation [5], and participatory theatre with coastal communities [6]. Working with journalists, for example through a media advisory group, helps keep coverage accurate [8]. Plan for rumours and misinformation from the start, with a clear way to hear concerns and respond [1][7].'
      ].join('\n\n'),
    report: () =>
      [
        '# Community engagement plan: malaria vaccine trial with healthy adult volunteers, coastal Kenya',
        '*Prepared by Mesh-AI from {N} TGHN resources*',
        'This plan groups engagement activities into three stages of the trial. Each activity comes from engagement work in coastal Kenya, or from guidance on vaccine trials and participatory practice.',
        '## 1. Before recruitment starts',
        '- Run formative research on local views of malaria, vaccines and research [1]\n- Meet local leaders, health authorities and community groups before recruitment begins [1][3]\n- Set up a community advisory group to review recruitment plans, consent materials and concerns [2][4]',
        '## 2. Explaining the study',
        '- Use illustrated explanations of trial stages, ethical review and randomisation [5]\n- Take the conversation to public spaces through participatory theatre [6]\n- Include school engagement, and brief journalists so coverage is accurate [1][8]',
        '## 3. While the trial runs',
        '- Agree how the team will hear about misconceptions and respond to them [1][7]\n- Decide who is on the engagement team and how they work with the community day to day [1]\n- Keep the community informed through recruitment, follow-up and the sharing of results [3]',
        '## What the library does not cover',
        'No TGHN resource describes engagement for a malaria vaccine trial with healthy volunteers in coastal Kenya directly. Questions specific to healthy volunteers, such as compensation, were not found in the library and are not addressed here.'
      ].join('\n\n')
  }
};

const trials: Topic = {
  key: 'trials',
  question: 'List articles on engagement with clinical trials',
  formatAutomatic: 'resources',
  formatReason: 'you asked for a list of articles',
  sources: ['better', 'bohemia', 'digital', 'gpp', 'strong', 'who'],
  answers: {
    summary: () =>
      'Recent articles argue for working in partnership with patients, the public and communities throughout a trial, combining public involvement with good participatory practice [1][4]. The BOHEMIA trial in Kenya shows what this looks like in practice [2], and other resources cover digital approaches, workshop lessons on strengthening engagement, and WHO guidance on trial quality and equity [3][5][6].',
    paragraph: () =>
      'The library’s resources on clinical trial engagement share one message: engagement should be a partnership that runs through the whole trial, not a recruitment step. A 2025 article sets out how public involvement and good participatory practice can work together [1], and the AVAC guidelines, written for HIV prevention trials, apply across fields [4]. For practice, the BOHEMIA team in Kwale describe formative research, stakeholder and school engagement, and rumour management [2]. Teams looking to strengthen their approach can draw on an article on digital engagement, themes from a 2020 workshop, and WHO guidance on trial quality and equity [3][5][6].',
    report: () =>
      [
        '# Engagement with clinical trials: a short reading list',
        '*Prepared by Mesh-AI from {N} TGHN resources*',
        '## Principles',
        '- Working in partnership with patients, the public and communities [1]\n- Good participatory practice across fields and populations [4]',
        '## Practice',
        '- Formative research, school engagement and rumour management in the BOHEMIA trial, Kenya [2]\n- Digital approaches to community engagement [3]',
        '## Guidance',
        '- Workshop themes on supporting strong engagement practice [5]\n- WHO guidance on clinical trial quality and equity [6]',
        '## What the library does not cover',
        'These resources focus on principles and individual case studies. Comparative evaluations of engagement approaches across trials were not found.'
      ].join('\n\n')
  }
};

const schools: Topic = {
  key: 'schools',
  question: 'How could we involve local schools?',
  formatAutomatic: 'summary',
  formatReason: 'you asked for ideas',
  sources: ['bohemia', 'sep', 'sciback', 'vr', 'pvideo', 'webinar', 'children'],
  rewrite: (ctx) =>
    ctx.malaria
      ? 'involving local schools in community engagement for a malaria vaccine trial with adult volunteers in coastal Kenya'
      : 'involving schools in community engagement with clinical trials',
  answers: {
    summary: (ctx) =>
      (ctx.malaria ? 'Schools are a well-used route into communities on the Kenyan coast. ' : 'Schools are a well-used route into communities around research centres. ') +
      'The BOHEMIA trial ran school engagement alongside its malaria work [1], and the KEMRI-Wellcome School Engagement Programme runs ongoing activities that build students’ interest in science and understanding between researchers and schools [2][6]. In one Kenyan project, high school students became malaria ambassadors [3], and laboratory tours, including in virtual reality, or participatory video projects give students a direct view of research and a way to evaluate the engagement [4][5]. ' +
      (ctx.malaria
        ? 'Because the trial in this session recruits adults over 18, present school activities as awareness-raising rather than recruitment, and agree how decisions about young people’s involvement are made [7].'
        : 'Agree early how decisions about children’s and young people’s involvement are made [7].'),
    paragraph: (ctx) =>
      [
        'School engagement is one of the best-documented approaches in the library. ' +
          (ctx.malaria
            ? 'For a malaria vaccine trial on the Kenyan coast, the closest example is BOHEMIA in Kwale, where school engagement ran alongside formative research and stakeholder meetings [1]. '
            : 'The BOHEMIA trial in Kwale, Kenya, ran school engagement alongside formative research and stakeholder meetings [1]. ') +
          'The KEMRI-Wellcome School Engagement Programme shows what a long-running programme looks like, and a Mesh webinar sets out its goals and methods as a “win-win” for researchers and schools [2][6].',
        'For activities, one Kenyan project trained high school students as malaria ambassadors [3], a virtual reality tour let students see inside research laboratories [4], and participatory video was used both to engage secondary school students and to evaluate that engagement [5]. ' +
          (ctx.malaria
            ? 'As the trial recruits adults only, school work should raise awareness rather than recruit, and the team should agree who decides about young people’s involvement [7].'
            : 'Teams should agree who decides about children’s and young people’s involvement [7].')
      ].join('\n\n'),
    report: (ctx) =>
      [
        '# ' + (ctx.malaria ? 'Involving schools in engagement for a malaria vaccine trial, coastal Kenya' : 'Involving schools in engagement with health research'),
        '*Prepared by Mesh-AI from {N} TGHN resources' + (ctx.malaria ? ', using earlier queries in this session as context' : '') + '*',
        '## Why work with schools',
        '- The BOHEMIA trial in Kwale ran school engagement alongside its malaria work [1]\n- Long-running programmes build interest in science and understanding between researchers and schools [2][6]',
        '## Activities to consider',
        '- Train students as malaria ambassadors [3]\n- Offer laboratory tours, including a virtual reality version [4]\n- Run participatory video projects that also evaluate the engagement [5]',
        '## Points to agree first',
        '- Who decides about children’s and young people’s involvement [7]' + (ctx.malaria ? '\n- Keeping school work separate from recruitment, since the trial enrols adults over 18' : ''),
        '## What the library does not cover',
        ctx.malaria
          ? 'No resource describes school engagement for a trial that recruits adults only, so keeping school work separate from recruitment is a judgement, not a finding from the library.'
          : 'The resources describe individual programmes. Comparisons of school engagement approaches were not found.'
      ].join('\n\n')
  }
};

export const TOPICS: Record<string, Topic> = { malaria, trials, schools };

export const EXAMPLES: { q: string; format: AnswerFormat }[] = [
  { q: 'Outline engagement activities for a malaria vaccine trial in coastal Kenya', format: 'summary' },
  { q: 'List articles on engagement with clinical trials', format: 'resources' },
  { q: 'Write a report on engaging communities in a malaria vaccine trial in Kenya', format: 'report' },
  { q: 'In one paragraph, how can trial teams engage communities in clinical trials?', format: 'paragraph' }
];
