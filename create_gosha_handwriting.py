import numpy as np
import matplotlib.pyplot as plt
from scipy.interpolate import splprep, splev
import os

def smooth_curve(pts, s=0.0, num=120):
    """Interpolate smooth spline curve through control points."""
    pts = np.array(pts, dtype=float)
    # Remove consecutive duplicates
    clean_pts = [pts[0]]
    for p in pts[1:]:
        if np.linalg.norm(p - clean_pts[-1]) > 1e-4:
            clean_pts.append(p)
    clean_pts = np.array(clean_pts)
    if len(clean_pts) < 2:
        return clean_pts[:, 0], clean_pts[:, 1]
    if len(clean_pts) == 2:
        x = np.linspace(clean_pts[0,0], clean_pts[1,0], num)
        y = np.linspace(clean_pts[0,1], clean_pts[1,1], num)
        return x, y
    k = min(3, len(clean_pts) - 1)
    tck, u = splprep([clean_pts[:, 0], clean_pts[:, 1]], s=s, k=k)
    unew = np.linspace(0, 1, num)
    out = splev(unew, tck)
    return out[0], out[1]

strokes = []

# ==========================================================
# LINE 1: "С днем рождения!" (Baseline ~ 130)
# ==========================================================

# 1. Capital 'С':
# Starts top-right hook, swoops down left, baseline curve, flick up
pts_C = [
    [52, 54], [56, 46], [48, 43], [34, 52], [22, 74], 
    [16, 98], [18, 118], [26, 131], [40, 134], [54, 126]
]
strokes.append(smooth_curve(pts_C, num=100))

# 2. Word "днем" (d - n - e - m)
# д: oval
pts_d1_oval = [
    [86, 102], [77, 95], [69, 108], [71, 124], 
    [82, 132], [93, 122], [94, 98]
]
strokes.append(smooth_curve(pts_d1_oval, num=80))

# д: stem & bottom loop, connecting to 'н'
pts_d1_stem = [
    [94, 98], [91, 128], [88, 162], [80, 168], 
    [74, 160], [75, 145], [86, 131], [98, 124], [108, 112]
]
strokes.append(smooth_curve(pts_d1_stem, num=90))

# н: first downstroke, crossbar, second downstroke, connect to 'е'
pts_n = [
    [108, 112], [112, 98], [108, 130], 
    [110, 114], [121, 112], 
    [123, 98], [120, 130], [126, 126], [133, 114]
]
strokes.append(smooth_curve(pts_n, num=90))

# е: loop connecting to 'м'
pts_e1 = [
    [133, 114], [138, 97], [142, 98], [136, 115], [139, 130], [144, 128], [148, 120]
]
strokes.append(smooth_curve(pts_e1, num=70))

# м: 3 arches with baseline connections
pts_m = [
    [148, 120], [153, 99], [150, 130], 
    [155, 108], [161, 99], [158, 130], 
    [163, 108], [169, 99], [167, 130], [174, 124]
]
strokes.append(smooth_curve(pts_m, num=100))


# 3. Word "рождения!" (r - o - zh - d - e - n - i - ya !)
# р: downstroke into descender, retrace and shoulder
pts_r = [
    [192, 114], [187, 142], [183, 172], 
    [185, 140], [189, 106], [198, 97], [205, 100], [202, 130], [207, 125]
]
strokes.append(smooth_curve(pts_r, num=90))

# о: oval
pts_o1 = [
    [213, 102], [207, 112], [210, 128], [220, 130], [224, 114], [220, 101], [224, 98]
]
strokes.append(smooth_curve(pts_o1, num=70))

# ж: left crescent, stem with tie, right crescent
pts_zh_left = [
    [233, 100], [227, 112], [230, 128]
]
strokes.append(smooth_curve(pts_zh_left, num=40))

pts_zh_mid = [
    [230, 114], [238, 114], 
    [237, 96], [235, 130], 
    [236, 114], [242, 114]
]
strokes.append(smooth_curve(pts_zh_mid, num=50))

pts_zh_right = [
    [241, 100], [246, 112], [243, 128], [248, 124], [253, 112]
]
strokes.append(smooth_curve(pts_zh_right, num=50))

# д: oval
pts_d2_oval = [
    [263, 102], [256, 97], [250, 110], [253, 126], [262, 130], [269, 120], [270, 99]
]
strokes.append(smooth_curve(pts_d2_oval, num=70))

# д: stem and loop into 'е'
pts_d2_stem = [
    [270, 99], [266, 130], [262, 163], [255, 168], [249, 158], [252, 144], [262, 130], [272, 116]
]
strokes.append(smooth_curve(pts_d2_stem, num=80))

# е: loop into 'н'
pts_e2 = [
    [272, 116], [277, 98], [281, 99], [275, 116], [279, 130], [285, 124]
]
strokes.append(smooth_curve(pts_e2, num=60))

# н: down, cross, down into 'и'
pts_n2 = [
    [285, 124], [289, 99], [286, 130], 
    [288, 114], [298, 112], 
    [300, 99], [298, 130], [304, 124]
]
strokes.append(smooth_curve(pts_n2, num=80))

