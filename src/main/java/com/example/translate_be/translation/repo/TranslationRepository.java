package com.example.translate_be.translation.repo;

import com.example.translate_be.translation.Translation;
import com.example.translate_be.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TranslationRepository extends JpaRepository<Translation, Long> {
    List<Translation> findTop20ByUserOrderByCreatedAtDesc(User user);
}
