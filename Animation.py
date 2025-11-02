# animation.py
# This is Brython Python code for browser execution

from browser import document, timer, window
import random
import math

canvas = document["background-canvas"]
ctx = canvas.getContext("2d")
section = document["profile"]
pic = document["pic-container"]

colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan', 'magenta']

class Ball:
    def __init__(self):
        self.x = 0
        self.y = 0
        self.vx = random.uniform(-2, 2)
        self.vy = random.uniform(-2, 2)
        self.color = random.choice(colors)
        self.radius = random.uniform(5, 10)

balls = [Ball() for _ in range(9)]

margin = 50
frame_left = 0
frame_top = 0
frame_right = 0
frame_bottom = 0

def set_bounds(evt=None):
    global frame_left, frame_top, frame_right, frame_bottom
    canvas.width = section.clientWidth
    canvas.height = section.clientHeight
    pic_left = pic.offsetLeft
    pic_top = pic.offsetTop
    pic_width = pic.offsetWidth
    pic_height = pic.offsetHeight
    frame_left = pic_left - margin
    frame_top = pic_top - margin
    frame_right = pic_left + pic_width + margin
    frame_bottom = pic_top + pic_height + 20  # Limited to not go much below the pic to avoid text
    # Reinitialize ball positions within new bounds
    for ball in balls:
        ball.x = random.uniform(frame_left + ball.radius, frame_right - ball.radius)
        ball.y = random.uniform(frame_top + ball.radius, frame_bottom - ball.radius)

def animate():
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for ball in balls:
        ball.x += ball.vx
        ball.y += ball.vy
        if ball.x - ball.radius < frame_left or ball.x + ball.radius > frame_right:
            ball.vx = -ball.vx
        if ball.y - ball.radius < frame_top or ball.y + ball.radius > frame_bottom:
            ball.vy = -ball.vy
        ctx.beginPath()
        ctx.arc(ball.x, ball.y, ball.radius, 0, math.pi * 2)
        ctx.fillStyle = ball.color
        ctx.fill()

set_bounds()
timer.set_interval(animate, 20)
window.addEventListener("resize", set_bounds)
