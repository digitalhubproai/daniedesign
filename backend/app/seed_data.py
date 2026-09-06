"""Initial demo/content data and the idempotent seeding routine run at app startup."""

import logging
from sqlalchemy.orm import Session
from app.models.project import Project
from app.models.blog import BlogPost
from app.models.service import Service
from app.models.creative import CreativeItem
from app.models.client import Client
from app.models.team import TeamMember
from app.models.gallery import StudioGalleryImage
from app.models.stat import SiteStat, ImpactStory
from app.models.admin import AdminUser
from app.auth import get_password_hash
from app.config import settings

logger = logging.getLogger(__name__)

INITIAL_PROJECTS = [
    {
        "slug": "ember-coffee",
        "title": "Ember Coffee",
        "category": "Branding",
        "year": "2025",
        "description": "A complete identity and packaging system for a specialty coffee roaster expanding from one city to national retail.",
        "image": "https://picsum.photos/seed/danie-ember/1600/1100",
        "services": ["Brand Strategy", "Visual Identity", "Packaging"],
        "featured": True,
        "challenge": "Ember was a beloved local roaster with strong coffee and an inconsistent visual presence. As retail orders grew, the brand needed to look as refined as the product — without losing the warmth regulars recognized.",
        "approach": "We started with positioning workshops and a competitive audit, then distilled the brand into a single idea: fire, patience and craft. Everything — from the logotype to the roast labels — was built around that idea.",
        "design": "The identity pairs a bold wordmark with a flexible flame motif that scales from a 4mm coffee bag stamp to a storefront sign. A warm, earthy palette and two display typefaces give the brand editorial confidence.",
        "development": "We built the packaging system as a modular grid, so new roast launches reuse the same structure without a redesign. A Webflow storefront carries the identity through to the checkout experience.",
        "outcome": "Within eight months, Ember secured placement in 60+ retail locations and reported a 45% lift in direct-to-consumer sales attributed to the rebrand.",
        "gallery": [
            "https://picsum.photos/seed/danie-gallery-01/1200/900",
            "https://picsum.photos/seed/danie-gallery-02/1200/900",
            "https://picsum.photos/seed/danie-gallery-03/1200/900"
        ],
        "order": 1,
    },
    {
        "slug": "northline-saas",
        "title": "Northline",
        "category": "UI/UX",
        "year": "2025",
        "description": "End-to-end product design for a B2B analytics platform that cut onboarding time by more than half.",
        "image": "https://picsum.photos/seed/danie-northline/1600/1100",
        "services": ["UX Research", "Product Design", "Design System"],
        "featured": True,
        "challenge": "Northline's analytics product was powerful but dense. New customers regularly abandoned setup within the first session, and the support team was buried in questions about basic configuration.",
        "approach": "We ran 18 user interviews, mapped the activation funnel, and rebuilt the product around three job-to-be-done flows instead of a feature list. Every screen was tested in high-fidelity prototypes before development.",
        "design": "The interface uses a calm, data-dense visual language: large typography for answers, quiet charts, and one accent color reserved for actions. A living design system keeps the team consistent at speed.",
        "development": "We handed off a React component library with full states, responsive behavior and accessibility notes, then supported the engineering team through two release cycles.",
        "outcome": "Onboarding completion rose from 34% to 81%, and the support queue around setup dropped by roughly two-thirds within a quarter.",
        "gallery": [
            "https://picsum.photos/seed/danie-gallery-04/1200/900",
            "https://picsum.photos/seed/danie-gallery-05/1200/900",
            "https://picsum.photos/seed/danie-gallery-06/1200/900"
        ],
        "order": 2,
    },
    {
        "slug": "vanta-mobile",
        "title": "Vanta Finance App",
        "category": "Mobile",
        "year": "2024",
        "description": "Mobile app design and development for a personal finance app with 200k+ installs in its first year.",
        "image": "https://picsum.photos/seed/danie-vanta/1600/1100",
        "services": ["App Design", "Flutter Development", "UX Research"],
        "featured": True,
        "challenge": "Vanta needed to make budgeting feel effortless for people who had never stuck with a finance app. The founding team wanted a product that felt more like a calm daily habit than a spreadsheet.",
        "approach": "We researched habits around money anxiety, then prototyped a frictionless 'check-in' model: five seconds of interaction per day, with the app doing the heavy analysis in the background.",
        "design": "The interface leans on generous spacing, soft motion and plain-language copy. A dark-first palette reduces the 'dashboard dread' users reported with competitors.",
        "development": "Built in Flutter for iOS and Android with a shared codebase, including biometric onboarding, offline transactions and a widget system for glanceable balances.",
        "outcome": "200k+ installs in year one, a 4.7-star average rating, and a retention curve that beat the category benchmark at every interval.",
        "gallery": [
            "https://picsum.photos/seed/danie-gallery-07/1200/900",
            "https://picsum.photos/seed/danie-gallery-08/1200/900",
            "https://picsum.photos/seed/danie-gallery-09/1200/900"
        ],
        "order": 3,
    },
    {
        "slug": "lumen-studio",
        "title": "Lumen Studio",
        "category": "Web",
        "year": "2024",
        "description": "An award-style editorial website for an architecture practice — heavy imagery, restrained motion, obsessive typography.",
        "image": "https://picsum.photos/seed/danie-lumen/1600/1100",
        "services": ["Website Design", "Web Development", "Art Direction"],
        "featured": True,
        "challenge": "Lumen's previous site buried its most striking projects under a conventional gallery grid. The practice wanted the website to feel like walking through a well-edited monograph.",
        "approach": "We structured the site around the project, not the page: full-bleed imagery, generous whitespace and a reading rhythm that slows the visitor down deliberately.",
        "design": "A near-monochrome system with one accent signals interactive moments. Custom type sizing and careful line length make even dense technical text feel editorial.",
        "development": "Built on a React front end with a headless CMS, featuring predictive project navigation, lazy-loaded high-resolution imagery and 95+ performance scores across devices.",
        "outcome": "The site doubled average session time and became the practice's primary source of new inquiries within six months of launch.",
        "gallery": [
            "https://picsum.photos/seed/danie-gallery-10/1200/900",
            "https://picsum.photos/seed/danie-gallery-11/1200/900",
            "https://picsum.photos/seed/danie-gallery-12/1200/900"
        ],
        "order": 4,
    },
    {
        "slug": "meridian-market",
        "title": "Meridian Market",
        "category": "Marketing",
        "year": "2023",
        "description": "A full-funnel digital marketing program that tripled organic revenue for a grocery delivery startup.",
        "image": "https://picsum.photos/seed/danie-meridian/1600/1100",
        "services": ["SEO", "Content Strategy", "Paid Media"],
        "featured": False,
        "challenge": "Meridian had a strong product and almost no organic presence. Search demand existed but competitors owned every head term, and paid acquisition costs were climbing each quarter.",
        "approach": "We rebuilt their content around shopping intent, launched a technical SEO cleanup, and unified paid social with a single creative system built from the brand identity.",
        "design": "Campaign creative used the brand's fresh, food-led photography system with short, honest copy — a deliberate contrast to the discount-heavy tone of the category.",
        "development": "A headless landing-page system let the marketing team launch new campaigns in hours instead of weeks, with built-in A/B testing and analytics hooks.",
        "outcome": "Organic revenue tripled within nine months, while blended acquisition costs fell 38% over the same period.",
        "gallery": [
            "https://picsum.photos/seed/danie-gallery-13/1200/900",
            "https://picsum.photos/seed/danie-gallery-14/1200/900",
            "https://picsum.photos/seed/danie-gallery-15/1200/900"
        ],
        "order": 5,
    },
    {
        "slug": "sable-ceramics",
        "title": "Sable Ceramics",
        "category": "Branding",
        "year": "2023",
        "description": "Brand identity and art direction for a handmade ceramics studio carried in 40+ independent stores.",
        "image": "https://picsum.photos/seed/danie-sable/1600/1100",
        "services": ["Brand Identity", "Art Direction", "Social Media Design"],
        "featured": False,
        "challenge": "Sable's products were beautiful; its brand was invisible. Wholesale buyers couldn't remember the studio, and social feeds looked like a different brand every week.",
        "approach": "We built the identity from the material itself — glaze, clay and kiln marks — translating the maker's process into a flexible visual language.",
        "design": "The system pairs a quiet serif for storytelling with a functional sans for commerce, over a warm, clay-toned palette. Pattern motifs echo the studio's signature glaze textures.",
        "development": "A complete guidelines package, wholesale sell-sheet templates and social grid system made the brand easy for the small team to run consistently.",
        "outcome": "Sable grew from 12 to 40+ wholesale accounts in a year and doubled its social audience without paid promotion.",
        "gallery": [
            "https://picsum.photos/seed/danie-gallery-16/1200/900",
            "https://picsum.photos/seed/danie-gallery-17/1200/900",
            "https://picsum.photos/seed/danie-gallery-18/1200/900"
        ],
        "order": 6,
    },
    {
        "slug": "arc-legal",
        "title": "Arc Legal",
        "category": "Web",
        "year": "2022",
        "description": "A conversion-focused website redesign for a litigation firm, with a lead-gen system built on Webflow.",
        "image": "https://picsum.photos/seed/danie-arc/1600/1100",
        "services": ["Website Design", "Webflow Development", "SEO"],
        "featured": False,
        "challenge": "Arc Legal's site looked credible but converted poorly — visitors couldn't tell which practice areas the firm actually led in, and the contact path was buried.",
        "approach": "We rebuilt the information architecture around practice depth rather than firm history, then engineered every page toward a single, obvious next step.",
        "design": "A restrained, trustworthy visual system with strong typography and courtroom photography. Trust signals — verdicts, credentials, recognitions — appear consistently near decision points.",
        "development": "Webflow build with a CMS for case studies, strict technical SEO, and an integrated form pipeline with CRM routing and team notifications.",
        "outcome": "Consultation requests more than doubled year over year, and organic traffic grew 140% in the first twelve months.",
        "gallery": [
            "https://picsum.photos/seed/danie-gallery-19/1200/900",
            "https://picsum.photos/seed/danie-gallery-20/1200/900",
            "https://picsum.photos/seed/danie-gallery-21/1200/900"
        ],
        "order": 7,
    },
    {
        "slug": "pulsewear",
        "title": "Pulsewear",
        "category": "Mobile",
        "year": "2022",
        "description": "UI/UX and product design for a fitness wearables companion app used by 90k monthly athletes.",
        "image": "https://picsum.photos/seed/danie-pulse/1600/1100",
        "services": ["UI/UX Design", "Design System", "Prototyping"],
        "featured": False,
        "challenge": "Pulsewear's app displayed enormous amounts of biometric data but no guidance. Users opened it, felt overwhelmed, and closed it.",
        "approach": "We designed around a single question per screen: 'What should I do next?' Research sessions with amateur and competitive athletes shaped a goal-first navigation model.",
        "design": "A bold, athletic visual language — dense but ordered, with big numbers, high-contrast charts and a dark mode designed first.",
        "development": "A token-based design system shipped alongside the redesign, cutting the client's UI implementation time on new features by roughly 40%.",
        "outcome": "Weekly active usage rose 62% after launch, and feature adoption for training plans went from 9% to 41%.",
        "gallery": [
            "https://picsum.photos/seed/danie-gallery-22/1200/900",
            "https://picsum.photos/seed/danie-gallery-23/1200/900",
            "https://picsum.photos/seed/danie-gallery-24/1200/900"
        ],
        "order": 8,
    }
]

