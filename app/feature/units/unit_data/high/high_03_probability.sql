-- 트랜잭션 시작
BEGIN;

-- 1. 대단원(majors) 삽입 및 ID 반환
WITH major_inserts AS (
    INSERT INTO majors (title, sort_order, is_published, textbook_id)
        VALUES
            ('경우의 수', 1, true, 28), -- textbook_id는 고등학교 3학년 확률과 통계 교재 ID로 가정
            ('확률', 2, true, 28),
            ('통계', 3, true, 28)
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
                       -- 경우의 수의 중단원들
                       ('순열과 조합의 확장', 1, '경우의 수'),
                       ('이항정리', 2, '경우의 수'),

                       -- 확률의 중단원들
                       ('확률의 기본 개념', 1, '확률'),
                       ('조건부확률과 독립', 2, '확률'),

                       -- 통계의 중단원들
                       ('확률분포', 1, '통계'),
                       ('통계적 추정', 2, '통계')
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
          -- 순열과 조합의 확장 - 소단원들
          ('중복순열과 같은 것이 있는 순열', 1, '순열과 조합의 확장', '성취기준: [12확통01-01] - 중복순열, 같은 것이 있는 순열의 이해와 계산'),
          ('중복조합', 2, '순열과 조합의 확장', '성취기준: [12확통01-02] - 중복조합의 이해와 중복조합의 수 계산'),

          -- 이항정리 - 소단원들
          ('이항정리', 1, '이항정리', '성취기준: [12확통01-03] - 이항정리의 이해와 활용'),

          -- 확률의 기본 개념 - 소단원들
          ('확률의 개념과 성질', 1, '확률의 기본 개념', '성취기준: [12확통02-01] - 확률의 개념과 기본 성질'),
          ('확률의 덧셈정리', 2, '확률의 기본 개념', '성취기준: [12확통02-02] - 확률의 덧셈정리와 활용'),
          ('여사건의 확률', 3, '확률의 기본 개념', '성취기준: [12확통02-03] - 여사건의 확률과 활용'),

          -- 조건부확률과 독립 - 소단원들
          ('조건부확률', 1, '조건부확률과 독립', '성취기준: [12확통02-04] - 조건부확률의 이해와 실생활 문제 해결'),
          ('사건의 독립과 종속', 2, '조건부확률과 독립', '성취기준: [12확통02-05] - 사건의 독립과 종속의 이해와 판단'),
          ('확률의 곱셈정리', 3, '조건부확률과 독립', '성취기준: [12확통02-06] - 확률의 곱셈정리와 활용'),

          -- 확률분포 - 소단원들
          ('확률변수와 확률분포', 1, '확률분포', '성취기준: [12확통03-01] - 확률변수와 확률분포의 뜻'),
          ('이산확률변수의 평균과 표준편차', 2, '확률분포', '성취기준: [12확통03-02] - 이산확률변수의 기댓값과 표준편차'),
          ('이항분포', 3, '확률분포', '성취기준: [12확통03-03] - 이항분포의 뜻과 성질, 평균과 표준편차'),
          ('정규분포', 4, '확률분포', '성취기준: [12확통03-04] - 정규분포의 뜻과 성질, 이항분포와의 관계'),

          -- 통계적 추정 - 소단원들
          ('모집단과 표본', 1, '통계적 추정', '성취기준: [12확통03-05] - 모집단과 표본의 뜻, 표본추출의 방법'),
          ('표본분포', 2, '통계적 추정', '성취기준: [12확통03-06] - 표본평균과 모평균, 표본비율과 모비율의 관계'),
          ('모평균과 모비율의 추정', 3, '통계적 추정', '성취기준: [12확통03-07] - 공학 도구를 이용한 모평균과 모비율의 추정')

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
                 -- 중복순열과 같은 것이 있는 순열
                 ((SELECT unit_id FROM units WHERE title = '중복순열과 같은 것이 있는 순열'), ARRAY['12확통01-01']),

                 -- 중복조합
                 ((SELECT unit_id FROM units WHERE title = '중복조합'), ARRAY['12확통01-02']),

                 -- 이항정리
                 ((SELECT unit_id FROM units WHERE title = '이항정리'), ARRAY['12확통01-03']),

                 -- 확률의 개념과 성질
                 ((SELECT unit_id FROM units WHERE title = '확률의 개념과 성질'), ARRAY['12확통02-01']),

                 -- 확률의 덧셈정리
                 ((SELECT unit_id FROM units WHERE title = '확률의 덧셈정리'), ARRAY['12확통02-02']),

                 -- 여사건의 확률
                 ((SELECT unit_id FROM units WHERE title = '여사건의 확률'), ARRAY['12확통02-03']),

                 -- 조건부확률
                 ((SELECT unit_id FROM units WHERE title = '조건부확률'), ARRAY['12확통02-04']),

                 -- 사건의 독립과 종속
                 ((SELECT unit_id FROM units WHERE title = '사건의 독립과 종속'), ARRAY['12확통02-05']),

                 -- 확률의 곱셈정리
                 ((SELECT unit_id FROM units WHERE title = '확률의 곱셈정리'), ARRAY['12확통02-06']),

                 -- 확률변수와 확률분포
                 ((SELECT unit_id FROM units WHERE title = '확률변수와 확률분포'), ARRAY['12확통03-01']),

                 -- 이산확률변수의 평균과 표준편차
                 ((SELECT unit_id FROM units WHERE title = '이산확률변수의 평균과 표준편차'), ARRAY['12확통03-02']),

                 -- 이항분포
                 ((SELECT unit_id FROM units WHERE title = '이항분포'), ARRAY['12확통03-03']),

                 -- 정규분포
                 ((SELECT unit_id FROM units WHERE title = '정규분포'), ARRAY['12확통03-04']),

                 -- 모집단과 표본
                 ((SELECT unit_id FROM units WHERE title = '모집단과 표본'), ARRAY['12확통03-05']),

                 -- 표본분포
                 ((SELECT unit_id FROM units WHERE title = '표본분포'), ARRAY['12확통03-06']),

                 -- 모평균과 모비율의 추정
                 ((SELECT unit_id FROM units WHERE title = '모평균과 모비율의 추정'), ARRAY['12확통03-07'])

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
