-- Create roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create cultos table
CREATE TABLE public.cultos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    summary TEXT,
    video_id TEXT,
    thumbnail_url TEXT,
    teachings TEXT[],
    year INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM date)::INTEGER) STORED,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on cultos
ALTER TABLE public.cultos ENABLE ROW LEVEL SECURITY;

-- RLS policies for cultos
CREATE POLICY "Anyone can view published cultos" ON public.cultos
    FOR SELECT USING (published = true);

CREATE POLICY "Admins can view all cultos" ON public.cultos
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert cultos" ON public.cultos
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update cultos" ON public.cultos
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete cultos" ON public.cultos
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Create estudos table
CREATE TABLE public.estudos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    date DATE NOT NULL,
    excerpt TEXT,
    content TEXT,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on estudos
ALTER TABLE public.estudos ENABLE ROW LEVEL SECURITY;

-- RLS policies for estudos
CREATE POLICY "Anyone can view published estudos" ON public.estudos
    FOR SELECT USING (published = true);

CREATE POLICY "Admins can view all estudos" ON public.estudos
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert estudos" ON public.estudos
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update estudos" ON public.estudos
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete estudos" ON public.estudos
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Create church_info table for editable content
CREATE TABLE public.church_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on church_info
ALTER TABLE public.church_info ENABLE ROW LEVEL SECURITY;

-- RLS policies for church_info
CREATE POLICY "Anyone can view church_info" ON public.church_info
    FOR SELECT USING (true);

CREATE POLICY "Admins can update church_info" ON public.church_info
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert church_info" ON public.church_info
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create schedule table
CREATE TABLE public.schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day TEXT NOT NULL,
    time TEXT NOT NULL,
    event TEXT NOT NULL,
    is_highlight BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on schedule
ALTER TABLE public.schedule ENABLE ROW LEVEL SECURITY;

-- RLS policies for schedule
CREATE POLICY "Anyone can view schedule" ON public.schedule
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage schedule" ON public.schedule
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cultos_updated_at
    BEFORE UPDATE ON public.cultos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_estudos_updated_at
    BEFORE UPDATE ON public.estudos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_church_info_updated_at
    BEFORE UPDATE ON public.church_info
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create profile trigger on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Insert default schedule data
INSERT INTO public.schedule (day, time, event, is_highlight, order_index) VALUES
    ('DOM', '09:00', 'Culto da Manhã', false, 1),
    ('DOM', '19:00', 'Culto da Noite', false, 2),
    ('QUA', '19:30', 'Estudo Bíblico', false, 3),
    ('SEX', '20:00', 'Culto de Oração', false, 4);