INITIAL_BLOGS = [
    {
        "slug": "what-a-full-service-marketing-agency-can-do-for-your-brand",
        "title": "What a Full-Service Marketing Agency Can Do for Your Brand",
        "category": "Digital Agency",
        "date": "May 2025",
        "read_time": "4 min read",
        "excerpt": "Discover the comprehensive capabilities of an end-to-end design and engineering studio — from brand architecture to custom web development and growth marketing.",
        "image": "https://daniedesign.com/wp-content/uploads/2025/05/ax-blog-05.jpg",
        "featured": True,
        "content": [
            {
                "heading": "Full-Spectrum Creative & Engineering Alignment",
                "paragraphs": [
                    "Myriam was first trained as a sculptor in Montreal and then in Helsinki, Finland. She is now based in Quebec but works for clients all around the globe. From textile design to murals, editorial illustrations and book covers, her style is recognized by her simple and perfectly arranged shapes as well as her rich and vibrant color palette.",
                    "Always ready to push the boundaries, especially when it comes to our own platform, our analytical eye creates sites that are visually engaging and also optimized for maximum performance. It perfectly reflects the journey to help your brand tell a story that increases understanding and drives decisive action."
                ]
            },
            {
                "heading": "Typography Hierarchy & Visual Order",
                "paragraphs": [
                    "Beckoning a diverse audience of customers who demand bold, premium experiences. The unique blend of quirkiness and personality sets a brand apart, establishing its distinct place in competitive markets.",
                    "Visual hierarchy is the fundamental principle of arranging elements to show their order of importance. By laying out elements logically and strategically, visitors navigate complex value propositions effortlessly."
                ]
            },
            {
                "heading": "Deep Execution & Streamlined ROI",
                "paragraphs": [
                    "Achieving deep work is our primary mission across every project. Full-service execution replaces fragmented communication with multiple freelancers by delivering unified strategy, high-speed code, and continuous conversion optimization."
                ]
            }
        ],
        "order": 1,
    },
    {
        "slug": "various-ideas-and-creative-concepts-based-on-market-research",
        "title": "Various Ideas and Creative Concepts Based on Market Research",
        "category": "Creative Strategy",
        "date": "May 2025",
        "read_time": "5 min read",
        "excerpt": "Simple, perfectly arranged shapes combined with a rich, vibrant aesthetic. How deep market intelligence fuels innovative brand concepts that convert.",
        "image": "https://daniedesign.com/wp-content/uploads/2025/05/ax-blog-03.jpg",
        "featured": False,
        "content": [
            {
                "heading": "Market Research as the Creative Anchor",
                "paragraphs": [
                    "Creative concepts only succeed commercially when rooted in authentic consumer behavior. By analyzing competitor positioning and identifying whitespace opportunities, design transitions from subjective decoration into a high-performing revenue engine.",
                    "Our research frameworks uncover what your target audience values most before writing a single line of code or designing the first artboard."
                ]
            },
            {
                "heading": "Rapid Concept Prototyping & Validation",
                "paragraphs": [
                    "From moodboard directions to clickable interactive prototypes, rapid iterative testing allows senior squads to validate user assumptions early in the product lifecycle.",
                    "By arranging design tokens and layout grids systematically, we ensure brand consistency across web, mobile, and social touchpoints."
                ]
            }
        ],
        "order": 2,
    },
    {
        "slug": "the-role-of-a-marketing-agency-in-scaling-your-startup",
        "title": "The Role of a Marketing Agency in Scaling Your Startup",
        "category": "Startup Growth",
        "date": "May 2025",
        "read_time": "4 min read",
        "excerpt": "Why early-stage startups need a specialized digital agency partner to accelerate product-market fit, acquisition funnels, and enterprise brand credibility.",
        "image": "https://daniedesign.com/wp-content/uploads/2025/05/ax-blog-04.jpg",
        "featured": False,
        "content": [
            {
                "heading": "Transitioning from MVP to Scalable Market Leader",
                "paragraphs": [
                    "Startups often launch with functional MVPs that lack visual credibility. A dedicated design and engineering partner builds the bespoke design systems, high-speed landing pages, and conversion architecture necessary to close enterprise accounts and raise capital.",
                    "Execution speed is the ultimate startup superpower. Partnering with an agile senior squad eliminates internal hiring friction and multiplies launch velocity."
                ]
            },
            {
                "heading": "Acquisition Funnels and Performance Optimization",
                "paragraphs": [
                    "Sustainable scaling requires repeatable customer acquisition channels. Aligning landing page messaging with targeted multi-channel campaigns ensures lower CAC and higher lifetime value."
                ]
            }
        ],
        "order": 3,
    },
    {
        "slug": "the-ultimate-guide-to-choosing-the-right-startup-agency-for-your-new-business",
        "title": "The Ultimate Guide to Choosing the Right Startup Agency for Your New Business",
        "category": "Strategy",
        "date": "May 2025",
        "read_time": "6 min read",
        "excerpt": "A practical founder's framework for evaluating agency portfolios, technical engineering standards, sprint workflows, and transparent pricing models.",
        "image": "https://daniedesign.com/wp-content/uploads/2025/05/ax-blog-08.jpg",
        "featured": False,
        "content": [
            {
                "heading": "Evaluating Portfolios Beyond Surface Aesthetics",
                "paragraphs": [
                    "Look for measurable case studies, live production websites, and client testimonials that demonstrate real business impact rather than static mockups.",
                    "Engineering standards matter: ensure your agency partner builds with modern production tech like Next.js 16, TypeScript, clean semantic CSS, and responsive layouts."
                ]
            },
            {
                "heading": "Direct Senior Access vs Agency Layers",
                "paragraphs": [
                    "Prioritize agencies that provide direct collaboration with senior creators and developers without layers of account management slowing down iteration cycles."
                ]
            }
        ],
        "order": 4,
    }
]

