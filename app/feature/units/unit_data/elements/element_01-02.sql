-- 트랜잭션 시작
BEGIN;

-- 1. 대단원(majors) 삽입 및 ID 반환
WITH major_inserts AS (
    INSERT INTO majors (title, sort_order, is_published, textbook_id)
        VALUES
            ('수와 연산', 1, true, 18), -- textbook_id는 기존에 있는 초등수학 교재 ID로 가정
            ('변화와 관계', 2, true, 18),
            ('도형과 측정', 3, true, 18),
            ('자료와 가능성', 4, true, 18)
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
                       ('수의 이해와 표현', 1, '수와 연산'),
                       ('기본 연산', 2, '수와 연산'),

                       -- 변화와 관계의 중단원들
                       ('규칙과 패턴', 1, '변화와 관계'),

                       -- 도형과 측정의 중단원들
                       ('도형의 탐구', 1, '도형과 측정'),
                       ('양과 측정', 2, '도형과 측정'),

                       -- 자료와 가능성의 중단원들
                       ('자료 정리와 해석', 1, '자료와 가능성')
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
          -- 수의 이해와 표현 - 소단원들
          ('기초 수 개념', 1, '수의 이해와 표현', '성취기준: [2수01-01], [2수01-04] - 수의 필요성과 0~100까지 수 개념, 수 분해와 합성으로 수감각 기르기'),
          ('자릿값과 큰 수', 2, '수의 이해와 표현', '성취기준: [2수01-02], [2수01-03] - 자릿값 이해, 네 자리 수 읽기/쓰기, 수의 크기 비교'),

          -- 기본 연산 - 소단원들
          ('덧셈과 뺄셈', 1, '기본 연산', '성취기준: [2수01-05], [2수01-06], [2수01-07], [2수01-08], [2수01-09] - 실생활과 연결한 덧셈과 뺄셈의 의미, 계산 원리, 상호 관계 등'),
          ('곱셈의 기초', 2, '기본 연산', '성취기준: [2수01-10], [2수01-11] - 실생활과 연결한 곱셈의 의미, 곱셈구구'),

          -- 규칙과 패턴 - 소단원들
          ('규칙 찾기와 만들기', 1, '규칙과 패턴', '성취기준: [2수02-01], [2수02-02] - 물체, 무늬, 수 등의 배열에서 규칙 찾고 표현하기'),

          -- 도형의 탐구 - 소단원들
          ('입체도형', 1, '도형의 탐구', '성취기준: [2수03-01], [2수03-02] - 직육면체, 원기둥, 구 모양 찾고 만들기'),
          ('평면도형', 2, '도형의 탐구', '성취기준: [2수03-03], [2수03-04], [2수03-05] - 삼각형, 사각형, 원 모양 찾고 만들기'),

          -- 양과 측정 - 소단원들
          ('비교와 측정 기초', 1, '양과 측정', '성취기준: [2수03-06], [2수03-12] - 길이, 들이, 무게, 넓이 비교하여 구별하기'),
          ('시각과 시간', 2, '양과 측정', '성취기준: [2수03-07], [2수03-08], [2수03-09] - 시계 보고 시각 읽기, 시간 단위 관계'),
          ('길이 측정', 3, '양과 측정', '성취기준: [2수03-10], [2수03-11], [2수03-13] - 길이 단위 cm와 m 이해하고 측정하기'),

          -- 자료 정리와 해석 - 소단원들
          ('자료의 분류와 표현', 1, '자료 정리와 해석', '성취기준: [2수04-01], [2수04-02], [2수04-03] - 기준에 따른 분류와 개수 세기, 표와 그래프로 나타내기')

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
                 -- 기초 수 개념
                 ((SELECT unit_id FROM units WHERE title = '기초 수 개념'), ARRAY['2수01-01', '2수01-04']),

                 -- 자릿값과 큰 수
                 ((SELECT unit_id FROM units WHERE title = '자릿값과 큰 수'), ARRAY['2수01-02', '2수01-03']),

                 -- 덧셈과 뺄셈
                 ((SELECT unit_id FROM units WHERE title = '덧셈과 뺄셈'), ARRAY['2수01-05', '2수01-06', '2수01-07', '2수01-08', '2수01-09']),

                 -- 곱셈의 기초
                 ((SELECT unit_id FROM units WHERE title = '곱셈의 기초'), ARRAY['2수01-10', '2수01-11']),

                 -- 규칙 찾기와 만들기
                 ((SELECT unit_id FROM units WHERE title = '규칙 찾기와 만들기'), ARRAY['2수02-01', '2수02-02']),

                 -- 입체도형
                 ((SELECT unit_id FROM units WHERE title = '입체도형'), ARRAY['2수03-01', '2수03-02']),

                 -- 평면도형
                 ((SELECT unit_id FROM units WHERE title = '평면도형'), ARRAY['2수03-03', '2수03-04', '2수03-05']),

                 -- 비교와 측정 기초
                 ((SELECT unit_id FROM units WHERE title = '비교와 측정 기초'), ARRAY['2수03-06', '2수03-12']),

                 -- 시각과 시간
                 ((SELECT unit_id FROM units WHERE title = '시각과 시간'), ARRAY['2수03-07', '2수03-08', '2수03-09']),

                 -- 길이 측정
                 ((SELECT unit_id FROM units WHERE title = '길이 측정'), ARRAY['2수03-10', '2수03-11', '2수03-13']),

                 -- 자료의 분류와 표현
                 ((SELECT unit_id FROM units WHERE title = '자료의 분류와 표현'), ARRAY['2수04-01', '2수04-02', '2수04-03'])

         ) AS mapping(unit_id, achievement_codes)
)

-- curriculums 테이블 업데이트 (구조에 따라 조정 필요)
UPDATE curriculums
SET
    unit_id = cum.unit_id
FROM curriculum_unit_mapping cum
WHERE curriculums.code = cum.achievement_code;

-- 트랜잭션 커밋
COMMIT;
