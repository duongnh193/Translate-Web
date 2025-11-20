package com.example.translate_be.translation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Component
public class AiClient {

    private static final Logger log = LoggerFactory.getLogger(AiClient.class);

    private final RestTemplate restTemplate;
    private final String endpoint;
    private final String model;
    private final String apiKey;

    public AiClient(RestTemplateBuilder builder,
                    @Value("${ai.gemini.endpoint}") String endpoint,
                    @Value("${ai.gemini.model}") String model,
                    @Value("${ai.gemini.api-key}") String apiKey) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(30))
                .build();
        this.endpoint = endpoint;
        this.model = model;
        this.apiKey = apiKey;
    }

    public AiResult translate(String prompt) {
        Instant start = Instant.now();
        String url = String.format("%s/%s:generateContent?key=%s", endpoint, model, apiKey);

        GeminiRequest request = new GeminiRequest(
                List.of(new GeminiContent("user", List.of(new GeminiPart(prompt)))))
                ;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<GeminiRequest> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<GeminiResponse> response = restTemplate.postForEntity(url, entity, GeminiResponse.class);
            GeminiResponse body = response.getBody();
            if (body == null || body.candidates == null || body.candidates.isEmpty()) {
                throw new IllegalStateException("Gemini response missing candidates");
            }
            String text = body.candidates.get(0).content.firstText();
            if (text == null || text.isBlank()) {
                throw new IllegalStateException("Gemini did not return text");
            }
            long latency = Duration.between(start, Instant.now()).toMillis();
            Map<String, Object> metadata = Map.of(
                    "promptTokens", body.usageMetadata != null ? body.usageMetadata.promptTokenCount : null,
                    "responseTokens", body.usageMetadata != null ? body.usageMetadata.candidatesTokenCount : null,
                    "totalTokens", body.usageMetadata != null ? body.usageMetadata.totalTokenCount : null,
                    "finishReason", body.candidates.get(0).finishReason
            );
            return new AiResult(text, model, latency, metadata);
        } catch (RestClientException ex) {
            log.error("Gemini API call failed", ex);
            throw new RuntimeException("Failed to generate translation", ex);
        }
    }

    public record AiResult(String text, String model, long latencyMs, Map<String, Object> metadata) {}

    private record GeminiRequest(List<GeminiContent> contents) {}

    private record GeminiContent(String role, List<GeminiPart> parts) {}

    private record GeminiPart(String text) {}

    private record GeminiResponse(List<Candidate> candidates, UsageMetadata usageMetadata) {}

    private record Candidate(GeminiCandidateContent content, String finishReason) {}

    private record GeminiCandidateContent(List<GeminiPart> parts) {
        String firstText() {
            return (parts == null || parts.isEmpty()) ? null : parts.get(0).text;
        }
    }

    private record UsageMetadata(Integer promptTokenCount, Integer candidatesTokenCount, Integer totalTokenCount) {}
}
