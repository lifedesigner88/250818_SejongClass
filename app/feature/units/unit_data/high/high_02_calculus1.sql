
-- 트랜잭션 시작
BEGIN;

-- 1. 대단원(majors) 삽입 및 ID 반환
WITH major_inserts AS (
    INSERT INTO majors (title, sort_order, is_published, textbook_id)
        VALUES
            ('함수의 극한과 연속', 1, true, 27), -- textbook_id는 고등학교 2학년 미적분1 교재 ID로 가정
            ('미분', 2, true, 27),
            ('적분', 3, true, 27)
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
                       -- 함수의 극한과 연속의 중단원들
                       ('함수의 극한', 1, '함수의 극한과 연속'),
                       ('함수의 연속', 2, '함수의 극한과 연속'),

                       -- 미분의 중단원들
                       ('미분의 개념', 1, '미분'),
                       ('미분법', 2, '미분'),
                       ('미분의 응용', 3, '미분'),

                       -- 적분의 중단원들
                       ('부정적분', 1, '적분'),
                       ('정적분', 2, '적분'),
                       ('적분의 응용', 3, '적분')
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
          -- 함수의 극한 - 소단원들
          ('함수의 극한의 개념', 1, '함수의 극한', '성취기준: [12미적Ⅰ-01-01] - 함수의 극한의 뜻과 설명'),
          ('함수의 극한의 성질', 2, '함수의 극한', '성취기준: [12미적Ⅰ-01-02] - 함수의 극한에 대한 성질과 극한값 계산'),

          -- 함수의 연속 - 소단원들
          ('함수의 연속성', 1, '함수의 연속', '성취기준: [12미적Ⅰ-01-03] - 함수의 연속을 극한으로 탐구와 이해'),
          ('연속함수의 성질', 2, '함수의 연속', '성취기준: [12미적Ⅰ-01-04] - 연속함수의 성질과 활용'),

          -- 미분의 개념 - 소단원들
          ('미분계수', 1, '미분의 개념', '성취기준: [12미적Ⅰ-02-01] - 미분계수의 이해와 계산'),
          ('미분가능성과 연속성', 2, '미분의 개념', '성취기준: [12미적Ⅰ-02-02] - 함수의 미분가능성과 연속성의 관계'),

          -- 미분법 - 소단원들
          ('기본 함수의 도함수', 1, '미분법', '성취기준: [12미적Ⅰ-02-03] - 함수 y=x^n의 도함수'),
          ('미분의 공식', 2, '미분법', '성취기준: [12미적Ⅰ-02-04] - 함수의 실수배, 합, 차, 곱의 미분법과 다항함수의 도함수'),

          -- 미분의 응용 - 소단원들
          ('접선의 방정식', 1, '미분의 응용', '성취기준: [12미적Ⅰ-02-05] - 미분계수와 접선의 기울기, 접선의 방정식'),
          ('평균값 정리', 2, '미분의 응용', '성취기준: [12미적Ⅰ-02-06] - 함수에 대한 평균값 정리와 활용'),
          ('함수의 증가와 감소', 3, '미분의 응용', '성취기준: [12미적Ⅰ-02-07] - 함수의 증가와 감소, 극대와 극소'),
          ('함수의 그래프', 4, '미분의 응용', '성취기준: [12미적Ⅰ-02-08] - 함수의 그래프의 개형'),
          ('방정식과 부등식', 5, '미분의 응용', '성취기준: [12미적Ⅰ-02-09] - 방정식과 부등식에 대한 문제 해결'),
          ('미분과 속도, 가속도', 6, '미분의 응용', '성취기준: [12미적Ⅰ-02-10] - 미분을 속도와 가속도에 활용'),

          -- 부정적분 - 소단원들
          ('부정적분의 개념', 1, '부정적분', '성취기준: [12미적Ⅰ-03-01] - 부정적분의 뜻과 설명'),
          ('부정적분의 공식', 2, '부정적분', '성취기준: [12미적Ⅰ-03-02] - 함수의 실수배, 합, 차의 부정적분과 다항함수의 부정적분'),

          -- 정적분 - 소단원들
          ('정적분의 개념', 1, '정적분', '성취기준: [12미적Ⅰ-03-03] - 정적분의 개념 탐구와 성질 이해'),
          ('정적분의 계산', 2, '정적분', '성취기준: [12미적Ⅰ-03-04] - 부정적분과 정적분의 관계, 다항함수의 정적분'),

          -- 적분의 응용 - 소단원들
          ('넓이와 적분', 1, '적분의 응용', '성취기준: [12미적Ⅰ-03-05] - 곡선으로 둘러싸인 도형의 넓이'),
          ('적분과 속도, 거리', 2, '적분의 응용', '성취기준: [12미적Ⅰ-03-06] - 적분을 속도와 거리에 활용')

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
                 -- 함수의 극한의 개념
                 ((SELECT unit_id FROM units WHERE title = '함수의 극한의 개념'), ARRAY['12미적Ⅰ-01-01']),

                 -- 함수의 극한의 성질
                 ((SELECT unit_id FROM units WHERE title = '함수의 극한의 성질'), ARRAY['12미적Ⅰ-01-02']),

                 -- 함수의 연속성
                 ((SELECT unit_id FROM units WHERE title = '함수의 연속성'), ARRAY['12미적Ⅰ-01-03']),

                 -- 연속함수의 성질
                 ((SELECT unit_id FROM units WHERE title = '연속함수의 성질'), ARRAY['12미적Ⅰ-01-04']),

                 -- 미분계수
                 ((SELECT unit_id FROM units WHERE title = '미분계수'), ARRAY['12미적Ⅰ-02-01']),

                 -- 미분가능성과 연속성
                 ((SELECT unit_id FROM units WHERE title = '미분가능성과 연속성'), ARRAY['12미적Ⅰ-02-02']),

                 -- 기본 함수의 도함수
                 ((SELECT unit_id FROM units WHERE title = '기본 함수의 도함수'), ARRAY['12미적Ⅰ-02-03']),

                 -- 미분의 공식
                 ((SELECT unit_id FROM units WHERE title = '미분의 공식'), ARRAY['12미적Ⅰ-02-04']),

                 -- 접선의 방정식
                 ((SELECT unit_id FROM units WHERE title = '접선의 방정식'), ARRAY['12미적Ⅰ-02-05']),

                 -- 평균값 정리
                 ((SELECT unit_id FROM units WHERE title = '평균값 정리'), ARRAY['12미적Ⅰ-02-06']),

                 -- 함수의 증가와 감소
                 ((SELECT unit_id FROM units WHERE title = '함수의 증가와 감소'), ARRAY['12미적Ⅰ-02-07']),

                 -- 함수의 그래프
                 ((SELECT unit_id FROM units WHERE title = '함수의 그래프'), ARRAY['12미적Ⅰ-02-08']),

                 -- 방정식과 부등식
                 ((SELECT unit_id FROM units WHERE title = '방정식과 부등식'), ARRAY['12미적Ⅰ-02-09']),

                 -- 미분과 속도, 가속도
                 ((SELECT unit_id FROM units WHERE title = '미분과 속도, 가속도'), ARRAY['12미적Ⅰ-02-10']),

                 -- 부정적분의 개념
                 ((SELECT unit_id FROM units WHERE title = '부정적분의 개념'), ARRAY['12미적Ⅰ-03-01']),

                 -- 부정적분의 공식
                 ((SELECT unit_id FROM units WHERE title = '부정적분의 공식'), ARRAY['12미적Ⅰ-03-02']),

                 -- 정적분의 개념
                 ((SELECT unit_id FROM units WHERE title = '정적분의 개념'), ARRAY['12미적Ⅰ-03-03']),

                 -- 정적분의 계산
                 ((SELECT unit_id FROM units WHERE title = '정적분의 계산'), ARRAY['12미적Ⅰ-03-04']),

                 -- 넓이와 적분
                 ((SELECT unit_id FROM units WHERE title = '넓이와 적분'), ARRAY['12미적Ⅰ-03-05']),

                 -- 적분과 속도, 거리
                 ((SELECT unit_id FROM units WHERE title = '적분과 속도, 거리'), ARRAY['12미적Ⅰ-03-06'])

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