# 🌟 PeopleOS — Enterprise Workforce & Employee Management System
[![Live Demo](https://img.shields.io/badge/Live_Demo-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://ems-himanshu.netlify.app/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
> A high-velocity, responsive workforce intelligence platform and Employee Management System (EMS) designed for modern enterprises. Built with an editorial aesthetic, authentic Indian corporate datasets, dynamic role-based access control, and real-time operations workflows.
🔗 **Live Application URL**: [https://ems-himanshu.netlify.app/](https://ems-himanshu.netlify.app/)
---
## 📸 Key Highlights & Features
### 1. 👥 Complete Employee Directory & 360° Profiles
- Comprehensive directory with live search, department filtering, and status tracking (Active, On Leave, Inactive).
- Deep employee profile modal with emergency contacts, job progression, skills matrix, compensation, and manager hierarchy.
- Instant CSV export for enterprise audits and HR reporting.
### 2. 📊 Executive Dashboard & Workforce Intelligence
- Real-time headcount statistics, company-wide attendance percentage, and active departments.
- **Attendance Breakdown (Last 6 Weeks)**: Responsive, touch-optimized visual analytics tracking Present, Late, and Absent trends across mobile, tablet, and widescreen viewports.
- Recent activity timeline and upcoming holiday calendar.
### 3. 🗓️ Intelligent Leave & Time-Off Management
- **Role-Based Isolation**: Employees only see their own leave requests; leadership (Admin & HR) has full organizational visibility.
- **Strict Applicant Locking**: When an employee submits time-off, the applicant field is securely locked to themselves (`Self` badge) to prevent submitting leave on behalf of colleagues.
- Multi-category support: *Casual Leave*, *Sick Leave*, *Earned Leave*, *Work From Home*, and *Unpaid Leave*.
- Supervisory review system with customized approval/rejection remarks.
### 4. ⏱️ Attendance & Time Tracking
- Daily employee attendance register tracking clock-in, clock-out, and net working hours.
- Status filters for *Present*, *Late*, and *Absent* with automated notes.
### 5. 💰 Payroll & Compensation Management
- Full Indian corporate compensation model in **INR (₹)** formatted in accordance with Indian number system conventions (`₹1,85,000`).
- Automated breakdown of Basic Salary, HRA, Special Allowance, PF deduction, TDS, and Net Pay.
- One-click pay stub generation and export.
### 6. 🔐 Role-Based Access Control (RBAC) & Fast Demo Switcher
- Seamless authentication allowing **any mock employee** to log in using their name or email.
- Built-in one-click demo credentials switcher:
| Role | Name | Email | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | **Himanshu Kumar Barnawal** | `himanshu.barnawal@peopleos.in` | Full executive command, settings, leave approvals, payroll |
| **HR Manager** | **Priya Sharma** | `priya.sharma@peopleos.in` | People operations, onboarding, leave review, attendance |
| **Employee** | **Sneha Kulkarni** *(or any mock user)* | `sneha.kulkarni@peopleos.in` | Self-service leave portal, personal attendance & records |
---
## 🛠️ Tech Stack & Architecture
- **Frontend**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a curated editorial palette (`#F6F2E9` Ivory, `#33263B` Muted Plum, `#C87555` Terracotta)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **State Management**: Reactive LocalStorage Storage Service with real-time Pub/Sub listener bindings
- **Deployment**: [Netlify](https://www.netlify.com/) with automated SPA redirects (`_redirects` & `netlify.toml`)
---
## 🚀 Getting Started Locally
### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`
### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/himanshu9798/PeopleOS-EMS-employee-management-system-.git
   cd PeopleOS-EMS-employee-management-system-
Install dependencies:

bash
npm install
Start local development server:

bash
npm run dev
Open http://localhost:5173 in your browser.

Build for production:

bash
npm run build
The production-optimized bundle will be created in the dist/ directory.

🌐 Live Deployment
The latest production build is deployed and hosted on Netlify:
👉 https://ems-himanshu.netlify.app/

👤 Author
Himanshu Kumar Barnawal

GitHub: @himanshu9798
Role: Executive Sponsor & Lead Architect
📄 License
This project is licensed under the MIT License - feel free to use it for educational and portfolio purposes.

3:09 PM
