package com.example.translate_be.dto;

import java.time.Instant;

public record TranslateResponse(
        String translatedText,
        String model,
        long latencyMs,
        Instant createdAt
) {}
