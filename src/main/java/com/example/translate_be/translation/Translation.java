package com.example.translate_be.translation;

import com.example.translate_be.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "translations")
public class Translation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "source_text", columnDefinition = "TEXT", nullable = false)
    private String sourceText;

    @Column(name = "translated_text", columnDefinition = "TEXT", nullable = false)
    private String translatedText;

    @Column(name = "src_lang", length = 12, nullable = false)
    private String sourceLanguage;

    @Column(name = "tgt_lang", length = 12, nullable = false)
    private String targetLanguage;

    @Column(length = 64)
    private String tone;

    @Column(length = 64)
    private String domain;

    @Column(name = "preset_id")
    private Long presetId;

    @Column(columnDefinition = "TEXT")
    private String metadata;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
