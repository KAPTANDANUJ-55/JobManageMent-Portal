// ---------------------------------------------------------------------------
// Seeded in-browser dataset that backs the mock API (src/api/mock/handlers.js).
// Everything here is fixture data - India-flavoured companies, users, jobs and
// applications - so the whole UI can be built and demoed before the Spring Boot
// service exists.
//
// Conventions worth knowing:
//  - ids are plain incrementing numbers, unique per collection.
//  - timestamps are generated relative to "now" so a fresh demo always shows
//    jobs posted "3 days ago" and deadlines in the future.
//  - `job.description` is a single string whose paragraphs are separated by a
//    blank line ("\n\n"); render it with `description.split('\n\n')`.
//  - collections are exported as `let` bindings and mutated in place (or
//    reassigned by resetSeed/hydrate) so handlers can persist changes.
// ---------------------------------------------------------------------------
import {
  ROLES,
  JOB_TYPES,
  EXPERIENCE_LEVELS,
  WORK_MODES,
  JOB_STATUS,
  APPLICATION_STATUS,
  CATEGORIES,
} from '@/utils/constants';

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.now();

/** ISO timestamp `n` days in the past (hour pinned so data looks tidy). */
function daysAgo(n, hour = 11) {
  const d = new Date(NOW - n * DAY);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

/** ISO timestamp `n` days in the future. */
function daysAhead(n, hour = 18) {
  const d = new Date(NOW + n * DAY);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

/** Highest id currently in a collection, plus one. */
export function nextId(collection = []) {
  return collection.reduce((max, row) => Math.max(max, Number(row?.id) || 0), 0) + 1;
}

// Readable aliases over the shared enums so no domain string is hardcoded here.
const CAT = {
  ENG: CATEGORIES[0],
  DESIGN: CATEGORIES[1],
  DATA: CATEGORIES[2],
  PRODUCT: CATEGORIES[3],
  MARKETING: CATEGORIES[4],
  SALES: CATEGORIES[5],
  FINANCE: CATEGORIES[6],
  HR: CATEGORIES[7],
  SUPPORT: CATEGORIES[8],
  OPS: CATEGORIES[9],
};
const TYPE = {
  FULL: JOB_TYPES[0],
  PART: JOB_TYPES[1],
  CONTRACT: JOB_TYPES[2],
  INTERN: JOB_TYPES[3],
  REMOTE: JOB_TYPES[4],
};
const LEVEL = {
  FRESHER: EXPERIENCE_LEVELS[0],
  JUNIOR: EXPERIENCE_LEVELS[1],
  MID: EXPERIENCE_LEVELS[2],
  SENIOR: EXPERIENCE_LEVELS[3],
  LEAD: EXPERIENCE_LEVELS[4],
};
const MODE = {
  ONSITE: WORK_MODES[0],
  HYBRID: WORK_MODES[1],
  REMOTE: WORK_MODES[2],
};

/** Every mock account shares one password so the demo is easy to explain. */
export const DEMO_PASSWORD = 'Password@123';

// --- companies --------------------------------------------------------------

function seedCompanies() {
  return [
    {
      id: 1,
      name: 'Zenlytics',
      logoText: 'ZL',
      industry: 'Analytics SaaS',
      location: 'Bengaluru',
      size: '250-500 employees',
      website: 'https://zenlytics.in',
      about:
        'Zenlytics builds a self-serve product analytics platform used by more than 900 Indian SaaS and D2C teams. The engineering group is split into small product pods that own a surface end to end, from the query planner to the dashboards customers stare at every morning.',
      rating: 4.4,
    },
    {
      id: 2,
      name: 'NimbusPay',
      logoText: 'NP',
      industry: 'Fintech & Payments',
      location: 'Mumbai',
      size: '500-1000 employees',
      website: 'https://nimbuspay.com',
      about:
        'NimbusPay is an RBI-licensed payment aggregator processing UPI, cards and recurring mandates for marketplaces and lending platforms. Reliability work is treated as product work here: every team publishes its own uptime and settlement-accuracy numbers.',
      rating: 4.1,
    },
    {
      id: 3,
      name: 'Craftly Labs',
      logoText: 'CL',
      industry: 'Design & Product Studio',
      location: 'Pune',
      size: '50-100 employees',
      website: 'https://craftlylabs.design',
      about:
        'Craftly Labs is an independent product studio that partners with funded startups on research, interface design and design systems. Projects run in six-week cycles with designers embedded directly in the client team.',
      rating: 4.6,
    },
    {
      id: 4,
      name: 'Vahan Mobility',
      logoText: 'VM',
      industry: 'Mobility & Logistics',
      location: 'Gurugram',
      size: '1000-5000 employees',
      website: 'https://vahanmobility.in',
      about:
        'Vahan Mobility runs an electric two-wheeler fleet and last-mile delivery network across eleven cities. The technology team owns rider apps, battery-swap station software and the routing engine behind every drop.',
      rating: 3.9,
    },
    {
      id: 5,
      name: 'MedhaAI',
      logoText: 'MA',
      industry: 'Healthcare AI',
      location: 'Hyderabad',
      size: '100-250 employees',
      website: 'https://medha.ai',
      about:
        'MedhaAI develops clinical decision-support models for radiology and pathology, deployed in over 200 diagnostic centres. Everything the team ships is validated against annotated datasets reviewed by practising clinicians.',
      rating: 4.3,
    },
    {
      id: 6,
      name: 'Kaveri Cloud',
      logoText: 'KC',
      industry: 'Cloud Infrastructure',
      location: 'Chennai',
      size: '250-500 employees',
      website: 'https://kavericloud.com',
      about:
        'Kaveri Cloud offers managed Kubernetes, object storage and observability out of data centres in Chennai and Mumbai, aimed at companies with data-residency requirements. Engineers here operate what they build, on a humane on-call rotation.',
      rating: 4.0,
    },
    {
      id: 7,
      name: 'Trailhead Retail',
      logoText: 'TR',
      industry: 'E-commerce',
      location: 'Noida',
      size: '500-1000 employees',
      website: 'https://trailheadretail.in',
      about:
        'Trailhead Retail sells outdoor and adventure gear through its own storefront and eight experience stores. The commerce platform, warehouse tooling and loyalty programme are all built in house.',
      rating: 3.8,
    },
    {
      id: 8,
      name: 'BrightFold Media',
      logoText: 'BF',
      industry: 'Marketing & AdTech',
      location: 'Mumbai',
      size: '100-250 employees',
      website: 'https://brightfold.media',
      about:
        'BrightFold Media plans and buys performance media for consumer brands, backed by an in-house attribution stack. Creative, media and analytics sit in the same pod for every account.',
      rating: 4.2,
    },
    {
      id: 9,
      name: 'FinEdge Capital',
      logoText: 'FE',
      industry: 'Financial Services',
      location: 'Bengaluru',
      size: '1000-5000 employees',
      website: 'https://finedgecapital.in',
      about:
        'FinEdge Capital is a non-banking financial company lending to small businesses and salaried borrowers, with a growing wealth-advisory arm. Underwriting is model-assisted but always signed off by a credit officer.',
      rating: 3.7,
    },
    {
      id: 10,
      name: 'Orbit HR Tech',
      logoText: 'OH',
      industry: 'HR Software',
      location: 'Remote',
      size: '50-100 employees',
      website: 'https://orbithr.io',
      about:
        'Orbit HR Tech is a fully distributed team building payroll and attendance software for Indian SMBs. Compliance updates ship the same week a statutory change is notified.',
      rating: 4.5,
    },
  ];
}

// --- users ------------------------------------------------------------------

/** Fills the fields every account has so each seed row stays readable. */
function mkUser(row) {
  return {
    avatarUrl: null,
    password: DEMO_PASSWORD,
    phone: null,
    location: null,
    headline: '',
    bio: '',
    skills: [],
    experienceYears: 0,
    education: [],
    resumeName: null,
    resumeUrl: null,
    companyId: null,
    active: true,
    ...row,
  };
}

function seedUsers() {
  return [
    mkUser({
      id: 1, name: 'Admin User', email: 'admin@demo.com', role: ROLES.ADMIN,
      phone: '+91 98450 11001', location: 'Bengaluru',
      headline: 'Platform administrator at JobHub',
      bio: 'Keeps job postings honest, reviews recruiter accounts and watches the moderation queue.',
      createdAt: daysAgo(420),
    }),
    mkUser({
      id: 2, name: 'Meera Nair', email: 'recruiter@demo.com', role: ROLES.RECRUITER, companyId: 1,
      phone: '+91 98450 22013', location: 'Bengaluru',
      headline: 'Talent Partner, Engineering & Design at Zenlytics',
      bio: 'Hires for the product pods at Zenlytics. Replies to every application, even the ones that do not work out.',
      experienceYears: 7, createdAt: daysAgo(380),
    }),
    mkUser({
      id: 3, name: 'Rohit Deshpande', email: 'rohit.deshpande@nimbuspay.com', role: ROLES.RECRUITER,
      companyId: 2, phone: '+91 98200 44521', location: 'Mumbai',
      headline: 'Lead Recruiter, Technology at NimbusPay',
      bio: 'Ten years of hiring for payments and risk teams across Mumbai and Pune.',
      experienceYears: 10, createdAt: daysAgo(300),
    }),
    mkUser({
      id: 4, name: 'Ishita Bose', email: 'ishita@craftlylabs.design', role: ROLES.RECRUITER,
      companyId: 3, phone: '+91 90280 71144', location: 'Pune',
      headline: 'Studio Manager at Craftly Labs',
      bio: 'Runs hiring and staffing for the studio. Cares more about portfolios than resumes.',
      experienceYears: 6, createdAt: daysAgo(210),
    }),
    mkUser({
      id: 5, name: 'Naveen Chandra', email: 'naveen.chandra@vahanmobility.in', role: ROLES.RECRUITER,
      companyId: 4, phone: '+91 99100 63302', location: 'Gurugram',
      headline: 'Talent Acquisition Manager at Vahan Mobility',
      bio: 'Hires across engineering, city operations and field sales for eleven cities.',
      experienceYears: 8, createdAt: daysAgo(150),
    }),
    mkUser({
      id: 6, name: 'Ananya Krishnan', email: 'ananya.k@medha.ai', role: ROLES.RECRUITER,
      companyId: 5, phone: '+91 99490 18876', location: 'Hyderabad',
      headline: 'Head of Talent at MedhaAI',
      bio: 'Builds the research and data teams. Former data analyst, so the screening call is a real conversation.',
      experienceYears: 9, createdAt: daysAgo(95),
    }),
    mkUser({
      id: 7, name: 'Suresh Iyer', email: 'suresh.iyer@kavericloud.com', role: ROLES.RECRUITER,
      companyId: 6, phone: '+91 94440 25519', location: 'Chennai',
      headline: 'Recruiter, Infrastructure & Platform at Kaveri Cloud',
      bio: 'Focused on SRE, platform and support hiring for the Chennai and Mumbai regions.',
      experienceYears: 5, createdAt: daysAgo(40),
    }),
    mkUser({
      id: 8, name: 'Arsh Sharma', email: 'seeker@demo.com', role: ROLES.SEEKER,
      phone: '+91 96860 33417', location: 'Bengaluru',
      headline: 'Frontend Engineer - React, TypeScript, design systems',
      bio: 'Three years of building customer-facing dashboards and design systems. Most recently rebuilt a reporting suite that cut first render from 4.2s to 900ms. Looking for a product team that treats the frontend as a craft.',
      skills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'REST APIs', 'Jest'],
      experienceYears: 3,
      education: [
        { degree: 'B.E. Computer Science', institution: 'RV College of Engineering, Bengaluru', year: 2023 },
        { degree: 'Class XII (PCM)', institution: 'Kendriya Vidyalaya, Jaipur', year: 2019 },
      ],
      resumeName: 'Arsh-Sharma-Frontend-Engineer.pdf', resumeUrl: '#resume-arsh-sharma',
      createdAt: daysAgo(55),
    }),
    mkUser({
      id: 9, name: 'Priya Menon', email: 'priya.menon@example.com', role: ROLES.SEEKER,
      phone: '+91 98840 77120', location: 'Chennai',
      headline: 'Data Analyst - SQL, Python, dashboards that get used',
      bio: 'Two years turning messy operations data into weekly decisions for a logistics team. Comfortable owning a metric end to end, from instrumentation to the review meeting.',
      skills: ['SQL', 'Python', 'Pandas', 'Power BI', 'Excel', 'dbt'],
      experienceYears: 2,
      education: [{ degree: 'B.Sc. Statistics', institution: 'Loyola College, Chennai', year: 2024 }],
      resumeName: 'Priya-Menon-Analyst.pdf', resumeUrl: '#resume-priya-menon',
      createdAt: daysAgo(132),
    }),
    mkUser({
      id: 10, name: 'Karthik Reddy', email: 'karthik.reddy@example.com', role: ROLES.SEEKER,
      phone: '+91 90000 51284', location: 'Hyderabad',
      headline: 'Backend Engineer - Java, Spring Boot, distributed systems',
      bio: 'Five years on payment and settlement services handling roughly 4,000 requests per second at peak. Enjoys the unglamorous work: idempotency, retries and reconciliation.',
      skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Kafka', 'Docker', 'AWS'],
      experienceYears: 5,
      education: [{ degree: 'B.Tech Information Technology', institution: 'JNTU Hyderabad', year: 2021 }],
      resumeName: 'Karthik-Reddy-Backend.pdf', resumeUrl: '#resume-karthik-reddy',
      createdAt: daysAgo(168),
    }),
    mkUser({
      id: 11, name: 'Sneha Gupta', email: 'sneha.gupta@example.com', role: ROLES.SEEKER,
      phone: '+91 98110 60934', location: 'Noida',
      headline: 'Product Designer - research-led, systems-minded',
      bio: 'Four years designing for fintech and health apps. Runs her own usability sessions and has shipped two design systems that outlived the projects they were built for.',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility'],
      experienceYears: 4,
      education: [{ degree: 'B.Des Communication Design', institution: 'NIFT New Delhi', year: 2022 }],
      resumeName: 'Sneha-Gupta-Product-Designer.pdf', resumeUrl: '#resume-sneha-gupta',
      createdAt: daysAgo(22),
    }),
    mkUser({
      id: 12, name: 'Aditya Rao', email: 'aditya.rao@example.com', role: ROLES.SEEKER,
      phone: '+91 88880 41276', location: 'Pune',
      headline: 'Final-year CS student looking for a first engineering role',
      bio: 'Built a college mess-management app used by 1,200 students and finished a summer internship on a Node.js billing service. Keen to learn from a team that reviews code properly.',
      skills: ['JavaScript', 'Node.js', 'MongoDB', 'Git', 'HTML/CSS'],
      experienceYears: 0,
      education: [{ degree: 'B.E. Computer Engineering', institution: 'COEP Technological University, Pune', year: 2026 }],
      resumeName: 'Aditya-Rao-Fresher.pdf', resumeUrl: '#resume-aditya-rao',
      createdAt: daysAgo(8),
    }),
    mkUser({
      id: 13, name: 'Fatima Sheikh', email: 'fatima.sheikh@example.com', role: ROLES.SEEKER,
      phone: '+91 98330 92210', location: 'Mumbai',
      headline: 'Finance Analyst - FP&A, reporting, audit readiness',
      bio: 'Six years across FP&A and controllership at a listed NBFC. Owns the monthly close, the board pack and an increasingly automated reporting stack.',
      skills: ['Financial Modelling', 'IND AS', 'Advanced Excel', 'Tally', 'SQL'],
      experienceYears: 6,
      education: [
        { degree: 'Chartered Accountant', institution: 'ICAI', year: 2020 },
        { degree: 'B.Com', institution: 'Narsee Monjee College, Mumbai', year: 2017 },
      ],
      resumeName: 'Fatima-Sheikh-Finance.pdf', resumeUrl: '#resume-fatima-sheikh',
      createdAt: daysAgo(88),
    }),
    mkUser({
      id: 14, name: 'Nikhil Verma', email: 'nikhil.verma@example.com', role: ROLES.SEEKER,
      phone: '+91 99580 30017', location: 'Gurugram',
      headline: 'Business Development - SaaS and B2B services',
      bio: 'Three years of outbound and mid-market closing, mostly selling logistics software to retail chains. Carried a 1.2 crore annual quota and finished last year at 118 percent.',
      skills: ['B2B Sales', 'Lead Generation', 'HubSpot', 'Negotiation', 'Account Management'],
      experienceYears: 3,
      education: [{ degree: 'MBA Marketing', institution: 'Symbiosis Institute, Pune', year: 2023 }],
      resumeName: 'Nikhil-Verma-BD.pdf', resumeUrl: '#resume-nikhil-verma',
      createdAt: daysAgo(46),
    }),
    mkUser({
      id: 15, name: 'Divya Iyer', email: 'divya.iyer@example.com', role: ROLES.SEEKER,
      phone: '+91 97390 84461', location: 'Remote',
      headline: 'HR Generalist - talent, onboarding and compliance',
      bio: 'Seven years of people operations in startups between 40 and 400 employees. Set up the onboarding and PF/ESI compliance process at two of them from scratch.',
      skills: ['Recruitment', 'Onboarding', 'HRIS', 'Payroll Compliance', 'Employee Relations'],
      experienceYears: 7,
      education: [{ degree: 'MBA Human Resources', institution: 'Christ University, Bengaluru', year: 2019 }],
      resumeName: 'Divya-Iyer-HR.pdf', resumeUrl: '#resume-divya-iyer',
      createdAt: daysAgo(205),
    }),
  ];
}

// --- jobs -------------------------------------------------------------------

/** Benefit packages are a company-level thing, so they are shared by company. */
const BENEFITS = {
  zenlytics: [
    'Employee stock options with an annual refresh grant',
    'Group medical cover of Rs 10L for you, your partner and two dependents',
    'Annual learning wallet of Rs 60,000 for courses and conferences',
    'Two no-questions-asked wellness days every quarter',
  ],
  nimbuspay: [
    'Performance bonus paid out twice a year',
    'Family floater health insurance of Rs 15L plus term cover',
    'Certification reimbursement for AWS, CFA and FRM',
    'Creche allowance and a 26-week parental leave policy',
  ],
  craftly: [
    'Four-day work week during non-delivery weeks',
    'Rs 80,000 hardware budget refreshed every three years',
    'Paid conference trip once a year, your pick',
    'Studio profit share for everyone past 18 months',
  ],
  vahan: [
    'Free access to the company EV fleet for daily commute',
    'Health cover of Rs 8L with unlimited teleconsultation',
    'Quarterly performance incentive linked to city metrics',
    'Relocation support for moves across our eleven cities',
  ],
  medha: [
    'Meaningful equity at an early-stage valuation',
    'Health cover of Rs 12L including mental-health sessions',
    'Conference and publication support, including travel',
    'Flexible hours with a four-hour overlap window',
  ],
  kaveri: [
    'Fully remote-friendly with a quarterly team offsite',
    'Health cover of Rs 10L and an annual full-body check-up',
    'On-call compensation paid per rotation, not bundled into CTC',
    'Home-office setup allowance of Rs 50,000',
  ],
};

/** Fills the fields that are the same for most postings. */
function mkJob(row) {
  return {
    salaryPeriod: 'year',
    openings: 1,
    status: JOB_STATUS.OPEN,
    featured: false,
    views: 0,
    ...row,
  };
}

function seedJobs() {
  return [
    // --- Zenlytics (company 1, recruiter Meera Nair) ---
    mkJob({
      id: 1, title: 'Senior Frontend Engineer', companyId: 1, recruiterId: 2,
      category: CAT.ENG, type: TYPE.FULL, workMode: MODE.HYBRID, location: 'Bengaluru',
      experienceLevel: LEVEL.SENIOR, salaryMin: 2800000, salaryMax: 4200000, openings: 2,
      featured: true, views: 1486, postedAt: daysAgo(24), deadline: daysAhead(26),
      description:
        'Zenlytics dashboards are the first thing our customers open in the morning, and they are the reason people renew. We are looking for a senior frontend engineer to own the charting and exploration surface: the part of the product where a growth analyst drags four dimensions onto a canvas and expects an answer in under a second.\n\nYou will work in a pod of five - two backend engineers, a designer and a product manager - with real say over what gets built and in what order. The current focus is a rewrite of our query builder into a composable component library, along with a serious push on perceived performance for accounts with very large event volumes.\n\nOur stack is React 18, Vite, Tailwind and TanStack Query against a Java backend. You do not need to have used all of it, but you should be the kind of engineer who reads the profiler output before guessing.',
      responsibilities: [
        'Own the query builder and dashboard rendering surface end to end, from component API design to production monitoring',
        'Cut time-to-interactive on large accounts through virtualisation, memoisation and smarter data fetching',
        'Extend the shared component library and keep its documentation genuinely current',
        'Review pull requests from two mid-level engineers and mentor them into stronger reviewers themselves',
        'Partner with design on interaction details, and push back when a pattern will not hold up at scale',
      ],
      requirements: [
        '5+ years building production React applications, including at least one data-heavy interface',
        'Strong grasp of the browser rendering path, React reconciliation and profiling tools',
        'Experience designing reusable component APIs that other teams consume',
        'Comfortable with TypeScript, modern build tooling and writing tests you would trust on a Friday',
        'Able to work from our Koramangala office two days a week',
      ],
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Data Visualisation', 'Performance', 'Testing'],
      benefits: BENEFITS.zenlytics,
    }),
    mkJob({
      id: 2, title: 'Analytics Engineer', companyId: 1, recruiterId: 2,
      category: CAT.DATA, type: TYPE.REMOTE, workMode: MODE.REMOTE, location: 'Remote',
      experienceLevel: LEVEL.MID, salaryMin: 1800000, salaryMax: 2600000,
      views: 742, postedAt: daysAgo(11), deadline: daysAhead(19),
      description:
        'We are hiring an analytics engineer to sit between our data platform and the teams that depend on it. Today every pod writes its own SQL against raw event tables, which means four slightly different definitions of "active account" and a monthly argument about which one is right.\n\nYour job is to end that argument. You will build and own the modelled layer in dbt - staging, marts and a documented metrics catalogue - and then make it the easiest path for anyone who needs a number. Expect a fair amount of stakeholder conversation alongside the modelling work.\n\nThe role is fully remote within India, with a two-day team gathering in Bengaluru once a quarter.',
      responsibilities: [
        'Design and maintain dbt models covering product usage, billing and customer lifecycle',
        'Publish a metrics catalogue with owners, definitions and freshness guarantees',
        'Build data-quality tests and alerting so breakages are caught before a stakeholder finds them',
        'Support product and go-to-market teams with self-serve datasets instead of one-off extracts',
        'Work with platform engineers to keep warehouse cost per query trending down',
      ],
      requirements: [
        '3+ years in analytics engineering, data engineering or a heavily SQL-based analyst role',
        'Advanced SQL, including window functions and query-plan reading',
        'Hands-on dbt experience with a real project you can talk through',
        'Working Python for orchestration and ad hoc analysis',
        'Clear written communication - most of your influence will arrive as documentation',
      ],
      skills: ['SQL', 'dbt', 'Python', 'Snowflake', 'Data Modelling', 'Airflow'],
      benefits: BENEFITS.zenlytics,
    }),
    mkJob({
      id: 3, title: 'Product Designer', companyId: 1, recruiterId: 2,
      category: CAT.DESIGN, type: TYPE.FULL, workMode: MODE.HYBRID, location: 'Bengaluru',
      experienceLevel: LEVEL.MID, salaryMin: 1600000, salaryMax: 2400000,
      views: 908, postedAt: daysAgo(18), deadline: daysAhead(12),
      description:
        'Analytics products fail in a very specific way: they show everything and explain nothing. We want a product designer who is genuinely interested in that problem and has opinions about how a dense interface should behave.\n\nYou will be the second designer at Zenlytics, paired with a pod working on onboarding and the first-week experience. Roughly two thirds of new accounts never build a second dashboard, and closing that gap is the mandate for the next two quarters.\n\nWe run weekly customer calls and you are expected on them. Research here is not a separate department, it is part of designing.',
      responsibilities: [
        'Design onboarding and dashboard-creation flows from first sketch through shipped detail',
        'Run five to six customer conversations a month and turn them into decisions the team can act on',
        'Extend our Figma library in step with the engineering component library',
        'Prototype interaction ideas well enough that engineers can judge feasibility',
        'Define success metrics for your work with the product manager before build starts',
      ],
      requirements: [
        '3+ years designing web applications, ideally B2B or data-heavy tools',
        'A portfolio showing your reasoning, not just final screens',
        'Strong Figma craft including components, variants and auto layout',
        'Practical understanding of accessibility - contrast, focus order, keyboard paths',
        'Comfortable presenting work to engineers and taking hard questions well',
      ],
      skills: ['Figma', 'Interaction Design', 'User Research', 'Design Systems', 'Prototyping'],
      benefits: BENEFITS.zenlytics,
    }),
    mkJob({
      id: 4, title: 'Customer Success Associate', companyId: 1, recruiterId: 2,
      category: CAT.SUPPORT, type: TYPE.FULL, workMode: MODE.ONSITE, location: 'Bengaluru',
      experienceLevel: LEVEL.JUNIOR, salaryMin: 600000, salaryMax: 900000,
      status: JOB_STATUS.CLOSED, views: 1130, postedAt: daysAgo(52), deadline: daysAhead(4),
      description:
        'Our customer success associates are the reason a new account gets to value in its first fortnight. You will own a book of roughly forty small and mid-market accounts, run their onboarding, and be the person they message when a number looks wrong.\n\nThe work is a mix of scheduled sessions and reactive help: kickoff calls, dashboard reviews at day 30 and day 90, plus a shared support queue you rotate through with three colleagues. Product knowledge is the whole job, so your first month is mostly structured learning.\n\nThis position is now closed - we are keeping the posting up for reference while we finish interviews.',
      responsibilities: [
        'Onboard new accounts and get each one to its first shared dashboard within fourteen days',
        'Run day-30 and day-90 reviews and document what each account actually needs next',
        'Handle the shared support queue with a first-response target of two working hours',
        'Flag renewal risk early with evidence, not gut feel',
        'Feed recurring friction back to product with real examples attached',
      ],
      requirements: [
        '1-3 years in customer success, support or account management at a software company',
        'Clear, calm written English - most of this job happens in writing',
        'Comfortable with spreadsheets and curious enough to learn basic SQL',
        'Organised enough to run forty accounts without dropping any of them',
        'Able to work from the Bengaluru office five days a week',
      ],
      skills: ['Customer Success', 'Onboarding', 'Account Management', 'Communication', 'Excel'],
      benefits: BENEFITS.zenlytics,
    }),
    // --- NimbusPay (company 2, recruiter Rohit Deshpande) ---
    mkJob({
      id: 5, title: 'Backend Engineer - Java & Spring Boot', companyId: 2, recruiterId: 3,
      category: CAT.ENG, type: TYPE.FULL, workMode: MODE.ONSITE, location: 'Mumbai',
      experienceLevel: LEVEL.MID, salaryMin: 1800000, salaryMax: 2800000, openings: 3,
      featured: true, views: 2214, postedAt: daysAgo(19), deadline: daysAhead(28),
      description:
        'NimbusPay settles money for a few thousand merchants every day, which means our backend services are held to a standard that most CRUD applications are not. A bug here does not show up as a broken page, it shows up as a merchant whose payout is short by Rs 40,000.\n\nYou will join the settlements team and work on the services that reconcile bank files against our ledger, handle retries and mandate renewals, and expose merchant-facing reports. Expect real conversations about idempotency, exactly-once semantics and what to do when a bank partner sends the same file twice.\n\nStack: Java 21, Spring Boot 3, PostgreSQL, Kafka and Kubernetes on our own infrastructure. Code review is thorough and every service has a runbook.',
      responsibilities: [
        'Build and operate settlement, reconciliation and payout services in Java and Spring Boot',
        'Design idempotent APIs and event consumers that survive duplicate and out-of-order delivery',
        'Write the SQL and schema changes yourself, including migration and rollback plans',
        'Take part in a weekday on-call rotation for the services your team owns',
        'Contribute to design documents and review those written by peers',
      ],
      requirements: [
        '3-6 years of backend engineering with Java and Spring Boot in production',
        'Solid relational database skills - indexing, transactions, isolation levels',
        'Experience with a message broker such as Kafka or RabbitMQ',
        'Familiarity with payments, ledgers or any domain where correctness beats speed',
        'Willing to work from our Lower Parel office; this team is deliberately on-site',
      ],
      skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Kafka', 'Kubernetes', 'REST APIs'],
      benefits: BENEFITS.nimbuspay,
    }),
    mkJob({
      id: 6, title: 'Risk & Fraud Analyst', companyId: 2, recruiterId: 3,
      category: CAT.DATA, type: TYPE.FULL, workMode: MODE.HYBRID, location: 'Mumbai',
      experienceLevel: LEVEL.JUNIOR, salaryMin: 900000, salaryMax: 1400000,
      views: 664, postedAt: daysAgo(9), deadline: daysAhead(21),
      description:
        'Fraud on a payments platform is an adversarial game, and the other side iterates weekly. We need an analyst who enjoys that: someone who will sit with a week of declined transactions and come back with a pattern nobody had noticed.\n\nYou will work with the risk team on rule tuning, chargeback analysis and merchant onboarding checks. Roughly half the role is investigative SQL, the other half is turning findings into rules, thresholds and the occasional uncomfortable recommendation about a large merchant.\n\nThis is a strong role for an early-career analyst who wants domain depth rather than another dashboard job.',
      responsibilities: [
        'Investigate flagged transactions and chargebacks, and document what actually happened',
        'Tune fraud rules and thresholds, measuring the false-positive cost of every change',
        'Run periodic reviews of merchant risk categories and escalate outliers',
        'Prepare monthly risk reporting for compliance and the leadership review',
        'Work with engineering to instrument the signals we currently lack',
      ],
      requirements: [
        '1-3 years in risk, fraud, credit analytics or transaction monitoring',
        'Strong SQL and confidence with large transaction datasets',
        'Working knowledge of Python or R for analysis',
        'Understanding of UPI, card networks or lending flows is a clear advantage',
        'The judgement to know when a pattern is signal and when it is noise',
      ],
      skills: ['SQL', 'Python', 'Fraud Analytics', 'Excel', 'Data Analysis'],
      benefits: BENEFITS.nimbuspay,
    }),
    mkJob({
      id: 7, title: 'Finance Manager - Controllership', companyId: 2, recruiterId: 3,
      category: CAT.FINANCE, type: TYPE.FULL, workMode: MODE.ONSITE, location: 'Mumbai',
      experienceLevel: LEVEL.SENIOR, salaryMin: 2400000, salaryMax: 3200000,
      views: 512, postedAt: daysAgo(23), deadline: daysAhead(15),
      description:
        'As a licensed payment aggregator we file more returns than most companies our size, and the finance function has grown faster than its process. We are hiring a finance manager to own controllership: monthly close, statutory compliance and the audit relationship.\n\nYou will manage two analysts and work closely with the settlements engineering team, because in a payments business the ledger is a product artefact as much as a finance one. There is a real automation agenda here - the current close takes eleven working days and we want it under six.\n\nThis role reports to the VP Finance and has visibility with the board audit committee.',
      responsibilities: [
        'Own the monthly and quarterly close, including reconciliations across nodal accounts',
        'Manage statutory compliance - GST, TDS, IND AS reporting and RBI returns',
        'Be the primary contact for statutory and internal auditors',
        'Shorten the close cycle by automating reconciliations with the engineering team',
        'Mentor two finance analysts and review their work properly, not just sign it',
      ],
      requirements: [
        'Chartered Accountant with 5+ years post-qualification experience',
        'Hands-on close and controllership experience at a regulated financial entity',
        'Strong IND AS knowledge and comfort defending positions to auditors',
        'Advanced Excel plus the curiosity to query the data warehouse directly',
        'Experience managing a small team',
      ],
      skills: ['IND AS', 'Financial Reporting', 'Statutory Audit', 'GST', 'Advanced Excel'],
      benefits: BENEFITS.nimbuspay,
    }),
    mkJob({
      id: 8, title: 'Product Manager - Payments', companyId: 2, recruiterId: 3,
      category: CAT.PRODUCT, type: TYPE.FULL, workMode: MODE.HYBRID, location: 'Mumbai',
      experienceLevel: LEVEL.SENIOR, salaryMin: 3200000, salaryMax: 4500000,
      featured: true, views: 1702, postedAt: daysAgo(7), deadline: daysAhead(23),
      description:
        'We are looking for a product manager to own the merchant-facing side of recurring payments: mandates, retries, dunning and the reporting merchants use to explain revenue to their own boards.\n\nThis is a genuinely technical product role. You will spend time in API documentation, NPCI circulars and failure-rate dashboards, and your best ideas will often be about a retry window rather than a screen. The current opportunity is large: mandate success rates vary by twenty points across bank partners and much of that gap is addressable.\n\nYou will work with two engineering pods, a designer and the risk team, and you will present outcomes monthly to the leadership group.',
      responsibilities: [
        'Own the recurring payments roadmap, from mandate creation through dunning and reporting',
        'Turn bank-level failure data into a prioritised list of fixes with measurable targets',
        'Write specifications precise enough that engineers argue about the right things',
        'Run merchant discovery calls and convert findings into roadmap decisions',
        'Track adoption and success-rate metrics after launch and report them honestly',
      ],
      requirements: [
        '4+ years in product management, at least two of them on payments or fintech infrastructure',
        'Comfortable reading API docs and debating schema and retry semantics with engineers',
        'Demonstrated ownership of a metric that moved because of your decisions',
        'Understanding of the Indian payments landscape - UPI Autopay, eNACH, card mandates',
        'Strong written communication; we make decisions in documents',
      ],
      skills: ['Product Management', 'Payments', 'API Design', 'SQL', 'Roadmapping', 'Analytics'],
      benefits: BENEFITS.nimbuspay,
    }),
    // --- Craftly Labs (company 3, recruiter Ishita Bose) ---
    mkJob({
      id: 9, title: 'UI/UX Design Intern', companyId: 3, recruiterId: 4,
      category: CAT.DESIGN, type: TYPE.INTERN, workMode: MODE.ONSITE, location: 'Pune',
      experienceLevel: LEVEL.FRESHER, salaryMin: 300000, salaryMax: 420000, openings: 2,
      views: 1975, postedAt: daysAgo(6), deadline: daysAhead(24),
      description:
        'A six-month paid internship at the studio, with a genuine chance of a full-time offer at the end - four of our seven designers started this way.\n\nYou will be paired with a senior designer on live client work from week two. Early tasks are focused - screen states, component variants, a competitive teardown - and they get broader as your judgement does. You will also sit in on client reviews, which is where most of the learning happens.\n\nWe are looking for taste and curiosity rather than a long resume. Show us three things you made and tell us why they look the way they do.',
      responsibilities: [
        'Support senior designers on client projects: wireframes, screen states and component work',
        'Build and maintain Figma component libraries under review',
        'Run competitive teardowns and share findings with the project team',
        'Take notes in client reviews and turn them into a clear action list',
        'Present your own work at the fortnightly studio critique',
      ],
      requirements: [
        'Final-year student or recent graduate in design, HCI or a related field',
        'A portfolio of two or three projects with your process visible',
        'Working knowledge of Figma',
        'Willing to be in the Pune studio four days a week for the full six months',
        'Able to take direct critique and come back with three options',
      ],
      skills: ['Figma', 'Wireframing', 'Visual Design', 'Design Thinking'],
      benefits: BENEFITS.craftly,
    }),
    mkJob({
      id: 10, title: 'Senior UX Researcher', companyId: 3, recruiterId: 4,
      category: CAT.DESIGN, type: TYPE.FULL, workMode: MODE.REMOTE, location: 'Remote',
      experienceLevel: LEVEL.SENIOR, salaryMin: 2200000, salaryMax: 3000000,
      views: 587, postedAt: daysAgo(14), deadline: daysAhead(30),
      description:
        'Our clients increasingly ask for research as a standalone engagement, and we want a senior researcher to lead that practice rather than fit it around design work.\n\nYou will scope and run studies across four or five projects a year - generative interviews, diary studies, usability testing, occasionally a survey when the question deserves one. Several engagements involve tier-two and tier-three users, so field research in regional languages is part of the job, not an exception.\n\nYou will also be responsible for how research is packaged. A finding that a client cannot act on is a finding we did not communicate properly.',
      responsibilities: [
        'Scope and lead research engagements from research question to final readout',
        'Run generative and evaluative studies, including field work outside metro cities',
        'Build a reusable research toolkit - screeners, guides, consent, synthesis templates',
        'Coach designers in the studio to run their own lightweight usability sessions',
        'Present findings to client leadership and defend the methodology when challenged',
      ],
      requirements: [
        '5+ years in UX or design research with a portfolio of studies you led',
        'Fluency in both qualitative methods and basic quantitative analysis',
        'Experience recruiting and interviewing users outside metro India',
        'Excellent synthesis and storytelling skills',
        'Comfortable working remotely with occasional travel to Pune and client sites',
      ],
      skills: ['User Research', 'Usability Testing', 'Interviewing', 'Synthesis', 'Survey Design'],
      benefits: BENEFITS.craftly,
    }),
    mkJob({
      id: 11, title: 'Motion Designer (6-month contract)', companyId: 3, recruiterId: 4,
      category: CAT.DESIGN, type: TYPE.CONTRACT, workMode: MODE.REMOTE, location: 'Remote',
      experienceLevel: LEVEL.MID, salaryMin: 1200000, salaryMax: 1800000,
      views: 431, postedAt: daysAgo(27), deadline: daysAhead(11),
      description:
        'Two of our current engagements need serious motion work: an onboarding sequence for a health app and a product launch film for a hardware client. We are hiring a motion designer on a six-month contract to lead both.\n\nThe brief spans interface motion and marketing animation, so you should be equally happy specifying a 200ms ease curve for engineers and cutting a ninety-second film to music. You will work with two visual designers and report to the studio creative lead.\n\nContract is six months, renewable, invoiced monthly. Fully remote with two optional studio weeks in Pune.',
      responsibilities: [
        'Design and produce interface motion specs that engineers can implement precisely',
        'Direct and edit a ninety-second product launch film, including sound design handoff',
        'Build a small motion library - loaders, transitions, empty states - for the client design system',
        'Review animation implementation in staging builds and flag what feels wrong',
        'Keep source files organised well enough for the client team to take over afterwards',
      ],
      requirements: [
        '3+ years of motion design with a showreel of both product and marketing work',
        'Strong After Effects skills; Rive or Lottie experience for production handoff',
        'Understanding of easing, timing and performance constraints on the web',
        'Able to work independently across two projects with fortnightly milestones',
        'Available to start within three weeks',
      ],
      skills: ['After Effects', 'Motion Design', 'Lottie', 'Figma', 'Video Editing'],
      benefits: BENEFITS.craftly,
    }),
    mkJob({
      id: 12, title: 'Marketing Associate (Part-time)', companyId: 3, recruiterId: 4,
      category: CAT.MARKETING, type: TYPE.PART, workMode: MODE.HYBRID, location: 'Pune',
      experienceLevel: LEVEL.JUNIOR, salaryMin: 500000, salaryMax: 800000,
      views: 623, postedAt: daysAgo(31), deadline: daysAhead(9),
      description:
        'The studio has never done its own marketing seriously, and it shows: our best work is invisible outside the client teams that commissioned it. We want a part-time marketing associate to fix that.\n\nThe work is content-led - case studies, a fortnightly newsletter, LinkedIn presence and the occasional event. You will interview our designers about projects and turn those conversations into pieces that a founder would actually finish reading.\n\nTwenty to twenty-five hours a week, at least one day in the Pune studio. This suits someone balancing a course or freelance practice.',
      responsibilities: [
        'Write and publish two client case studies a month with the project teams',
        'Own the fortnightly newsletter, from drafting through send and reporting',
        'Manage the studio LinkedIn presence and grow it deliberately, not by posting more',
        'Coordinate two design meetups a quarter, including venue and speakers',
        'Track which content actually brings in enquiries and drop what does not',
      ],
      requirements: [
        '1-3 years in content or marketing, ideally at an agency or studio',
        'Genuinely good writing - a work sample matters more than your resume here',
        'Comfortable interviewing designers and structuring what they tell you',
        'Basic familiarity with analytics and email tooling',
        'Available for 20-25 hours a week with one day on-site in Pune',
      ],
      skills: ['Content Writing', 'Social Media', 'Email Marketing', 'SEO Basics'],
      benefits: BENEFITS.craftly,
    }),
    // --- Vahan Mobility (company 4, recruiter Naveen Chandra) ---
    mkJob({
      id: 13, title: 'Android Engineer', companyId: 4, recruiterId: 5,
      category: CAT.ENG, type: TYPE.FULL, workMode: MODE.HYBRID, location: 'Gurugram',
      experienceLevel: LEVEL.MID, salaryMin: 1700000, salaryMax: 2500000, openings: 2,
      views: 1094, postedAt: daysAgo(5), deadline: daysAhead(25),
      description:
        'Nine thousand riders open the Vahan app before every shift, usually on a budget Android phone with patchy connectivity somewhere between two delivery hubs. That constraint shapes every decision on this team.\n\nYou will work on the rider application: shift assignment, navigation handoff, battery-swap station discovery and proof-of-delivery capture. Offline-first behaviour is not a nice-to-have here, it is the product. We care a great deal about cold-start time, battery drain and how the app behaves on a 2G fallback.\n\nStack is Kotlin, Jetpack Compose, Room and WorkManager, with a Go backend. Three days a week in the Gurugram office, and one ride-along with a rider per quarter because you should feel what you are building.',
      responsibilities: [
        'Build and maintain rider-facing features in Kotlin and Jetpack Compose',
        'Own offline-first sync, conflict resolution and background job reliability',
        'Reduce cold-start time and battery consumption with measured, defended changes',
        'Instrument crash and performance monitoring, and act on what it says',
        'Test on low-end devices, not just the emulator or your own phone',
      ],
      requirements: [
        '3-6 years of Android development with released apps you can point to',
        'Strong Kotlin and hands-on Jetpack Compose experience',
        'Practical experience with offline storage and background sync',
        'Understanding of Android performance profiling and memory behaviour',
        'Willing to work from Gurugram three days a week',
      ],
      skills: ['Kotlin', 'Jetpack Compose', 'Android', 'Room', 'Coroutines', 'Offline Sync'],
      benefits: BENEFITS.vahan,
    }),
    mkJob({
      id: 14, title: 'City Operations Manager', companyId: 4, recruiterId: 5,
      category: CAT.OPS, type: TYPE.FULL, workMode: MODE.ONSITE, location: 'Gurugram',
      experienceLevel: LEVEL.SENIOR, salaryMin: 1800000, salaryMax: 2600000,
      views: 806, postedAt: daysAgo(16), deadline: daysAhead(14),
      description:
        'A city is a P&L at Vahan, and the operations manager runs it. You will own Delhi NCR: rider supply, fleet uptime, station throughput and cost per delivery, with a team of four supervisors and around 1,400 riders.\n\nThis is a demanding, unglamorous, deeply consequential job. A typical week involves a supply gap on Friday evenings, two stations running below target utilisation, and a client escalation about missed slots - all of which need fixing before Monday. The people who do well here are systematic and present, not heroic.\n\nYou will report to the Regional Head and review numbers with the leadership team every Monday morning.',
      responsibilities: [
        'Own Delhi NCR operating metrics: fleet uptime, on-time rate and cost per delivery',
        'Manage rider supply and retention with four supervisors reporting to you',
        'Improve battery-swap station utilisation and reduce queueing at peak hours',
        'Handle client escalations directly and close the loop with a written fix',
        'Work with product on tooling gaps and pilot new operating processes before rollout',
      ],
      requirements: [
        '5+ years in city or field operations at a logistics, mobility or quick-commerce company',
        'Direct experience managing a large blue-collar workforce through supervisors',
        'Comfortable with data - you should be able to build your own weekly review deck',
        'Calm under escalation and clear in writing',
        'Based in Delhi NCR and willing to be in the field regularly',
      ],
      skills: ['Operations Management', 'Team Leadership', 'Excel', 'Process Design', 'Stakeholder Management'],
      benefits: BENEFITS.vahan,
    }),
    mkJob({
      id: 15, title: 'Business Development Executive', companyId: 4, recruiterId: 5,
      category: CAT.SALES, type: TYPE.FULL, workMode: MODE.ONSITE, location: 'Noida',
      experienceLevel: LEVEL.JUNIOR, salaryMin: 600000, salaryMax: 1000000, openings: 4,
      views: 1338, postedAt: daysAgo(12), deadline: daysAhead(18),
      description:
        'We are expanding the enterprise delivery business and need four business development executives to build the pipeline in Noida and West Delhi. Targets are retail chains, pharmacy networks and mid-sized D2C brands that currently run their own delivery fleets badly.\n\nThe role is genuine field sales: you will be out four days a week, doing store visits and warehouse walkthroughs, and the deals that close are usually the ones where you understood the customer operation better than they expected. Fixed salary plus an uncapped incentive that our top performers use to roughly double their earnings.\n\nStructured training runs for the first three weeks and you will shadow a senior BD manager for the first month.',
      responsibilities: [
        'Build and work a pipeline of retail and D2C prospects in your assigned territory',
        'Run discovery visits at customer stores and warehouses, not just conference rooms',
        'Prepare commercial proposals with the pricing team and negotiate to signature',
        'Keep CRM hygiene good enough that the forecast means something',
        'Hand over closed accounts to operations with a complete requirements document',
      ],
      requirements: [
        '1-3 years in B2B field sales, ideally logistics, FMCG distribution or SaaS',
        'Comfortable with cold outreach and a high volume of in-person meetings',
        'Fluent in Hindi and English',
        'Own two-wheeler or car with a valid licence',
        'Based in or willing to relocate to Delhi NCR',
      ],
      skills: ['B2B Sales', 'Field Sales', 'Lead Generation', 'CRM', 'Negotiation'],
      benefits: BENEFITS.vahan,
    }),
    mkJob({
      id: 16, title: 'Talent Acquisition Partner', companyId: 4, recruiterId: 5,
      category: CAT.HR, type: TYPE.FULL, workMode: MODE.HYBRID, location: 'Gurugram',
      experienceLevel: LEVEL.MID, salaryMin: 1200000, salaryMax: 1800000,
      status: JOB_STATUS.CLOSED, views: 741, postedAt: daysAgo(48), deadline: daysAhead(6),
      description:
        'We were hiring a talent acquisition partner to own technology and corporate hiring across our eleven cities, working alongside the high-volume rider recruitment team.\n\nThe role covered full-cycle hiring for roughly thirty positions a year, from intake conversation to offer negotiation, plus responsibility for our interview process quality - structured scorecards, calibrated panels and a candidate experience we are not embarrassed by.\n\nThis position has been filled. The posting stays visible so candidates in process can still see the details they applied against.',
      responsibilities: [
        'Own full-cycle hiring for engineering, product and corporate roles',
        'Run intake conversations that produce a real scorecard, not a wish list',
        'Build sourcing pipelines beyond job boards, including targeted outreach',
        'Train interviewers and keep panel calibration honest',
        'Report funnel metrics monthly and diagnose where candidates drop out',
      ],
      requirements: [
        '3-6 years in talent acquisition with in-house experience',
        'Track record hiring technical roles and holding your own with engineering managers',
        'Hands-on with an ATS and comfortable reporting on funnel data',
        'Strong candidate-facing communication',
        'Able to work from Gurugram three days a week',
      ],
      skills: ['Talent Acquisition', 'Sourcing', 'Interviewing', 'ATS', 'Stakeholder Management'],
      benefits: BENEFITS.vahan,
    }),
    // --- MedhaAI (company 5, recruiter Ananya Krishnan) ---
    mkJob({
      id: 17, title: 'Machine Learning Engineer - Medical Imaging', companyId: 5, recruiterId: 6,
      category: CAT.DATA, type: TYPE.FULL, workMode: MODE.HYBRID, location: 'Hyderabad',
      experienceLevel: LEVEL.SENIOR, salaryMin: 3000000, salaryMax: 4500000,
      featured: true, views: 1911, postedAt: daysAgo(3), deadline: daysAhead(27),
      description:
        'Our chest X-ray and mammography models are read alongside a radiologist in more than 200 diagnostic centres. That deployment context is the interesting part of this job: a model that is two points better on a benchmark but slower to load is not obviously an improvement.\n\nYou will own model development for one imaging modality end to end - dataset curation with our clinical annotators, training, validation against a held-out multi-centre set, and the export path into our on-premise inference runtime. Expect to spend real time on data quality and label noise, because that is where most of the gains are.\n\nWe publish, and we support writing up work for peer review. You will also sit in on radiologist feedback sessions every month.',
      responsibilities: [
        'Own model development for one imaging modality from dataset curation to deployed artefact',
        'Work with clinical annotators to improve label quality and resolve disagreement systematically',
        'Validate models against multi-centre held-out data and report metrics that clinicians trust',
        'Optimise inference for on-premise hardware with limited GPU memory',
        'Document experiments so a colleague can reproduce them six months later',
      ],
      requirements: [
        '4+ years in applied machine learning with deep learning in production',
        'Strong PyTorch and computer vision fundamentals',
        'Experience with medical imaging, DICOM data or another regulated ML domain',
        'Rigour about evaluation - class imbalance, calibration, distribution shift',
        'Able to work from the Hyderabad office three days a week',
      ],
      skills: ['Python', 'PyTorch', 'Computer Vision', 'MLOps', 'DICOM', 'Model Evaluation'],
      benefits: BENEFITS.medha,
    }),
    mkJob({
      id: 18, title: 'Data Engineering Lead', companyId: 5, recruiterId: 6,
      category: CAT.DATA, type: TYPE.FULL, workMode: MODE.ONSITE, location: 'Hyderabad',
      experienceLevel: LEVEL.LEAD, salaryMin: 4500000, salaryMax: 6500000,
      views: 977, postedAt: daysAgo(20), deadline: daysAhead(22),
      description:
        'Every model we ship depends on a pipeline that moves studies from partner centres into an annotated, de-identified training set. That pipeline currently works, but it was built by researchers under deadline and it is now the bottleneck for the whole company.\n\nWe are hiring a data engineering lead to rebuild it properly and to grow a team of four around it. The technical scope covers de-identification, DICOM ingestion at scale, annotation workflow tooling and a versioned dataset registry. The organisational scope is just as important: this team has never had a lead and needs one.\n\nPatient data means the compliance bar is high. You will work with our compliance officer on data-residency and retention requirements, and neither of you gets to hand-wave.',
      responsibilities: [
        'Own the architecture of ingestion, de-identification and dataset versioning',
        'Hire and lead a team of four data engineers, including two current team members',
        'Set and enforce standards for data lineage, retention and access control',
        'Partner with research to remove the pipeline delays that slow experiments today',
        'Be accountable for pipeline reliability and cost, with published SLOs',
      ],
      requirements: [
        '7+ years in data engineering, with 2+ years leading engineers',
        'Deep experience with distributed processing and object storage at terabyte scale',
        'Practical knowledge of handling sensitive or regulated data',
        'Strong Python and SQL, plus infrastructure-as-code familiarity',
        'Based in Hyderabad; this role is on-site given the data-handling controls',
      ],
      skills: ['Python', 'Spark', 'Airflow', 'AWS', 'Data Governance', 'Team Leadership'],
      benefits: BENEFITS.medha,
    }),
    mkJob({
      id: 19, title: 'Clinical Data Analyst (Contract)', companyId: 5, recruiterId: 6,
      category: CAT.DATA, type: TYPE.CONTRACT, workMode: MODE.REMOTE, location: 'Remote',
      experienceLevel: LEVEL.MID, salaryMin: 1400000, salaryMax: 2000000,
      views: 508, postedAt: daysAgo(25), deadline: daysAhead(13),
      description:
        'We have two clinical validation studies running until the end of the financial year and need an analyst dedicated to them for twelve months.\n\nThe work is careful rather than exploratory: preparing analysis datasets, running the pre-specified statistical analysis, producing tables and figures for regulatory submission, and documenting every deviation from the plan. Our clinical affairs lead writes the protocol; you make the numbers in it real.\n\nTwelve-month contract, fully remote, with monthly reviews. Extension is likely if the pipeline of studies holds.',
      responsibilities: [
        'Prepare analysis-ready datasets from study exports with full traceability',
        'Run the pre-specified statistical analysis and sensitivity checks',
        'Produce tables, listings and figures for submission-quality reports',
        'Document deviations from the analysis plan and their impact',
        'Answer queries from clinical affairs and external reviewers with evidence',
      ],
      requirements: [
        '3+ years as a clinical data analyst, biostatistician or similar',
        'Strong R or Python for statistical analysis, plus solid SQL',
        'Understanding of diagnostic accuracy measures - sensitivity, specificity, ROC analysis',
        'Meticulous documentation habits; reproducibility is the deliverable',
        'Available for a twelve-month engagement starting within a month',
      ],
      skills: ['R', 'Python', 'Biostatistics', 'SQL', 'Clinical Research'],
      benefits: BENEFITS.medha,
    }),
    mkJob({
      id: 20, title: 'Product Marketing Manager', companyId: 5, recruiterId: 6,
      category: CAT.MARKETING, type: TYPE.FULL, workMode: MODE.HYBRID, location: 'Hyderabad',
      experienceLevel: LEVEL.MID, salaryMin: 1800000, salaryMax: 2600000,
      status: JOB_STATUS.PENDING, views: 214, postedAt: daysAgo(1), deadline: daysAhead(29),
      description:
        'Selling clinical AI means convincing three different audiences with three different concerns: a radiologist who cares about accuracy, a centre owner who cares about throughput and cost, and a procurement team that cares about compliance paperwork.\n\nWe are hiring a product marketing manager to build the material that speaks to each of them properly - positioning, clinical evidence summaries, ROI models and the deck our sales team currently improvises. You will work between product, clinical affairs and sales, and you will be expected to sit in on customer calls rather than write from imagination.\n\nThis posting is awaiting administrator review before it goes live on the public board.',
      responsibilities: [
        'Own positioning and messaging for our imaging products across all three buyer personas',
        'Turn clinical validation results into evidence summaries a radiologist finds credible',
        'Build the sales toolkit: decks, ROI calculators, objection handling, case studies',
        'Run launch plans for new modalities with product and sales',
        'Track win-loss reasons and feed them back into positioning',
      ],
      requirements: [
        '3-6 years in product marketing, ideally healthcare, medtech or regulated B2B',
        'Ability to read a validation study and explain it without distorting it',
        'Excellent writing and deck-building craft',
        'Comfortable joining clinical and procurement conversations directly',
        'Able to work from Hyderabad three days a week',
      ],
      skills: ['Product Marketing', 'Positioning', 'Content Strategy', 'Sales Enablement', 'Healthcare'],
      benefits: BENEFITS.medha,
    }),
    // --- Kaveri Cloud (company 6, recruiter Suresh Iyer) ---
    mkJob({
      id: 21, title: 'DevOps Engineer', companyId: 6, recruiterId: 7,
      category: CAT.ENG, type: TYPE.FULL, workMode: MODE.REMOTE, location: 'Remote',
      experienceLevel: LEVEL.MID, salaryMin: 1900000, salaryMax: 2800000, openings: 2,
      featured: true, views: 1652, postedAt: daysAgo(8), deadline: daysAhead(20),
      description:
        'Kaveri Cloud runs managed Kubernetes for customers who cannot put their data outside India. We operate our own hardware in Chennai and Mumbai, which means the abstractions stop somewhere real - occasionally at a failed disk.\n\nYou will join the platform team that builds and runs the control plane our customers use: cluster provisioning, upgrades, backups and the observability stack behind them. There is a lot of Go and a lot of Terraform, and the work is genuinely infrastructural rather than CI-pipeline babysitting.\n\nFully remote within India. On-call is one week in five and it is paid separately, not folded into your CTC.',
      responsibilities: [
        'Automate cluster provisioning, upgrade and backup workflows with Terraform and Go tooling',
        'Own the observability stack - Prometheus, Grafana, Loki - and make alerts actionable',
        'Improve deployment safety with progressive rollout and tested rollback paths',
        'Take part in a paid one-in-five on-call rotation and write honest postmortems',
        'Work directly with customer engineers on migration and capacity questions',
      ],
      requirements: [
        '3-6 years in DevOps, SRE or platform engineering',
        'Strong Kubernetes fundamentals - you should be able to debug a stuck rollout unaided',
        'Hands-on Terraform and Linux systems knowledge',
        'Scripting or service development in Go, Python or Bash',
        'Comfortable being on-call for systems you helped design',
      ],
      skills: ['Kubernetes', 'Terraform', 'Linux', 'Prometheus', 'CI/CD', 'Go'],
      benefits: BENEFITS.kaveri,
    }),
    mkJob({
      id: 22, title: 'Site Reliability Engineering Lead', companyId: 6, recruiterId: 7,
      category: CAT.ENG, type: TYPE.FULL, workMode: MODE.HYBRID, location: 'Chennai',
      experienceLevel: LEVEL.LEAD, salaryMin: 4800000, salaryMax: 7000000,
      views: 1203, postedAt: daysAgo(35), deadline: daysAhead(35),
      description:
        'We are looking for an SRE lead to take responsibility for the reliability of our entire managed platform - the thing customers actually pay for - and to lead the five engineers who keep it running.\n\nThe honest state of things: our uptime is good, our incident response is decent, and our error budgets exist mostly on a wiki page nobody consults. We want someone who will make SLOs load-bearing, who will push back on launches that are not operable, and who treats a repeat incident as a design failure rather than bad luck.\n\nYou will report to the VP Engineering and be a peer to the platform and product leads. Three days a week in the Chennai office, with regular time in the data centre.',
      responsibilities: [
        'Define and enforce SLOs and error budgets that actually influence release decisions',
        'Lead a team of five SREs, including their growth and on-call sustainability',
        'Own incident command for major events and drive blameless postmortems to closure',
        'Run capacity planning across two data centres with a twelve-month horizon',
        'Build the operational review that gates new services going to production',
      ],
      requirements: [
        '8+ years in SRE, infrastructure or systems engineering, with 3+ years leading a team',
        'Deep experience operating large-scale distributed systems on your own hardware or cloud',
        'Track record of measurable reliability improvement you can describe concretely',
        'Strong incident command instincts and clear written communication under pressure',
        'Based in Chennai or willing to relocate, with relocation support provided',
      ],
      skills: ['SRE', 'Kubernetes', 'Observability', 'Incident Management', 'Capacity Planning', 'Leadership'],
      benefits: BENEFITS.kaveri,
    }),
    mkJob({
      id: 23, title: 'Inside Sales Representative', companyId: 6, recruiterId: 7,
      category: CAT.SALES, type: TYPE.FULL, workMode: MODE.ONSITE, location: 'Chennai',
      experienceLevel: LEVEL.FRESHER, salaryMin: 400000, salaryMax: 650000, openings: 3,
      views: 1467, postedAt: daysAgo(29), deadline: daysAhead(16),
      description:
        'A good entry point into cloud infrastructure sales. You will work the inbound queue and a defined outbound list, qualify opportunities and set up technical conversations for our solution engineers.\n\nMost of our buyers are engineering managers, so you need to learn enough vocabulary to be taken seriously - what a Kubernetes cluster is for, why data residency matters, roughly what a customer pays elsewhere. We train that in the first month, but only if you are genuinely interested in it.\n\nFresh graduates are welcome. Fixed salary plus a quarterly incentive tied to qualified meetings and pipeline created.',
      responsibilities: [
        'Qualify inbound enquiries within one working day and route them correctly',
        'Run outbound sequences to a defined list of mid-market technology companies',
        'Book and prepare technical discovery calls for solution engineers',
        'Keep CRM records accurate enough for the weekly pipeline review',
        'Learn the product well enough to answer basic questions without escalating',
      ],
      requirements: [
        'Graduate in any discipline; 0-2 years of experience',
        'Clear spoken and written English, plus Tamil or Hindi',
        'Genuine curiosity about technology - be ready to explain something technical you learned recently',
        'Resilience for a high-volume outreach role',
        'Able to work from the Chennai office five days a week',
      ],
      skills: ['Inside Sales', 'Lead Qualification', 'CRM', 'Communication'],
      benefits: BENEFITS.kaveri,
    }),
    mkJob({
      id: 24, title: 'HR Operations Executive', companyId: 6, recruiterId: 7,
      category: CAT.HR, type: TYPE.FULL, workMode: MODE.ONSITE, location: 'Chennai',
      experienceLevel: LEVEL.JUNIOR, salaryMin: 500000, salaryMax: 750000,
      status: JOB_STATUS.DRAFT, views: 38, postedAt: daysAgo(1), deadline: daysAhead(40),
      description:
        'We are drafting this role for the next hiring cycle. The HR operations executive will run the transactional backbone of the people function: onboarding paperwork, payroll inputs, attendance and leave records, and statutory filings for PF and ESI.\n\nThe person in this seat makes everyone else in HR effective. It suits someone early in their career who is precise with detail and enjoys tidying up a process that has grown messy - our onboarding checklist currently lives in three places and disagrees with itself.\n\nDraft posting, not yet published. Requirements may still change before it goes live.',
      responsibilities: [
        'Run onboarding and exit formalities end to end, including documentation and IT coordination',
        'Prepare monthly payroll inputs and reconcile them against attendance records',
        'Maintain employee records in the HRIS with an audit trail',
        'Handle PF, ESI and professional tax filings within statutory deadlines',
        'Be the first point of contact for routine employee queries',
      ],
      requirements: [
        '1-3 years in HR operations, shared services or payroll',
        'Working knowledge of Indian statutory compliance - PF, ESI, professional tax',
        'Strong Excel and comfort with an HRIS',
        'High accuracy with documentation and deadlines',
        'Able to work from the Chennai office five days a week',
      ],
      skills: ['HR Operations', 'Payroll', 'HRIS', 'Statutory Compliance', 'Excel'],
      benefits: BENEFITS.kaveri,
    }),
  ];
}

// --- applications -----------------------------------------------------------

const S = APPLICATION_STATUS;

/** One timeline entry. Timelines always start at APPLIED and end at `status`. */
function step(status, days, note) {
  return { status, at: daysAgo(days, 15), note };
}

/** Derives `updatedAt` from the last timeline entry so the two never disagree. */
function mkApplication(row) {
  const last = row.timeline[row.timeline.length - 1];
  return { status: last.status, updatedAt: last.at, ...row };
}

function seedApplications() {
  return [
    // Arsh Sharma (seeker@demo.com, id 8) - the demo seeker's pipeline.
    mkApplication({
      id: 1, jobId: 1, seekerId: 8, appliedAt: daysAgo(21),
      resumeName: 'Arsh-Sharma-Frontend-Engineer.pdf',
      coverLetter:
        'I have spent the last three years on data-heavy React interfaces, most recently rebuilding a reporting suite where I brought first render down from 4.2s to under a second. The query builder rewrite you describe is exactly the kind of problem I want to own next.',
      timeline: [
        step(S.APPLIED, 21, 'Application submitted'),
        step(S.IN_REVIEW, 18, 'Resume reviewed by Meera Nair'),
        step(S.SHORTLISTED, 13, 'Shortlisted for the technical round'),
        step(S.INTERVIEW, 7, 'System design and frontend deep dive with the pod lead'),
        step(S.OFFERED, 2, 'Offer extended: Rs 36L fixed plus stock options'),
      ],
    }),
    mkApplication({
      id: 2, jobId: 3, seekerId: 8, appliedAt: daysAgo(16),
      resumeName: 'Arsh-Sharma-Frontend-Engineer.pdf',
      coverLetter:
        'I know this is posted as a design role, but I have shipped two design systems and would like to be considered for the design-engineering side of it. Happy to walk through the component library I built at my current company.',
      timeline: [
        step(S.APPLIED, 16, 'Application submitted'),
        step(S.IN_REVIEW, 12, 'Portfolio and component library reviewed'),
        step(S.SHORTLISTED, 7, 'Shortlisted as a design-engineering hybrid candidate'),
        step(S.INTERVIEW, 3, 'Portfolio walkthrough scheduled with the design lead'),
      ],
    }),
    mkApplication({
      id: 3, jobId: 2, seekerId: 8, appliedAt: daysAgo(10),
      resumeName: 'Arsh-Sharma-Frontend-Engineer.pdf',
      coverLetter:
        'My SQL is stronger than my resume suggests - I own the reporting queries behind our current dashboards and have been learning dbt on a side project. Open to a conversation about whether the gap is bridgeable.',
      timeline: [
        step(S.APPLIED, 10, 'Application submitted'),
        step(S.IN_REVIEW, 8, 'Reviewed by the data platform team'),
        step(S.SHORTLISTED, 4, 'Shortlisted for a SQL exercise'),
      ],
    }),
    mkApplication({
      id: 4, jobId: 21, seekerId: 8, appliedAt: daysAgo(7),
      resumeName: 'Arsh-Sharma-Frontend-Engineer.pdf',
      coverLetter:
        'I have handled our team CI and containerised our frontend builds, and I want to move deeper into infrastructure. I am aware this is a step sideways for me and I am ready to prove the fundamentals in a technical round.',
      timeline: [
        step(S.APPLIED, 7, 'Application submitted'),
        step(S.IN_REVIEW, 4, 'Under review with the platform team'),
      ],
    }),
    mkApplication({
      id: 5, jobId: 13, seekerId: 8, appliedAt: daysAgo(4),
      resumeName: 'Arsh-Sharma-Frontend-Engineer.pdf',
      coverLetter:
        'Applying because the offline-first constraint sounds genuinely interesting. I have not shipped native Android, but I have built an offline-capable PWA for field staff and understand the sync problems involved.',
      timeline: [step(S.APPLIED, 4, 'Application submitted')],
    }),
    mkApplication({
      id: 6, jobId: 5, seekerId: 8, appliedAt: daysAgo(16),
      resumeName: 'Arsh-Sharma-Frontend-Engineer.pdf',
      coverLetter:
        'I work against a Spring Boot backend daily and have contributed endpoints to it. Applying in case a full-stack leaning candidate is useful to the settlements team.',
      timeline: [
        step(S.APPLIED, 16, 'Application submitted'),
        step(S.IN_REVIEW, 13, 'Screened by the settlements team'),
        step(S.REJECTED, 10, 'Not moving ahead - the team needs depth in Java and ledger systems'),
      ],
    }),
    // Other seekers - these are what the demo recruiter sees in her pipeline.
    mkApplication({
      id: 7, jobId: 1, seekerId: 12, appliedAt: daysAgo(20),
      resumeName: 'Aditya-Rao-Fresher.pdf',
      coverLetter:
        'I am graduating this year and know the posting asks for five years. I am applying anyway because I have built and shipped a React app used by 1,200 students and would take any chance to be considered for a junior opening on the same team.',
      timeline: [
        step(S.APPLIED, 20, 'Application submitted'),
        step(S.IN_REVIEW, 17, 'Reviewed by Meera Nair'),
        step(S.REJECTED, 15, 'Experience below the bar for a senior role - encouraged to apply to our next intern cycle'),
      ],
    }),
    mkApplication({
      id: 8, jobId: 2, seekerId: 9, appliedAt: daysAgo(10),
      resumeName: 'Priya-Menon-Analyst.pdf',
      coverLetter:
        'I built the modelled layer for our logistics team in dbt last year, including the tests and the definitions doc, so the metrics catalogue part of this role is familiar ground. Remote suits me and I can start in four weeks.',
      timeline: [
        step(S.APPLIED, 10, 'Application submitted'),
        step(S.IN_REVIEW, 8, 'Reviewed by the data platform team'),
        step(S.SHORTLISTED, 6, 'Cleared the SQL exercise with a strong score'),
        step(S.INTERVIEW, 2, 'Modelling discussion with the analytics lead'),
      ],
    }),
    mkApplication({
      id: 9, jobId: 3, seekerId: 11, appliedAt: daysAgo(15),
      resumeName: 'Sneha-Gupta-Product-Designer.pdf',
      coverLetter:
        'Onboarding for dense products is the problem I have spent the last two years on - at my current company I took first-week activation from 31 to 52 percent. My portfolio has the full case study including the two ideas that did not work.',
      timeline: [
        step(S.APPLIED, 15, 'Application submitted'),
        step(S.IN_REVIEW, 11, 'Portfolio reviewed by design and product'),
        step(S.SHORTLISTED, 5, 'Shortlisted for the design exercise round'),
      ],
    }),
    mkApplication({
      id: 10, jobId: 4, seekerId: 12, appliedAt: daysAgo(45),
      resumeName: 'Aditya-Rao-Fresher.pdf',
      coverLetter:
        'Looking for a first role where I can learn the product side of software before specialising. I ran the support rota for our college app, which is the closest thing I have to relevant experience.',
      timeline: [
        step(S.APPLIED, 45, 'Application submitted'),
        step(S.IN_REVIEW, 42, 'Screened by the customer success team'),
        step(S.REJECTED, 38, 'Role filled by a candidate with prior support experience'),
      ],
    }),
    mkApplication({
      id: 11, jobId: 4, seekerId: 14, appliedAt: daysAgo(40),
      resumeName: 'Nikhil-Verma-BD.pdf',
      coverLetter:
        'I have three years of B2B account management and wanted to explore the customer success side of SaaS. Comfortable with a book of forty accounts given my current territory is larger than that.',
      timeline: [
        step(S.APPLIED, 40, 'Application submitted'),
        step(S.IN_REVIEW, 37, 'Screened by the customer success team'),
        step(S.WITHDRAWN, 35, 'Candidate withdrew - accepted another offer in field sales'),
      ],
    }),
    mkApplication({
      id: 12, jobId: 5, seekerId: 10, appliedAt: daysAgo(17),
      resumeName: 'Karthik-Reddy-Backend.pdf',
      coverLetter:
        'I have spent five years on settlement and payout services at peaks of around 4,000 requests per second, including a reconciliation rewrite that eliminated a recurring class of short payouts. Happy to walk through how we handled duplicate bank files.',
      timeline: [
        step(S.APPLIED, 17, 'Application submitted'),
        step(S.IN_REVIEW, 14, 'Reviewed by Rohit Deshpande'),
        step(S.SHORTLISTED, 10, 'Strong take-home submission on idempotent consumers'),
        step(S.INTERVIEW, 5, 'Two technical rounds plus a ledger design discussion'),
        step(S.OFFERED, 1, 'Offer released: Rs 27L fixed with a joining bonus'),
      ],
    }),
    mkApplication({
      id: 13, jobId: 6, seekerId: 9, appliedAt: daysAgo(8),
      resumeName: 'Priya-Menon-Analyst.pdf',
      coverLetter:
        'Investigative analysis is the part of my current job I enjoy most - I found a Rs 22L leakage in our returns process by working through six weeks of exception data. I would like to do that full time on a fraud team.',
      timeline: [
        step(S.APPLIED, 8, 'Application submitted'),
        step(S.IN_REVIEW, 6, 'Reviewed by the risk team'),
        step(S.SHORTLISTED, 3, 'Case study submitted and rated well by the risk lead'),
      ],
    }),
    mkApplication({
      id: 14, jobId: 7, seekerId: 13, appliedAt: daysAgo(21),
      resumeName: 'Fatima-Sheikh-Finance.pdf',
      coverLetter:
        'I currently own the monthly close at a listed NBFC and took it from fourteen days to nine by automating three reconciliations. Your stated goal of getting under six days is what attracted me to this role.',
      timeline: [
        step(S.APPLIED, 21, 'Application submitted'),
        step(S.IN_REVIEW, 18, 'Reviewed by the VP Finance'),
        step(S.SHORTLISTED, 12, 'Shortlisted after a technical accounting discussion'),
        step(S.INTERVIEW, 6, 'Final round with the audit committee chair scheduled'),
      ],
    }),
    mkApplication({
      id: 15, jobId: 15, seekerId: 14, appliedAt: daysAgo(11),
      resumeName: 'Nikhil-Verma-BD.pdf',
      coverLetter:
        'I sold logistics software to retail chains for three years and closed at 118 percent of a Rs 1.2 crore quota last year. I know the Noida and West Delhi retail belt well and can bring a warm list with me.',
      timeline: [
        step(S.APPLIED, 11, 'Application submitted'),
        step(S.IN_REVIEW, 9, 'Reviewed by Naveen Chandra'),
        step(S.SHORTLISTED, 6, 'Shortlisted after a territory-planning conversation'),
        step(S.INTERVIEW, 2, 'Field ride-along and closing round with the BD manager'),
      ],
    }),
    mkApplication({
      id: 16, jobId: 16, seekerId: 15, appliedAt: daysAgo(44),
      resumeName: 'Divya-Iyer-HR.pdf',
      coverLetter:
        'Seven years of people operations across two startups, including setting up structured interview scorecards at both. Interested in this role because technology hiring at eleven-city scale is a bigger operational puzzle than I have handled so far.',
      timeline: [
        step(S.APPLIED, 44, 'Application submitted'),
        step(S.IN_REVIEW, 41, 'Reviewed by Naveen Chandra'),
        step(S.INTERVIEW, 34, 'Two rounds completed with the HR director'),
        step(S.REJECTED, 27, 'Position filled internally - strong feedback, will revisit for the next opening'),
      ],
    }),
    mkApplication({
      id: 17, jobId: 17, seekerId: 9, appliedAt: daysAgo(2),
      resumeName: 'Priya-Menon-Analyst.pdf',
      coverLetter:
        'I am an analyst rather than an ML engineer, but I have completed a computer vision specialisation and want to move towards applied research. Applying in case a junior opening exists on the same team.',
      timeline: [
        step(S.APPLIED, 2, 'Application submitted'),
        step(S.REJECTED, 1, 'Screened out - the role needs four or more years of production ML'),
      ],
    }),
    mkApplication({
      id: 18, jobId: 18, seekerId: 10, appliedAt: daysAgo(6),
      resumeName: 'Karthik-Reddy-Backend.pdf',
      coverLetter:
        'I have built ingestion pipelines handling several terabytes a month and mentored two engineers, though I have not formally led a team. Keen to talk about whether the lead scope is a stretch you would consider.',
      timeline: [step(S.APPLIED, 6, 'Application submitted')],
    }),
    mkApplication({
      id: 19, jobId: 10, seekerId: 11, appliedAt: daysAgo(9),
      resumeName: 'Sneha-Gupta-Product-Designer.pdf',
      coverLetter:
        'I run my own usability sessions rather than waiting for a researcher, and I have done field interviews in Hindi across three tier-two cities. Applying for the research role because that is the part of the work I want more of.',
      timeline: [
        step(S.APPLIED, 9, 'Application submitted'),
        step(S.IN_REVIEW, 5, 'Research samples under review by the studio lead'),
      ],
    }),
    mkApplication({
      id: 20, jobId: 14, seekerId: 14, appliedAt: daysAgo(13),
      resumeName: 'Nikhil-Verma-BD.pdf',
      coverLetter:
        'I have worked alongside city operations teams as a vendor for three years and have wanted to run one myself. I understand this is a career change and I am ready to start below my current title to make it.',
      timeline: [
        step(S.APPLIED, 13, 'Application submitted'),
        step(S.IN_REVIEW, 9, 'Reviewed by the regional head'),
      ],
    }),
  ];
}

// --- saved jobs & notifications ---------------------------------------------

function seedSavedJobs() {
  return [
    { id: 1, seekerId: 8, jobId: 8, savedAt: daysAgo(6, 20) },
    { id: 2, seekerId: 8, jobId: 22, savedAt: daysAgo(5, 9) },
    { id: 3, seekerId: 8, jobId: 17, savedAt: daysAgo(3, 22) },
    { id: 4, seekerId: 8, jobId: 10, savedAt: daysAgo(1, 8) },
    { id: 5, seekerId: 9, jobId: 19, savedAt: daysAgo(4, 19) },
    { id: 6, seekerId: 10, jobId: 22, savedAt: daysAgo(12, 21) },
    { id: 7, seekerId: 11, jobId: 11, savedAt: daysAgo(2, 13) },
  ];
}

function seedNotifications() {
  return [
    {
      id: 1, userId: 8, title: 'You have an offer from Zenlytics',
      body: 'Meera Nair has released an offer for Senior Frontend Engineer. Review the details and respond within seven days.',
      read: false, createdAt: daysAgo(2, 15),
    },
    {
      id: 2, userId: 8, title: 'Interview scheduled with Craftly-style portfolio round',
      body: 'Your portfolio walkthrough for Product Designer at Zenlytics is confirmed. Check your email for the calendar invite.',
      read: false, createdAt: daysAgo(3, 15),
    },
    {
      id: 3, userId: 8, title: 'Shortlisted for Analytics Engineer',
      body: 'Zenlytics moved your application to shortlisted and sent across a short SQL exercise.',
      read: true, createdAt: daysAgo(4, 15),
    },
    {
      id: 4, userId: 8, title: '6 new jobs match your React profile',
      body: 'Fresh postings in Bengaluru and Remote were added this week that fit your saved search.',
      read: true, createdAt: daysAgo(7, 9),
    },
    {
      id: 5, userId: 2, title: 'New applicant for Senior Frontend Engineer',
      body: 'Arsh Sharma applied and matches six of your seven listed skills. Review the application when you get a moment.',
      read: false, createdAt: daysAgo(21, 12),
    },
    {
      id: 6, userId: 2, title: 'Weekly hiring summary',
      body: 'Your four postings received 8 applications and 1,486 views over the last seven days.',
      read: true, createdAt: daysAgo(5, 8),
    },
    {
      id: 7, userId: 1, title: '1 job posting awaiting moderation',
      body: 'Product Marketing Manager at MedhaAI was submitted for review and is not yet visible on the public board.',
      read: false, createdAt: daysAgo(1, 10),
    },
  ];
}

// --- live collections -------------------------------------------------------
// Declared with `let` so resetSeed()/hydrate() can swap them wholesale; ES module
// live bindings mean importers always see the current array.

export let companies = seedCompanies();
export let users = seedUsers();
export let jobs = seedJobs();
export let applications = seedApplications();
export let savedJobs = seedSavedJobs();
export let notifications = seedNotifications();

/** Bumped whenever a seed shape changes, which invalidates saved snapshots. */
export const MOCK_DB_VERSION = 3;

/** Plain serialisable copy of the whole database, for localStorage. */
export function snapshot() {
  return { __v: MOCK_DB_VERSION, companies, users, jobs, applications, savedJobs, notifications };
}

/** Replaces the live collections from a snapshot. Returns false if unusable. */
export function hydrate(state) {
  if (!state || typeof state !== 'object' || state.__v !== MOCK_DB_VERSION) return false;
  if (!Array.isArray(state.users) || !Array.isArray(state.jobs)) return false;
  companies = state.companies ?? companies;
  users = state.users;
  jobs = state.jobs;
  applications = state.applications ?? [];
  savedJobs = state.savedJobs ?? [];
  notifications = state.notifications ?? [];
  return true;
}

/** Throws away every mutation and rebuilds the original fixture data. */
export function resetSeed() {
  companies = seedCompanies();
  users = seedUsers();
  jobs = seedJobs();
  applications = seedApplications();
  savedJobs = seedSavedJobs();
  notifications = seedNotifications();
}

// Getters keep the bundle pointing at the current arrays even after a reset.
const db = {
  get companies() { return companies; },
  get users() { return users; },
  get jobs() { return jobs; },
  get applications() { return applications; },
  get savedJobs() { return savedJobs; },
  get notifications() { return notifications; },
  nextId,
  snapshot,
  hydrate,
  resetSeed,
  DEMO_PASSWORD,
  MOCK_DB_VERSION,
};

export default db;





