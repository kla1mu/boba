import cv2
import numpy as np

im1 = cv2.imread(r'C:\Users\gogic\.gemini\antigravity\scratch\mom-35-birthday\im1_correct.png')
im2 = cv2.imread(r'C:\Users\gogic\.gemini\antigravity\brain\c2df761a-4a8b-428e-9fce-2041f54db386\.user_uploaded\media_1789838274313.png')

def clean_ink(crop, thresh=18.0, gain=35.0):
    crop_f = crop.astype(float)
    b, g, r = crop_f[:,:,0], crop_f[:,:,1], crop_f[:,:,2]
    diff = (b - r) + 0.6 * (b - g)
    alpha = np.clip((diff - thresh) / gain, 0.0, 1.0)
    mask = (alpha * 255).astype(np.uint8)
    kernel = np.ones((2,2), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.GaussianBlur(mask, (3,3), 0)
    
    rgba = np.zeros((crop.shape[0], crop.shape[1], 4), dtype=np.uint8)
    rgba[:,:,0] = np.clip(b * 1.15 + 15, 0, 255).astype(np.uint8)
    rgba[:,:,1] = np.clip(g * 0.95, 0, 255).astype(np.uint8)
    rgba[:,:,2] = np.clip(r * 0.88, 0, 255).astype(np.uint8)
    rgba[:,:,3] = mask
    return rgba

# Crop actual letters from photos
cut_Ot = clean_ink(im2[95:175, 28:74], thresh=20.0)[:, :42]
cut_c = clean_ink(im2[280:340, 382:408], thresh=18.0)
cut_den = clean_ink(im1[490:570, 635:725], thresh=18.0)
cut_d = cut_den[:, 0:28]
cut_e = cut_den[:, 26:48]
cut_n = cut_den[:, 45:68]
cut_m = clean_ink(im2[285:335, 495:535], thresh=18.0)
cut_r = clean_ink(im1[95:175, 515:550], thresh=20.0)
cut_o = clean_ink(im1[110:165, 585:615], thresh=18.0)
cut_shi = clean_ink(im1[235:285, 435:478], thresh=18.0)
cut_ya = clean_ink(im1[110:165, 480:508], thresh=18.0)
cut_dot = clean_ink(im1[295:325, 310:330], thresh=18.0)
cut_i = clean_ink(im1[235:285, 455:478], thresh=18.0)

# Create 2-line canvas: 220 height, 650 width
canvas = np.zeros((220, 650, 4), dtype=np.uint8)

def paste_crop(dst, src, x, y, scale=1.0):
    if scale != 1.0:
        new_w = max(1, int(src.shape[1] * scale))
        new_h = max(1, int(src.shape[0] * scale))
        src = cv2.resize(src, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)
    h, w = src.shape[:2]
    x1, y1 = max(0, x), max(0, y)
    x2, y2 = min(dst.shape[1], x + w), min(dst.shape[0], y + h)
    src_x1, src_y1 = max(0, -x), max(0, -y)
    src_x2, src_y2 = src_x1 + (x2 - x1), src_y1 + (y2 - y1)
    if x2 <= x1 or y2 <= y1: return
    a_src = src[src_y1:src_y2, src_x1:src_x2, 3] / 255.0
    a_dst = dst[y1:y2, x1:x2, 3] / 255.0
    for c in range(3):
        dst[y1:y2, x1:x2, c] = np.clip(
            src[src_y1:src_y2, src_x1:src_x2, c] * a_src + 
            dst[y1:y2, x1:x2, c] * a_dst * (1.0 - a_src), 0, 255)
    dst[y1:y2, x1:x2, 3] = np.clip((a_src + a_dst * (1.0 - a_src)) * 255, 0, 255)

# Ink color for connector strokes
ink_color = (215, 140, 95, 240)

# =========================================================================
# LINE 1: "С днем рождения!"
# Baseline ~ y = 80
# =========================================================================
# Capital 'С' (scaled up)
paste_crop(canvas, cut_c, 15, 15, scale=1.4)

# "днем":
# 'д':
paste_crop(canvas, cut_d, 65, 15, scale=0.95)
# connect d to n:
cv2.line(canvas, (88, 75), (94, 70), ink_color, 2)
# 'н':
paste_crop(canvas, cut_n, 90, 18, scale=0.95)
# connect n to e:
cv2.line(canvas, (110, 72), (116, 68), ink_color, 2)
# 'е':
paste_crop(canvas, cut_e, 114, 18, scale=0.95)
# connect e to m:
cv2.line(canvas, (132, 70), (138, 66), ink_color, 2)
# 'м':
paste_crop(canvas, cut_m, 136, 42, scale=1.0)

# "рождения!":
# 'р':
paste_crop(canvas, cut_r, 200, 15, scale=0.95)
# connect r to o:
cv2.line(canvas, (230, 72), (236, 68), ink_color, 2)
# 'о':
paste_crop(canvas, cut_o, 234, 30, scale=0.95)
# connect o to zh:
cv2.line(canvas, (258, 62), (266, 64), ink_color, 2)

# 'ж' (crafted in Gosha's stroke):
pts_zh_l = np.array([[272, 50], [266, 62], [270, 74]], np.int32)
cv2.polylines(canvas, [pts_zh_l], False, ink_color, 2, cv2.LINE_AA)
cv2.line(canvas, (267, 62), (278, 62), ink_color, 2, cv2.LINE_AA)
cv2.line(canvas, (273, 48), (271, 75), ink_color, 2, cv2.LINE_AA)
pts_zh_r = np.array([[274, 50], [280, 62], [276, 74], [282, 70]], np.int32)
cv2.polylines(canvas, [pts_zh_r], False, ink_color, 2, cv2.LINE_AA)

# connect zh to d:
cv2.line(canvas, (282, 70), (290, 68), ink_color, 2)
# 'д':
paste_crop(canvas, cut_d, 288, 15, scale=0.95)
# connect d to e:
cv2.line(canvas, (312, 75), (318, 70), ink_color, 2)
# 'е':
paste_crop(canvas, cut_e, 316, 18, scale=0.95)
# connect e to n:
cv2.line(canvas, (334, 72), (340, 68), ink_color, 2)
# 'н':
paste_crop(canvas, cut_n, 338, 18, scale=0.95)
# connect n to i:
cv2.line(canvas, (358, 72), (364, 68), ink_color, 2)
# 'и':
paste_crop(canvas, cut_i, 362, 42, scale=1.0)
# connect i to ya:
cv2.line(canvas, (382, 70), (388, 66), ink_color, 2)
# 'я':
paste_crop(canvas, cut_ya, 386, 32, scale=0.95)

# '!':
cv2.line(canvas, (422, 32), (419, 68), ink_color, 2, cv2.LINE_AA)
cv2.circle(canvas, (418, 76), 2, ink_color, -1, cv2.LINE_AA)


# =========================================================================
# LINE 2: "От Гоши."
# Baseline ~ y = 175
# =========================================================================
# 'От' (directly from Gosha's 'Ответ'):
paste_crop(canvas, cut_Ot, 100, 105, scale=1.1)

# Capital 'Г' in 'Гоши':
pts_G_top = np.array([[165, 122], [172, 116], [184, 115], [195, 117]], np.int32)
cv2.polylines(canvas, [pts_G_top], False, ink_color, 2, cv2.LINE_AA)
cv2.line(canvas, (180, 116), (173, 172), ink_color, 2, cv2.LINE_AA)
cv2.line(canvas, (173, 172), (167, 169), ink_color, 2, cv2.LINE_AA)

# 'о':
paste_crop(canvas, cut_o, 188, 128, scale=0.95)
# connect o to shi:
cv2.line(canvas, (212, 160), (218, 156), ink_color, 2)
# 'ши':
paste_crop(canvas, cut_shi, 216, 138, scale=1.0)
# '.'
paste_crop(canvas, cut_dot, 256, 155, scale=1.0)

out_png = r'C:\Users\gogic\.gemini\antigravity\scratch\mom-35-birthday\images\gosha-handwriting.png'
cv2.imwrite(out_png, canvas)
print('Saved authentic composite to', out_png)
