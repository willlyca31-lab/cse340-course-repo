=====================================================
-- CSE 340 - Database Setup Script
-- Service Organizations and Service Projects
-- =====================================================

-- =====================================================
-- Drop tables (allows the script to be rerun)
-- =====================================================
DROP TABLE IF EXISTS public.project_category;
DROP TABLE IF EXISTS public.project;
DROP TABLE IF EXISTS public.category;
DROP TABLE IF EXISTS public.organization;

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
-- Project Table
-- =====================================================
CREATE TABLE public.project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,

    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES public.organization (organization_id)
        ON DELETE CASCADE
);

-- =====================================================
-- Category Table
-- =====================================================
CREATE TABLE public.category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- =====================================================
-- Project_Category Junction Table
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
-- Sample Organizations
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
'An urban farming collective promoting food sustainability and education in local neighborhoods.',
'contact@greenharvest.org',
'greenharvest-logo.png'
),
(
'UnityServe Volunteers',
'A volunteer coordination group supporting local charities and service initiatives.',
'hello@unityserve.org',
'unityserve-logo.png'
);

-- =====================================================
-- Sample Categories
-- =====================================================
INSERT INTO public.category (name)
VALUES
('Construction'),
('Education'),
('Environment'),
('Food Security'),
('Community Service');

-- =====================================================
-- Sample Projects
-- =====================================================
INSERT INTO public.project
(organization_id, name, description)
VALUES
(
1,
'Community Playground',
'Build a safe playground for children in underserved neighborhoods.'
),
(
1,
'Senior Home Renovation',
'Repair and renovate homes for senior citizens.'
),
(
2,
'Community Garden',
'Develop neighborhood gardens that provide fresh produce.'
),
(
2,
'Urban Farming Workshops',
'Teach sustainable gardening and food production.'
),
(
3,
'Volunteer Recruitment',
'Recruit and train volunteers for local charities.'
),
(
3,
'School Supply Drive',
'Collect and distribute school supplies to children in need.'
);

-- =====================================================
-- Sample Project Categories
-- =====================================================
INSERT INTO public.project_category
(project_id, category_id)
VALUES
(1,1),
(1,5),
(2,1),
(2,5),
(3,4),
(3,3),
(4,2),
(4,3),
(5,5),
(6,2),
(6,5);

-- =====================================================
-- Verification Queries
-- =====================================================

SELECT * FROM public.organization;
SELECT * FROM public.project;
SELECT * FROM public.category;
SELECT * FROM public.project_category;
-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE public.organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Project_Category Junction Table
-- ========================================
CREATE TABLE public.project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES public.project(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES public.category(category_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert Sample Data: Organizations
-- ========================================
INSERT INTO public.organization (
    name,
    description,
    contact_email,
    logo_filename
)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);

