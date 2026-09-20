import numpy as np
import matplotlib.pyplot as plt
from scipy.interpolate import splprep, splev

def make_spline(pts, num=150):
    pts = np.array(pts, dtype=float)
    # Deduplicate consecutive points
    clean = [pts[0]]
    for p in pts[1:]:
        if np.linalg.norm(p - clean[-1]) > 0.5:
            clean.append(p)
    clean = np.array(clean)
    if len(clean) < 3:
        x = np.linspace(clean[0,0], clean[-1,0], num)
        y = np.linspace(clean[0,1], clean[-1,1], num)
        return x, y
    k = min(3, len(clean) - 1)
    tck, u = splprep([clean[:, 0], clean[:, 1]], s=0.0, k=k)
    unew = np.linspace(0, 1, num)
    out = splev(unew, tck)
    return out[0], out[1]

strokes = []

# =========================================================================
# LINE 1: "С днем рождения!"
# Baseline y = 135, x-height top y = 95, ascender y = 45, descender y = 180
# Slant: ~14 degrees forward
# =========================================================================

# 1. Capital 'С':
# Starts top right with a graceful entry hook, curves around in an oval to the baseline,
# and releases with a smooth upward tail
pts_C = [
    [54, 52], [58, 44], [50, 42], [36, 52], [24, 76],
    [18, 102], [22, 124], [34, 137], [52, 136], [66, 126]
]
strokes.append(make_spline(pts_C, 120))

# 2. Word "днем" (d - n - e - m):
# Starts at x = 95
# д: oval body
pts_d_oval = [
    [108, 104], [98, 96], [88, 110], [90, 126],
    [102, 136], [114, 124], [116, 96]
]
strokes.append(make_spline(pts_d_oval, 80))

# д: stem going straight down into deep loop, then rising to connect to 'н'
pts_d_stem = [
    [116, 96], [112, 134], [108, 172], [98, 178],
    [90, 168], [92, 150], [106, 134], [120, 124], [132, 110]
]
strokes.append(make_spline(pts_d_stem, 100))

# н: downstroke to baseline, retrace up to crossbar, bridge, second downstroke to baseline, exit hook
pts_n = [
    [132, 110], [136, 95], [131, 135],
    [133, 116], [146, 114],
    [149, 95], [145, 135], [152, 130], [160, 116]
]
strokes.append(make_spline(pts_n, 100))

# е: loop
pts_e = [
    [160, 116], [166, 95], [171, 96], [164, 116], [168, 135], [176, 131], [182, 120]
]
strokes.append(make_spline(pts_e, 80))

# м: three rhythmic downstrokes with baseline hooks
pts_m = [
    [182, 120], [188, 96], [184, 135],
    [190, 110], [197, 96], [193, 135],
    [199, 110], [206, 96], [203, 135], [212, 128]
]
strokes.append(make_spline(pts_m, 120))


# 3. Word "рождения!" (r - o - zh - d - e - n - i - ya !)
# Starts at x = 245
# р: long descender, retrace and rounded shoulder
pts_r = [
    [242, 116], [236, 146], [230, 180],
    [232, 145], [238, 106], [248, 94], [257, 97], [254, 134], [260, 128]
]
strokes.append(make_spline(pts_r, 100))

# о: oval
pts_o1 = [
    [268, 102], [260, 112], [264, 132], [276, 135], [282, 118], [278, 100], [283, 96]
]
strokes.append(make_spline(pts_o1, 80))

# ж: Russian cursive ж (left crescent, vertical stem with middle knot, right crescent)
# left crescent
pts_zh_left = [
    [296, 98], [288, 114], [293, 134]
]
strokes.append(make_spline(pts_zh_left, 45))

# center stem and ties
pts_zh_mid = [
    [290, 116], [301, 116],
    [300, 94], [297, 135],
    [299, 116], [308, 116]
]
strokes.append(make_spline(pts_zh_mid, 60))

# right crescent connecting to 'д'
pts_zh_right = [
    [306, 98], [314, 114], [309, 134], [316, 128], [324, 114]
]
strokes.append(make_spline(pts_zh_right, 60))

# д: oval
pts_d2_oval = [
    [336, 104], [328, 96], [320, 110], [322, 128], [332, 136], [342, 124], [344, 96]
]
strokes.append(make_spline(pts_d2_oval, 80))

# д: stem and loop into 'е'
pts_d2_stem = [
    [344, 96], [340, 134], [336, 172], [326, 178],
    [318, 166], [322, 148], [334, 134], [346, 124], [356, 114]
]
strokes.append(make_spline(pts_d2_stem, 100))

# е: loop
pts_e2 = [
    [356, 114], [362, 95], [367, 96], [360, 116], [364, 135], [372, 130]
]
strokes.append(make_spline(pts_e2, 70))

# н: down, cross, down
pts_n2 = [
    [372, 130], [376, 95], [372, 135],
    [374, 116], [386, 114],
    [389, 95], [385, 135], [392, 128]
]
strokes.append(make_spline(pts_n2, 90))