# и: two arches like 'u'
pts_i1 = [
    [304, 124], [309, 99], [307, 126], [314, 128], [318, 100], [316, 130], [322, 122]
]
strokes.append(smooth_curve(pts_i1, num=70))

# я: top loop, left body, right foot
pts_ya = [
    [324, 114], [320, 100], [327, 97], [330, 110], [324, 122], [322, 130],
    [327, 116], [334, 128], [339, 124]
]
strokes.append(smooth_curve(pts_ya, num=80))

# ! : exclamation mark
pts_excl_stem = [
    [349, 72], [347, 94], [345, 116]
]
strokes.append(smooth_curve(pts_excl_stem, num=30))
pts_excl_dot = [
    [344, 128], [345, 130], [344, 131], [343, 129]
]
strokes.append(smooth_curve(pts_excl_dot, num=15))


# ==========================================================
# LINE 2: "От Гоши." (Baseline ~ 220)
# ==========================================================

# 1. Capital 'О' (matching Gosha's 'О' from 'Ответ'):
# Wide, tilted oval starting top right, sweeping down left, up right, inside flourish
pts_O_cap = [
    [104, 162], [88, 156], [74, 172], [68, 196], [70, 218], 
    [82, 230], [98, 228], [108, 208], [112, 178], [106, 160], [98, 164], [104, 174]
]
strokes.append(smooth_curve(pts_O_cap, num=110))

# 2. 'т' in 'От' (matching Gosha's stroke from 'Ответ'):
# Downstroke with top arch, connects out
pts_t1 = [
    [118, 192], [115, 226], [117, 204], [126, 194], [125, 226], [127, 204], [135, 194], [134, 226], [140, 222]
]
strokes.append(smooth_curve(pts_t1, num=90))

# 3. Capital 'Г' in 'Гоши':
# Horizontal top wave
pts_G_top = [
    [162, 154], [168, 149], [178, 147], [188, 148], [196, 150]
]
strokes.append(smooth_curve(pts_G_top, num=50))

# Vertical stem of 'Г' with base hook to left
pts_G_stem = [
    [177, 148], [174, 178], [170, 208], [168, 228], [162, 224]
]
strokes.append(smooth_curve(pts_G_stem, num=60))

# 4. 'о' in 'Гоши':
pts_o2 = [
    [188, 198], [182, 208], [184, 224], [193, 226], [197, 212], [194, 198], [198, 195]
]
strokes.append(smooth_curve(pts_o2, num=60))

# 5. 'ш' in 'Гоши' (three prongs like in 'машин'):
pts_sh = [
    [202, 196], [200, 224], [207, 226], [211, 198], [209, 224], [216, 226], [220, 198], [219, 226], [224, 220]
]
strokes.append(smooth_curve(pts_sh, num=90))

# 6. 'и' in 'Гоши' (two prongs like in 'машин'):
pts_i2 = [
    [227, 196], [225, 224], [232, 226], [236, 198], [235, 226], [242, 220]
]
strokes.append(smooth_curve(pts_i2, num=70))

# 7. '.' Period:
pts_dot = [
    [252, 226], [253, 228], [252, 229], [251, 227]
]
strokes.append(smooth_curve(pts_dot, num=15))

# ==========================================================
# RENDER HIGH-RESOLUTION PNG & SVG WITH MATPLOTLIB
# ==========================================================
fig, ax = plt.subplots(figsize=(7.5, 3.2), dpi=200)
fig.patch.set_alpha(0.0)
ax.patch.set_alpha(0.0)
ax.axis('off')

# Set coordinates
ax.set_xlim(5, 365)
ax.set_ylim(255, 30) # Inverted y so top is top

# Realistic Ballpoint Ink Colors
# Core deep blue, outer pressure gradient
c_core = '#1648a8'
c_mid = '#225fd8'
c_soft = '#3672e8'

# Draw strokes with layered thickness and antialiasing for authentic ballpoint pen feel
for x, y in strokes:
    # Outer softer stroke
    ax.plot(x, y, color=c_soft, linewidth=3.4, alpha=0.35, solid_capstyle='round', solid_joinstyle='round')
    # Mid body
    ax.plot(x, y, color=c_mid, linewidth=2.5, alpha=0.85, solid_capstyle='round', solid_joinstyle='round')
    # Sharp inner core
    ax.plot(x, y, color=c_core, linewidth=1.5, alpha=0.95, solid_capstyle='round', solid_joinstyle='round')

# Draw dots as realistic ink pools
ax.plot([344], [130], 'o', color=c_core, markersize=3.5, alpha=0.95)
ax.plot([252], [227], 'o', color=c_core, markersize=3.5, alpha=0.95)

out_png = r'C:\Users\gogic\.gemini\antigravity\scratch\mom-35-birthday\images\gosha-handwriting.png'
out_svg = r'C:\Users\gogic\.gemini\antigravity\scratch\mom-35-birthday\images\gosha-handwriting.svg'

plt.tight_layout(pad=0.2)
fig.savefig(out_png, transparent=True, dpi=200)
fig.savefig(out_svg, transparent=True)
plt.close(fig)

print('Generated:', out_png, 'and', out_svg)
