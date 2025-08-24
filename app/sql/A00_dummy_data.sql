-- 더미 데이터 삽입 스크립트
-- 의존성 순서: themes → subjects → textbooks → majors → middles → units → concepts → users → 관계 테이블들

-- 1. themes (최상위 테이블)
INSERT INTO themes (name, slug, is_active, sort_order, icon_url)
VALUES ('과학', 'science', true, 1, 'https://example.com/icons/science.svg'),
       ('수학', 'mathematics', true, 2, 'https://example.com/icons/math.svg'),
       ('언어', 'language', true, 3, 'https://example.com/icons/language.svg'),
       ('예술', 'arts', true, 4, 'https://example.com/icons/arts.svg'),
       ('기술', 'technology', true, 5, 'https://example.com/icons/tech.svg');

-- 2. subjects (themes 의존)
INSERT INTO subjects (name, slug, is_active, sort_order, icon_url, themes_id)
VALUES ('물리학', 'physics', true, 1, 'https://example.com/icons/physics.svg', 1),
       ('화학', 'chemistry', true, 2, 'https://example.com/icons/chemistry.svg', 1),
       ('생물학', 'biology', true, 3, 'https://example.com/icons/biology.svg', 1),
       ('미적분학', 'calculus', true, 1, 'https://example.com/icons/calculus.svg', 2),
       ('선형대수', 'linear-algebra', true, 2, 'https://example.com/icons/algebra.svg', 2),
       ('한국어', 'korean', true, 1, 'https://example.com/icons/korean.svg', 3),
       ('영어', 'english', true, 2, 'https://example.com/icons/english.svg', 3),
       ('프로그래밍', 'programming', true, 1, 'https://example.com/icons/programming.svg', 5),
       ('회화', 'painting', true, 1, 'https://example.com/icons/painting.svg', 4),
       ('음악', 'music', true, 2, 'https://example.com/icons/music.svg', 4);

-- 3. textbooks (subjects 의존)
INSERT INTO textbooks (title, slug, price, is_published, sort_order, description, cover_image_url, subjects_id)
VALUES ('기초 물리학', 'basic-physics', 25000, true, 1, '물리학의 기본 개념을 다루는 교재입니다.', 'https://example.com/covers/physics.jpg',
        1),
       ('고급 물리학', 'advanced-physics', 35000, true, 2, '심화된 물리학 이론을 학습합니다.',
        'https://example.com/covers/advanced-physics.jpg', 1),
       ('일반 화학', 'general-chemistry', 28000, true, 1, '화학의 기본 원리를 배웁니다.', 'https://example.com/covers/chemistry.jpg',
        2),
       ('유기 화학', 'organic-chemistry', 32000, true, 2, '유기화합물의 구조와 반응을 학습합니다.',
        'https://example.com/covers/organic-chemistry.jpg', 2),
       ('세포 생물학', 'cell-biology', 30000, true, 1, '세포의 구조와 기능을 다룹니다.', 'https://example.com/covers/cell-biology.jpg',
        3),
       ('미적분학 I', 'calculus-1', 22000, true, 1, '미분과 적분의 기본을 배웁니다.', 'https://example.com/covers/calculus1.jpg', 4),
       ('미적분학 II', 'calculus-2', 24000, true, 2, '다변수 함수와 벡터 해석을 학습합니다.', 'https://example.com/covers/calculus2.jpg',
        4),
       ('선형대수학', 'linear-algebra-book', 26000, true, 1, '벡터와 행렬의 이론을 다룹니다.',
        'https://example.com/covers/linear-algebra.jpg', 5),
       ('JavaScript 완전 정복', 'javascript-mastery', 35000, true, 1, '모던 JavaScript를 마스터하세요.',
        'https://example.com/covers/javascript.jpg', 8),
       ('Python 프로그래밍', 'python-programming', 30000, true, 2, 'Python의 기초부터 고급까지.',
        'https://example.com/covers/python.jpg', 8);

