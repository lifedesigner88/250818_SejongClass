-- 트랜잭션 시작
BEGIN;

-- 1. 대단원(majors) 삽입 및 ID 반환
WITH major_inserts AS (
    INSERT INTO majors (title, sort_order, is_published, textbook_id)
        VALUES
            ('수와 연산', 1, true, 6), -- textbook_id는 중학교 3학년 교재 ID로 가정
            ('변화와 관계', 2, true, 6),
            ('도형과 측정', 3, true, 6)
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
                       ('제곱근과 실수', 1, '수와 연산'),

                       -- 변화와 관계의 중단원들
                       ('다항식과 인수분해', 1, '변화와 관계'),
                       ('이차방정식과 이차함수', 2, '변화와 관계'),

                       -- 도형과 측정의 중단원들
                       ('닮음과 삼각비', 1, '도형과 측정'),
                       ('원의 성질', 2, '도형과 측정')
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
          -- 제곱근과 실수 - 소단원들
          ('제곱근의 뜻과 성질', 1, '제곱근과 실수', '성취기준: [9수01-07] - 제곱근의 뜻과 성질, 제곱근의 대소 관계'),
          ('무리수와 실수', 2, '제곱근과 실수', '성취기준: [9수01-08], [9수01-09] - 무리수의 개념과 유용성, 실수의 대소 관계'),
          ('근호를 포함한 식의 계산', 3, '제곱근과 실수', '성취기준: [9수01-10] - 근호를 포함한 식의 사칙계산'),

          -- 다항식과 인수분해 - 소단원들
          ('다항식의 곱셈과 인수분해', 1, '다항식과 인수분해', '성취기준: [9수02-19] - 다항식의 곱셈과 인수분해'),

          -- 이차방정식과 이차함수 - 소단원들
          ('이차방정식', 1, '이차방정식과 이차함수', '성취기준: [9수02-20] - 이차방정식의 풀이와 활용'),
          ('이차함수의 개념과 그래프', 2, '이차방정식과 이차함수', '성취기준: [9수02-21], [9수02-22] - 이차함수의 개념과 그래프, 그래프의 성질'),

          -- 닮음과 삼각비 - 소단원들
          ('도형의 닮음', 1, '닮음과 삼각비', '성취기준: [9수03-12], [9수03-13] - 도형의 닮음과 닮은 도형의 성질, 삼각형의 닮음 조건'),
          ('평행선과 선분의 비', 2, '닮음과 삼각비', '성취기준: [9수03-14] - 평행선 사이의 선분의 길이의 비'),
          ('삼각비', 3, '닮음과 삼각비', '성취기준: [9수03-16], [9수03-17] - 삼각비의 뜻과 값, 삼각비의 활용'),

          -- 원의 성질 - 소단원들
          ('원의 현과 접선', 1, '원의 성질', '성취기준: [9수03-18] - 원의 현에 관한 성질과 접선에 관한 성질'),
          ('원주각의 성질', 2, '원의 성질', '성취기준: [9수03-19] - 원주각의 성질과 정당화')

     ) AS u(title, sort_order, middle_title, readme_content)
         JOIN middle_inserts mid ON mid.title = u.middle_title;

-- 트랜잭션 커밋
COMMIT;


-- 트랜잭션 시작
BEGIN;

-- 성취기준 코드와 유닛 매핑을 통한 curriculums 업데이트
WITH curriculum_unit_mapping AS (
    SELECT
        unit_id,
        UNNEST(achievement_codes) AS achievement_code
    FROM (
             VALUES
                 -- 제곱근의 뜻과 성질
                 ((SELECT unit_id FROM units WHERE title = '제곱근의 뜻과 성질'), ARRAY['9수01-07']),

                 -- 무리수와 실수
                 ((SELECT unit_id FROM units WHERE title = '무리수와 실수'), ARRAY['9수01-08', '9수01-09']),

                 -- 근호를 포함한 식의 계산
                 ((SELECT unit_id FROM units WHERE title = '근호를 포함한 식의 계산'), ARRAY['9수01-10']),

                 -- 다항식의 곱셈과 인수분해
                 ((SELECT unit_id FROM units WHERE title = '다항식의 곱셈과 인수분해'), ARRAY['9수02-19']),

                 -- 이차방정식
                 ((SELECT unit_id FROM units WHERE title = '이차방정식'), ARRAY['9수02-20']),

                 -- 이차함수의 개념과 그래프
                 ((SELECT unit_id FROM units WHERE title = '이차함수의 개념과 그래프'), ARRAY['9수02-21', '9수02-22']),

                 -- 도형의 닮음
                 ((SELECT unit_id FROM units WHERE title = '도형의 닮음'), ARRAY['9수03-12', '9수03-13']),

                 -- 평행선과 선분의 비
                 ((SELECT unit_id FROM units WHERE title = '평행선과 선분의 비'), ARRAY['9수03-14']),

                 -- 삼각비
                 ((SELECT unit_id FROM units WHERE title = '삼각비'), ARRAY['9수03-16', '9수03-17']),

                 -- 원의 현과 접선
                 ((SELECT unit_id FROM units WHERE title = '원의 현과 접선'), ARRAY['9수03-18']),

                 -- 원주각의 성질
                 ((SELECT unit_id FROM units WHERE title = '원주각의 성질'), ARRAY['9수03-19'])

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