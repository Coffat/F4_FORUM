package com.f4.forum.repository;

import com.f4.forum.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    
    @Query("SELECT p FROM Promotion p WHERE p.endDate IS NULL OR p.endDate >= CURRENT_DATE")
    List<Promotion> findValidPromotions();
    
    List<Promotion> findByIdIn(List<Long> ids);
}