-- 4. majors (textbooks 의존)
INSERT INTO majors (title, sort_order, is_published, textbook_id)
VALUES ('역학의 기초', 1, true, 1),
       ('전자기학', 2, true, 1),
       ('열역학과 통계역학', 3, true, 2),
       ('양자역학 입문', 4, true, 2),
       ('원자와 분자', 1, true, 3),
       ('화학 반응과 평형', 2, true, 3),
       ('세포막과 세포질', 1, true, 5),
       ('유전학 기초', 2, true, 5),
       ('극한과 연속성', 1, true, 6),
       ('미분의 응용', 2, true, 6),
       ('적분의 기법', 3, true, 6),
       ('다중적분', 1, true, 7),
       ('벡터 공간', 1, true, 8),
       ('고유값과 고유벡터', 2, true, 8),
       ('ES6와 모던 문법', 1, true, 9),
       ('비동기 프로그래밍', 2, true, 9),
       ('데이터 구조', 1, true, 10),
       ('알고리즘 설계', 2, true, 10);

-- 5. middles (majors 의존)
INSERT INTO middles (title, sort_order, is_published, major_id)
VALUES ('뉴턴 법칙', 1, true, 1),
       ('운동량과 에너지', 2, true, 1),
       ('전기장의 개념', 1, true, 2),
       ('자기장의 성질', 2, true, 2),
       ('온도와 열', 1, true, 3),
       ('엔트로피와 열역학 법칙', 2, true, 3),
       ('파동함수', 1, true, 4),
       ('불확정성 원리', 2, true, 4),
       ('원자 구조', 1, true, 5),
       ('분자 결합', 2, true, 5),
       ('세포막의 구조', 1, true, 7),
       ('세포 호흡', 2, true, 7),
       ('극한의 정의', 1, true, 9),
       ('연속함수', 2, true, 9),
       ('변수와 함수', 1, true, 15),
       ('조건문과 반복문', 2, true, 15),
       ('Promise와 async/await', 1, true, 16),
       ('이벤트 루프', 2, true, 16);

-- 6. units (middles 의존)
INSERT INTO units (title, youtube_video_id, readme_content, estimated_duration, sort_order, is_published,
                   middle_chapter_id)
VALUES ('뉴턴 제1법칙 이해하기', 'abc123def456', '관성의 법칙에 대해 알아봅시다.', 1800, 1, true, 1),
       ('뉴턴 제2법칙 적용하기', 'def456ghi789', 'F=ma 공식을 실생활에 적용해봅시다.', 2100, 2, true, 1),
       ('뉴턴 제3법칙과 작용-반작용', 'ghi789jkl012', '작용-반작용 법칙의 예시를 살펴봅시다.', 1500, 3, true, 1),
       ('운동량 보존법칙', 'jkl012mno345', '운동량이 보존되는 조건을 알아봅시다.', 2400, 1, true, 2),
       ('운동 에너지와 위치 에너지', 'mno345pqr678', '에너지의 종류와 전환을 학습합니다.', 2700, 2, true, 2),
       ('전기장의 정의', 'pqr678stu901', '전기장이란 무엇인지 알아봅시다.', 1800, 1, true, 3),
       ('쿨롱의 법칙', 'stu901vwx234', '전기력에 대한 쿨롱의 법칙을 학습합니다.', 2100, 2, true, 3),
       ('자기장과 로렌츠 힘', 'vwx234yz567', '자기장 속에서 움직이는 전하의 운동을 살펴봅시다.', 2400, 1, true, 4),
       ('전자기 유도', 'yz567abc890', '패러데이 법칙과 전자기 유도 현상을 학습합니다.', 2700, 2, true, 4),
       ('온도와 열의 차이', 'abc890def123', '온도와 열의 개념을 구분해봅시다.', 1500, 1, true, 5),
       ('파동함수의 의미', 'def123ghi456', '양자역학에서 파동함수가 의미하는 바를 알아봅시다.', 3000, 1, true, 7),
       ('원자 오비탈', 'ghi456jkl789', '전자가 존재할 수 있는 궤도를 학습합니다.', 2700, 1, true, 9),
       ('극한의 엄밀한 정의', 'jkl789mno012', '엡실론-델타 정의를 이해해봅시다.', 3600, 1, true, 13),
       ('연속함수의 성질', 'mno012pqr345', '연속함수가 갖는 특성들을 알아봅시다.', 2400, 1, true, 14),
       ('변수 선언과 스코프', 'pqr345stu678', 'let, const, var의 차이점을 알아봅시다.', 1800, 1, true, 15),
       ('Promise 기초', 'stu678vwx901', 'JavaScript의 비동기 처리를 학습합니다.', 2700, 1, true, 17);

