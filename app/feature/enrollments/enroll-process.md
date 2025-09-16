



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