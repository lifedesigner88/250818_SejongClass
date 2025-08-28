
-- 트랜잭션 시작
BEGIN;

-- 1. 대단원(majors) 삽입 및 ID 반환
WITH major_inserts AS (
    INSERT INTO majors (title, sort_order, is_published, textbook_id)
        VALUES
            ('다항식', 1, true, 7), -- textbook_id는 고등학교 1학년 공통수학 교재 ID로 가정
            ('방정식과 부등식', 2, true, 7),
            ('경우의 수', 3, true, 7),
            ('행렬', 4, true, 7)
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
                       -- 다항식의 중단원들
                       ('다항식의 사칙연산', 1, '다항식'),
                       ('나머지정리와 인수분해', 2, '다항식'),

                       -- 방정식과 부등식의 중단원들
                       ('복소수와 이차방정식', 1, '방정식과 부등식'),
                       ('이차함수와 방정식', 2, '방정식과 부등식'),
                       ('고차방정식과 연립방정식', 3, '방정식과 부등식'),
                       ('부등식', 4, '방정식과 부등식'),

                       -- 경우의 수의 중단원들
                       ('경우의 수', 1, '경우의 수'),
                       ('순열과 조합', 2, '경우의 수'),

                       -- 행렬의 중단원들
                       ('행렬의 개념과 연산', 1, '행렬')
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
          -- 다항식의 사칙연산 - 소단원들
          ('다항식의 사칙연산', 1, '다항식의 사칙연산', '성취기준: [10공수1-01-01] - 다항식의 사칙연산 원리와 계산'),

          -- 나머지정리와 인수분해 - 소단원들
          ('항등식과 나머지정리', 1, '나머지정리와 인수분해', '성취기준: [10공수1-01-02] - 항등식의 성질과 나머지정리'),
          ('다항식의 인수분해', 2, '나머지정리와 인수분해', '성취기준: [10공수1-01-03] - 다항식의 인수분해'),

          -- 복소수와 이차방정식 - 소단원들
          ('복소수', 1, '복소수와 이차방정식', '성취기준: [10공수1-02-01] - 복소수의 뜻과 성질, 사칙연산'),
          ('이차방정식의 근', 2, '복소수와 이차방정식', '성취기준: [10공수1-02-02], [10공수1-02-03] - 이차방정식의 실근과 허근, 근과 계수의 관계'),

          -- 이차함수와 방정식 - 소단원들
          ('이차방정식과 이차함수', 1, '이차함수와 방정식', '성취기준: [10공수1-02-04] - 이차방정식과 이차함수의 관계'),
          ('이차함수와 직선', 2, '이차함수와 방정식', '성취기준: [10공수1-02-05] - 이차함수의 그래프와 직선의 위치 관계'),
          ('이차함수의 최대최소', 3, '이차함수와 방정식', '성취기준: [10공수1-02-06] - 이차함수의 최대, 최소와 실생활 활용'),

          -- 고차방정식과 연립방정식 - 소단원들
          ('삼차방정식과 사차방정식', 1, '고차방정식과 연립방정식', '성취기준: [10공수1-02-07] - 간단한 삼차방정식과 사차방정식'),
          ('연립이차방정식', 2, '고차방정식과 연립방정식', '성취기준: [10공수1-02-08] - 미지수가 2개인 연립이차방정식'),

          -- 부등식 - 소단원들
          ('연립일차부등식', 1, '부등식', '성취기준: [10공수1-02-09] - 미지수가 1개인 연립일차부등식'),
          ('절댓값 부등식', 2, '부등식', '성취기준: [10공수1-02-10] - 절댓값을 포함한 일차부등식'),
          ('이차부등식', 3, '부등식', '성취기준: [10공수1-02-11] - 이차부등식과 이차함수의 관계, 연립이차부등식'),

          -- 경우의 수 - 소단원들
          ('합의 법칙과 곱의 법칙', 1, '경우의 수', '성취기준: [10공수1-03-01] - 합의 법칙과 곱의 법칙, 경우의 수 문제 해결'),

          -- 순열과 조합 - 소단원들
          ('순열', 1, '순열과 조합', '성취기준: [10공수1-03-02] - 순열의 개념과 순열의 수'),
          ('조합', 2, '순열과 조합', '성취기준: [10공수1-03-03] - 조합의 개념과 조합의 수'),

          -- 행렬의 개념과 연산 - 소단원들
          ('행렬의 개념', 1, '행렬의 개념과 연산', '성취기준: [10공수1-04-01] - 행렬의 뜻과 실생활 표현'),
          ('행렬의 연산', 2, '행렬의 개념과 연산', '성취기준: [10공수1-04-02] - 행렬의 연산과 문제 해결')

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
                 -- 다항식의 사칙연산
                 ((SELECT unit_id FROM units WHERE title = '다항식의 사칙연산'), ARRAY['10공수1-01-01']),

                 -- 항등식과 나머지정리
                 ((SELECT unit_id FROM units WHERE title = '항등식과 나머지정리'), ARRAY['10공수1-01-02']),

                 -- 다항식의 인수분해
                 ((SELECT unit_id FROM units WHERE title = '다항식의 인수분해'), ARRAY['10공수1-01-03']),

                 -- 복소수
                 ((SELECT unit_id FROM units WHERE title = '복소수'), ARRAY['10공수1-02-01']),

                 -- 이차방정식의 근
                 ((SELECT unit_id FROM units WHERE title = '이차방정식의 근'), ARRAY['10공수1-02-02', '10공수1-02-03']),

                 -- 이차방정식과 이차함수
                 ((SELECT unit_id FROM units WHERE title = '이차방정식과 이차함수'), ARRAY['10공수1-02-04']),

                 -- 이차함수와 직선
                 ((SELECT unit_id FROM units WHERE title = '이차함수와 직선'), ARRAY['10공수1-02-05']),

                 -- 이차함수의 최대최소
                 ((SELECT unit_id FROM units WHERE title = '이차함수의 최대최소'), ARRAY['10공수1-02-06']),

                 -- 삼차방정식과 사차방정식
                 ((SELECT unit_id FROM units WHERE title = '삼차방정식과 사차방정식'), ARRAY['10공수1-02-07']),

                 -- 연립이차방정식
                 ((SELECT unit_id FROM units WHERE title = '연립이차방정식'), ARRAY['10공수1-02-08']),

                 -- 연립일차부등식
                 ((SELECT unit_id FROM units WHERE title = '연립일차부등식'), ARRAY['10공수1-02-09']),

                 -- 절댓값 부등식
                 ((SELECT unit_id FROM units WHERE title = '절댓값 부등식'), ARRAY['10공수1-02-10']),

                 -- 이차부등식
                 ((SELECT unit_id FROM units WHERE title = '이차부등식'), ARRAY['10공수1-02-11']),

                 -- 합의 법칙과 곱의 법칙
                 ((SELECT unit_id FROM units WHERE title = '합의 법칙과 곱의 법칙'), ARRAY['10공수1-03-01']),

                 -- 순열
                 ((SELECT unit_id FROM units WHERE title = '순열'), ARRAY['10공수1-03-02']),

                 -- 조합
                 ((SELECT unit_id FROM units WHERE title = '조합'), ARRAY['10공수1-03-03']),

                 -- 행렬의 개념
                 ((SELECT unit_id FROM units WHERE title = '행렬의 개념'), ARRAY['10공수1-04-01']),

                 -- 행렬의 연산
                 ((SELECT unit_id FROM units WHERE title = '행렬의 연산'), ARRAY['10공수1-04-02'])

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