-- 7. concepts (독립 테이블)
INSERT INTO concepts (name, slug, definition, name_eng)
VALUES ('관성', 'inertia', '물체가 현재의 운동 상태를 유지하려는 성질', 'Inertia'),
       ('가속도', 'acceleration', '속도의 변화율', 'Acceleration'),
       ('운동량', 'momentum', '질량과 속도의 곱', 'Momentum'),
       ('에너지', 'energy', '물체가 일을 할 수 있는 능력', 'Energy'),
       ('전기장', 'electric-field', '전하 주위에 형성되는 물리적 장', 'Electric Field'),
       ('자기장', 'magnetic-field', '자석이나 전류 주위에 형성되는 물리적 장', 'Magnetic Field'),
       ('온도', 'temperature', '물체의 차가운 정도나 뜨거운 정도를 나타내는 물리량', 'Temperature'),
       ('엔트로피', 'entropy', '시스템의 무질서도를 나타내는 물리량', 'Entropy'),
       ('파동함수', 'wave-function', '양자 시스템의 상태를 기술하는 수학적 함수', 'Wave Function'),
       ('궤도', 'orbital', '전자가 존재할 확률이 높은 공간', 'Orbital'),
       ('극한', 'limit', '함수값이 특정값에 한없이 가까워지는 것', 'Limit'),
       ('연속성', 'continuity', '함수가 끊어지지 않고 이어지는 성질', 'Continuity'),
       ('미분', 'derivative', '함수의 순간변화율', 'Derivative'),
       ('적분', 'integral', '구간에서 함수의 넓이나 부피를 구하는 것', 'Integral'),
       ('변수', 'variable', '값을 저장하는 메모리 공간', 'Variable'),
       ('함수', 'function', '특정 작업을 수행하는 코드 블록', 'Function'),
       ('배열', 'array', '여러 값을 순서대로 저장하는 자료구조', 'Array'),
       ('객체', 'object', '속성과 메서드를 가진 데이터 구조', 'Object'),
       ('비동기', 'asynchronous', '작업이 동시에 실행되는 방식', 'Asynchronous'),
       ('프로미스', 'promise', '비동기 작업의 결과를 나타내는 객체', 'Promise');

-- 8. users (독립 테이블)
INSERT INTO users (user_id, email, username, role, nickname, profile_url)
VALUES ('550e8400-e29b-41d4-a716-446655440001', 'john@example.com', 'john_doe', 'user', 'John',
        'https://example.com/profiles/john.jpg'),
       ('550e8400-e29b-41d4-a716-446655440002', 'jane@example.com', 'jane_smith', 'user', 'Jane',
        'https://example.com/profiles/jane.jpg'),
       ('550e8400-e29b-41d4-a716-446655440003', 'admin@example.com', 'admin_user', 'admin', 'Admin',
        'https://example.com/profiles/admin.jpg'),
       ('550e8400-e29b-41d4-a716-446655440004', 'alice@example.com', 'alice_wonder', 'user', 'Alice',
        'https://example.com/profiles/alice.jpg'),
       ('550e8400-e29b-41d4-a716-446655440005', 'bob@example.com', 'bob_builder', 'user', 'Bob',
        'https://example.com/profiles/bob.jpg'),
       ('550e8400-e29b-41d4-a716-446655440006', 'charlie@example.com', 'charlie_brown', 'user', 'Charlie',
        'https://example.com/profiles/charlie.jpg'),
       ('550e8400-e29b-41d4-a716-446655440007', 'diana@example.com', 'diana_prince', 'user', 'Diana',
        'https://example.com/profiles/diana.jpg'),
       ('550e8400-e29b-41d4-a716-446655440008', 'edward@example.com', 'ed_tech', 'user', 'Edward',
        'https://example.com/profiles/edward.jpg');

