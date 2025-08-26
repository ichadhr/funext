import { NavigationSection } from "@components/ui/types";
import {
    bundleIcon,
    Board20Filled,
    Board20Regular,
    Person20Filled,
    Person20Regular,
    MegaphoneLoud20Filled,
    MegaphoneLoud20Regular,
    PersonLightbulb20Filled,
    PersonLightbulb20Regular,
    PersonSearch20Filled,
    PersonSearch20Regular,
    PreviewLink20Filled,
    PreviewLink20Regular,
    NotePin20Filled,
    NotePin20Regular,
    People20Filled,
    People20Regular,
    HeartPulse20Filled,
    HeartPulse20Regular,
    BoxMultiple20Filled,
    BoxMultiple20Regular,
    PeopleStar20Filled,
    PeopleStar20Regular,
    DataArea20Filled,
    DataArea20Regular,
    DocumentBulletListMultiple20Filled,
    DocumentBulletListMultiple20Regular,
    LockClosed20Filled, // New import for login icon
    LockClosed20Regular, // New import for login icon
} from "@fluentui/react-icons";

const PATH = "#";

export const NAV_ICONS = {
    person: bundleIcon(Person20Filled, Person20Regular),
    dashboard: bundleIcon(Board20Filled, Board20Regular),
    announcements: bundleIcon(MegaphoneLoud20Filled, MegaphoneLoud20Regular),
    employeeSpotlight: bundleIcon(PersonLightbulb20Filled, PersonLightbulb20Regular),
    profileSearch: bundleIcon(PersonSearch20Filled, PersonSearch20Regular),
    performanceReviews: bundleIcon(PreviewLink20Filled, PreviewLink20Regular),
    jobPostings: bundleIcon(NotePin20Filled, NotePin20Regular),
    interviews: bundleIcon(People20Filled, People20Regular),
    healthPlans: bundleIcon(HeartPulse20Filled, HeartPulse20Regular),
    trainingPrograms: bundleIcon(BoxMultiple20Filled, BoxMultiple20Regular),
    careerDevelopment: bundleIcon(PeopleStar20Filled, PeopleStar20Regular),
    workforceData: bundleIcon(DataArea20Filled, DataArea20Regular),
    reports: bundleIcon(DocumentBulletListMultiple20Filled, DocumentBulletListMultiple20Regular),
    login: bundleIcon(LockClosed20Filled, LockClosed20Regular), // New login icon
} as const;

export const NAVIGATION_SECTIONS: NavigationSection[] = [
    {
        items: [
            { id: "1", label: "Dashboard", icon: "dashboard", href: PATH },
            { id: "2", label: "Announcements", icon: "announcements", href: PATH },
            { id: "3", label: "Employee Spotlight", icon: "employeeSpotlight", href: PATH },
            { id: "4", label: "Profile Search", icon: "profileSearch", href: PATH },
            { id: "5", label: "Performance Reviews", icon: "performanceReviews", href: PATH }
        ]
    },
    {
        title: "Employee Management",
        items: [
            {
                id: "6",
                label: "Job Postings",
                icon: "jobPostings",
                subItems: [
                    { id: "7", label: "Openings", href: PATH },
                    { id: "8", label: "Submissions", href: PATH }
                ]
            },
            { id: "9", label: "Interviews", icon: "interviews" }
        ]
    },
    {
        title: "Benefits",
        items: [
            { id: "10", label: "Health Plans", icon: "healthPlans" },
            {
                id: "11",
                label: "Retirement",
                icon: "dashboard", // No specific icon provided for Retirement, keeping dashboard for now
                subItems: [
                    { id: "13", label: "Plan Information", href: PATH },
                    { id: "14", label: "Fund Performance", href: PATH }
                ]
            }
        ]
    },
    {
        title: "Learning",
        items: [
            { id: "15", label: "Training Programs", icon: "trainingPrograms" },
            {
                id: "16",
                label: "Career Development",
                icon: "careerDevelopment",
                subItems: [
                    { id: "17", label: "Career Paths", href: PATH },
                    { id: "18", label: "Planning", href: PATH }
                ]
            }
        ]
    },
    {
        items: [
            { id: "19", label: "Workforce Data", icon: "workforceData", target: "_blank" },
            { id: "20", label: "Reports", icon: "reports", href: PATH },
            { id: "21", label: "Login", icon: "login", href: "/login" } // New login page link
        ],
        hasDivider: true
    }
];