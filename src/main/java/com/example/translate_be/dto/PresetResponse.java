package com.example.translate_be.dto;

public record PresetResponse(
        Long id,
        String name,
        String defaultTone,
        String defaultDomain,
        String promptSnippet
) {}
