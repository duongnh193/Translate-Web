package com.example.translate_be.translation;

import com.example.translate_be.dto.TranslateRequest;
import com.example.translate_be.preset.Preset;
import org.springframework.stereotype.Component;

@Component
public class PromptBuilder {

    private static final String SYSTEM_PROMPT = "Bạn là dịch giả chuyên nghiệp bản ngữ của ngôn ngữ đích. Giữ định dạng, không dịch code.";

    public String buildPrompt(TranslateRequest request, Preset preset) {
        StringBuilder builder = new StringBuilder();
        builder.append("System: ").append(SYSTEM_PROMPT).append("\n");
        if (preset != null && preset.getPromptSnippet() != null) {
            builder.append("Preset: ").append(preset.getPromptSnippet()).append("\n");
        }
        builder.append("Tone: ").append(defaultValue(request.tone(), "neutral")).append("\n");
        builder.append("Domain: ").append(defaultValue(request.domain(), "general")).append("\n");
        if (request.extraInstruction() != null && !request.extraInstruction().isBlank()) {
            builder.append("Extra: ").append(request.extraInstruction()).append("\n");
        }
        builder.append("Source Language: ").append(request.srcLang()).append(" -> Target Language: ").append(request.tgtLang()).append("\n");
        builder.append("Text:\n").append(request.sourceText());
        return builder.toString();
    }

    private String defaultValue(String value, String fallback) {
        return (value == null || value.isBlank()) ? fallback : value;
    }
}