INITIAL_SERVICES = [
    {
        "number": "01",
        "title": "Branding",
        "description": "Help businesses create clear, recognizable and consistent identities through strategy, creative direction and visual design.",
        "capabilities": ["Creative Direction", "Brand Identity", "Branding Strategy", "Graphic Design", "Startup Branding"],
        "href": "/services/branding",
        "image": "/images/branding.jpg",
        "tagline": "Identities that stay recognizable",
        "video": "https://cdn.pixabay.com/video/2017/04/21/8794-214200523_medium.mp4",
        "accent": "#ff4d1f",
        "order": 1,
    },
    {
        "number": "02",
        "title": "UI/UX Design",
        "description": "Design useful and intuitive digital experiences through research, structure, prototyping and testing.",
        "capabilities": ["UI/UX Consulting", "UX Research", "Usability Testing", "Wireframing", "Prototyping", "Mobile App Design"],
        "href": "/services/ui-ux",
        "image": "/images/uiux.jpg",
        "tagline": "Experiences people understand",
        "video": "https://cdn.pixabay.com/video/2019/10/09/27669-365224683_medium.mp4",
        "accent": "#4da6ff",
        "order": 2,
    },
    {
        "number": "03",
        "title": "Website Development",
        "description": "Build responsive websites and digital products using modern platforms and frameworks.",
        "capabilities": ["WordPress", "Webflow", "Laravel", "React", "Flutter", "Design Systems", "React.js", "Mobile Applications"],
        "href": "/services/web-development",
        "image": "/images/web development.png",
        "tagline": "Performance behind the pixels",
        "video": "https://cdn.pixabay.com/video/2020/06/18/42521-431738825_medium.mp4",
        "accent": "#7ee787",
        "order": 3,
    },
    {
        "number": "04",
        "title": "Digital Marketing",
        "description": "Use strategy, search visibility, audience research and social channels to help brands grow online.",
        "capabilities": ["Online Marketing", "SEO", "Strategy", "Market Research", "Social Media"],
        "href": "/services/digital-marketing",
        "image": "/images/digitalmarketing.webp",
        "tagline": "Attention turned into growth",
        "video": "https://cdn.pixabay.com/video/2020/08/21/47713-451772938_medium.mp4",
        "accent": "#b388ff",
        "order": 4,
    }
]

