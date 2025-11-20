CREATE DATABASE IF NOT EXISTS translater
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE translater;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS presets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    default_tone VARCHAR(64),
    default_domain VARCHAR(64),
    prompt_snippet TEXT
);

CREATE TABLE IF NOT EXISTS translations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    source_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    src_lang VARCHAR(12) NOT NULL,
    tgt_lang VARCHAR(12) NOT NULL,
    tone VARCHAR(64),
    domain VARCHAR(64),
    preset_id BIGINT,
    metadata JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_translations_user FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO presets (name, default_tone, default_domain, prompt_snippet)
SELECT * FROM (SELECT 'Job Application Email', 'very formal', 'business', '[ROLE / SYSTEM]\nBạn là dịch giả chuyên nghiệp, có khả năng dịch giữa mọi ngôn ngữ.\nNhiệm vụ:\n- Dịch từ {SRC_LANG} sang {TGT_LANG}.\n- Văn phong email xin việc: trang trọng, chuyên nghiệp, lịch sự.\n- Giữ nguyên cấu trúc email: subject, greeting, body, sign-off.\n- Không thêm nội dung mới, không giải thích.\n\n[BỐI CẢNH & GIỌNG ĐIỆU]\n- Loại văn bản: Job application email\n- Tone: Very formal\n- Lĩnh vực: {DOMAIN}\n- Đối tượng người đọc: Nhà tuyển dụng / HR\n- Quy tắc bổ sung:\n  - Không dùng slang.\n  - Không dùng biểu cảm casual.\n  - Giữ nguyên tên công ty/vị trí/người/phòng ban.\n') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM presets WHERE name = 'Job Application Email');

INSERT INTO presets (name, default_tone, default_domain, prompt_snippet)
SELECT * FROM (SELECT 'Social caption', 'casual', 'lifestyle', '[ROLE / SYSTEM]\nBạn là dịch giả chuyên về nội dung mạng xã hội, có thể dịch linh hoạt giữa mọi ngôn ngữ.\nNhiệm vụ:\n- Dịch từ {SRC_LANG} sang {TGT_LANG}.\n- Văn phong: casual, gần gũi, tự nhiên như người trẻ bản ngữ.\n- Có thể điều chỉnh để caption nghe bắt trend, nhưng không được sai thông điệp.\n- Giữ hashtag, emoji, nhưng được dịch nghĩa hashtag nếu hợp lý.\n\n[BỐI CẢNH & GIỌNG ĐIỆU]\n- Loại văn bản: Social media caption\n- Tone: Casual / friendly\n- Lĩnh vực: Lifestyle / travel / daily life\n- Đối tượng người đọc: Follower / bạn bè / cộng đồng online\n- Quy tắc bổ sung: Tránh văn phong quá trang trọng.\n') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM presets WHERE name = 'Social caption');

INSERT INTO presets (name, default_tone, default_domain, prompt_snippet)
SELECT * FROM (SELECT 'Technical document', 'neutral', 'it', '[ROLE / SYSTEM]\nBạn là dịch giả IT kỹ thuật cao, dịch được mọi ngôn ngữ.\nNhiệm vụ:\n- Dịch từ {SRC_LANG} sang {TGT_LANG}.\n- Văn phong: rõ ràng, chính xác, trung tính.\n- Giữ nguyên:\n  - Code block\n  - File path\n  - Tên function, class, command line\n  - Cấu trúc markdown\n\n[BỐI CẢNH & GIỌNG ĐIỆU]\n- Loại văn bản: Technical documentation\n- Tone: Neutral / Clear\n- Lĩnh vực: Software engineering / IT / Cloud / DevOps\n- Đối tượng người đọc: Developer / engineer\n- Quy tắc:\n  - Không dịch tên kỹ thuật khi dịch nghe gượng.\n  - Không tạo ví dụ mới.\n') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM presets WHERE name = 'Technical document');
