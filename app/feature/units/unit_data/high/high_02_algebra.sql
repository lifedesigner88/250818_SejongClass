-- 트랜잭션 시작
BEGIN;

-- 1. 대단원(majors) 삽입 및 ID 반환
WITH major_inserts AS (
    INSERT INTO majors (title, sort_order, is_published, textbook_id)
        VALUES
            ('지수함수와 로그함수', 1, true, 26), -- textbook_id는 고등학교 2학년 대수 교재 ID로 가정
            ('삼각함수', 2, true, 26),
            ('수열', 3, true, 26)
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
                       -- 지수함수와 로그함수의 중단원들
                       ('지수와 지수함수', 1, '지수함수와 로그함수'),
                       ('로그와 로그함수', 2, '지수함수와 로그함수'),
                       ('지수함수와 로그함수의 응용', 3, '지수함수와 로그함수'),

                       -- 삼각함수의 중단원들
                       ('일반각과 호도법', 1, '삼각함수'),
                       ('삼각함수의 성질과 그래프', 2, '삼각함수'),
                       ('삼각법칙', 3, '삼각함수'),

                       -- 수열의 중단원들
                       ('수열의 기초', 1, '수열'),
                       ('등차수열과 등비수열', 2, '수열'),
                       ('수열의 합과 귀납법', 3, '수열')
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
          -- 지수와 지수함수 - 소단원들
          ('거듭제곱과 거듭제곱근', 1, '지수와 지수함수', '성취기준: [12대수01-01] - 거듭제곱과 거듭제곱근의 뜻과 성질'),
          ('지수의 확장', 2, '지수와 지수함수', '성취기준: [12대수01-02] - 지수가 유리수, 실수까지 확장'),
          ('지수법칙', 3, '지수와 지수함수', '성취기준: [12대수01-03] - 지수법칙의 이해와 활용'),

          -- 로그와 로그함수 - 소단원들
          ('로그의 뜻과 성질', 1, '로그와 로그함수', '성취기준: [12대수01-04] - 로그의 뜻과 성질을 이용한 계산'),
          ('상용로그', 2, '로그와 로그함수', '성취기준: [12대수01-05] - 상용로그의 이해와 실생활 연결'),

          -- 지수함수와 로그함수의 응용 - 소단원들
          ('지수함수와 로그함수의 개념', 1, '지수함수와 로그함수의 응용', '성취기준: [12대수01-06] - 지수함수와 로그함수의 뜻'),
          ('지수함수와 로그함수의 그래프와 성질', 2, '지수함수와 로그함수의 응용', '성취기준: [12대수01-07] - 지수함수와 로그함수의 그래프와 성질'),
          ('지수함수와 로그함수의 활용', 3, '지수함수와 로그함수의 응용', '성취기준: [12대수01-08] - 지수함수와 로그함수를 활용한 문제 해결'),

          -- 일반각과 호도법 - 소단원들
          ('일반각과 호도법', 1, '일반각과 호도법', '성취기준: [12대수02-01] - 일반각과 호도법의 뜻과 관계'),

          -- 삼각함수의 성질과 그래프 - 소단원들
          ('삼각함수의 개념과 그래프', 1, '삼각함수의 성질과 그래프', '성취기준: [12대수02-02] - 삼각함수의 개념과 그래프, 성질'),

          -- 삼각법칙 - 소단원들
          ('사인법칙과 코사인법칙', 1, '삼각법칙', '성취기준: [12대수02-03] - 사인법칙과 코사인법칙의 이해와 실생활 문제 해결'),

          -- 수열의 기초 - 소단원들
          ('수열의 개념', 1, '수열의 기초', '성취기준: [12대수03-01] - 수열의 뜻'),

          -- 등차수열과 등비수열 - 소단원들
          ('등차수열', 1, '등차수열과 등비수열', '성취기준: [12대수03-02] - 등차수열의 뜻과 일반항, 합'),
          ('등비수열', 2, '등차수열과 등비수열', '성취기준: [12대수03-03] - 등비수열의 뜻과 일반항, 합'),

          -- 수열의 합과 귀납법 - 소단원들
          ('시그마와 수열의 합', 1, '수열의 합과 귀납법', '성취기준: [12대수03-04], [12대수03-05] - 시그마의 뜻과 성질, 수열의 합'),
          ('수열의 귀납적 정의', 2, '수열의 합과 귀납법', '성취기준: [12대수03-06] - 수열의 귀납적 정의'),
          ('수학적 귀납법', 3, '수열의 합과 귀납법', '성취기준: [12대수03-07] - 수학적 귀납법의 원리와 증명')

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
                 -- 거듭제곱과 거듭제곱근
                 ((SELECT unit_id FROM units WHERE title = '거듭제곱과 거듭제곱근'), ARRAY['12대수01-01']),

                 -- 지수의 확장
                 ((SELECT unit_id FROM units WHERE title = '지수의 확장'), ARRAY['12대수01-02']),

                 -- 지수법칙
                 ((SELECT unit_id FROM units WHERE title = '지수법칙'), ARRAY['12대수01-03']),

                 -- 로그의 뜻과 성질
                 ((SELECT unit_id FROM units WHERE title = '로그의 뜻과 성질'), ARRAY['12대수01-04']),

                 -- 상용로그
                 ((SELECT unit_id FROM units WHERE title = '상용로그'), ARRAY['12대수01-05']),

                 -- 지수함수와 로그함수의 개념
                 ((SELECT unit_id FROM units WHERE title = '지수함수와 로그함수의 개념'), ARRAY['12대수01-06']),

                 -- 지수함수와 로그함수의 그래프와 성질
                 ((SELECT unit_id FROM units WHERE title = '지수함수와 로그함수의 그래프와 성질'), ARRAY['12대수01-07']),

                 -- 지수함수와 로그함수의 활용
                 ((SELECT unit_id FROM units WHERE title = '지수함수와 로그함수의 활용'), ARRAY['12대수01-08']),

                 -- 일반각과 호도법
                 ((SELECT unit_id FROM units WHERE title = '일반각과 호도법'), ARRAY['12대수02-01']),

                 -- 삼각함수의 개념과 그래프
                 ((SELECT unit_id FROM units WHERE title = '삼각함수의 개념과 그래프'), ARRAY['12대수02-02']),

                 -- 사인법칙과 코사인법칙
                 ((SELECT unit_id FROM units WHERE title = '사인법칙과 코사인법칙'), ARRAY['12대수02-03']),

                 -- 수열의 개념
                 ((SELECT unit_id FROM units WHERE title = '수열의 개념'), ARRAY['12대수03-01']),

                 -- 등차수열
                 ((SELECT unit_id FROM units WHERE title = '등차수열'), ARRAY['12대수03-02']),

                 -- 등비수열
                 ((SELECT unit_id FROM units WHERE title = '등비수열'), ARRAY['12대수03-03']),

                 -- 시그마와 수열의 합
                 ((SELECT unit_id FROM units WHERE title = '시그마와 수열의 합'), ARRAY['12대수03-04', '12대수03-05']),

                 -- 수열의 귀납적 정의
                 ((SELECT unit_id FROM units WHERE title = '수열의 귀납적 정의'), ARRAY['12대수03-06']),

                 -- 수학적 귀납법
                 ((SELECT unit_id FROM units WHERE title = '수학적 귀납법'), ARRAY['12대수03-07'])

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
