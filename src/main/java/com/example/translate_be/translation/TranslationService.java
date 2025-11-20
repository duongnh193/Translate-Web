package com.example.translate_be.translation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.translate_be.dto.HistoryItem;
import com.example.translate_be.dto.HistoryResponse;
import com.example.translate_be.dto.TranslateRequest;
import com.example.translate_be.dto.TranslateResponse;
import com.example.translate_be.preset.Preset;
import com.example.translate_be.preset.PresetService;
import com.example.translate_be.translation.repo.TranslationRepository;
import com.example.translate_be.user.User;
import com.example.translate_be.user.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TranslationService {

    private final TranslationRepository translationRepository;
    private final UserRepository userRepository;
    private final PresetService presetService;
    private final PromptBuilder promptBuilder;
    private final AiClient aiClient;
    private final ObjectMapper objectMapper;

    @Transactional
    public TranslateResponse translate(TranslateRequest request, String userEmail) {
        validateLanguage(request.srcLang());
        validateLanguage(request.tgtLang());
        Preset preset = null;
        if (request.presetId() != null) {
            preset = presetService.findById(request.presetId());
        }
        String prompt = promptBuilder.buildPrompt(request, preset);
        AiClient.AiResult result = aiClient.translate(prompt);

        Translation translation = Translation.builder()
                .user(resolveUser(userEmail))
                .sourceText(request.sourceText())
                .translatedText(result.text())
                .sourceLanguage(request.srcLang())
                .targetLanguage(request.tgtLang())
                .tone(request.tone())
                .domain(request.domain())
                .presetId(request.presetId())
                .metadata(writeMetadata(result))
                .createdAt(Instant.now())
                .build();
        translationRepository.save(translation);

        return new TranslateResponse(result.text(), result.model(), result.latencyMs(), translation.getCreatedAt());
    }

    public HistoryResponse history(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<HistoryItem> items = translationRepository.findTop20ByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(t -> new HistoryItem(
                        t.getId(),
                        t.getSourceText(),
                        t.getTranslatedText(),
                        t.getSourceLanguage(),
                        t.getTargetLanguage(),
                        t.getTone(),
                        t.getDomain(),
                        t.getPresetId(),
                        t.getCreatedAt()))
                .toList();
        return new HistoryResponse(items);
    }

    private User resolveUser(String email) {
        if (email == null) {
            return null;
        }
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private String writeMetadata(AiClient.AiResult result) {
        try {
            return objectMapper.writeValueAsString(result.metadata());
        } catch (JsonProcessingException e) {
            return "{}";
        }
    }

    private void validateLanguage(String lang) {
        if (lang == null || lang.length() > 12 || !lang.matches("^[a-zA-Z-]+$")) {
            throw new IllegalArgumentException("Invalid language: " + lang);
        }
    }
}
