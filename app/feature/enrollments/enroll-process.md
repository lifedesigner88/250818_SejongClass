



if (is_published) 비공개 강의  (강의 목차와 성취기준 준비 안된 것들.) textBook

    클릭 불가. 



else 공개 강의 (강의 목차, 성취기준 준비됨)

    등록 안한 강의 (목차 까지 접근 가능)

        if unit 클릭 (결제 창 오픈)

            if (무료 - 0원)
                => enrollent 테이블 삽입 (payment_state: True)


            else 유료 - 0>원
                => 결제 요청 후 완료
                => Enrollments 등록



권한 : ADMIN & ENROL USER & NOTEN USER


if ADMIN
                            published ⏱️  is_free 🆓
      O                     T           F           (강의 준비 완료, 등록 후 시청) 
      O                     T           T           (강의 준비 완료, 공개 강의)   🆕
      O                     F           F           (강의 준비중, 등록 후 시청)
      O                     F           T           (강의 준비중, 공개강의)

publised : 강의가 준비되어 공개한 강의    (기본값은 false 이고 유튜브 영상 과 자료 준비되면 true)
is_free  : 등록을 안해도 볼 수 있는 강의. (기본값은 false 로 해두고 오픈할 강의만 free 변경)



NOT ENROLL
EROLL =>                    false           true



