import cv2
import numpy as np

im1 = cv2.imread(r'C:\Users\gogic\.gemini\antigravity\scratch\mom-35-birthday\im1_correct.png')
im2 = cv2.imread(r'C:\Users\gogic\.gemini\antigravity\brain\c2df761a-4a8b-428e-9fce-2041f54db386\.user_uploaded\media_1789838274313.png')

def extract_crystal(crop, thresh=42.0, ramp=35.0):
    crop_f = crop.astype(float)
    b, g, r = crop_f[:,:,0], crop_f[:,:,1], crop_f[:,:,2]
    score = (b - r) * 1.6 + (255.0 - r) * 0.6
    alpha = np.clip((score - thresh) / ramp, 0.0, 1.0)
    
    # Clean up single-pixel speckles
    mask = (alpha * 255).astype(np.uint8)
    kernel = np.ones((2,2), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.GaussianBlur(mask, (3,3), 0)
    
    out = np.zeros((crop.shape[0], crop.shape[1], 4), dtype=np.uint8)
    # Royal blue ballpoint pen ink
    out[:,:,0] = np.clip(b * 1.1 + 10, 0, 255).astype(np.uint8)
    out[:,:,1] = np.clip(g * 0.92, 0, 255).astype(np.uint8)
    out[:,:,2] = np.clip(r * 0.82, 0, 255).astype(np.uint8)
    out[:,:,3] = mask
    return out

# 1. 'От' from im2 (Ответ): y: 100..165, x: 28..72
cut_Ot = extract_crystal(im2[100:165, 28:72])[:, 2:40]

# 2. 'с' from im2 (спортсменов): y: 285..335, x: 382..408
cut_c = extract_crystal(im2[285:335, 382:408])

# 3. 'день' from im1: y: 495..570, x: 635..725
cut_den = extract_crystal(im1[495:570, 635:725])
cut_d = cut_den[:, 2:28]
cut_e = cut_den[:, 27:48]
cut_n = cut_den[:, 46:68]

# 4. 'м' from im2 (спортсменов): y: 288..335, x: 496..532
cut_m = extract_crystal(im2[288:335, 496:532])

# 5. 'р' from im1 (работа): y: 100..170, x: 518..548
cut_r = extract_crystal(im1[100:170, 518:548])

# 6. 'о' from im1 (работа): y: 112..160, x: 588..614
cut_o = extract_crystal(im1[112:160, 588:614])

# 7. 'ши' from im1 (машин): y: 238..282, x: 436..476
cut_shi = extract_crystal(im1[238:282, 436:476])

# 8. 'я' from im1 (Домашняя): y: 114..162, x: 482..506
cut_ya = extract_crystal(im1[114:162, 482:506])

# 9. '.' from im1 (20 д.): y: 298..322, x: 312..328
cut_dot = extract_crystal(im1[298:322, 312:328])

# 10. 'и' from im1 (машин): y: 238..282, x: 456..476
cut_i = extract_crystal(im1[238:282, 456:476])

# Canvas: 200 height, 600 width
canvas = np.zeros((200, 600, 4), dtype=np.uint8)

def paste(dst, src, x, y, scale=1.0):
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

ink_bgr = (212, 138, 92, 245)

# ==========================================================
# LINE 1: "С днем рождения!"
# Baseline ~ y = 72
# ==========================================================
# 'С':
paste(canvas, cut_c, 15, 16, scale=1.35)

# "днем":
paste(canvas, cut_d, 62, 12, scale=0.95)
cv2.line(canvas, (86, 70), (92, 66), ink_bgr, 2, cv2.LINE_AA)
paste(canvas, cut_n, 88, 16, scale=0.95)
cv2.line(canvas, (108, 68), (114, 64), ink_bgr, 2, cv2.LINE_AA)
paste(canvas, cut_e, 112, 16, scale=0.95)
cv2.line(canvas, (130, 66), (136, 62), ink_bgr, 2, cv2.LINE_AA)
paste(canvas, cut_m, 134, 38, scale=1.0)

# "рождения!":
paste(canvas, cut_r, 192, 12, scale=0.95)
cv2.line(canvas, (218, 68), (224, 64), ink_bgr, 2, cv2.LINE_AA)
paste(canvas, cut_o, 222, 26, scale=0.95)
cv2.line(canvas, (244, 58), (252, 60), ink_bgr, 2, cv2.LINE_AA)

# 'ж'
pts_zh_l = np.array([[258, 48], [252, 58], [256, 70]], np.int32)
cv2.polylines(canvas, [pts_zh_l], False, ink_bgr, 2, cv2.LINE_AA)
cv2.line(canvas, (253, 58), (263, 58), ink_bgr, 2, cv2.LINE_AA)
cv2.line(canvas, (259, 46), (257, 72), ink_bgr, 2, cv2.LINE_AA)
pts_zh_r = np.array([[260, 48], [266, 58], [262, 70], [268, 66]], np.int32)
cv2.polylines(canvas, [pts_zh_r], False, ink_bgr, 2, cv2.LINE_AA)

cv2.line(canvas, (268, 66), (276, 64), ink_bgr, 2, cv2.LINE_AA)
paste(canvas, cut_d, 274, 12, scale=0.95)
cv2.line(canvas, (298, 70), (304, 66), ink_bgr, 2, cv2.LINE_AA)
paste(canvas, cut_e, 302, 16, scale=0.95)
cv2.line(canvas, (320, 68), (326, 64), ink_bgr, 2, cv2.LINE_AA)
paste(canvas, cut_n, 324, 16, scale=0.95)
cv2.line(canvas, (344, 68), (350, 64), ink_bgr, 2, cv2.LINE_AA)
paste(canvas, cut_i, 348, 38, scale=1.0)
cv2.line(canvas, (366, 66), (372, 62), ink_bgr, 2, cv2.LINE_AA)
paste(canvas, cut_ya, 370, 26, scale=0.95)

# '!':
cv2.line(canvas, (402, 30), (399, 64), ink_bgr, 2, cv2.LINE_AA)
cv2.circle(canvas, (398, 71), 2, ink_bgr, -1, cv2.LINE_AA)


# ==========================================================
# LINE 2: "От Гоши."
# Baseline ~ y = 155
# ==========================================================
# 'От':
paste(canvas, cut_Ot, 110, 95, scale=1.1)

# Capital 'Г' in 'Гоши':
pts_G_top = np.array([[170, 110], [178, 105], [190, 104], [202, 106]], np.int32)
cv2.polylines(canvas, [pts_G_top], False, ink_bgr, 2, cv2.LINE_AA)
cv2.line(canvas, (186, 105), (179, 155), ink_bgr, 2, cv2.LINE_AA)
cv2.line(canvas, (179, 155), (173, 152), ink_bgr, 2, cv2.LINE_AA)

# 'о':
paste(canvas, cut_o, 194, 114, scale=0.95)
cv2.line(canvas, (216, 146), (222, 142), ink_bgr, 2, cv2.LINE_AA)

# 'ши':
paste(canvas, cut_shi, 220, 124, scale=1.0)

# '.':
paste(canvas, cut_dot, 258, 142, scale=1.0)

out_file = r'C:\Users\gogic\.gemini\antigravity\scratch\mom-35-birthday\images\gosha-handwriting.png'
cv2.imwrite(out_file, canvas)
print('Saved crystal signature to', out_file)