# и: two arches
pts_i1 = [
    [392, 128], [398, 96], [395, 130], [403, 134], [408, 96], [405, 135], [412, 126]
]
strokes.append(make_spline(pts_i1, 80))

# я: top loop, left body, right foot
pts_ya = [
    [416, 114], [411, 99], [419, 96], [423, 110],
    [416, 125], [414, 135],
    [418, 116], [428, 132], [434, 128]
]
strokes.append(make_spline(pts_ya, 90))

# ! : exclamation mark
pts_excl_stem = [
    [448, 68], [445, 94], [442, 120]
]
strokes.append(make_spline(pts_excl_stem, 35))
dot_excl = [440, 134]


# =========================================================================
# LINE 2: "От Гоши."
# Baseline y = 235, x-height top y = 195, ascender y = 145
# Starts at x = 140 (aligned nicely under 'днем рождения')
# =========================================================================

# 1. Capital 'О' (matching Gosha's 'О' from 'Ответ'):
# Confident, slanted oval starting top right, sweeping down left, baseline, up right, inside flourish
pts_O_cap = [
    [174, 160], [154, 154], [138, 172], [130, 200], [134, 226],
    [148, 238], [168, 236], [182, 214], [186, 180], [178, 158],
    [168, 164], [176, 178]
]
strokes.append(make_spline(pts_O_cap, 120))

# 2. 'т' in 'От' (matching Gosha's stroke from 'Ответ'):
# Three arches
pts_t = [
    [196, 194], [191, 235],
    [193, 212], [202, 195], [199, 235],
    [201, 212], [210, 195], [208, 235], [216, 228]
]
strokes.append(make_spline(pts_t, 100))

# Space to 'Гоши.'
# 3. Capital 'Г' in 'Гоши':
# Horizontal top wave
pts_G_top = [
    [242, 154], [250, 147], [264, 146], [278, 148], [288, 151]
]
strokes.append(make_spline(pts_G_top, 60))

# Vertical stem of 'Г' with base hook
pts_G_stem = [
    [262, 147], [258, 180], [253, 212], [250, 235], [242, 230]
]
strokes.append(make_spline(pts_G_stem, 70))

# 4. 'о' in 'Гоши':
pts_o2 = [
    [274, 202], [266, 214], [270, 232], [281, 234], [287, 218], [283, 200], [289, 197]
]
strokes.append(make_spline(pts_o2, 80))

# 5. 'ш' in 'Гоши' (three prongs like in 'машин'):
pts_sh = [
    [295, 196], [292, 230], [301, 234],
    [306, 198], [303, 230], [312, 234],
    [317, 198], [314, 235], [322, 228]
]
strokes.append(make_spline(pts_sh, 110))

# 6. 'и' in 'Гоши' (two prongs like in 'машин'):
pts_i2 = [
    [324, 228], [330, 196], [327, 230], [336, 234], [342, 196], [339, 235], [348, 228]
]
strokes.append(make_spline(pts_i2, 90))

# 7. '.' Period
dot_period = [358, 235]


# =========================================================================
# RENDER TO HIGH-RES PNG & SVG
# Width = 9.0 in, Height = 4.2 in, 200 DPI -> 1800 x 840 px
# =========================================================================
fig, ax = plt.subplots(figsize=(9.2, 4.4), dpi=200)
fig.patch.set_alpha(0.0)
ax.patch.set_alpha(0.0)
ax.axis('off')

# Set view range
ax.set_xlim(5, 465)
ax.set_ylim(275, 25) # Inverted y

# Color palette: Authentic Russian school ballpoint pen blue
c_outer = '#2563eb'
c_mid = '#1d4ed8'
c_core = '#1e3a8a'

# Render multi-layered stroke for authentic ballpoint depth and pressure
for x, y in strokes:
    # Soft pressure halo
    ax.plot(x, y, color=c_outer, linewidth=3.6, alpha=0.30, solid_capstyle='round', solid_joinstyle='round')
    # Main ink body
    ax.plot(x, y, color=c_mid, linewidth=2.6, alpha=0.85, solid_capstyle='round', solid_joinstyle='round')
    # Deep saturated ballpoint core
    ax.plot(x, y, color=c_core, linewidth=1.4, alpha=0.95, solid_capstyle='round', solid_joinstyle='round')

# Draw ink dots
for (dx, dy) in [dot_excl, dot_period]:
    ax.plot([dx], [dy], 'o', color=c_outer, markersize=5.0, alpha=0.35)
    ax.plot([dx], [dy], 'o', color=c_mid, markersize=4.0, alpha=0.85)
    ax.plot([dx], [dy], 'o', color=c_core, markersize=2.6, alpha=0.95)

out_png = r'C:\Users\gogic\.gemini\antigravity\scratch\mom-35-birthday\images\gosha-handwriting.png'
out_svg = r'C:\Users\gogic\.gemini\antigravity\scratch\mom-35-birthday\images\gosha-handwriting.svg'

plt.tight_layout(pad=0.1)
fig.savefig(out_png, transparent=True, dpi=200)
fig.savefig(out_svg, transparent=True)
plt.close(fig)

print('Successfully rendered:', out_png)
