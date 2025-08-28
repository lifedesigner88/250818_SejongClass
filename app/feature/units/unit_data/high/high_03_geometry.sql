
-- 트랜잭션 시작
BEGIN;

-- 1. 대단원(majors) 삽입 및 ID 반환
WITH major_inserts AS (
    INSERT INTO majors (title, sort_order, is_published, textbook_id)
        VALUES
            ('이차곡선', 1, true, 13), -- textbook_id는 고등학교 3학년 기하 교재 ID로 가정
            ('공간도형과 공간좌표', 2, true, 13),
            ('벡터', 3, true, 13)
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
                       -- 이차곡선의 중단원들
                       ('원뿔곡선', 1, '이차곡선'),
                       ('이차곡선의 성질', 2, '이차곡선'),

                       -- 공간도형과 공간좌표의 중단원들
                       ('공간에서의 직선과 평면', 1, '공간도형과 공간좌표'),
                       ('공간좌표', 2, '공간도형과 공간좌표'),

                       -- 벡터의 중단원들
                       ('벡터의 연산', 1, '벡터'),
                       ('벡터의 응용', 2, '벡터')
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
          -- 원뿔곡선 - 소단원들
          ('포물선', 1, '원뿔곡선', '성취기준: [12기하01-01] - 포물선의 뜻과 방정식 표현'),
          ('타원', 2, '원뿔곡선', '성취기준: [12기하01-02] - 타원의 뜻과 방정식 표현'),
          ('쌍곡선', 3, '원뿔곡선', '성취기준: [12기하01-03] - 쌍곡선의 뜻과 방정식 표현'),

          -- 이차곡선의 성질 - 소단원들
          ('이차곡선의 접선', 1, '이차곡선의 성질', '성취기준: [12기하01-04] - 이차곡선의 접선의 방정식'),

          -- 공간에서의 직선과 평면 - 소단원들
          ('공간에서의 위치 관계', 1, '공간에서의 직선과 평면', '성취기준: [12기하02-01] - 직선과 직선, 직선과 평면, 평면과 평면의 위치 관계'),
          ('삼수선 정리', 2, '공간에서의 직선과 평면', '성취기준: [12기하02-02] - 삼수선 정리의 이해와 활용'),
          ('정사영', 3, '공간에서의 직선과 평면', '성취기준: [12기하02-03] - 도형의 정사영과 도형과 정사영의 관계'),

          -- 공간좌표 - 소단원들
          ('공간좌표계', 1, '공간좌표', '성취기준: [12기하02-04] - 좌표공간에서 두 점 사이의 거리와 선분의 내분점'),
          ('구의 방정식', 2, '공간좌표', '성취기준: [12기하02-05] - 구를 방정식으로 표현'),

          -- 벡터의 연산 - 소단원들
          ('벡터의 기본 개념', 1, '벡터의 연산', '성취기준: [12기하03-01] - 벡터의 뜻과 벡터의 덧셈, 뺄셈, 실수배'),
          ('위치벡터와 좌표', 2, '벡터의 연산', '성취기준: [12기하03-02] - 위치벡터의 뜻과 벡터와 좌표의 대응'),
          ('벡터의 내적', 3, '벡터의 연산', '성취기준: [12기하03-03] - 내적의 뜻과 두 벡터의 내적'),

          -- 벡터의 응용 - 소단원들
          ('벡터와 직선의 방정식', 1, '벡터의 응용', '성취기준: [12기하03-04] - 벡터를 이용한 직선의 방정식'),
          ('벡터와 평면의 방정식', 2, '벡터의 응용', '성취기준: [12기하03-05] - 좌표공간에서 벡터를 이용한 평면과 구의 방정식')

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
                 -- 포물선
                 ((SELECT unit_id FROM units WHERE title = '포물선'), ARRAY['12기하01-01']),

                 -- 타원
                 ((SELECT unit_id FROM units WHERE title = '타원'), ARRAY['12기하01-02']),

                 -- 쌍곡선
                 ((SELECT unit_id FROM units WHERE title = '쌍곡선'), ARRAY['12기하01-03']),

                 -- 이차곡선의 접선
                 ((SELECT unit_id FROM units WHERE title = '이차곡선의 접선'), ARRAY['12기하01-04']),

                 -- 공간에서의 위치 관계
                 ((SELECT unit_id FROM units WHERE title = '공간에서의 위치 관계'), ARRAY['12기하02-01']),

                 -- 삼수선 정리
                 ((SELECT unit_id FROM units WHERE title = '삼수선 정리'), ARRAY['12기하02-02']),

                 -- 정사영
                 ((SELECT unit_id FROM units WHERE title = '정사영'), ARRAY['12기하02-03']),

                 -- 공간좌표계
                 ((SELECT unit_id FROM units WHERE title = '공간좌표계'), ARRAY['12기하02-04']),

                 -- 구의 방정식
                 ((SELECT unit_id FROM units WHERE title = '구의 방정식'), ARRAY['12기하02-05']),

                 -- 벡터의 기본 개념
                 ((SELECT unit_id FROM units WHERE title = '벡터의 기본 개념'), ARRAY['12기하03-01']),

                 -- 위치벡터와 좌표
                 ((SELECT unit_id FROM units WHERE title = '위치벡터와 좌표'), ARRAY['12기하03-02']),

                 -- 벡터의 내적
                 ((SELECT unit_id FROM units WHERE title = '벡터의 내적'), ARRAY['12기하03-03']),

                 -- 벡터와 직선의 방정식
                 ((SELECT unit_id FROM units WHERE title = '벡터와 직선의 방정식'), ARRAY['12기하03-04']),

                 -- 벡터와 평면의 방정식
                 ((SELECT unit_id FROM units WHERE title = '벡터와 평면의 방정식'), ARRAY['12기하03-05'])

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