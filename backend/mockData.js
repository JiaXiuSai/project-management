export let projects = [
  {
    id: 1,
    name: "Website Redesign",
    status: "Backlog",
    description: "Complete redesign of the company website with modern UI/UX principles, responsive design, and improved user experience. This project will include new branding elements, enhanced navigation, and optimized performance for better conversion rates.",
  },
  {
    id: 2,
    name: "Mobile App Development",
    status: "On Hold",
    description: "Development of a comprehensive mobile application for iOS and Android platforms. The app will feature user authentication, real-time notifications, offline functionality, and seamless integration with our backend services.",
  },
  {
    id: 3,
    name: "API Integration Platform",
    status: "Completed",
    description: "Implementation of a robust API integration platform that connects multiple third-party services. This includes authentication, data synchronization, error handling, and comprehensive logging for monitoring and debugging purposes.",
  },
  {
    id: 4,
    name: "Marketing Campaign Strategy",
    status: "Planning",
    description: "Development of a comprehensive marketing campaign strategy targeting new customer segments. This includes market research, competitor analysis, content creation, social media planning, and performance tracking metrics.",
  },
  {
    id: 5,
    name: "User Research & Analytics",
    status: "In Progress",
    description: "Conducting extensive user research interviews and implementing advanced analytics tracking. This project involves user journey mapping, A/B testing, heatmap analysis, and creating detailed personas for better product development decisions.",
  },
  {
    id: 6,
    name: "Backend Services Refactor",
    status: "Under Review",
    description: "Comprehensive refactoring of backend services to improve performance, scalability, and maintainability. This includes database optimization, microservices architecture implementation, and enhanced security measures.",
  },
  {
    id: 7,
    name: "Quality Assurance Testing",
    status: "Cancelled",
    description: "Implementation of comprehensive quality assurance testing procedures including automated testing, manual testing protocols, performance testing, and security testing to ensure high-quality software delivery.",
  },
  {
    id: 8,
    name: "Technical Documentation Update",
    status: "Completed",
    description: "Complete update and reorganization of all technical documentation including API documentation, user guides, developer guides, and system architecture documentation to improve knowledge sharing and onboarding processes.",
  },
];

export let nextId = 9;

export const incrementId = () => {
  nextId++;
};

export const statuses = [
  "Backlog",
  "Planning",
  "In Progress",
  "On Hold",
  "Under Review",
  "Completed",
  "Cancelled",
];
