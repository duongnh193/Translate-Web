package com.example.translate_be.dto;

import java.time.Instant;

public record HistoryItem(
        Long id,
        String sourceText,
        String translatedText,
        String srcLang,
        String tgtLang,
        String tone,
        String domain,
        Long presetId,
        Instant createdAt
) {}