-- 9. dealings (units와 concepts 의존)
INSERT INTO dealings (unit_id, concept_id, discription, sort_order)
VALUES (1, 1, '관성의 법칙과 실생활 예시', 1),
       (2, 2, '가속도 계산 방법', 1),
       (3, 1, '작용-반작용과 관성', 2),
       (4, 3, '운동량 계산과 보존', 1),
       (5, 4, '에너지 변환 과정', 1),
       (6, 5, '전기장의 세기 계산', 1),
       (7, 5, '쿨롱 법칙 적용', 2),
       (8, 6, '로렌츠 힘의 계산', 1),
       (9, 6, '전자기 유도 현상', 2),
       (10, 7, '온도 측정과 열량', 1),
       (11, 9, '파동함수의 해석', 1),
       (12, 10, '원자 궤도의 모양', 1),
       (13, 11, '극한값의 계산', 1),
       (14, 12, '연속함수의 판별', 1),
       (15, 15, '변수의 스코프 규칙', 1),
       (16, 20, 'Promise 사용법', 1);

-- 10. enrollments (users와 textbooks 의존)
INSERT INTO enrollments (user_id, textbook_id, progress_rate, payment_status, review, rating)
VALUES ('550e8400-e29b-41d4-a716-446655440001', 1, 75, true, '물리학 기초를 잘 설명해주는 좋은 교재입니다.', 8),
       ('550e8400-e29b-41d4-a716-446655440001', 6, 50, true, '미적분학이 어렵지만 차근차근 따라가고 있습니다.', 7),
       ('550e8400-e29b-41d4-a716-446655440002', 3, 90, true, '화학 개념이 명확하게 정리되어 있어요.', 9),
       ('550e8400-e29b-41d4-a716-446655440002', 9, 25, true, 'JavaScript 학습 시작했습니다.', 8),
       ('550e8400-e29b-41d4-a716-446655440004', 2, 100, true, '고급 물리학까지 완주했습니다. 훌륭한 내용!', 10),
       ('550e8400-e29b-41d4-a716-446655440004', 8, 60, true, '선형대수가 생각보다 재미있네요.', 8),
       ('550e8400-e29b-41d4-a716-446655440005', 5, 30, true, '생물학 처음 공부하는데 이해하기 쉬워요.', 7),
       ('550e8400-e29b-41d4-a716-446655440006', 10, 80, true, 'Python 프로그래밍 거의 다 봤어요.', 9),
       ('550e8400-e29b-41d4-a716-446655440007', 7, 40, true, '미적분학 II 어렵지만 포기하지 않겠어요.', 6),
       ('550e8400-e29b-41d4-a716-446655440008', 4, 65, true, '유기화학 반응 메커니즘이 흥미로워요.', 8);

-- 11. masters (users와 concepts 의존)
INSERT INTO masters (user_id, concept_id, master_rate)
VALUES ('550e8400-e29b-41d4-a716-446655440001', 1, 4),
       ('550e8400-e29b-41d4-a716-446655440001', 2, 3),
       ('550e8400-e29b-41d4-a716-446655440001', 11, 3),
       ('550e8400-e29b-41d4-a716-446655440002', 3, 5),
       ('550e8400-e29b-41d4-a716-446655440002', 15, 2),
       ('550e8400-e29b-41d4-a716-446655440004', 4, 5),
       ('550e8400-e29b-41d4-a716-446655440004', 5, 4),
       ('550e8400-e29b-41d4-a716-446655440004', 6, 4),
       ('550e8400-e29b-41d4-a716-446655440005', 10, 2),
       ('550e8400-e29b-41d4-a716-446655440006', 16, 4),
       ('550e8400-e29b-41d4-a716-446655440006', 17, 3),
       ('550e8400-e29b-41d4-a716-446655440006', 20, 4),
       ('550e8400-e29b-41d4-a716-446655440007', 13, 3),
       ('550e8400-e29b-41d4-a716-446655440008', 18, 3),
       ('550e8400-e29b-41d4-a716-446655440008', 19, 2);