INITIAL_CREATIVE = [
    {"label": "Logo Design", "image": "https://picsum.photos/seed/danie-creative-01/900/1100", "category": "Identity", "order": 1},
    {"label": "Brand Design", "image": "https://picsum.photos/seed/danie-creative-02/900/1100", "category": "Identity", "order": 2},
    {"label": "Stationery Design", "image": "https://picsum.photos/seed/danie-creative-03/900/1100", "category": "Print", "order": 3},
    {"label": "Social Media Design", "image": "https://picsum.photos/seed/danie-creative-04/900/1100", "category": "Digital", "order": 4},
    {"label": "Brand Guidelines", "image": "https://picsum.photos/seed/danie-creative-05/900/1100", "category": "Identity", "order": 5},
    {"label": "Packaging Design", "image": "https://picsum.photos/seed/danie-creative-06/900/1100", "category": "Print", "order": 6},
    {"label": "Label Design", "image": "https://picsum.photos/seed/danie-creative-07/900/1100", "category": "Print", "order": 7},
    {"label": "UI/UX Design", "image": "https://picsum.photos/seed/danie-creative-08/900/1100", "category": "Digital", "order": 8},
    {"label": "App Design", "image": "https://picsum.photos/seed/danie-creative-09/900/1100", "category": "Digital", "order": 9},
    {"label": "Website Design", "image": "https://picsum.photos/seed/danie-creative-10/900/1100", "category": "Digital", "order": 10},
    {"label": "Website Development", "image": "https://picsum.photos/seed/danie-creative-11/900/1100", "category": "Digital", "order": 11},
    {"label": "Motion Graphics", "image": "https://picsum.photos/seed/danie-creative-12/900/1100", "category": "Motion", "order": 12},
]

