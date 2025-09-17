-- TRUNCATE와 함께 IDENTITY 컬럼도 초기화
TRUNCATE TABLE dealings RESTART IDENTITY CASCADE;
TRUNCATE TABLE enrollments RESTART IDENTITY CASCADE;
TRUNCATE TABLE masters RESTART IDENTITY CASCADE;
TRUNCATE TABLE progress RESTART IDENTITY CASCADE;
TRUNCATE TABLE prerequisites RESTART IDENTITY CASCADE;
TRUNCATE TABLE supportives RESTART IDENTITY CASCADE;
TRUNCATE TABLE units RESTART IDENTITY CASCADE;
TRUNCATE TABLE middles RESTART IDENTITY CASCADE;
TRUNCATE TABLE majors RESTART IDENTITY CASCADE;
TRUNCATE TABLE textbooks RESTART IDENTITY CASCADE;
TRUNCATE TABLE subjects RESTART IDENTITY CASCADE;
TRUNCATE TABLE themes RESTART IDENTITY CASCADE;
TRUNCATE TABLE concepts RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;



-- 1. themes 테이블 데이터
INSERT INTO themes (name, slug, is_active, sort_order, hover, class_name) VALUES
                                                                     ('수학', 'math', true, 1,
                                                                      'hover:scale-110 hover:rotate-3 hover:shadow-2xl hover:brightness-110',
                                                                      'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500'),
                                                                     ('물리', 'physics', true, 2,
                                                                      'hover:scale-110 hover:-rotate-3 hover:shadow-2xl hover:brightness-110 hover:backdrop-blur-sm transform-gpu',
                                                                      'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600'),
                                                                     ('코딩', 'coding', false, 3,
                                                                      'hover:scale-110 hover:rotate-2 hover:shadow-2xl hover:brightness-115',
                                                                      'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600'),
                                                                     ('인생', 'life', false, 4,
                                                                      'hover:scale-110 hover:-rotate-2 hover:shadow-2xl hover:brightness-105',
                                                                      'bg-gradient-to-br from-purple-400 via-violet-500 to-pink-600');

-- 2. subjects 테이블 데이터
INSERT INTO subjects (name, slug, is_active, sort_order, emoji, themes_id) VALUES

-- 수학 subjects (theme_id = 1)
('초등', 'elementary', true, 1, '🔢', 1),  -- 숫자들
('중등', 'middle', true, 2, '📐', 1),      -- 삼각자
('고등', 'high', true, 3, '📊', 1),       -- 차트
('대학', 'college', true, 4, '🎓', 1),    -- 졸업모자

-- 물리 subjects (theme_id = 2)
('기초', 'basic', true, 1, '⚽', 2),       -- 공
('일반', 'general', true, 2, '⚡', 2),     -- 번개
('고급', 'advanced', true, 3, '🔬', 2),   -- 현미경
('예술', 'artistic', true, 4, '🎨', 2);    -- 팔레트


-- 3. textbooks 테이블 데이터
INSERT INTO textbooks (title, slug, subjects_id, sort_order, is_published, price) VALUES
-- 초등 수학 교재들 (subjects_id: 1)
('초등 1-2학년', 'elementary-1-2', 1, 1, true, 0),
('초등 3-4학년', 'elementary-3-4', 1, 2, true, 0),
('초등 5-6학년', 'elementary-5-6', 1, 3, true, 0),

-- 중등 수학 교재들 (subjects_id: 2)
('중등 1학년', 'middle-school-1', 2, 1, true, 0),
('중등 2학년', 'middle-school-2', 2, 2, true, 0),
('중등 3학년', 'middle-school-3', 2, 3, true, 0),

-- 고등 수학 교재들 (subjects_id: 3)
('고등 1-1 공통수학 1', 'high-school-1-1-common-math-1', 3, 1, true, 0),
('고등 1-2 공통수학 2', 'high-school-1-2-common-math-2', 3, 2, true, 0),
('고등 2-1 대수', 'high-school-2-1-algebra', 3, 3, true, 30000),
('고등 2-2 미적분 1', 'high-school-2-2-calculus-1', 3, 4, true, 30000),
('고등 3-1 확률과 통계', 'high-school-3-1-probability-statistics', 3, 5, true, 50000),
('고등 3-2 미적분 2', 'high-school-3-2-calculus-2', 3, 6, true, 50000),
('고등 3-2 기하', 'high-school-3-2-geometry', 3, 7, true, 50000),

-- 대학 수학 교재들 (subjects_id: 4)
('대학 미적분', 'university-calculus', 4, 1, true, 100000),
('대학 선형대수', 'university-linear-algebra', 4, 2, true, 100000),
('대학 확률과 통계', 'university-probability-statistics', 4, 3, true, 100000),
('대학 이산수학', 'university-discrete-math', 4, 4, true, 100000);
