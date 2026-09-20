import cv2
import numpy as np

# Create transparent RGBA canvas for signature
# Height: 240, Width: 850
canvas = np.zeros((240, 850, 4), dtype=np.uint8)

def paste_rgba(dst, src, x, y, scale=1.0):
    if scale != 1.0:
        new_w = max(1, int(src.shape[1] * scale))
        new_h = max(1, int(src.shape[0] * scale))
        src = cv2.resize(src, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)
    
    h, w = src.shape[:2]
    # Check boundaries
    x1, y1 = max(0, x), max(0, y)
    x2, y2 = min(dst.shape[1], x + w), min(dst.shape[0], y + h)
    
    src_x1, src_y1 = max(0, -x), max(0, -y)
    src_x2, src_y2 = src_x1 + (x2 - x1), src_y1 + (y2 - y1)
    
    if x2 <= x1 or y2 <= y1:
        return
    
    # Alpha blend
    alpha_src = src[src_y1:src_y2, src_x1:src_x2, 3] / 255.0
    alpha_dst = dst[y1:y2, x1:x2, 3] / 255.0
    
    for c in range(3):
        dst[y1:y2, x1:x2, c] = np.clip(
            src[src_y1:src_y2, src_x1:src_x2, c] * alpha_src + 
            dst[y1:y2, x1:x2, c] * alpha_dst * (1.0 - alpha_src), 0, 255
        )
    dst[y1:y2, x1:x2, 3] = np.clip((alpha_src + alpha_dst * (1.0 - alpha_src)) * 255, 0, 255)

# Load cuts
let_Ot = cv2.imread(r'C:\Users\gogic\.gemini\antigravity\scratch\mom-35-birthday\let_Ot.png', cv2.IMREAD_UNCHANGED)
let_d = cv2.imread(r'C:\Users\gogic\.gemini\antigravity\scratch\mom-35-birthday\let_d.png', cv2.IMREAD_UNCHANGED)
let_c = cv2.imread(r'C:\Users\gogic\.gemini\antigravity\scratch\mom-35-birthday\let_c.png', cv2.IMREAD_UNCHANGED)
let_r = cv2.imread(r'C:\Users\gogic\.gemini\antigravity\scratch\mom-35-birthday\let_r.png', cv2.IMREAD_UNCHANGED)
let_m = cv2.imread(r'C:\Users\gogic\.gemini\antigravity\scratch\mom-35-birthday\let_m.png', cv2.IMREAD_UNCHANGED)
let_en = cv2.imread(r'C:\Users\gogic\.gemini\antigravity\scratch\mom-35-birthday\let_en.png', cv2.IMREAD_UNCHANGED)
let_shi = cv2.imread(r'C:\Users\gogic\.gemini\antigravity\scratch\mom-35-birthday\let_shi.png', cv2.IMREAD_UNCHANGED)
let_ya = cv2.imread(r'C:\Users\gogic\.gemini\antigravity\scratch\mom-35-birthday\let_ya.png', cv2.IMREAD_UNCHANGED)
let_dot = cv2.imread(r'C:\Users\gogic\.gemini\antigravity\scratch\mom-35-birthday\let_dot.png', cv2.IMREAD_UNCHANGED)

# Let's inspect baseline alignment and assembly
print('Assets ready for assembly')
