-- 트랜잭션 시작
BEGIN;

-- 1. 대단원(majors) 삽입 및 ID 반환
WITH major_inserts AS (
    INSERT INTO majors (title, sort_order, is_published, textbook_id)
        VALUES
            ('도형의 방정식', 1, true, 25), -- textbook_id는 고등학교 1학년 공통수학2 교재 ID로 가정
            ('집합과 명제', 2, true, 25),
            ('함수와 그래프', 3, true, 25)
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
                       -- 도형의 방정식의 중단원들
                       ('점과 직선', 1, '도형의 방정식'),
                       ('원의 방정식', 2, '도형의 방정식'),
                       ('도형의 이동', 3, '도형의 방정식'),

                       -- 집합과 명제의 중단원들
                       ('집합', 1, '집합과 명제'),
                       ('명제와 증명', 2, '집합과 명제'),

                       -- 함수와 그래프의 중단원들
                       ('함수의 개념과 성질', 1, '함수와 그래프'),
                       ('특수한 함수', 2, '함수와 그래프')
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
          -- 점과 직선 - 소단원들
          ('선분의 내분과 외분', 1, '점과 직선', '성취기준: [10공수2-01-01] - 선분의 내분 이해와 내분점의 좌표 계산'),
          ('직선의 기울기와 방정식', 2, '점과 직선', '성취기준: [10공수2-01-02] - 두 직선의 평행 조건과 수직 조건'),
          ('점과 직선 사이의 거리', 3, '점과 직선', '성취기준: [10공수2-01-03] - 점과 직선 사이의 거리와 문제 해결'),

          -- 원의 방정식 - 소단원들
          ('원의 방정식', 1, '원의 방정식', '성취기준: [10공수2-01-04] - 원의 방정식과 그래프'),
          ('원과 직선의 위치 관계', 2, '원의 방정식', '성취기준: [10공수2-01-05] - 좌표평면에서 원과 직선의 위치 관계'),

          -- 도형의 이동 - 소단원들
          ('평행이동', 1, '도형의 이동', '성취기준: [10공수2-01-06] - 평행이동의 탐구와 실생활 연결'),
          ('대칭이동', 2, '도형의 이동', '성취기준: [10공수2-01-07] - 원점, x축, y축, 직선 y=x에 대한 대칭이동'),

          -- 집합 - 소단원들
          ('집합의 개념과 표현', 1, '집합', '성취기준: [10공수2-02-01] - 집합의 개념과 표현'),
          ('집합 사이의 관계', 2, '집합', '성취기준: [10공수2-02-02] - 두 집합 사이의 포함관계'),
          ('집합의 연산', 3, '집합', '성취기준: [10공수2-02-03] - 집합의 연산과 벤 다이어그램'),

          -- 명제와 증명 - 소단원들
          ('명제와 조건', 1, '명제와 증명', '성취기준: [10공수2-02-04] - 명제와 조건의 뜻, 전칭과 존재 명제'),
          ('명제의 역과 대우', 2, '명제와 증명', '성취기준: [10공수2-02-05] - 명제의 역과 대우'),
          ('조건의 관계', 3, '명제와 증명', '성취기준: [10공수2-02-06] - 충분조건과 필요조건'),
          ('증명법', 4, '명제와 증명', '성취기준: [10공수2-02-07] - 대우를 이용한 증명법과 귀류법'),
          ('절대부등식', 5, '명제와 증명', '성취기준: [10공수2-02-08] - 절대부등식의 뜻과 증명'),

          -- 함수의 개념과 성질 - 소단원들
          ('함수의 개념(2)', 1, '함수의 개념과 성질', '성취기준: [10공수2-03-01] - 함수의 개념과 그래프'),
          ('합성함수', 2, '함수의 개념과 성질', '성취기준: [10공수2-03-02] - 함수의 합성과 합성함수'),
          ('역함수', 3, '함수의 개념과 성질', '성취기준: [10공수2-03-03] - 역함수의 개념과 역함수 구하기'),

          -- 특수한 함수 - 소단원들
          ('유리함수', 1, '특수한 함수', '성취기준: [10공수2-03-04] - 유리함수의 그래프와 성질'),
          ('무리함수', 2, '특수한 함수', '성취기준: [10공수2-03-05] - 무리함수의 그래프와 성질')

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
                 -- 선분의 내분과 외분
                 ((SELECT unit_id FROM units WHERE title = '선분의 내분과 외분'), ARRAY['10공수2-01-01']),

                 -- 직선의 기울기와 방정식
                 ((SELECT unit_id FROM units WHERE title = '직선의 기울기와 방정식'), ARRAY['10공수2-01-02']),

                 -- 점과 직선 사이의 거리
                 ((SELECT unit_id FROM units WHERE title = '점과 직선 사이의 거리'), ARRAY['10공수2-01-03']),

                 -- 원의 방정식
                 ((SELECT unit_id FROM units WHERE title = '원의 방정식'), ARRAY['10공수2-01-04']),

                 -- 원과 직선의 위치 관계
                 ((SELECT unit_id FROM units WHERE title = '원과 직선의 위치 관계'), ARRAY['10공수2-01-05']),

                 -- 평행이동
                 ((SELECT unit_id FROM units WHERE title = '평행이동'), ARRAY['10공수2-01-06']),

                 -- 대칭이동
                 ((SELECT unit_id FROM units WHERE title = '대칭이동'), ARRAY['10공수2-01-07']),

                 -- 집합의 개념과 표현
                 ((SELECT unit_id FROM units WHERE title = '집합의 개념과 표현'), ARRAY['10공수2-02-01']),

                 -- 집합 사이의 관계
                 ((SELECT unit_id FROM units WHERE title = '집합 사이의 관계'), ARRAY['10공수2-02-02']),

                 -- 집합의 연산
                 ((SELECT unit_id FROM units WHERE title = '집합의 연산'), ARRAY['10공수2-02-03']),

                 -- 명제와 조건
                 ((SELECT unit_id FROM units WHERE title = '명제와 조건'), ARRAY['10공수2-02-04']),

                 -- 명제의 역과 대우
                 ((SELECT unit_id FROM units WHERE title = '명제의 역과 대우'), ARRAY['10공수2-02-05']),

                 -- 조건의 관계
                 ((SELECT unit_id FROM units WHERE title = '조건의 관계'), ARRAY['10공수2-02-06']),

                 -- 증명법
                 ((SELECT unit_id FROM units WHERE title = '증명법'), ARRAY['10공수2-02-07']),

                 -- 절대부등식
                 ((SELECT unit_id FROM units WHERE title = '절대부등식'), ARRAY['10공수2-02-08']),

                 -- 함수의 개념
                 ((SELECT unit_id FROM units WHERE title = '함수의 개념(2)'), ARRAY['10공수2-03-01']),

                 -- 합성함수
                 ((SELECT unit_id FROM units WHERE title = '합성함수'), ARRAY['10공수2-03-02']),

                 -- 역함수
                 ((SELECT unit_id FROM units WHERE title = '역함수'), ARRAY['10공수2-03-03']),

                 -- 유리함수
                 ((SELECT unit_id FROM units WHERE title = '유리함수'), ARRAY['10공수2-03-04']),

                 -- 무리함수
                 ((SELECT unit_id FROM units WHERE title = '무리함수'), ARRAY['10공수2-03-05'])

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