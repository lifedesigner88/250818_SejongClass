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
print(f"제곱의 합: {sum(squares)}")`
};