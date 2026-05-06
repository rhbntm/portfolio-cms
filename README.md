# Portfolio CMS

A sophisticated portfolio content management system built with React + Vite, featuring a dual-interface design with an elegant public-facing portfolio and a functional admin dashboard. The project uses Supabase for backend services and implements a comprehensive CSS module styling system.

View the live site: [https://ralph-brent-portfolio.vercel.app/](https://ralph-brent-portfolio.vercel.app/)

## ✨ Features

### Public Site
- **Elegant Dark Theme Design**: Editorial aesthetic with serif headlines and cinematic project cards
- **Responsive Layout**: Mobile-first design with adaptive grid systems
- **Project Showcase**: Dynamic project galleries with bento grid layouts
- **Blog/Journal**: Integrated blog system with chronological post listings
- **Smooth Navigation**: Fixed header with backdrop blur effects
- **Typography System**: Curated fonts (Noto Serif, Manrope) for optimal readability

### Admin Dashboard
- **Content Management**: Full CRUD operations for projects and blog posts
- **Authentication**: Secure login system with Supabase auth
- **Utilitarian UI**: Clean, functional admin interface with monospace labels
- **Real-time Updates**: Live data synchronization with Supabase
- **Protected Routes**: Role-based access control

### Technical Features
- **CSS Modules**: Scoped styling with comprehensive design tokens
- **Component Architecture**: Modular React components with reusable UI elements
- **State Management**: Efficient data fetching with custom hooks
- **SEO Optimized**: Proper meta tags and semantic HTML structure

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, React Router
- **Styling**: CSS Modules, Custom CSS Properties (Design Tokens)
- **Backend**: Supabase (Database, Auth, Storage)
- **Contact**: EmailJS for form submissions
- **Deployment**: Vercel (optimized for static sites)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- EmailJS account (for contact forms)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-cms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill `.env` with your credentials (see Environment Variables section below).

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# EmailJS Configuration (for contact forms)
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

### Getting Your Credentials

**Supabase:**
1. Create a new project at [supabase.com](https://supabase.com)
2. Navigate to Project Settings > API
3. Copy the Project URL and anon public key

**EmailJS:**
1. Sign up at [emailjs.com](https://emailjs.com)
2. Create an email service and template
3. Copy your Service ID, Template ID, and Public Key

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   └── ProtectedRoute.jsx   # Authentication wrapper
├── hooks/                   # Custom React hooks
│   ├── posts/              # Blog post hooks
│   ├── projects/           # Project management hooks
│   └── useAuth.js          # Authentication hook
├── layouts/                 # Layout components
│   ├── MainLayout.jsx      # Public site layout
│   └── AdminLayout.jsx     # Admin dashboard layout
├── pages/                   # Page components
│   ├── Home.jsx            # Landing page
│   ├── Login.jsx           # Admin login
│   ├── projects/           # Project pages
│   ├── blog/               # Blog pages
│   └── admin/              # Admin dashboard pages
├── styles/
│   └── globals.css         # Global styles and design tokens
├── assets/                 # Static assets
├── main.jsx               # App entry point
└── index.css              # Base styles
```

## 🎨 Design System

The project uses a comprehensive design token system with two distinct aesthetics:

### Public Site (Editorial Dark)
- **Colors**: Dark theme with forest green accents
- **Typography**: Noto Serif (headlines), Manrope (body)
- **Spacing**: Generous, cinematic layouts
- **Components**: Elegant cards with hover effects

### Admin Dashboard (Utilitarian)
- **Colors**: Utilitarian dark theme
- **Typography**: IBM Plex Sans (text), IBM Plex Mono (labels)
- **Spacing**: Tight, functional layouts
- **Components**: Clean tables and forms

## 🏗 Development Workflow

### Styling Implementation
The project follows a structured CSS module approach:
1. Global styles in `src/styles/globals.css`
2. Component-specific modules (e.g., `Home.module.css`)
3. Design tokens for consistency
4. Responsive design with mobile-first approach

### Adding New Content
1. Use the admin dashboard at `/admin`
2. Navigate to Projects or Posts sections
3. Use the intuitive forms to add/edit content
4. Changes reflect immediately on the public site

### Code Style
- Use functional components with hooks
- Follow the existing CSS module patterns
- Maintain the design token system
- Keep components focused and reusable

## 🚀 Deployment

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

**Build Settings:**
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Manual Deployment
```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

## 🧪 Testing

```bash
# Run the development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

---

**Built with ❤️ using React, Vite, and Supabase**