-- 12. prerequisites (concepts 자기 참조)
INSERT INTO prerequisites (concept_id, prerequisite_id, description, sort_order)
VALUES (2, 1, '가속도를 이해하기 위해서는 먼저 관성의 개념이 필요합니다.', 1),
       (3, 2, '운동량은 가속도 개념을 기반으로 합니다.', 1),
       (4, 3, '에너지 보존법칙은 운동량 개념과 연관됩니다.', 1),
       (6, 5, '자기장을 이해하려면 전기장 개념이 선행되어야 합니다.', 1),
       (8, 7, '엔트로피는 온도 개념을 기반으로 합니다.', 1),
       (10, 9, '원자 궤도를 이해하려면 파동함수 개념이 필요합니다.', 1),
       (12, 11, '연속성은 극한 개념을 기반으로 합니다.', 1),
       (13, 12, '미분은 연속성과 극한 개념이 필요합니다.', 1),
       (14, 13, '적분은 미분의 역과정으로 미분 이해가 선행되어야 합니다.', 1),
       (16, 15, '함수는 변수 개념을 기반으로 합니다.', 1),
       (17, 16, '배열은 함수와 변수 개념이 필요합니다.', 1),
       (18, 17, '객체는 배열 개념을 확장한 것입니다.', 1),
       (20, 19, '프로미스는 비동기 개념을 구현한 것입니다.', 1);

-- 13. progress (users와 units 의존)
INSERT INTO progress (user_id, unit_id, completion_status)
VALUES ('550e8400-e29b-41d4-a716-446655440001', 1, true),
       ('550e8400-e29b-41d4-a716-446655440001', 2, true),
       ('550e8400-e29b-41d4-a716-446655440001', 3, false),
       ('550e8400-e29b-41d4-a716-446655440001', 13, true),
       ('550e8400-e29b-41d4-a716-446655440001', 14, false),
       ('550e8400-e29b-41d4-a716-446655440002', 6, true),
       ('550e8400-e29b-41d4-a716-446655440002', 7, true),
       ('550e8400-e29b-41d4-a716-446655440002', 15, true),
       ('550e8400-e29b-41d4-a716-446655440002', 16, false),
       ('550e8400-e29b-41d4-a716-446655440004', 4, true),
       ('550e8400-e29b-41d4-a716-446655440004', 5, true),
       ('550e8400-e29b-41d4-a716-446655440004', 8, true),
       ('550e8400-e29b-41d4-a716-446655440004', 9, true),
       ('550e8400-e29b-41d4-a716-446655440005', 12, true),
       ('550e8400-e29b-41d4-a716-446655440006', 15, true),
       ('550e8400-e29b-41d4-a716-446655440006', 16, true),
       ('550e8400-e29b-41d4-a716-446655440007', 13, true),
       ('550e8400-e29b-41d4-a716-446655440008', 10, true);

-- 14. supportives (concepts 자기 참조)
INSERT INTO supportives (concept_id, supportive_id, description, sort_order)
VALUES (1, 3, '관성을 이해하면 운동량 개념도 더 쉽게 이해할 수 있습니다.', 1),
       (2, 4, '가속도와 에너지는 밀접한 관련이 있습니다.', 1),
       (5, 6, '전기장과 자기장은 전자기학의 핵심 개념들입니다.', 1),
       (7, 8, '온도와 엔트로피는 열역학의 기본 개념들입니다.', 1),
       (9, 10, '파동함수와 궤도는 양자역학에서 함께 다뤄집니다.', 1),
       (11, 13, '극한을 이해하면 미분도 더 잘 이해할 수 있습니다.', 1),
       (12, 14, '연속성은 적분의 기본 조건입니다.', 1),
       (15, 17, '변수를 이해하면 배열 사용이 더 쉬워집니다.', 1),
       (16, 18, '함수와 객체는 JavaScript의 핵심 요소들입니다.', 1),
       (19, 20, '비동기와 프로미스는 모던 JavaScript 개발의 필수 요소입니다.', 1);