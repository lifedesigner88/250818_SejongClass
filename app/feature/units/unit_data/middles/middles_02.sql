-- 트랜잭션 시작
BEGIN;

-- 1. 대단원(majors) 삽입 및 ID 반환
WITH major_inserts AS (
    INSERT INTO majors (title, sort_order, is_published, textbook_id)
        VALUES
            ('수와 연산', 1, true, 5), -- textbook_id는 중학교 2학년 교재 ID로 가정
            ('변화와 관계', 2, true, 5),
            ('도형과 측정', 3, true, 5)
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
                       ('수의 심화', 1, '수와 연산'),

                       -- 변화와 관계의 중단원들
                       ('식의 계산', 1, '변화와 관계'),
                       ('연립방정식과 함수', 2, '변화와 관계'),

                       -- 도형과 측정의 중단원들
                       ('삼각형과 사각형의 성질', 1, '도형과 측정'),
                       ('피타고라스 정리', 2, '도형과 측정')
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
          -- 수의 심화 - 소단원들
          ('순환소수와 유리수', 1, '수의 심화', '성취기준: [9수01-06] - 순환소수의 뜻과 유리수와 순환소수의 관계'),

          -- 식의 계산 - 소단원들
          ('지수법칙과 다항식', 1, '식의 계산', '성취기준: [9수02-08], [9수02-09], [9수02-10] - 지수법칙, 다항식의 덧셈과 뺄셈, 단항식과 다항식의 곱셈과 나눗셈'),
          ('일차부등식', 2, '식의 계산', '성취기준: [9수02-11], [9수02-12] - 부등식과 해의 뜻, 부등식의 성질, 일차부등식 풀이'),

          -- 연립방정식과 함수 - 소단원들
          ('연립일차방정식', 1, '연립방정식과 함수', '성취기준: [9수02-13] - 미지수가 2개인 연립일차방정식 풀이와 활용'),
          ('함수의 개념', 2, '연립방정식과 함수', '성취기준: [9수02-14] - 함수의 개념과 함숫값'),
          ('일차함수', 3, '연립방정식과 함수', '성취기준: [9수02-15], [9수02-16] - 일차함수의 개념과 그래프, 그래프의 성질'),
          ('일차함수와 방정식의 관계', 4, '연립방정식과 함수', '성취기준: [9수02-17], [9수02-18] - 일차함수와 일차방정식의 관계, 두 일차함수와 연립방정식의 관계'),

          -- 삼각형과 사각형의 성질 - 소단원들
          ('삼각형의 성질', 1, '삼각형과 사각형의 성질', '성취기준: [9수03-09], [9수03-10] - 이등변삼각형의 성질, 삼각형의 외심과 내심의 성질'),
          ('사각형의 성질', 2, '삼각형과 사각형의 성질', '성취기준: [9수03-11] - 사각형의 성질 이해와 정당화'),

          -- 피타고라스 정리 - 소단원들
          ('피타고라스 정리', 1, '피타고라스 정리', '성취기준: [9수03-15] - 피타고라스 정리의 이해와 정당화')

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
                 -- 순환소수와 유리수
                 ((SELECT unit_id FROM units WHERE title = '순환소수와 유리수'), ARRAY['9수01-06']),

                 -- 지수법칙과 다항식
                 ((SELECT unit_id FROM units WHERE title = '지수법칙과 다항식'), ARRAY['9수02-08', '9수02-09', '9수02-10']),

                 -- 일차부등식
                 ((SELECT unit_id FROM units WHERE title = '일차부등식'), ARRAY['9수02-11', '9수02-12']),

                 -- 연립일차방정식
                 ((SELECT unit_id FROM units WHERE title = '연립일차방정식'), ARRAY['9수02-13']),

                 -- 함수의 개념
                 ((SELECT unit_id FROM units WHERE title = '함수의 개념'), ARRAY['9수02-14']),

                 -- 일차함수
                 ((SELECT unit_id FROM units WHERE title = '일차함수'), ARRAY['9수02-15', '9수02-16']),

                 -- 일차함수와 방정식의 관계
                 ((SELECT unit_id FROM units WHERE title = '일차함수와 방정식의 관계'), ARRAY['9수02-17', '9수02-18']),

                 -- 삼각형의 성질
                 ((SELECT unit_id FROM units WHERE title = '삼각형의 성질'), ARRAY['9수03-09', '9수03-10']),

                 -- 사각형의 성질
                 ((SELECT unit_id FROM units WHERE title = '사각형의 성질'), ARRAY['9수03-11']),

                 -- 피타고라스 정리
                 ((SELECT unit_id FROM units WHERE title = '피타고라스 정리'), ARRAY['9수03-15'])

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