# 🧴 Skincare Tracker

A comprehensive web application for managing your skincare product collection, tracking expiration dates, and monitoring product usage.

## ✨ Features

### 📊 Dashboard
- **Product Overview**: View total products, active items, expiring soon, and expired products
- **Upcoming Expirations**: Track products expiring in the next 30 days with color-coded urgency
- **Product Types Analysis**: See breakdown of your most common product types

### 🔍 Product Management
- **Add Products**: Easy-to-use form for adding new skincare products
- **Edit Products**: Update product information and tracking dates
- **Delete Products**: Remove products with confirmation
- **Product Status Tracking**: Monitor active, expiring, expired, and finished products

### 🔎 Advanced Search & Filtering
- **Real-time Search**: Search by product name or brand
- **Filter by Type**: Filter products by skincare type (cleanser, moisturizer, serum, etc.)
- **Filter by Brand**: Find products from specific brands
- **Filter by Status**: View products by their current status
- **Smart Sorting**: Sort by name, brand, expiration date, or recently added
- **Clear Filters**: Easy reset of all active filters

### 📅 Date Management
- **Expiration Tracking**: Monitor product expiration dates with visual indicators
- **Date Opened Tracking**: Keep track of when products were first opened
- **Finish Date Recording**: Log when products are completely used up
- **Smart Status Detection**: Automatic status calculation based on dates

### 🎨 User Interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface built with shadcn/ui components
- **Color-coded Status**: Visual indicators for product urgency
- **Organized Layout**: Tabbed interface separating active and finished products

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skincare-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Dashboard page
│   └── products/          # Product management pages
│       ├── page.tsx       # Products listing
│       ├── add/           # Add product page
│       └── [id]/edit/     # Edit product page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── product-card.tsx  # Product display component
│   ├── product-form.tsx  # Product form component
│   └── main-nav.tsx      # Navigation component
├── lib/                  # Utility libraries
│   ├── date-utils.ts     # Date handling utilities
│   └── utils.ts          # General utilities
├── services/             # API services
│   └── productService.ts # Product CRUD operations
└── utils/                # Type definitions and configs
    └── supabase/         # Supabase configuration
```

## 🔧 Key Components

### Date Utilities (`/src/lib/date-utils.ts`)
Centralized date handling functions for:
- Product status determination
- Date formatting
- Expiration calculations
- Product sorting

### Product Service (`/src/services/productService.ts`)
API layer for:
- Fetching products
- Creating new products
- Updating existing products
- Deleting products

### Product Card Component
Displays individual products with:
- Status badges with color coding
- Key product information
- Action buttons (edit, delete)

## 🎯 Product Statuses

- **Active**: Products in good condition, not expiring soon
- **Expiring Soon**: Products expiring within 30 days
- **Expired**: Products past their expiration date
- **Finished**: Products that have been completely used up

## 🎨 Status Color Coding

- **Green**: Active products
- **Yellow**: Expiring in 15-30 days
- **Orange**: Expiring in 8-14 days
- **Red**: Expiring within 7 days or expired

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones

## 🔮 Future Enhancements

- [ ] Product usage tracking and recommendations
- [ ] Barcode scanning for easy product entry
- [ ] Notification system for expiring products
- [ ] Product review and rating system
- [ ] Import/export functionality
- [ ] Multi-user support with sharing features

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide](https://lucide.dev/) for the icon library
- [Vercel](https://vercel.com/) for the deployment platform
- [Supabase](https://supabase.com/) for the backend infrastructure