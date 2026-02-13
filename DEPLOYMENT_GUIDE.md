# Motor Insurance Application - Deployment Guide

This guide will help you deploy your application using Supabase (database) and Vercel (hosting).

## Prerequisites

- Node.js 16+ installed
- A Supabase account (https://supabase.com)
- A Vercel account (https://vercel.com)
- Git installed

## Local Development Setup

### 1. Set up Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Settings > API** and copy:
   - **Project URL** (your SUPABASE_URL)
   - **Anon/Public Key** (your SUPABASE_KEY)
3. Save these values - you'll need them next

### 2. Configure Backend Environment

1. Navigate to the backend folder:
```bash
cd backend
```

2. Copy the example environment file:
```bash
cp .env.example .env
```

3. Edit `.env` and add your Supabase credentials:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_public_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. Install dependencies:
```bash
npm install
```

5. Run the backend:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

### 3. Configure Frontend Environment

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Copy the example environment file:
```bash
cp .env.example .env
```

3. Edit `.env` and ensure it has:
```
REACT_APP_BACKEND_URL=http://localhost:5000
```

4. Install dependencies:
```bash
npm install
```

5. Run the frontend:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## Production Deployment

### Deploy Backend to Vercel

1. Push your code to GitHub

2. Go to [https://vercel.com](https://vercel.com) and sign in

3. Click **Add New** → **Project** and select your repository

4. Configure the project:
   - **Framework Preset**: Node.js
   - **Root Directory**: `backend`

5. Add environment variables under **Settings > Environment Variables**:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_KEY`: Your Supabase anon key
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your Vercel frontend URL

6. Click **Deploy**

Your backend will be available at something like: `https://your-project.vercel.app`

### Deploy Frontend to Vercel

1. Go to [https://vercel.com](https://vercel.com) and click **Add New** → **Project**

2. Select your repository (if not already done)

3. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`

4. Add environment variables under **Settings > Environment Variables**:
   - `REACT_APP_BACKEND_URL`: Your Vercel backend URL from above (e.g., `https://your-backend.vercel.app`)

5. Click **Deploy**

Your frontend will be available at something like: `https://your-project.vercel.app`

## Supabase Setup

### Create Tables

You need to create the following tables in Supabase:

#### admin_accounts table
```sql
CREATE TABLE admin_accounts (
  admin_id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### insurance_policies table
```sql
CREATE TABLE insurance_policies (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  assured VARCHAR(255) NOT NULL,
  address TEXT,
  coc_number VARCHAR(255) UNIQUE NOT NULL,
  or_number VARCHAR(255) NOT NULL,
  policy_number VARCHAR(255),
  policy_type VARCHAR(100),
  policy_year INT,
  date_issued DATE,
  date_received DATE,
  insurance_from_date DATE,
  insurance_to_date DATE,
  model VARCHAR(255),
  make VARCHAR(255),
  body_type VARCHAR(100),
  color VARCHAR(50),
  mv_file_no VARCHAR(255),
  plate_no VARCHAR(255) UNIQUE,
  chassis_no VARCHAR(255),
  motor_no VARCHAR(255),
  premium DECIMAL(10, 2),
  other_charges DECIMAL(10, 2),
  auth_fee DECIMAL(10, 2),
  doc_stamps DECIMAL(10, 2),
  e_vat DECIMAL(10, 2),
  lgt DECIMAL(10, 2),
  total_premium DECIMAL(10, 2),
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(255)
);
```

### Production Database Query

To improve performance in production, you may want to add indexes:

```sql
CREATE INDEX idx_admin_username ON admin_accounts(username);
CREATE INDEX idx_policies_coc ON insurance_policies(coc_number);
CREATE INDEX idx_policies_or ON insurance_policies(or_number);
CREATE INDEX idx_policies_plate ON insurance_policies(plate_no);
CREATE INDEX idx_policies_deleted ON insurance_policies(is_deleted);
```

## Environment Variables Reference

### Backend (.env)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon key
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: `development` or `production`
- `FRONTEND_URL`: Frontend URL for CORS (localhost for dev, Vercel URL for prod)

### Frontend (.env)
- `REACT_APP_BACKEND_URL`: Backend API URL

## Troubleshooting

### CORS Issues
If you see CORS errors, update the CORS configuration in `backend/index.js` to include your Vercel frontend domain.

### Database Connection Issues
- Verify your Supabase URL and key are correct
- Check that the tables exist in Supabase
- Ensure RLS (Row Level Security) policies aren't blocking access

### Login Not Working
- Ensure you have admin accounts in the `admin_accounts` table
- Check browser console for error messages
- Verify the backend URL in frontend .env is correct

## Next Steps

1. **Configure custom domain** (optional): Both Vercel and Supabase support custom domains
2. **Set up monitoring**: Use Vercel Analytics and Supabase logs
3. **Implement authentication**: Consider adding JWT or session management
4. **Setup CI/CD**: Automatically deploy on git push
5. **Enable RLS policies**: Secure your Supabase data with Row Level Security

## Support

For issues with:
- **Vercel**: https://vercel.com/support
- **Supabase**: https://supabase.com/docs
- **React**: https://react.dev
