import type { Resource } from '../types';

/*
  Sample TGHN resources, taken from the Mesh resource sheet and the live Mesh site.
  The real service returns these from OpenSearch; tags drive the filters.
*/
export const RESOURCES: Record<string, Resource> = {
  bohemia: {
    id: "bohemia",
    title: "Community engagement in the BOHEMIA clinical trial, Kwale, Kenya",
    url: "https://mesh.tghn.org/articles/community-engagement-bohemia-clinical-trial-kwale-kenya/",
    summary: "How the trial team used formative research, stakeholder and school engagement, and rumour management alongside a malaria trial on the Kenyan coast.",
    typeLabel: "Article",
    where: "Mesh, Kenya",
    date: "30 Sep 2025",
    authors: "Truphena Onyango et al.",
    tags: {type: ["Article"],hub: ["Mesh"],topic: ["Engagement in clinical trials","Schools"],health: ["Malaria"],region: ["Sub-Saharan Africa"],country: ["Kenya"],lang: ["English"],year: ["2024 onwards"]}
  },
  kilifi: {
    id: "kilifi",
    title: "Beginning community engagement at a busy biomedical research programme: experiences from Kilifi, Kenya",
    url: "https://mesh.tghn.org/articles/beginning-community-engagement-busy-biomedical-research-programme-experiences-kemri-cgmrc-wellcome-trust-research-programme-kil/",
    summary: "The rationale for community engagement in research, and how it was set up and first put into practice at the KEMRI-Wellcome programme in Kilifi.",
    typeLabel: "Published literature",
    where: "Mesh, Kenya",
    date: "2016",
    authors: "Summarised by the Mesh Editorial Team",
    tags: {type: ["Published literature"],hub: ["Mesh"],topic: ["Community advisory boards"],region: ["Sub-Saharan Africa"],country: ["Kenya"],lang: ["English"],year: ["Before 2020"]}
  },
  gpp: {
    id: "gpp",
    title: "AVAC Good Participatory Practice (GPP) Guidelines",
    url: "https://mesh.tghn.org/articles/guide-avac-good-participatory-practice-gpp-guidelines/",
    summary: "Developed for HIV prevention trials, these guidelines apply to clinical trials across fields, research areas, geographies and populations.",
    typeLabel: "Guides and tools",
    where: "Mesh, global",
    date: "1 Mar 2021",
    authors: "AVAC and the Mesh Editorial Team",
    tags: {type: ["Guides and tools"],hub: ["Mesh"],topic: ["Participatory research","Engagement in clinical trials"],health: ["HIV/AIDS","Vaccines"],region: ["Global"],lang: ["English"],year: ["2020 to 2023"]}
  },
  cab: {
    id: "cab",
    title: "WHO: Working with Community Advisory Boards for COVID-19 related clinical studies",
    url: "https://mesh.tghn.org/articles/guide-who-working-community-advisory-boards-covid-19-related-clinical-studies/",
    summary: "How to establish and work with different types of community advisory boards and groups in clinical studies.",
    typeLabel: "Guides and tools",
    where: "Mesh, global",
    date: "19 May 2021",
    authors: "World Health Organization",
    tags: {type: ["Guides and tools"],hub: ["Mesh"],topic: ["Community advisory boards","Engagement in clinical trials"],health: ["COVID-19"],region: ["Global"],lang: ["English"],year: ["2020 to 2023"]}
  },
  animated: {
    id: "animated",
    title: "Animated resources explaining COVID-19 vaccine trials",
    url: "https://mesh.tghn.org/articles/guides-tools-animated-resources-explaining-covid-19-vaccine-trials/",
    summary: "Illustrated slides from Kenya explaining vaccine development, the sequence and timeline of clinical studies, ethical review and randomisation.",
    typeLabel: "Guides and tools",
    where: "Mesh, Kenya",
    date: "18 Nov 2020",
    authors: "Mesh Editorial Team",
    tags: {type: ["Guides and tools"],hub: ["Mesh"],topic: ["Schools","Communications"],health: ["COVID-19","Vaccines"],region: ["Sub-Saharan Africa"],country: ["Kenya"],lang: ["English"],year: ["2020 to 2023"]}
  },
  theatre: {
    id: "theatre",
    title: "Using Magnet Theatre to engage public audiences with health research in coastal Kenya",
    url: "https://mesh.tghn.org/articles/project-report-using-magnet-theatre-engage-public-audiences-health-research-coastal-kenya/",
    summary: "How the KEMRI Wellcome Trust Research Programme used Magnet Theatre to engage communities, and what the team learnt.",
    typeLabel: "Project report",
    where: "Mesh, Kenya",
    date: "15 Sep 2021",
    authors: "Gladys Sanga, Irene Jao, Joy Kiptim, Alun Davies",
    tags: {type: ["Project reports"],hub: ["Mesh"],topic: ["Arts and theatre"],region: ["Sub-Saharan Africa"],country: ["Kenya"],lang: ["English"],year: ["2020 to 2023"]}
  },
  misinfo: {
    id: "misinfo",
    title: "Vaccine Misinformation Management Field Guide",
    url: "https://mesh.tghn.org/articles/guide-vaccine-information-field-guide/",
    summary: "UNICEF guidance on addressing vaccine misinformation and building demand for immunisation.",
    typeLabel: "Guides and tools",
    where: "Mesh, global",
    date: "1 Feb 2021",
    authors: "Mesh Editorial Team",
    tags: {type: ["Guides and tools"],hub: ["Mesh"],topic: ["Communications"],health: ["Vaccines","COVID-19"],region: ["Global"],lang: ["English"],year: ["2020 to 2023"]}
  },
  media: {
    id: "media",
    title: "Working with journalists and the media",
    url: "https://mesh.tghn.org/articles/guide-working-journalists-and-media/",
    summary: "Working with journalists from a research programme point of view, including media advisory groups and a journalists-in-residence programme.",
    typeLabel: "Guides and tools",
    where: "Mesh, Kenya",
    date: "9 Mar 2021",
    authors: "Cynthia Nyanduko Mauncho, Lindiwe Mafuleka",
    tags: {type: ["Guides and tools"],hub: ["Mesh"],topic: ["Communications"],region: ["Sub-Saharan Africa"],country: ["Kenya"],lang: ["English"],year: ["2020 to 2023"]}
  },
  better: {
    id: "better",
    title: "Better engagement, better evidence: working in partnership with patients, the public, and communities in clinical trials with involvement and good participatory practice",
    url: "https://mesh.tghn.org/articles/better-engagement-better-evidence-working-partnership-patients-public-and-communities-clinical-trials-involvement-and-good-part/",
    summary: "Makes the case for working in partnership with patients, the public and communities across clinical trials, combining public involvement with good participatory practice.",
    typeLabel: "Article",
    where: "Mesh, global",
    date: "1 Apr 2025",
    authors: "Nina Gobat et al.",
    tags: {type: ["Article"],hub: ["Mesh"],topic: ["Engagement in clinical trials","Participatory research"],region: ["Global"],lang: ["English"],year: ["2024 onwards"]}
  },
  digital: {
    id: "digital",
    title: "Digital approaches to enhancing community engagement in clinical trials",
    url: "https://mesh.tghn.org/articles/digital-approaches-enhancing-community-engagement-clinical-trials/",
    summary: "An article on digital approaches trial teams can use to strengthen community engagement.",
    typeLabel: "Article",
    where: "Mesh, global",
    date: "16 Mar 2026",
    authors: "Rayner K. J. Tan",
    tags: {type: ["Article"],hub: ["Mesh"],topic: ["Engagement in clinical trials","Communications"],region: ["Global"],lang: ["English"],year: ["2024 onwards"]}
  },
  strong: {
    id: "strong",
    title: "Supporting Strong Engagement Practice in Clinical Trials",
    url: "https://mesh.tghn.org/articles/published-report-supporting-strong-engagement-practice-clinical-trials/",
    summary: "Key themes from an October 2020 workshop on ways to support strong engagement practice within clinical trials.",
    typeLabel: "Project report",
    where: "Mesh, global",
    date: "25 Jan 2021",
    authors: "Mesh Editorial Team, Siân Aggett",
    tags: {type: ["Project reports"],hub: ["Mesh"],topic: ["Engagement in clinical trials"],health: ["Vaccines"],region: ["Global"],lang: ["English"],year: ["2020 to 2023"]}
  },
  who: {
    id: "who",
    title: "WHO Guidance for best practices for clinical trials",
    url: "https://mesh.tghn.org/articles/guidance-best-practices-clinical-trials/",
    summary: "WHO guidance aimed at improving the quality and equity of clinical trials worldwide.",
    typeLabel: "Guideline",
    where: "Mesh, global",
    date: "25 Sep 2024",
    authors: "World Health Organization",
    tags: {type: ["Guideline"],hub: ["Mesh"],topic: ["Engagement in clinical trials"],region: ["Global"],lang: ["English"],year: ["2024 onwards"]}
  },
  sep: {
    id: "sep",
    title: "KEMRI | Wellcome Trust Research Programme: School Engagement Programme",
    url: "https://mesh.tghn.org/articles/kemri-wellcome-trust-research-programme-school-engagement-programme/",
    summary: "A programme that aims to build students’ interest in science and science careers, and mutual understanding between researchers and schools.",
    typeLabel: "Project report",
    where: "Mesh, Kenya",
    date: "8 Jan 2020",
    authors: "Alun Iwan Davies, Grace Mwango",
    tags: {type: ["Project reports"],hub: ["Mesh"],topic: ["Schools"],region: ["Sub-Saharan Africa"],country: ["Kenya"],lang: ["English"],year: ["Before 2020"]}
  },
  sciback: {
    id: "sciback",
    title: "The Sciback-skit programme: engaging young people as malaria ambassadors in Kenya",
    url: "https://mesh.tghn.org/articles/project-report-sciback-skit-programme-engaging-young-people-malaria-ambassadors-kenya/",
    summary: "High school students learnt about malaria and scientific research and became malaria ambassadors. Funded by the DELTAS Africa CPE Seed Fund.",
    typeLabel: "Project report",
    where: "Mesh, Kenya",
    date: "26 Aug 2021",
    authors: "Trizah Milugo, Mesh Editorial Team",
    tags: {type: ["Project reports"],hub: ["Mesh"],topic: ["Schools"],health: ["Malaria"],region: ["Sub-Saharan Africa"],country: ["Kenya"],lang: ["English"],year: ["2020 to 2023"]}
  },
  vr: {
    id: "vr",
    title: "School students take virtual reality tour",
    url: "https://mesh.tghn.org/articles/school-students-take-virtual-reality-tour-kemri-wellcome-trust-research-laboratories/",
    summary: "A 360-degree virtual reality tour of the KEMRI-Wellcome research laboratories, made to complement the programme’s school engagement activities.",
    typeLabel: "Article",
    where: "Mesh, Kenya",
    date: "29 Feb 2024",
    authors: "Patience Kiyuka",
    tags: {type: ["Article"],hub: ["Mesh"],topic: ["Schools","Communications"],region: ["Sub-Saharan Africa"],country: ["Kenya"],lang: ["English"],year: ["2024 onwards"]}
  },
  pvideo: {
    id: "pvideo",
    title: "Evaluating and engaging: using participatory video with Kenyan secondary school students to explore engagement with health research",
    url: "https://interact-research.tghn.org/articles/evaluating-and-engaging-using-participatory-video-kenyan-secondary-school-students-explore-engagement-health-research/",
    summary: "How participatory video with secondary school students was used both to engage them with health research and to evaluate that engagement.",
    typeLabel: "Article",
    where: "INTERACT, Kenya",
    date: "22 Sep 2023",
    authors: "Alun Davies",
    tags: {type: ["Article"],topic: ["Schools","Evaluation","Participatory research"],region: ["Sub-Saharan Africa"],country: ["Kenya"],lang: ["English"],year: ["2020 to 2023"]}
  },
  webinar: {
    id: "webinar",
    title: "Webinar: Why is it important for health researchers to engage school students?",
    url: "https://mesh.tghn.org/articles/webinar-why-it-important-health-researchers-engage-school-students/",
    summary: "Dr Alun Davies of the KEMRI-Wellcome Trust Research Programme sets out the goals, methods and outcomes of school engagement as a “win-win” for researchers and schools.",
    typeLabel: "Webinar",
    where: "Mesh, Kenya",
    date: "28 Jan 2020",
    authors: "Mesh Editorial Team",
    tags: {type: ["Webinars"],hub: ["Mesh"],topic: ["Schools"],region: ["Sub-Saharan Africa"],country: ["Kenya"],lang: ["English"],year: ["2020 to 2023"]}
  },
  children: {
    id: "children",
    title: "Who should decide about children’s and adolescents’ participation in health research?",
    url: "https://mesh.tghn.org/articles/who-should-decide-about-childrens-and-adolescents-participation-health-research/",
    summary: "Explores how research centres can involve children and young people in health research activities and in developing research proposals.",
    typeLabel: "Published literature",
    where: "Mesh, Kenya",
    date: "21 Jan 2020",
    authors: "Mesh Editorial Team",
    tags: {type: ["Published literature"],hub: ["Mesh"],topic: ["Ethics of engagement","Schools"],health: ["Child health"],region: ["Sub-Saharan Africa"],country: ["Kenya"],lang: ["English"],year: ["2020 to 2023"]}
  }
};
