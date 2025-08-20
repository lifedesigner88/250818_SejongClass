export const PYTHON_CODE = {
    basic: `# 기본 Python 예제
print("Hello, SejongClass!")

# 변수와 연산
x = 10
y = 20
result = x + y
print(f"{x} + {y} = {result}")`,

    math: `# 수학 예제
import math

# 삼각함수
angle = math.pi / 4  # 45도
sin_value = math.sin(angle)
cos_value = math.cos(angle)

print(f"sin(45°) = {sin_value:.4f}")
print(f"cos(45°) = {cos_value:.4f}")

# 제곱근과 거듭제곱
number = 16
sqrt_result = math.sqrt(number)
power_result = math.pow(number, 0.5)

print(f"√{number} = {sqrt_result}")`,

    physics: `# 물리학 예제
import math

def projectile_motion(initial_velocity, angle, time):
    """포물체 운동 계산"""
    angle_rad = math.radians(angle)
    
    # 수평 및 수직 성분
    vx = initial_velocity * math.cos(angle_rad)
    vy = initial_velocity * math.sin(angle_rad)
    
    # 시간 t에서의 위치
    x = vx * time
    y = vy * time - 0.5 * 9.8 * time**2
    
    return x, y

# 45도 각도로 20m/s로 발사된 물체의 1초 후 위치
x_pos, y_pos = projectile_motion(20, 45, 1)
print(f"1초 후 위치: x={x_pos:.2f}m, y={y_pos:.2f}m")`,

    data: `# 데이터 분석 예제
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 평균, 최대값, 최소값
average = sum(numbers) / len(numbers)
maximum = max(numbers)
minimum = min(numbers)

print(f"데이터: {numbers}")
print(f"평균: {average}")
print(f"최대값: {maximum}")
print(f"최소값: {minimum}")

# 제곱의 합
squares = [x**2 for x in numbers]
print(f"제곱들: {squares}")
print(f"제곱의 합: {sum(squares)}")`,

    prime: `# 소수 찾기와 소인수분해 예제
# 순수 파이썬만 사용

def is_prime(n):
    """주어진 수가 소수인지 확인하는 함수"""
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True

def prime_factors(n):
    """주어진 수의 소인수분해 결과를 반환하는 함수"""
    factors = []
    
    # 2로 나누기
    while n % 2 == 0:
        factors.append(2)
        n = n // 2
    
    # 3 이상의 홀수로 나누기
    i = 3
    while i * i <= n:
        while n % i == 0:
            factors.append(i)
            n = n // i
        i += 2
    
    # n이 소수인 경우
    if n > 2:
        factors.append(n)
    
    return factors

# 1부터 20까지의 수 중 소수 찾기
primes = []
for num in range(1, 21):
    if is_prime(num):
        primes.append(num)

print("1부터 20까지의 소수:")
print(primes)

# 여러 수의 소인수분해 결과 출력
test_numbers = [12, 15, 28, 36, 100]
print("소인수분해:")
for num in test_numbers:
    factors = prime_factors(num)
    factor_str = ' × '.join(map(str, factors))
    print(f"{num} = {factor_str}")

# 특정 범위의 소수 개수 계산
range_start = 1
range_end = 100
prime_count = sum(1 for n in range(range_start, range_end + 1) if is_prime(n))
print(f"{range_start}부터 {range_end}까지의 소수 개수: {prime_count}")`,

    game: `# 간단한 숫자 맞추기 게임
# 순수 파이썬만 사용

import random

def number_guessing_game():
    """1~100 사이의 숫자를 맞추는 게임"""
    secret_number = random.randint(1, 100)
    attempts = 0
    max_attempts = 10
    
    print("1부터 100 사이의 숫자를 맞춰보세요!")
    print(f"기회는 총 {max_attempts}번 있습니다.")
    
    while attempts < max_attempts:
        try:
            guess = int(input(f"{attempts+1}번째 시도. 숫자를 입력하세요: "))
            
            if guess < 1 or guess > 100:
                print("1부터 100 사이의 숫자를 입력해주세요.")
                continue
                
            attempts += 1
            
            if guess < secret_number:
                print("더 큰 숫자입니다.")
            elif guess > secret_number:
                print("더 작은 숫자입니다.")
            else:
                print(f"축하합니다! {attempts}번째 시도에 정답을 맞추셨습니다.")
                print(f"정답은 {secret_number}입니다.")
                return
                
            remaining = max_attempts - attempts
            print(f"남은 기회: {remaining}번")
            
        except ValueError:
            print("유효한 숫자를 입력해주세요.")
    
    print(f"게임 오버! 정답은 {secret_number}였습니다.")

# 게임 시작
print("===== 숫자 맞추기 게임 =====")
number_guessing_game()`,

    encrypt:`# 시저 암호와 비즈네르 암호 구현
# 순수 파이썬만 사용

def caesar_encrypt(text, shift):
    """시저 암호로 문자열 암호화"""
    result = ""
    
    for char in text:
        if char.isalpha():
            # 알파벳인 경우만 처리
            ascii_offset = ord('A') if char.isupper() else ord('a')
            # (문자 코드 - 오프셋 + 이동량) % 26 + 오프셋
            encrypted_char = chr((ord(char) - ascii_offset + shift) % 26 + ascii_offset)
            result += encrypted_char
        else:
            # 알파벳이 아닌 경우 그대로 추가
            result += char
    
    return result

def caesar_decrypt(text, shift):
    """시저 암호로 암호화된 문자열 복호화"""
    # 암호화의 반대 방향으로 이동
    return caesar_encrypt(text, -shift)

def vigenere_encrypt(text, key):
    """비즈네르 암호로 문자열 암호화"""
    result = ""
    key = key.upper()  # 키를 대문자로 변환
    key_length = len(key)
    key_as_int = [ord(k) - ord('A') for k in key]
    
    i = 0
    for char in text:
        if char.isalpha():
            # 알파벳인 경우만 처리
            ascii_offset = ord('A') if char.isupper() else ord('a')
            key_shift = key_as_int[i % key_length]
            encrypted_char = chr((ord(char) - ascii_offset + key_shift) % 26 + ascii_offset)
            result += encrypted_char
            i += 1
        else:
            # 알파벳이 아닌 경우 그대로 추가
            result += char
    
    return result

def vigenere_decrypt(text, key):
    """비즈네르 암호로 암호화된 문자열 복호화"""
    result = ""
    key = key.upper()  # 키를 대문자로 변환
    key_length = len(key)
    key_as_int = [ord(k) - ord('A') for k in key]
    
    i = 0
    for char in text:
        if char.isalpha():
            # 알파벳인 경우만 처리
            ascii_offset = ord('A') if char.isupper() else ord('a')
            key_shift = key_as_int[i % key_length]
            decrypted_char = chr((ord(char) - ascii_offset - key_shift) % 26 + ascii_offset)
            result += decrypted_char
            i += 1
        else:
            # 알파벳이 아닌 경우 그대로 추가
            result += char
    
    return result

# 테스트 문자열
plaintext = "Hello, World! This is a secret message."
print("원본 텍스트:", plaintext)

# 시저 암호 테스트
shift = 3
caesar_encrypted = caesar_encrypt(plaintext, shift)
caesar_decrypted = caesar_decrypt(caesar_encrypted, shift)

print("시저 암호 (이동량 =", shift, "):")
print("암호화:", caesar_encrypted)
print("복호화:", caesar_decrypted)

# 비즈네르 암호 테스트
key = "KEY"
vigenere_encrypted = vigenere_encrypt(plaintext, key)
vigenere_decrypted = vigenere_decrypt(vigenere_encrypted, key)

print("비즈네르 암호 (키 =", key, "):")
print("암호화:", vigenere_encrypted)
print("복호화:", vigenere_decrypted)`,

    pattern:`# 파스칼의 삼각형과 패턴 생성
# 순수 파이썬만 사용

def generate_pascal_triangle(rows):
    """파스칼의 삼각형 생성"""
    triangle = []
    
    for i in range(rows):
        # 각 행은 리스트로 표현
        row = [1]  # 행의 첫 번째 원소는 항상 1
        
        # 이전 행의 인접한 두 원소 합을 현재 행에 추가
        if triangle:
            last_row = triangle[-1]
            for j in range(len(last_row) - 1):
                row.append(last_row[j] + last_row[j + 1])
            
            row.append(1)  # 행의 마지막 원소도 항상 1
        
        triangle.append(row)
    
    return triangle

def print_pascal_triangle(triangle):
    """파스칼의 삼각형을 예쁘게 출력"""
    width = len(' '.join(map(str, triangle[-1])))
    
    for row in triangle:
        # 가운데 정렬하여 출력
        print(' '.join(map(str, row)).center(width))

def print_number_pattern(rows):
    """숫자 패턴 출력"""
    for i in range(1, rows + 1):
        # 행 번호만큼 숫자 반복
        line = ''
        for j in range(1, i + 1):
            line += str(j) + ' '
        print(line.rstrip())

def print_star_pattern(rows):
    """별 패턴 출력"""
    for i in range(1, rows + 1):
        # 공백으로 왼쪽 정렬 후 별 출력
        spaces = ' ' * (rows - i)
        stars = '*' * (2 * i - 1)
        print(spaces + stars)

def print_diamond_pattern(rows):
    """다이아몬드 패턴 출력"""
    # 상단 부분 (증가)
    for i in range(1, rows + 1):
        spaces = ' ' * (rows - i)
        stars = '*' * (2 * i - 1)
        print(spaces + stars)
    
    # 하단 부분 (감소)
    for i in range(rows - 1, 0, -1):
        spaces = ' ' * (rows - i)
        stars = '*' * (2 * i - 1)
        print(spaces + stars)

# 파스칼의 삼각형
print("=== 파스칼의 삼각형 ===")
pascal_rows = 7
pascal_triangle = generate_pascal_triangle(pascal_rows)
print_pascal_triangle(pascal_triangle)

# 숫자 패턴
print("=== 숫자 패턴 ===")
print_number_pattern(5)

# 별 패턴 (삼각형)
print("=== 별 패턴 (삼각형) ===")
print_star_pattern(5)

# 별 패턴 (다이아몬드)
print("=== 별 패턴 (다이아몬드) ===")
print_diamond_pattern(5)

# 파스칼 삼각형에서 패턴 찾기
print("=== 파스칼의 삼각형에서 발견되는 패턴 ===")
print("1. 각 행의 합은 2의 거듭제곱:")
for i, row in enumerate(pascal_triangle):
    row_sum = sum(row)
    print(f"  행 {i}: 합 = {row_sum} = 2^{i}")

print("2. 대각선의 합:")
for i in range(min(5, pascal_rows)):
    diagonal_sum = sum(pascal_triangle[j][j] for j in range(i + 1))
    print(f"  대각선 {i}까지의 합: {diagonal_sum}")`,


    default: "# 파이썬 코드를 입력하세요",
};