-- 트랜잭션 시작
BEGIN;

-- 1. 대단원(majors) 삽입 및 ID 반환
WITH major_inserts AS (
    INSERT INTO majors (title, sort_order, is_published, textbook_id)
        VALUES
            ('수와 연산', 1, true, 20), -- textbook_id는 초등학교 5-6학년 교재 ID로 가정
            ('변화와 관계', 2, true, 20),
            ('도형과 측정', 3, true, 20),
            ('자료와 가능성', 4, true, 20)
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
                       ('자연수 연산의 심화', 1, '수와 연산'),
                       ('분수의 완성', 2, '수와 연산'),
                       ('소수의 완성', 3, '수와 연산'),

                       -- 변화와 관계의 중단원들
                       ('함수적 관계', 1, '변화와 관계'),
                       ('비와 비율', 2, '변화와 관계'),

                       -- 도형과 측정의 중단원들
                       ('도형의 성질', 1, '도형과 측정'),
                       ('입체도형의 체계', 2, '도형과 측정'),
                       ('넓이와 부피', 3, '도형과 측정'),

                       -- 자료와 가능성의 중단원들
                       ('통계와 확률', 1, '자료와 가능성')
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
          -- 자연수 연산의 심화 - 소단원들
          ('혼합 계산과 어림', 1, '자연수 연산의 심화', '성취기준: [6수01-01], [6수01-02], [6수01-03] - 사칙연산 혼합 계산, 수의 범위, 올림/버림/반올림'),
          ('약수와 배수', 2, '자연수 연산의 심화', '성취기준: [6수01-04], [6수01-05] - 약수와 공약수, 최대공약수, 배수와 공배수, 최소공배수'),

          -- 분수의 완성 - 소단원들
          ('분수의 기본 연산', 1, '분수의 완성', '성취기준: [6수01-06], [6수01-07], [6수01-08] - 약분과 통분, 분수 크기 비교, 분모가 다른 분수의 덧셈과 뺄셈'),
          ('분수의 곱셈과 나눗셈', 2, '분수의 완성', '성취기준: [6수01-09], [6수01-10], [6수01-11] - 분수의 곱셈과 나눗셈 계산 원리'),

          -- 소수의 완성 - 소단원들
          ('분수와 소수의 관계', 1, '소수의 완성', '성취기준: [6수01-12] - 분수와 소수의 관계와 크기 비교'),
          ('소수의 곱셈과 나눗셈', 2, '소수의 완성', '성취기준: [6수01-13], [6수01-14], [6수01-15] - 소수의 곱셈과 나눗셈 계산 원리'),

          -- 함수적 관계 - 소단원들
          ('대응 관계', 1, '함수적 관계', '성취기준: [6수02-01] - 한 양의 변화에 따른 다른 양의 종속적 변화 관계'),

          -- 비와 비율 - 소단원들
          ('비의 이해', 1, '비와 비율', '성취기준: [6수02-02], [6수02-03] - 비의 개념과 표현, 비율과 백분율'),
          ('비례식과 비례배분', 2, '비와 비율', '성취기준: [6수02-04], [6수02-05] - 비례식의 성질과 풀이, 비례배분'),

          -- 도형의 성질 - 소단원들
          ('합동과 대칭', 1, '도형의 성질', '성취기준: [6수03-01], [6수03-02] - 도형의 합동과 성질, 선대칭과 점대칭도형'),

          -- 입체도형의 체계 - 소단원들
          ('기본 입체도형', 1, '입체도형의 체계', '성취기준: [6수03-03], [6수03-04] - 직육면체와 정육면체의 성질, 겨냥도와 전개도'),
          ('각기둥과 각뿔', 2, '입체도형의 체계', '성취기준: [6수03-05], [6수03-06] - 각기둥과 각뿔의 성질, 각기둥의 전개도'),
          ('원기둥, 원뿔, 구', 3, '입체도형의 체계', '성취기준: [6수03-07], [6수03-08] - 원기둥, 원뿔, 구의 성질, 원기둥의 전개도'),
          ('입체도형의 공간 감각', 4, '입체도형의 체계', '성취기준: [6수03-09], [6수03-10] - 쌓기나무 개수 구하기, 여러 방향에서 본 모양'),

          -- 넓이와 부피 - 소단원들
          ('평면도형의 둘레와 넓이', 1, '넓이와 부피', '성취기준: [6수03-11], [6수03-12], [6수03-13], [6수03-14] - 둘레와 넓이 단위, 기본 도형의 넓이'),
          ('원의 측정', 2, '넓이와 부피', '성취기준: [6수03-15], [6수03-16] - 원주율과 원의 둘레, 원의 넓이'),
          ('입체도형의 겉넓이와 부피', 3, '넓이와 부피', '성취기준: [6수03-17], [6수03-18], [6수03-19] - 겉넓이와 부피 단위, 부피 구하기'),

          -- 통계와 확률 - 소단원들
          ('자료의 분석', 1, '통계와 확률', '성취기준: [6수04-01], [6수04-02], [6수04-03] - 평균의 의미, 띠그래프와 원그래프, 탐구 문제 해결'),
          ('가능성과 확률', 2, '통계와 확률', '성취기준: [6수04-04], [6수04-05], [6수04-06] - 가능성의 표현과 비교, 가능성을 수로 나타내기')

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
                 -- 혼합 계산과 어림
                 ((SELECT unit_id FROM units WHERE title = '혼합 계산과 어림'), ARRAY['6수01-01', '6수01-02', '6수01-03']),

                 -- 약수와 배수
                 ((SELECT unit_id FROM units WHERE title = '약수와 배수'), ARRAY['6수01-04', '6수01-05']),

                 -- 분수의 기본 연산
                 ((SELECT unit_id FROM units WHERE title = '분수의 기본 연산'), ARRAY['6수01-06', '6수01-07', '6수01-08']),

                 -- 분수의 곱셈과 나눗셈
                 ((SELECT unit_id FROM units WHERE title = '분수의 곱셈과 나눗셈'), ARRAY['6수01-09', '6수01-10', '6수01-11']),

                 -- 분수와 소수의 관계
                 ((SELECT unit_id FROM units WHERE title = '분수와 소수의 관계'), ARRAY['6수01-12']),

                 -- 소수의 곱셈과 나눗셈
                 ((SELECT unit_id FROM units WHERE title = '소수의 곱셈과 나눗셈'), ARRAY['6수01-13', '6수01-14', '6수01-15']),

                 -- 대응 관계
                 ((SELECT unit_id FROM units WHERE title = '대응 관계'), ARRAY['6수02-01']),

                 -- 비의 이해
                 ((SELECT unit_id FROM units WHERE title = '비의 이해'), ARRAY['6수02-02', '6수02-03']),

                 -- 비례식과 비례배분
                 ((SELECT unit_id FROM units WHERE title = '비례식과 비례배분'), ARRAY['6수02-04', '6수02-05']),

                 -- 합동과 대칭
                 ((SELECT unit_id FROM units WHERE title = '합동과 대칭'), ARRAY['6수03-01', '6수03-02']),

                 -- 기본 입체도형
                 ((SELECT unit_id FROM units WHERE title = '기본 입체도형'), ARRAY['6수03-03', '6수03-04']),

                 -- 각기둥과 각뿔
                 ((SELECT unit_id FROM units WHERE title = '각기둥과 각뿔'), ARRAY['6수03-05', '6수03-06']),

                 -- 원기둥, 원뿔, 구
                 ((SELECT unit_id FROM units WHERE title = '원기둥, 원뿔, 구'), ARRAY['6수03-07', '6수03-08']),

                 -- 입체도형의 공간 감각
                 ((SELECT unit_id FROM units WHERE title = '입체도형의 공간 감각'), ARRAY['6수03-09', '6수03-10']),

                 -- 평면도형의 둘레와 넓이
                 ((SELECT unit_id FROM units WHERE title = '평면도형의 둘레와 넓이'), ARRAY['6수03-11', '6수03-12', '6수03-13', '6수03-14']),

                 -- 원의 측정
                 ((SELECT unit_id FROM units WHERE title = '원의 측정'), ARRAY['6수03-15', '6수03-16']),

                 -- 입체도형의 겉넓이와 부피
                 ((SELECT unit_id FROM units WHERE title = '입체도형의 겉넓이와 부피'), ARRAY['6수03-17', '6수03-18', '6수03-19']),

                 -- 자료의 분석
                 ((SELECT unit_id FROM units WHERE title = '자료의 분석'), ARRAY['6수04-01', '6수04-02', '6수04-03']),

                 -- 가능성과 확률
                 ((SELECT unit_id FROM units WHERE title = '가능성과 확률'), ARRAY['6수04-04', '6수04-05', '6수04-06'])

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