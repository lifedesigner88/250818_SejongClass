-- 트랜잭션 시작
BEGIN;

-- 1. 대단원(majors) 삽입 및 ID 반환
WITH major_inserts AS (
    INSERT INTO majors (title, sort_order, is_published, textbook_id)
        VALUES
            ('수와 연산', 1, true, 19), -- textbook_id는 초등학교 3-4학년 교재 ID로 가정
            ('변화와 관계', 2, true, 19),
            ('도형과 측정', 3, true, 19),
            ('자료와 가능성', 4, true, 19)
        RETURNING major_id, title
),

-- 2. 중단원(middles) 삽입 및 ID 반환
     middle_inserts AS (
         INSERT INTO middles (title, sort_order, is_published, major_id)
             SELECT
                 m.title as middle_title,
                 m.sort_order,
                 true,
                 maj.major_id
             FROM (VALUES
                       -- 수와 연산의 중단원들
                       ('큰 수와 기본 연산', 1, '수와 연산'),
                       ('분수와 소수', 2, '수와 연산'),

                       -- 변화와 관계의 중단원들
                       ('규칙과 관계', 1, '변화와 관계'),

                       -- 도형과 측정의 중단원들
                       ('도형의 기초와 이동', 1, '도형과 측정'),
                       ('다양한 도형', 2, '도형과 측정'),
                       ('측정과 단위', 3, '도형과 측정'),

                       -- 자료와 가능성의 중단원들
                       ('자료의 수집과 분석', 1, '자료와 가능성')
                  ) AS m(title, sort_order, major_title)
                      JOIN major_inserts maj ON maj.title = m.major_title
             RETURNING middle_id, title, major_id
     )

-- 3. 소단원(units) 삽입
INSERT INTO units (title, sort_order, is_published, middle_chapter_id, readme_content)
SELECT
    u.title,
    u.sort_order,
    true,
    mid.middle_id,
    u.readme_content
FROM (VALUES
          -- 큰 수와 기본 연산 - 소단원들
          ('다섯 자리 이상의 수', 1, '큰 수와 기본 연산', '성취기준: [4수01-01], [4수01-02] - 큰 수의 필요성과 10000 이상 수의 자릿값, 수의 계열과 크기 비교'),
          ('세 자리 수의 연산', 2, '큰 수와 기본 연산', '성취기준: [4수01-03], [4수01-04] - 세 자리 수의 덧셈과 뺄셈, 곱하는 수가 한 자리 또는 두 자리 수인 곱셈'),
          ('나눗셈의 이해', 3, '큰 수와 기본 연산', '성취기준: [4수01-05], [4수01-06], [4수01-07] - 나눗셈의 의미와 곱셈과의 관계, 한 자리 및 두 자리 수 나눗셈'),
          ('자연수의 어림셈', 4, '큰 수와 기본 연산', '성취기준: [4수01-08] - 자연수의 사칙연산 상황에서 어림셈'),

          -- 분수와 소수 - 소단원들
          ('분수의 이해', 1, '분수와 소수', '성취기준: [4수01-09], [4수01-10], [4수01-11] - 분수의 필요성과 이해, 단위분수와 가분수, 분수의 크기 비교'),
          ('소수의 이해', 2, '분수와 소수', '성취기준: [4수01-12], [4수01-13], [4수01-14] - 소수의 이해와 읽기 쓰기, 소수의 크기 비교'),
          ('분수와 소수의 연산', 3, '분수와 소수', '성취기준: [4수01-15], [4수01-16] - 분모가 같은 분수의 덧셈과 뺄셈, 소수의 덧셈과 뺄셈'),

          -- 규칙과 관계 - 소단원들
          ('규칙의 발견과 표현', 1, '규칙과 관계', '성취기준: [4수02-01], [4수02-02] - 변화 규칙을 수나 식으로 나타내기, 계산식 배열의 규칙'),
          ('등호와 동치', 2, '규칙과 관계', '성취기준: [4수02-03] - 등호를 사용하여 크기가 같은 두 양의 관계 표현'),

          -- 도형의 기초와 이동 - 소단원들
          ('도형의 기본 요소', 1, '도형의 기초와 이동', '성취기준: [4수03-01], [4수03-02], [4수03-03] - 직선, 선분, 반직선, 각의 이해, 수직과 평행 관계'),
          ('평면도형의 이동', 2, '도형의 기초와 이동', '성취기준: [4수03-04], [4수03-05] - 도형의 밀기, 뒤집기, 돌리기, 점의 이동 설명'),

          -- 다양한 도형 - 소단원들
          ('원의 구성과 그리기', 1, '다양한 도형', '성취기준: [4수03-06], [4수03-07] - 원의 중심, 반지름, 지름의 이해, 컴퍼스로 원 그리기'),
          ('삼각형의 분류', 2, '다양한 도형', '성취기준: [4수03-08], [4수03-09] - 이등변삼각형, 정삼각형, 직각삼각형 등의 분류'),
          ('사각형의 분류', 3, '다양한 도형', '성취기준: [4수03-10] - 직사각형, 정사각형, 사다리꼴, 평행사변형, 마름모의 이해'),
          ('다각형과 도형 활용', 4, '다양한 도형', '성취기준: [4수03-11], [4수03-12] - 다각형과 정다각형, 도형으로 여러 모양 만들기'),

          -- 측정과 단위 - 소단원들
          ('시간의 정밀 측정', 1, '측정과 단위', '성취기준: [4수03-13], [4수03-14] - 1분과 1초의 관계, 초 단위까지의 시간 연산'),
          ('길이의 정밀 측정', 2, '측정과 단위', '성취기준: [4수03-15], [4수03-16] - 1mm와 1km 단위, 길이의 다양한 표현'),
          ('들이의 측정', 3, '측정과 단위', '성취기준: [4수03-17], [4수03-18], [4수03-19] - 1L와 1mL 단위, 들이의 연산'),
          ('무게의 측정', 4, '측정과 단위', '성취기준: [4수03-20], [4수03-21], [4수03-22], [4수03-23] - 1g, 1kg, 1t 단위, 무게의 연산'),
          ('각도의 측정', 5, '측정과 단위', '성취기준: [4수03-24], [4수03-25] - 1도(°) 단위와 각도기, 내각의 크기 합'),

          -- 자료의 수집과 분석 - 소단원들
          ('그래프의 이해와 활용', 1, '자료의 수집과 분석', '성취기준: [4수04-01], [4수04-02], [4수04-03] - 그림그래프, 막대그래프, 꺾은선그래프 작성과 해석')

     ) AS u(title, sort_order, middle_title, readme_content)
         JOIN middle_inserts mid ON mid.title = u.middle_title;