INITIAL_CLIENTS = [
    {"name": "Northline", "quote": "They rebuilt our product experience from the ground up — and our activation numbers prove it.", "featured": True, "order": 1},
    {"name": "Ember Coffee", "quote": "The rebrand made us look like the company we always knew we were. Retail doors opened almost immediately.", "featured": True, "order": 2},
    {"name": "Meridian", "quote": "Tripled organic revenue in nine months. The team operates like an extension of our own.", "featured": True, "order": 3},
    {"name": "Vanta Finance", "quote": "Rare to find a partner this good at both design and engineering. The app simply works.", "featured": True, "order": 4},
    {"name": "Lumen Studio", "quote": "", "featured": False, "order": 5},
    {"name": "Sable Ceramics", "quote": "", "featured": False, "order": 6},
    {"name": "Arc Legal", "quote": "", "featured": False, "order": 7},
    {"name": "Pulsewear", "quote": "", "featured": False, "order": 8},
    {"name": "Halcyon Labs", "quote": "", "featured": False, "order": 9},
    {"name": "Orbit Health", "quote": "", "featured": False, "order": 10},
]

INITIAL_STATS = [
    {"value": 1000, "suffix": "+", "label": "Projects Supported", "description": "Design and development solutions that helped companies grow — including support for businesses reaching major funding milestones.", "is_hero": 0, "order": 1},
    {"value": 10, "suffix": "+", "label": "Years of Experience", "description": "A journey that began with a small team focused on design and creativity, and grew into branding, design and digital work for startups and established brands.", "is_hero": 0, "order": 2},
    {"value": 98, "suffix": "%", "label": "Client Satisfaction", "description": "An average satisfaction rate built on quality, communication, transparency and proactive handling of challenges.", "is_hero": 0, "order": 3},
    {"value": 500, "suffix": "+", "label": "Websites & Apps", "description": "Responsive, user-focused websites and applications across WordPress, Figma, Webflow and custom solutions.", "is_hero": 0, "order": 4},
    {"value": 25, "suffix": "+", "label": "Team Specialists", "description": "A multidisciplinary team of designers and developers covering branding, graphic design, responsive websites, applications and complete digital solutions.", "is_hero": 0, "order": 5},
    {"value": 98, "suffix": "%", "label": "Client satisfaction and repeat partnerships", "description": "", "is_hero": 1, "order": 6},
    {"value": 160, "suffix": "+", "label": "Successful projects across 24 countries", "description": "", "is_hero": 1, "order": 7},
]

