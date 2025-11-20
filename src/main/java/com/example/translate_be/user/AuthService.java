package com.example.translate_be.user;

import com.example.translate_be.dto.AuthResponse;
import com.example.translate_be.dto.LoginRequest;
import com.example.translate_be.dto.RegisterRequest;
import com.example.translate_be.security.JwtService;
import com.example.translate_be.user.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(u -> {
            throw new IllegalArgumentException("Email already exists");
        });

        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .createdAt(Instant.now())
                .build();
        userRepository.save(user);
        return buildToken(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        return buildToken(user);
    }

    private AuthResponse buildToken(User user) {
        String token = jwtService.generateToken(user.getEmail(), Map.of("uid", user.getId()));
        return new AuthResponse(token, user.getEmail());
    }
}
