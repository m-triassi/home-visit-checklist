export const INITIAL_SECTIONS = [
    {
        id: "structural",
        title: "Major Structural",
        items: [
            {
                id: "foundation",
                label: "Foundation",
                description:
                    "Major concern in Montreal due to clay-rich soil and freeze-thaw cycles.",
                lookFor: [
                    'Horizontal or "stair-step" cracks in basement walls',
                    "Signs of water infiltration (stains, dampness, efflorescence)",
                    "Uneven or sloping floors",
                    "Doors/windows that stick",
                ],
                ask: "Have there ever been foundation repairs? Is there a warranty?",
            },
            {
                id: "french_drain",
                label: "French Drain (Drain français)",
                description: "Critical for water management.",
                lookFor: [
                    "Check if there is a sump pump and ask if it is active",
                ],
                ask: "When was the drain last replaced/inspected? (Typical lifespan 25-30 years)",
            },
            {
                id: "roof",
                label: "Roof (Toit)",
                description: "Montreal snow/ice impact.",
                lookFor: [
                    "Curling, cracked, or missing shingles",
                    "Flat roofs: Pooling water, bubbles",
                    "Attic: Leaks, condensation, blocked soffits",
                ],
                ask: "When was the roof last replaced? (Asphalt 15-20 yrs)",
            },
            {
                id: "masonry",
                label: "Brickwork & Siding (Maçonnerie)",
                description: "External envelope condition.",
                lookFor: [
                    "Crumbling mortar (repointing needed)",
                    "Bulging/bowing bricks (structural red flag)",
                    "Large cracks",
                ],
                ask: null,
            },
            {
                id: "windows_doors",
                label: "Windows & Doors",
                description: "Insulation and seal integrity.",
                lookFor: [
                    "Condensation BETWEEN glass panes (blown seal)",
                    "Water stains on wall under windows",
                    "Drafts or gaps",
                ],
                ask: "How old are the windows?",
            },
        ],
    },
    {
        id: "systems",
        title: "Interior Systems",
        items: [
            {
                id: "electrical",
                label: "Electrical (Électricité)",
                description: "Safety and insurance compliance.",
                lookFor: [
                    "Fuses instead of breakers",
                    "Knob-and-tube wiring (pre-1950s)",
                    "Aluminum wiring (1960-70s)",
                    "Ungrounded (2-prong) outlets",
                ],
                ask: "Is panel 100A or 200A? Any recalls?",
            },
            {
                id: "plumbing",
                label: "Plumbing (Plomberie)",
                description: "Pipe material and water pressure.",
                lookFor: [
                    "Galvanized steel pipes (dull grey, pre-1960s)",
                    "Lead pipes",
                    "Signs of leaks (ceilings, under sinks)",
                    "Low water pressure (test shower+toilet)",
                ],
                ask: "Has main sewer line been replaced/inspected? (Tree roots)",
            },
            {
                id: "heating",
                label: "Heating (Chauffage)",
                description: "Furnace/Boiler health.",
                lookFor: ["Age of furnace, boiler, or heat pump"],
                ask: "System age? Hot water tank rented? Oil tank inspection date?",
            },
            {
                id: "pyrite",
                label: "Pyrite",
                description: "Backfill mineral causing swelling (1980s-90s).",
                lookFor: [
                    "Starburst/spider-web cracks in basement/garage floor",
                ],
                ask: "Has property been tested for pyrite?",
            },
            {
                id: "vermiculite",
                label: "Vermiculite Insulation",
                description:
                    "Attic insulation (pre-1990) may contain asbestos.",
                lookFor: ["Pebbly, grey-brown/silver-gold insulation in attic"],
                ask: "Is there vermiculite? Tested for asbestos?",
            },
            {
                id: "asbestos",
                label: "Asbestos (Amiante)",
                description: "Hazardous material in older finishes.",
                lookFor: [
                    "9x9 floor tiles",
                    "Ceiling tiles",
                    "Wrap on heating pipes",
                ],
                ask: null,
            },
        ],
    },
];

export const STATUS_OPTS = {
    PASS: "pass",
    FAIL: "fail",
    QUESTION: "question",
    NONE: null,
};