-- 트랜잭션 커밋
COMMIT;


-- 트랜잭션 시작
ALTER TABLE curriculums ADD COLUMN updated_at timestamp with time zone DEFAULT now();
COMMIT;

-- 성취기준 코드와 유닛 매핑을 통한 curriculums 업데이트
WITH curriculum_unit_mapping AS (
    SELECT
        unit_id,
        UNNEST(achievement_codes) AS achievement_code
    FROM (
             VALUES
                 -- 다섯 자리 이상의 수
                 ((SELECT unit_id FROM units WHERE title = '다섯 자리 이상의 수'), ARRAY['4수01-01', '4수01-02']),

                 -- 세 자리 수의 연산
                 ((SELECT unit_id FROM units WHERE title = '세 자리 수의 연산'), ARRAY['4수01-03', '4수01-04']),

                 -- 나눗셈의 이해
                 ((SELECT unit_id FROM units WHERE title = '나눗셈의 이해'), ARRAY['4수01-05', '4수01-06', '4수01-07']),

                 -- 자연수의 어림셈
                 ((SELECT unit_id FROM units WHERE title = '자연수의 어림셈'), ARRAY['4수01-08']),

                 -- 분수의 이해
                 ((SELECT unit_id FROM units WHERE title = '분수의 이해'), ARRAY['4수01-09', '4수01-10', '4수01-11']),

                 -- 소수의 이해
                 ((SELECT unit_id FROM units WHERE title = '소수의 이해'), ARRAY['4수01-12', '4수01-13', '4수01-14']),

                 -- 분수와 소수의 연산
                 ((SELECT unit_id FROM units WHERE title = '분수와 소수의 연산'), ARRAY['4수01-15', '4수01-16']),

                 -- 규칙의 발견과 표현
                 ((SELECT unit_id FROM units WHERE title = '규칙의 발견과 표현'), ARRAY['4수02-01', '4수02-02']),

                 -- 등호와 동치
                 ((SELECT unit_id FROM units WHERE title = '등호와 동치'), ARRAY['4수02-03']),

                 -- 도형의 기본 요소
                 ((SELECT unit_id FROM units WHERE title = '도형의 기본 요소'), ARRAY['4수03-01', '4수03-02', '4수03-03']),

                 -- 평면도형의 이동
                 ((SELECT unit_id FROM units WHERE title = '평면도형의 이동'), ARRAY['4수03-04', '4수03-05']),

                 -- 원의 구성과 그리기
                 ((SELECT unit_id FROM units WHERE title = '원의 구성과 그리기'), ARRAY['4수03-06', '4수03-07']),

                 -- 삼각형의 분류
                 ((SELECT unit_id FROM units WHERE title = '삼각형의 분류'), ARRAY['4수03-08', '4수03-09']),

                 -- 사각형의 분류
                 ((SELECT unit_id FROM units WHERE title = '사각형의 분류'), ARRAY['4수03-10']),

                 -- 다각형과 도형 활용
                 ((SELECT unit_id FROM units WHERE title = '다각형과 도형 활용'), ARRAY['4수03-11', '4수03-12']),

                 -- 시간의 정밀 측정
                 ((SELECT unit_id FROM units WHERE title = '시간의 정밀 측정'), ARRAY['4수03-13', '4수03-14']),

                 -- 길이의 정밀 측정
                 ((SELECT unit_id FROM units WHERE title = '길이의 정밀 측정'), ARRAY['4수03-15', '4수03-16']),

                 -- 들이의 측정
                 ((SELECT unit_id FROM units WHERE title = '들이의 측정'), ARRAY['4수03-17', '4수03-18', '4수03-19']),

                 -- 무게의 측정
                 ((SELECT unit_id FROM units WHERE title = '무게의 측정'), ARRAY['4수03-20', '4수03-21', '4수03-22', '4수03-23']),

                 -- 각도의 측정
                 ((SELECT unit_id FROM units WHERE title = '각도의 측정'), ARRAY['4수03-24', '4수03-25']),

                 -- 그래프의 이해와 활용
                 ((SELECT unit_id FROM units WHERE title = '그래프의 이해와 활용'), ARRAY['4수04-01', '4수04-02', '4수04-03'])

         ) AS mapping(unit_id, achievement_codes)
)

-- curriculums 테이블 업데이트
UPDATE curriculums
SET
    unit_id = cum.unit_id
FROM curriculum_unit_mapping cum
WHERE curriculums.code = cum.achievement_code;

-- 트랜잭션 커밋
COMMIT;