-- 1단계: concepts 테이블에 개념들 삽입
INSERT INTO concepts (name, slug, definition, name_eng) VALUES
                                                            ('자릿값', 'place-value', '십진법에서 숫자가 놓인 위치에 따라 갖는 값으로, 일의 자리와 십의 자리를 구분하여 0~100까지의 수를 정확히 이해하는 기초 개념', 'Place Value'),
                                                            ('수의 분해와 합성', 'number-decomposition-composition', '하나의 수를 여러 방법으로 나누고 합치는 능력으로, 수감각 형성의 핵심이 되는 개념', 'Number Decomposition and Composition'),
                                                            ('수감각', 'number-sense', '수에 대한 직관적 이해력으로, 수의 크기를 비교하고 어림하며 일상에서 수를 활용하는 종합적 능력', 'Number Sense');

-- 2단계: dealings 테이블에 unit_id = 1과 연결
INSERT INTO dealings (unit_id, concept_id, discription, sort_order) VALUES
                                                                        (1, (SELECT concept_id FROM concepts WHERE slug = 'place-value'), '십진법의 핵심으로 일의 자리와 십의 자리를 구분하여 수를 이해합니다', 1),
                                                                        (1, (SELECT concept_id FROM concepts WHERE slug = 'number-decomposition-composition'), '수를 여러 방법으로 나누고 합치며 수감각을 기릅니다', 2),
                                                                        (1, (SELECT concept_id FROM concepts WHERE slug = 'number-sense'), '수에 대한 직관적 이해력을 바탕으로 일상에서 수를 활용합니다', 3);