INITIAL_IMPACT = [
    {"number": "01", "title": "Foundation", "body": "It started with a small team obsessed with design and creativity. What began as a couple of people and a sketchbook grew into a studio serving startups and established brands across the world.", "order": 1},
    {"number": "02", "title": "Growth", "body": "From the first website to complete brand systems — 1,000+ projects supported, hundreds of products shipped and work delivered across 24 countries.", "order": 2},
    {"number": "03", "title": "Craft", "body": "Design is only half the story. Every pixel is engineered — responsive builds, performance budgets and interfaces that feel as good as they look.", "order": 3},
    {"number": "04", "title": "Partnership", "body": "98% of clients stay. We measure success in repeat partnerships, long-term retainers and the moments a product quietly outperforms the market.", "order": 4},
]

INITIAL_TEAM = [
    {"name": "Danie", "role": "CEO & Creative Director", "image": "https://daniedesign.com/wp-content/uploads/2026/01/212-01.jpg", "order": 1},
    {"name": "Fiona Sid", "role": "Head of Strategy", "image": "https://daniedesign.com/wp-content/uploads/2026/01/212-02.jpg", "order": 2},
    {"name": "Danish", "role": "Lead Designer", "image": "https://daniedesign.com/wp-content/uploads/2026/01/212-03.jpg", "order": 3},
    {"name": "Owais", "role": "Website And App Developer", "image": "https://daniedesign.com/wp-content/uploads/2026/01/12121.jpg", "order": 4},
    {"name": "Ana Dina Belić", "role": "Graphic Designer", "image": "https://daniedesign.com/wp-content/uploads/2025/05/team-5.webp", "order": 5},
    {"name": "Giuseppe Carbonara", "role": "Brand Strategist", "image": "https://daniedesign.com/wp-content/uploads/2025/05/team-6.webp", "order": 6},
    {"name": "Vedran Starčić", "role": "Jr. Designer", "image": "https://daniedesign.com/wp-content/uploads/2025/05/team-7.webp", "order": 7},
    {"name": "Izquierdo Bayà", "role": "Creative Writer", "image": "https://daniedesign.com/wp-content/uploads/2025/05/team-8.webp", "order": 8},
    {"name": "Jared Silverman", "role": "Motion Designer", "image": "https://daniedesign.com/wp-content/uploads/2025/05/team-9.webp", "order": 9},
    {"name": "Samuel Bertain", "role": "WordPress Developer", "image": "https://daniedesign.com/wp-content/uploads/2025/05/team-10.webp", "order": 10},
]

