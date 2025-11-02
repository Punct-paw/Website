# animation.py  (Brython)
from browser import document, timer, window
import random, math

# DOM refs
canvas = document["background-canvas"]
ctx = canvas.getContext("2d")
section = document["profile"]
pic = document["pic-container"]

# visual params
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

def set_canvas_size_and_scale():
    """Set canvas buffer size to match display size * devicePixelRatio for crisp rendering."""
    dpr = window.devicePixelRatio or 1
    css_w = canvas.clientWidth or section.clientWidth or 1200
    css_h = canvas.clientHeight or section.clientHeight or 600
    canvas.width = int(css_w * dpr)
    canvas.height = int(css_h * dpr)
    # scale drawing operations so coordinates are in CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

def set_bounds(evt=None):
    """Compute frame bounds in canvas-local coordinates so balls move in the area around the profile picture."""
    global frame_left, frame_top, frame_right, frame_bottom

    # Ensure canvas covers the section (size + scaling)
    set_canvas_size_and_scale()

    # get bounding rects (client coordinates)
    canvas_rect = canvas.getBoundingClientRect()
    pic_rect = pic.getBoundingClientRect()

    # Convert picture coords into canvas-local (CSS) coordinates:
    # canvas_rect.left/top are the offset of the canvas in the page.
    frame_left = (pic_rect.left - canvas_rect.left) - margin
    frame_top = (pic_rect.top - canvas_rect.top) - margin
    frame_right = (pic_rect.left - canvas_rect.left) + pic_rect.width + margin
    # keep bottom a bit above text; allow small extra below picture
    frame_bottom = (pic_rect.top - canvas_rect.top) + pic_rect.height + 20

    # clamp to canvas bounds so we don't set frames outside canvas
    frame_left = max(0, frame_left)
    frame_top = max(0, frame_top)
    frame_right = min(canvas.clientWidth, frame_right)
    frame_bottom = min(canvas.clientHeight, frame_bottom)

    # initialize ball positions inside the frame (if outside, reposition)
    for ball in balls:
        ball.x = random.uniform(frame_left + ball.radius, max(frame_left + ball.radius + 1, frame_right - ball.radius))
        ball.y = random.uniform(frame_top + ball.radius, max(frame_top + ball.radius + 1, frame_bottom - ball.radius))

def animate():
    # Clear full canvas in CSS pixel coords
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

    for ball in balls:
        ball.x += ball.vx
        ball.y += ball.vy

        # bounce on frame edges
        if ball.x - ball.radius < frame_left:
            ball.x = frame_left + ball.radius
            ball.vx = -ball.vx
        if ball.x + ball.radius > frame_right:
            ball.x = frame_right - ball.radius
            ball.vx = -ball.vx
        if ball.y - ball.radius < frame_top:
            ball.y = frame_top + ball.radius
            ball.vy = -ball.vy
        if ball.y + ball.radius > frame_bottom:
            ball.y = frame_bottom - ball.radius
            ball.vy = -ball.vy

        # draw
        ctx.beginPath()
        ctx.arc(ball.x, ball.y, ball.radius, 0, math.pi * 2)
        ctx.fillStyle = ball.color
        ctx.fill()

# make canvas decorative and ensure layering/positioning via style (in case CSS doesn't handle it)
canvas.style.position = "absolute"
canvas.style.top = "0"
canvas.style.left = "0"
canvas.style.width = "100%"
canvas.style.height = "100%"
canvas.style.pointerEvents = "none"   # so canvas does not block clicks
canvas.style.zIndex = "0"

# ensure the main content sits above the canvas
# (the profile-intro container should have position relative and higher z-index in CSS; we attempt a safe fallback)
profile_intro = document.select_one(".profile-intro")
if profile_intro:
    profile_intro.style.position = "relative"
    profile_intro.style.zIndex = "1"

# initialize and run
set_bounds()
timer.set_interval(animate, 20)
# update bounds on resize (use window resize event)
window.addEventListener("resize", set_bounds)
