
-- Fix missing GRANTs on existing tables so the app can read/write properly
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.assessments TO authenticated;
GRANT ALL ON public.assessments TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.prep_plans TO authenticated;
GRANT ALL ON public.prep_plans TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.progress_snapshots TO authenticated;
GRANT ALL ON public.progress_snapshots TO service_role;

-- Seed companies table with realistic campus-placement data
INSERT INTO public.companies (name, logo_emoji, roles, topics, difficulty, pattern, ctc, description) VALUES
('Google', '🔍', ARRAY['Software Engineer L3','Site Reliability Engineer'], ARRAY['DSA Hard','System Design','Behavioural','Googliness'], 'Hard', 'OA → Phone → 3 On-site rounds (DSA + System Design + Culture)', '₹25-40 LPA', 'Product giant. Emphasises structured problem solving, coding clarity, and culture fit. System design is mandatory for L3+ roles.'),
('Microsoft', '🪟', ARRAY['SDE','SDE II','PM'], ARRAY['DSA Medium-Hard','System Design','Behavioural','Azure Basics'], 'Hard', 'OA → Phone → 4 On-site rounds (DSA + Design + AA + Manager)', '₹22-38 LPA', 'Strong focus on system design and behavioural alignment. Azure knowledge is a plus for some teams.'),
('Amazon', '📦', ARRAY['SDE-1','SDE-2','Support Engineer'], ARRAY['DSA Medium-Hard','System Design','Leadership Principles','Debugging'], 'Hard', 'OA (coding + work style) → 3-4 Loop rounds + Bar Raiser', '₹18-28 LPA', 'Leadership Principles are non-negotiable. Prepare 8-10 STAR stories. System design appears from SDE-2 onwards.'),
('TCS', '💼', ARRAY['Assistant Systems Engineer','Trainee'], ARRAY['Aptitude','English','Reasoning','OOPS Basics','DBMS Basics'], 'Easy', 'NQT → Technical → HR', '₹3.6-7 LPA', 'India''s largest IT employer. Mass recruitment through National Qualifier Test. Communication and attitude matter more than deep tech.'),
('Infosys', 'ℹ️', ARRAY['Systems Engineer','Specialist Programmer'], ARRAY['Aptitude','English','Pseudocode','Puzzles'], 'Easy', 'Online Test → Interview (Technical + HR)', '₹3.6-8 LPA', 'Two tracks: regular SE and high-paying Specialist Programmer (SP). SP has a harder coding test and higher CTC.'),
('Wipro', '🌿', ARRAY['Project Engineer','Graduate Engineer Trainee'], ARRAY['Aptitude','English','Coding (Basic)','Communication'], 'Easy', 'Online Assessment → Technical + HR', '₹3.5-6.5 LPA', 'Mass hiring with focus on communication skills and willingness to relocate. Bond period is common.'),
('Accenture', '🔺', ARRAY['Associate Software Engineer','Advanced ASE'], ARRAY['Aptitude','English','Pseudocode','Cloud Basics','Group Discussion'], 'Medium', 'Cognitive + Technical → GD → Interview', '₹4.5-10 LPA', 'Advanced ASE track pays higher and has a tougher coding round. Group Discussion is often a filter round.'),
('Cognizant', '🧠', ARRAY['Programmer Analyst','Associate'], ARRAY['Aptitude','English','Coding','DBMS Basics'], 'Medium', 'Online Test → Technical → HR', '₹4-7 LPA', 'Strong presence in BFSI and healthcare verticals. OOPS and SQL questions are common in technical rounds.'),
('Deloitte', '🔷', ARRAY['Analyst','Consultant (Associate)'], ARRAY['Aptitude','Case Study','Group Exercise','Behavioural','Situational Judgement'], 'Medium', 'Aptitude → Case/GD → 2 Behavioural rounds', '₹6-10 LPA', 'Consulting culture. Client-facing maturity, structured communication, and situational judgement are tested heavily.'),
('KPMG', '📊', ARRAY['Analyst','Technology Consultant'], ARRAY['Aptitude','Logical','Case Study','Excel','Behavioural'], 'Medium', 'Online → Case/GD → Technical + HR', '₹5.5-9 LPA', 'Similar to Deloitte with extra emphasis on Excel and data interpretation. Business intuition is valued.'),
('Flipkart', '🛒', ARRAY['Software Development Engineer','Business Analyst'], ARRAY['DSA Medium-Hard','Machine Coding','System Design','Product Sense'], 'Hard', 'OA (2 DSA + 1 Machine Coding) → DSA → Design → HM', '₹16-25 LPA', 'Machine coding round is unique: build a mini feature with clean code and tests. Product sense matters for non-engineering roles.'),
('Swiggy', '🍔', ARRAY['SDE','Data Scientist','Product Manager'], ARRAY['DSA','Machine Coding','SQL','Statistics','A/B Testing'], 'Hard', 'OA → Technical → Design/Case → HM + Culture', '₹15-24 LPA', 'Fast-paced startup culture. Expect deep project dives and comfort with ambiguous problem statements.'),
('Mu Sigma', 'Σ', ARRAY['Decision Scientist','Trainee'], ARRAY['Aptitude','Pseudo-code','SQL','Case Study','Video Synthesis'], 'Medium', 'Video Synthesis → Pseudo-code + SQL → Case → HR', '₹5-7 LPA', 'Analytics consulting firm. Case studies are business-first. Bond and stability checks are strict.'),
('Zoho', '📝', ARRAY['Member Technical Staff','Product Manager'], ARRAY['C/C++','DSA','Puzzles','OS','DBMS'], 'Medium', 'Written (C tracing + aptitude) → 2 Technical → HR', '₹8-15 LPA', 'Written round filters heavily. C/C++ output tracing and pointer arithmetic are must-knows.'),
('Freshworks', '🌱', ARRAY['Software Engineer','DevOps Engineer'], ARRAY['DSA Medium','System Design','JavaScript/Node.js','Cloud Basics'], 'Medium', 'OA → DSA → Design → HM + Culture', '₹10-18 LPA', 'SaaS product company. JavaScript ecosystem knowledge and SaaS product thinking are valued.'),
('AMD / Intel', '⚙️', ARRAY['Design Engineer','Verification Engineer','Firmware Engineer'], ARRAY['Digital Logic','Verilog','Computer Architecture','C/C++','Python Scripting'], 'Hard', 'Aptitude + Core → Technical (Verilog/Arch) → Coding → HR', '₹10-18 LPA', 'Core hardware companies. Deep knowledge in one core subject (digital design or architecture) beats broad shallow knowledge.'),
('Qualcomm', '📡', ARRAY['Engineer','Embedded Software Engineer'], ARRAY['C','Embedded Systems','DSP','Wireless Protocols','OS'], 'Hard', 'Online Core + Aptitude → Technical → Manager → HR', '₹12-20 LPA', 'Wireless and embedded focus. C programming and OS internals are heavily tested.'),
('Capgemini', '♊', ARRAY['Software Engineer','Analyst'], ARRAY['Aptitude','English','Pseudocode','OOPS','SQL'], 'Easy', 'Online → Technical → HR', '₹4-7 LPA', 'French IT consulting. Pseudocode rounds and basic OOPS/SQL are common. Relocation flexibility is expected.'),
('IBM', '🐧', ARRAY['Software Developer','Associate System Engineer'], ARRAY['Aptitude','English','Coding (Basic)','DB2','Cloud Basics'], 'Medium', 'Online → Coding → Technical → HR', '₹4.5-9 LPA', 'Enterprise tech giant. DB2 and cloud basics (IBM Cloud/Red Hat) are useful. Behavioural rounds focus on teamwork.'),
('Oracle', '🔴', ARRAY['Application Developer','Member Technical Staff'], ARRAY['DSA Medium','SQL Advanced','Java/C++','Database Internals'], 'Hard', 'OA → DSA → SQL Deep-dive → HM', '₹12-20 LPA', 'Database giant. Advanced SQL and database internals are tested deeply. Java or C++ expertise is expected.');