INITIAL_GALLERY = [
    {"src": "https://daniedesign.com/wp-content/uploads/2026/01/charlesdeluvio-Lks7vei-eAg-unsplash-1-scaled.jpg", "alt": "Studio workspace with design screens", "order": 1},
    {"src": "https://daniedesign.com/wp-content/uploads/2026/01/israel-andrade-YI_9SivVt_s-unsplash-scaled.jpg", "alt": "Creative team collaborating in the studio", "order": 2},
    {"src": "https://daniedesign.com/wp-content/uploads/2026/01/charlesdeluvio-Lks7vei-eAg-unsplash-1-1-scaled.jpg", "alt": "Designer reviewing interface layouts", "order": 3},
    {"src": "https://daniedesign.com/wp-content/uploads/2026/01/campaign-creators-gMsnXqILjp4-unsplash-scaled.jpg", "alt": "Team workshop session", "order": 4},
    {"src": "https://daniedesign.com/wp-content/uploads/2025/05/ax-about-gallery-01.webp", "alt": "Danie Design studio gallery", "order": 5},
]

def seed_database(db: Session):
    """Populate the database with initial content; each table is only filled when empty.

    The admin user is matched by email (so its password isn't reset on restart),
    while every other table is seeded only if it currently has zero rows.
    """
    try:
        # Seed Admin User
        admin = db.query(AdminUser).filter(AdminUser.email == settings.ADMIN_EMAIL).first()
        # Only insert the default admin if it doesn't exist — never overwrite its password
        if not admin:
            logger.info("Creating default Super Admin user...")
            db.add(AdminUser(
                email=settings.ADMIN_EMAIL,
                name="Danie Admin",
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                role="admin"
            ))
            db.commit()

        # Seed Projects — skipped when the table already has rows, so admin edits survive restarts
        if db.query(Project).count() == 0:
            logger.info("Seeding projects...")
            for p in INITIAL_PROJECTS:
                db.add(Project(**p))
            db.commit()
            
        # Seed Blogs (content is a list of {heading, paragraphs} sections stored as JSON)
        if db.query(BlogPost).count() == 0:
            logger.info("Seeding blogs...")
            for b in INITIAL_BLOGS:
                db.add(BlogPost(**b))
            db.commit()

        # Seed Services
        if db.query(Service).count() == 0:
            logger.info("Seeding services...")
            for s in INITIAL_SERVICES:
                db.add(Service(**s))
            db.commit()

        # Seed Creative
        if db.query(CreativeItem).count() == 0:
            logger.info("Seeding creative items...")
            for c in INITIAL_CREATIVE:
                db.add(CreativeItem(**c))
            db.commit()

        # Seed Clients
        if db.query(Client).count() == 0:
            logger.info("Seeding clients...")
            for cl in INITIAL_CLIENTS:
                db.add(Client(**cl))
            db.commit()

        # Seed Stats (is_hero=1 entries render in the homepage hero strip; others in the stats grid)
        if db.query(SiteStat).count() == 0:
            logger.info("Seeding stats...")
            for st in INITIAL_STATS:
                db.add(SiteStat(**st))
            db.commit()

        # Seed Impact
        if db.query(ImpactStory).count() == 0:
            logger.info("Seeding impact stories...")
            for imp in INITIAL_IMPACT:
                db.add(ImpactStory(**imp))
            db.commit()

        # Seed Team
        if db.query(TeamMember).count() == 0:
            logger.info("Seeding team members...")
            for tm in INITIAL_TEAM:
                db.add(TeamMember(**tm))
            db.commit()

        # Seed Gallery
        if db.query(StudioGalleryImage).count() == 0:
            logger.info("Seeding studio gallery...")
            for g in INITIAL_GALLERY:
                db.add(StudioGalleryImage(**g))
            db.commit()
            
        logger.info("Database seed check completed successfully.")
    except Exception as e:
        # Seeding must never prevent the app from starting; undo partial inserts and carry on
        logger.error(f"Error seeding database: {e}")
        db.rollback()
