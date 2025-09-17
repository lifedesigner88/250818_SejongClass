-- 트랜잭션 시작
BEGIN;

-- 1. 대단원(majors) 삽입 및 ID 반환
WITH major_inserts AS (
    INSERT INTO majors (title, sort_order, is_published, textbook_id)
        VALUES
            ('수열의 극한', 1, true, 29), -- textbook_id는 고등학교 3학년 미적분2 교재 ID로 가정
            ('미분법', 2, true, 29),
            ('적분법', 3, true, 29)
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
                       -- 수열의 극한의 중단원들
                       ('수열의 수렴과 발산', 1, '수열의 극한'),
                       ('급수', 2, '수열의 극한'),

                       -- 미분법의 중단원들
                       ('지수함수와 로그함수의 미분', 1, '미분법'),
                       ('삼각함수의 미분', 2, '미분법'),
                       ('고급 미분법', 3, '미분법'),
                       ('미분법의 응용', 4, '미분법'),

                       -- 적분법의 중단원들
                       ('다양한 함수의 적분', 1, '적분법'),
                       ('적분법의 기법', 2, '적분법'),
                       ('적분법의 응용', 3, '적분법')
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
          -- 수열의 수렴과 발산 - 소단원들
          ('수열의 수렴과 발산', 1, '수열의 수렴과 발산', '성취기준: [12미적Ⅱ-01-01] - 수열의 수렴, 발산의 뜻과 판정'),
          ('수열의 극한의 성질', 2, '수열의 수렴과 발산', '성취기준: [12미적Ⅱ-01-02] - 수열의 극한에 대한 성질과 극한값 계산'),
          ('등비수열의 극한', 3, '수열의 수렴과 발산', '성취기준: [12미적Ⅱ-01-03] - 등비수열의 수렴, 발산 판정과 극한값'),

          -- 급수 - 소단원들
          ('급수의 수렴과 발산', 1, '급수', '성취기준: [12미적Ⅱ-01-04] - 급수의 수렴, 발산의 뜻과 판정'),
          ('등비급수', 2, '급수', '성취기준: [12미적Ⅱ-01-05] - 등비급수의 합과 활용'),

          -- 지수함수와 로그함수의 미분 - 소단원들
          ('지수함수와 로그함수의 극한과 미분', 1, '지수함수와 로그함수의 미분', '성취기준: [12미적Ⅱ-02-01] - 지수함수와 로그함수의 극한과 미분'),

          -- 삼각함수의 미분 - 소단원들
          ('삼각함수의 덧셈정리', 1, '삼각함수의 미분', '성취기준: [12미적Ⅱ-02-02] - 삼각함수의 덧셈정리와 활용'),
          ('삼각함수의 극한과 미분', 2, '삼각함수의 미분', '성취기준: [12미적Ⅱ-02-03] - 삼각함수의 극한과 사인, 코사인함수의 미분'),

          -- 고급 미분법 - 소단원들
          ('함수의 몫의 미분법', 1, '고급 미분법', '성취기준: [12미적Ⅱ-02-04] - 함수의 몫을 미분'),
          ('합성함수의 미분법', 2, '고급 미분법', '성취기준: [12미적Ⅱ-02-05] - 합성함수의 미분'),
          ('매개변수 함수의 미분법', 3, '고급 미분법', '성취기준: [12미적Ⅱ-02-06] - 매개변수로 나타낸 함수의 미분'),
          ('음함수와 역함수의 미분법', 4, '고급 미분법', '성취기준: [12미적Ⅱ-02-07] - 음함수와 역함수의 미분'),

          -- 미분법의 응용 - 소단원들
          ('곡선의 접선의 방정식', 1, '미분법의 응용', '성취기준: [12미적Ⅱ-02-08] - 다양한 곡선의 접선의 방정식'),
          ('함수의 그래프 (고급)', 2, '미분법의 응용', '성취기준: [12미적Ⅱ-02-09] - 함수의 그래프의 개형'),
          ('방정식과 부등식 (고급)', 3, '미분법의 응용', '성취기준: [12미적Ⅱ-02-10] - 방정식과 부등식에 대한 문제 해결'),
          ('미분과 속도, 가속도 (고급)', 4, '미분법의 응용', '성취기준: [12미적Ⅱ-02-11] - 미분을 속도와 가속도에 활용'),

          -- 다양한 함수의 적분 - 소단원들
          ('다양한 함수의 부정적분과 정적분', 1, '다양한 함수의 적분', '성취기준: [12미적Ⅱ-03-01] - y=x^n, 지수함수, 삼각함수의 부정적분과 정적분'),

          -- 적분법의 기법 - 소단원들
          ('치환적분법', 1, '적분법의 기법', '성취기준: [12미적Ⅱ-03-02] - 치환적분법의 이해와 활용'),
          ('부분적분법', 2, '적분법의 기법', '성취기준: [12미적Ⅱ-03-03] - 부분적분법의 이해와 활용'),
          ('정적분과 급수의 관계', 3, '적분법의 기법', '성취기준: [12미적Ⅱ-03-04] - 정적분과 급수의 합 사이의 관계'),

          -- 적분법의 응용 - 소단원들
          ('넓이와 적분 (고급)', 1, '적분법의 응용', '성취기준: [12미적Ⅱ-03-05] - 곡선으로 둘러싸인 도형의 넓이'),
          ('입체도형의 부피', 2, '적분법의 응용', '성취기준: [12미적Ⅱ-03-06] - 입체도형의 부피에 대한 문제 해결'),
          ('적분과 속도, 거리 (고급)', 3, '적분법의 응용', '성취기준: [12미적Ⅱ-03-07] - 적분을 속도와 거리에 활용')

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
                 -- 수열의 수렴과 발산
                 ((SELECT unit_id FROM units WHERE title = '수열의 수렴과 발산'), ARRAY['12미적Ⅱ-01-01']),

                 -- 수열의 극한의 성질
                 ((SELECT unit_id FROM units WHERE title = '수열의 극한의 성질'), ARRAY['12미적Ⅱ-01-02']),

                 -- 등비수열의 극한
                 ((SELECT unit_id FROM units WHERE title = '등비수열의 극한'), ARRAY['12미적Ⅱ-01-03']),

                 -- 급수의 수렴과 발산
                 ((SELECT unit_id FROM units WHERE title = '급수의 수렴과 발산'), ARRAY['12미적Ⅱ-01-04']),

                 -- 등비급수
                 ((SELECT unit_id FROM units WHERE title = '등비급수'), ARRAY['12미적Ⅱ-01-05']),

                 -- 지수함수와 로그함수의 극한과 미분
                 ((SELECT unit_id FROM units WHERE title = '지수함수와 로그함수의 극한과 미분'), ARRAY['12미적Ⅱ-02-01']),

                 -- 삼각함수의 덧셈정리
                 ((SELECT unit_id FROM units WHERE title = '삼각함수의 덧셈정리'), ARRAY['12미적Ⅱ-02-02']),

                 -- 삼각함수의 극한과 미분
                 ((SELECT unit_id FROM units WHERE title = '삼각함수의 극한과 미분'), ARRAY['12미적Ⅱ-02-03']),

                 -- 함수의 몫의 미분법
                 ((SELECT unit_id FROM units WHERE title = '함수의 몫의 미분법'), ARRAY['12미적Ⅱ-02-04']),

                 -- 합성함수의 미분법
                 ((SELECT unit_id FROM units WHERE title = '합성함수의 미분법'), ARRAY['12미적Ⅱ-02-05']),

                 -- 매개변수 함수의 미분법
                 ((SELECT unit_id FROM units WHERE title = '매개변수 함수의 미분법'), ARRAY['12미적Ⅱ-02-06']),

                 -- 음함수와 역함수의 미분법
                 ((SELECT unit_id FROM units WHERE title = '음함수와 역함수의 미분법'), ARRAY['12미적Ⅱ-02-07']),

                 -- 곡선의 접선의 방정식
                 ((SELECT unit_id FROM units WHERE title = '곡선의 접선의 방정식'), ARRAY['12미적Ⅱ-02-08']),

                 -- 함수의 그래프 (고급)
                 ((SELECT unit_id FROM units WHERE title = '함수의 그래프 (고급)'), ARRAY['12미적Ⅱ-02-09']),

                 -- 방정식과 부등식 (고급)
                 ((SELECT unit_id FROM units WHERE title = '방정식과 부등식 (고급)'), ARRAY['12미적Ⅱ-02-10']),

                 -- 미분과 속도, 가속도 (고급)
                 ((SELECT unit_id FROM units WHERE title = '미분과 속도, 가속도 (고급)'), ARRAY['12미적Ⅱ-02-11']),

                 -- 다양한 함수의 부정적분과 정적분
                 ((SELECT unit_id FROM units WHERE title = '다양한 함수의 부정적분과 정적분'), ARRAY['12미적Ⅱ-03-01']),

                 -- 치환적분법
                 ((SELECT unit_id FROM units WHERE title = '치환적분법'), ARRAY['12미적Ⅱ-03-02']),

                 -- 부분적분법
                 ((SELECT unit_id FROM units WHERE title = '부분적분법'), ARRAY['12미적Ⅱ-03-03']),

                 -- 정적분과 급수의 관계
                 ((SELECT unit_id FROM units WHERE title = '정적분과 급수의 관계'), ARRAY['12미적Ⅱ-03-04']),

                 -- 넓이와 적분 (고급)
                 ((SELECT unit_id FROM units WHERE title = '넓이와 적분 (고급)'), ARRAY['12미적Ⅱ-03-05']),

                 -- 입체도형의 부피
                 ((SELECT unit_id FROM units WHERE title = '입체도형의 부피'), ARRAY['12미적Ⅱ-03-06']),

                 -- 적분과 속도, 거리 (고급)
                 ((SELECT unit_id FROM units WHERE title = '적분과 속도, 거리 (고급)'), ARRAY['12미적Ⅱ-03-07'])

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