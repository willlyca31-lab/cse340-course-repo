 
-- =====================================================
-- Drop Existing Tables (Optional for rebuilding database)
-- =====================================================
DROP TABLE IF EXISTS public.project_volunteer CASCADE;
DROP TABLE IF EXISTS public.project_category CASCADE;
DROP TABLE IF EXISTS public.project CASCADE;
DROP TABLE IF EXISTS public.category CASCADE;
DROP TABLE IF EXISTS public.organization CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;

-- =====================================================
-- Roles Table
-- =====================================================
CREATE TABLE public.roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

-- =====================================================
-- Seed Roles
-- =====================================================
INSERT INTO public.roles
(role_name, role_description)
VALUES
('user', 'Standard user with basic access'),
('admin', 'Administrator with full system access');

-- =====================================================
-- Users Table
-- =====================================================
CREATE TABLE public.users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES public.roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Organization Table
-- =====================================================
CREATE TABLE public.organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- =====================================================
-- Organizations
-- =====================================================
INSERT INTO public.organization 
(name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer organization supporting local charities and community service.',
    'hello@unityserve.org',
    'unityserve-logo.png'
),
(
    'Hope Health Outreach',
    'A nonprofit providing health education and free community medical services.',
    'contact@hopehealth.org',
    'hopehealth-logo.png'
),
(
    'FutureTech Mentors',
    'Helping youth develop technology skills through mentoring and workshops.',
    'info@futuretechmentors.org',
    'futuretech-logo.png'
);
-- =====================================================
-- Project Table
-- =====================================================
CREATE TABLE public.project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,

    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES public.organization(organization_id)
        ON DELETE CASCADE
);

-- =====================================================
-- Project Volunteer Junction Table
-- Many-to-many relationship between users and projects
-- =====================================================
CREATE TABLE public.project_volunteer (
user_id INT NOT NULL,
project_id INT NOT NULL,

```
PRIMARY KEY (user_id, project_id),

CONSTRAINT fk_volunteer_user
    FOREIGN KEY (user_id)
    REFERENCES public.users(user_id)
    ON DELETE CASCADE,

CONSTRAINT fk_volunteer_project
    FOREIGN KEY (project_id)
    REFERENCES public.project(project_id)
    ON DELETE CASCADE
```

);

-- =====================================================
-- Category Table
-- =====================================================
CREATE TABLE public.category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- =====================================================
-- Project Category Junction Table
-- =====================================================
CREATE TABLE public.project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_pc_project
        FOREIGN KEY (project_id)
        REFERENCES public.project(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pc_category
        FOREIGN KEY (category_id)
        REFERENCES public.category(category_id)
        ON DELETE CASCADE
);

-- =====================================================
-- Categories
-- =====================================================
INSERT INTO public.category (name)
VALUES
('Construction'),
('Education'),
('Environment'),
('Food Security'),
('Community Service');

-- =====================================================
-- Projects (15 Total)
-- =====================================================

INSERT INTO public.project
(organization_id, name, description, location, project_date)
VALUES

-- Organization 1
(1,
 'Community Playground',
 'Build a safe playground for neighborhood children.',
 'Querétaro, Mexico',
 '2026-09-15'),

(1,
 'Senior Home Renovation',
 'Repair homes for elderly residents.',
 'Querétaro, Mexico',
 '2026-09-20'),

(1,
 'Affordable Housing Project',
 'Construct affordable homes for low-income families.',
 'Querétaro, Mexico',
 '2026-10-05'),


-- Organization 2
(2,
 'Community Garden',
 'Develop neighborhood vegetable gardens.',
 'Querétaro, Mexico',
 '2026-09-18'),

(2,
 'Urban Farming Workshops',
 'Teach sustainable farming techniques.',
 'Querétaro, Mexico',
 '2026-09-25'),

(2,
 'Food Pantry Expansion',
 'Increase access to nutritious food.',
 'Querétaro, Mexico',
 '2026-10-10'),


-- Organization 3
(3,
 'Volunteer Recruitment',
 'Recruit and train community volunteers.',
 'Querétaro, Mexico',
 '2026-09-12'),

(3,
 'School Supply Drive',
 'Collect and distribute school supplies.',
 'Querétaro, Mexico',
 '2026-08-25'),

(3,
 'Holiday Meal Program',
 'Provide meals to families during holidays.',
 'Querétaro, Mexico',
 '2026-12-15'),


-- Organization 4
(4,
 'Community Health Fair',
 'Offer free health screenings and education.',
 'Querétaro, Mexico',
 '2026-10-20'),

(4,
 'Mobile Clinic Support',
 'Provide healthcare services in rural communities.',
 'San Juan del Río, Querétaro',
 '2026-10-28'),

(4,
 'Wellness Education Campaign',
 'Promote healthy lifestyles through workshops.',
 'Querétaro, Mexico',
 '2026-11-05'),


-- Organization 5
(5,
 'Coding Bootcamp',
 'Teach programming skills to students.',
 'Querétaro, Mexico',
 '2026-09-30'),

(5,
 'Robotics Club',
 'Support STEM education through robotics activities.',
 'Querétaro, Mexico',
 '2026-10-15'),

(5,
 'Computer Donation Drive',
 'Provide refurbished computers to schools.',
 'Querétaro, Mexico',
 '2026-11-10');
-- =====================================================
-- Project Categories
-- =====================================================
INSERT INTO public.project_category
(project_id, category_id)
VALUES

-- Project 1
(1,1),
(1,5),

-- Project 2
(2,1),
(2,5),

-- Project 3
(3,1),

-- Project 4
(4,4),
(4,3),

-- Project 5
(5,2),
(5,3),

-- Project 6
(6,4),

-- Project 7
(7,5),

-- Project 8
(8,2),
(8,5),

-- Project 9
(9,5),

-- Project 10
(10,5),

-- Project 11
(11,5),

-- Project 12
(12,2),

-- Project 13
(13,2),

-- Project 14
(14,2),

-- Project 15
(15,2),
(15,5);


