-- 트랜잭션 시작
BEGIN;

-- 1. 대단원(majors) 삽입 및 ID 반환
WITH major_inserts AS (
    INSERT INTO majors (title, sort_order, is_published, textbook_id)
        VALUES
            ('수와 연산', 1, true, 4), -- textbook_id는 중학교 1학년 교재 ID로 가정
            ('변화와 관계', 2, true, 4),
            ('도형과 측정', 3, true, 4)
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
                       ('수의 확장', 1, '수와 연산'),

                       -- 변화와 관계의 중단원들
                       ('문자와 식', 1, '변화와 관계'),
                       ('좌표와 그래프', 2, '변화와 관계'),

                       -- 도형과 측정의 중단원들
                       ('기본 도형과 작도', 1, '도형과 측정'),
                       ('평면도형과 입체도형', 2, '도형과 측정')
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
          -- 수의 확장 - 소단원들
          ('소인수분해', 1, '수의 확장', '성취기준: [9수01-01], [9수01-02] - 소인수분해의 뜻과 최대공약수, 최소공배수 구하기'),
          ('정수와 유리수', 2, '수의 확장', '성취기준: [9수01-03], [9수01-04], [9수01-05] - 음수의 필요성과 정수, 유리수의 개념 및 사칙계산'),

          -- 문자와 식 - 소단원들
          ('문자의 사용과 일차식', 1, '문자와 식', '성취기준: [9수02-01], [9수02-02] - 문자를 사용한 식의 유용성과 일차식의 덧셈, 뺄셈'),
          ('일차방정식', 2, '문자와 식', '성취기준: [9수02-03], [9수02-04] - 방정식과 해의 뜻, 등식의 성질, 일차방정식 풀이'),

          -- 좌표와 그래프 - 소단원들
          ('좌표평면', 1, '좌표와 그래프', '성취기준: [9수02-05] - 순서쌍과 좌표의 이해와 편리함'),
          ('그래프와 함수적 관계', 2, '좌표와 그래프', '성취기준: [9수02-06], [9수02-07] - 그래프 나타내기와 해석, 정비례와 반비례'),

          -- 기본 도형과 작도 - 소단원들
          ('점, 선, 면과 각', 1, '기본 도형과 작도', '성취기준: [9수03-01], [9수03-02] - 점, 선, 면, 각의 이해와 평행선의 성질'),
          ('삼각형의 작도와 합동', 2, '기본 도형과 작도', '성취기준: [9수03-03], [9수03-04] - 삼각형 작도와 합동 조건'),

          -- 평면도형과 입체도형 - 소단원들
          ('다각형의 성질', 1, '평면도형과 입체도형', '성취기준: [9수03-05] - 다각형의 성질 이해와 설명'),
          ('원과 부채꼴', 2, '평면도형과 입체도형', '성취기준: [9수03-06] - 부채꼴의 중심각과 호의 관계, 호의 길이와 넓이'),
          ('입체도형의 성질', 3, '평면도형과 입체도형', '성취기준: [9수03-07], [9수03-08] - 다면체와 회전체의 성질, 겉넓이와 부피')

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
                 -- 소인수분해
                 ((SELECT unit_id FROM units WHERE title = '소인수분해'), ARRAY['9수01-01', '9수01-02']),

                 -- 정수와 유리수
                 ((SELECT unit_id FROM units WHERE title = '정수와 유리수'), ARRAY['9수01-03', '9수01-04', '9수01-05']),

                 -- 문자의 사용과 일차식
                 ((SELECT unit_id FROM units WHERE title = '문자의 사용과 일차식'), ARRAY['9수02-01', '9수02-02']),

                 -- 일차방정식
                 ((SELECT unit_id FROM units WHERE title = '일차방정식'), ARRAY['9수02-03', '9수02-04']),

                 -- 좌표평면
                 ((SELECT unit_id FROM units WHERE title = '좌표평면'), ARRAY['9수02-05']),

                 -- 그래프와 함수적 관계
                 ((SELECT unit_id FROM units WHERE title = '그래프와 함수적 관계'), ARRAY['9수02-06', '9수02-07']),

                 -- 점, 선, 면과 각
                 ((SELECT unit_id FROM units WHERE title = '점, 선, 면과 각'), ARRAY['9수03-01', '9수03-02']),

                 -- 삼각형의 작도와 합동
                 ((SELECT unit_id FROM units WHERE title = '삼각형의 작도와 합동'), ARRAY['9수03-03', '9수03-04']),

                 -- 다각형의 성질
                 ((SELECT unit_id FROM units WHERE title = '다각형의 성질'), ARRAY['9수03-05']),

                 -- 원과 부채꼴
                 ((SELECT unit_id FROM units WHERE title = '원과 부채꼴'), ARRAY['9수03-06']),

                 -- 입체도형의 성질
                 ((SELECT unit_id FROM units WHERE title = '입체도형의 성질'), ARRAY['9수03-07', '9수03-08'])

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



-- 트랜잭션 시작
BEGIN;

-- 1. 대단원(majors) 삽입 및 ID 반환
WITH major_inserts AS (
    INSERT INTO majors (title, sort_order, is_published, textbook_id)
        VALUES
            ('자료와 가능성', 4, true, 4)
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
                       -- 자료와 가능성의 중단원들
                       ('자료의 정리', 1, '자료와 가능성')
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

          -- 자료의 정리 - 소단원들
          ('대푯값', 1, '자료의 정리', '성취기준: [9수04-01] - 중앙값과 최빈값의 뜻, 자료의 특성에 따른 적절한 대푯값 선택'),
          ('도수분포와 그래프', 2, '자료의 정리', '성취기준: [9수04-02] - 줄기와 잎 그림, 도수분포표, 히스토그램, 도수분포다각형')

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

                 -- 대푯값
                 ((SELECT unit_id FROM units WHERE title = '대푯값'), ARRAY['9수04-01']),

                 -- 도수분포와 그래프
                 ((SELECT unit_id FROM units WHERE title = '도수분포와 그래프'), ARRAY['9수04-02'])

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